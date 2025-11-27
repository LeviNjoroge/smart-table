/**
 * Traditional PDF Parser
 * Uses pdfjs-dist for text extraction and pattern matching
 * Client-side only - no AI required
 */

import { TimetableData, TimetableSession } from '@/types/timetable';
import { classifyLine, extractUnitCode } from './cell-classifier';
import { splitMultiUnit, hasMultipleUnits } from './multi-unit-splitter';

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export async function parsePDF(file: File): Promise<TimetableData> {
    // Ensure client-side execution
    if (typeof window === 'undefined') {
        return {
            sessions: [],
            metadata: { generated_at: new Date().toISOString() },
            confidence: 0.3,
        };
    }

    try {
        // Dynamic import to avoid SSR
        const pdfjs = await import('pdfjs-dist');

        // Set worker
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

        const sessions: TimetableSession[] = [];
        let allText = '';

        // Extract text from all pages
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();

            // Get text items with positions
            const items = textContent.items.map((item: any) => ({
                text: item.str,
                x: item.transform[4],
                y: item.transform[5],
                width: item.width,
            }));

            // Sort by vertical then horizontal position
            items.sort((a: any, b: any) => {
                if (Math.abs(a.y - b.y) < 5) {
                    return a.x - b.x;
                }
                return b.y - a.y; // Reverse Y (PDF coords start bottom-left)
            });

            // Group into lines
            const lines: string[] = [];
            let currentLine: string[] = [];
            let lastY = items[0]?.y || 0;

            items.forEach((item: any) => {
                if (Math.abs(item.y - lastY) > 5) {
                    if (currentLine.length > 0) {
                        lines.push(currentLine.join(' ').trim());
                        currentLine = [];
                    }
                }
                currentLine.push(item.text);
                lastY = item.y;
            });

            if (currentLine.length > 0) {
                lines.push(currentLine.join(' ').trim());
            }

            allText += lines.join('\n') + '\n\n';
        }

        // Parse text into sessions
        const parsedSessions = parseTextToSessions(allText);
        sessions.push(...parsedSessions);

        const confidence = calculateConfidence(sessions);

        return {
            sessions,
            metadata: {
                generated_at: new Date().toISOString(),
            },
            confidence,
        };
    } catch (error) {
        console.error('Error parsing PDF:', error);

        return {
            sessions: [],
            metadata: {
                generated_at: new Date().toISOString(),
            },
            confidence: 0.3,
        };
    }
}

function parseTextToSessions(text: string): TimetableSession[] {
    const sessions: TimetableSession[] = [];
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    let currentDay: string | null = null;
    let currentTime: { start: string; end: string; duration: number } | null = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Detect day
        const dayMatch = DAYS_OF_WEEK.find(day => line.toLowerCase().includes(day));
        if (dayMatch) {
            currentDay = dayMatch.charAt(0).toUpperCase() + dayMatch.slice(1);
            continue;
        }

        // Detect time slot
        const timeMatch = line.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
        if (timeMatch) {
            const [, startH, startM, endH, endM] = timeMatch;
            currentTime = {
                start: `${startH.padStart(2, '0')}:${startM}`,
                end: `${endH.padStart(2, '0')}:${endM}`,
                duration: parseInt(endH) - parseInt(startH),
            };
            continue;
        }

        // Detect unit code (start of a session)
        const unitCode = extractUnitCode(line);
        if (unitCode && currentDay && currentTime) {
            // Collect next few lines for this session
            const sessionLines = [line];
            for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
                const nextLine = lines[j];
                // Stop if we hit another unit code or time
                if (extractUnitCode(nextLine) || /\d{1,2}:\d{2}/.test(nextLine)) break;
                if (DAYS_OF_WEEK.some(day => nextLine.toLowerCase().includes(day))) break;
                sessionLines.push(nextLine);
            }

            const cellContent = sessionLines.join('\n');

            // Check for multi-unit
            if (hasMultipleUnits(cellContent)) {
                const units = splitMultiUnit(cellContent);
                units.forEach(unit => {
                    sessions.push(createSession({
                        cellContent: `${unit.unitCode}\n${unit.unitName || ''}`,
                        day: currentDay!,
                        timeSlot: currentTime!,
                        unitCode: unit.unitCode,
                        unitName: unit.unitName,
                        lecturer: unit.lecturer,
                        room: unit.room,
                    }));
                });
            } else {
                sessions.push(createSession({ cellContent, day: currentDay, timeSlot: currentTime }));
            }
        }
    }

    return sessions;
}

function createSession(params: {
    cellContent: string;
    day: string;
    timeSlot: { start: string; end: string; duration: number };
    unitCode?: string;
    unitName?: string;
    lecturer?: string;
    room?: string;
}): TimetableSession {
    const lines = params.cellContent.split('\n').map(l => l.trim()).filter(l => l);

    const unitCode = params.unitCode || extractUnitCode(lines[0]) || '';
    const unitName = params.unitName || lines[1] || '';
    const lecturer = params.lecturer || lines.find(l => classifyLine(l) === 'lecturer') || '';
    const room = params.room || lines.find(l => classifyLine(l) === 'room') || '';
    const mode = lines.some(l => /lms|online/i.test(l)) ? 'lms' : 'inperson';

    return {
        unit_code: unitCode,
        unit_name: unitName,
        time_start: params.timeSlot.start,
        time_end: params.timeSlot.end,
        duration_hours: params.timeSlot.duration,
        mode: mode as 'inperson' | 'lms',
        room,
        day: params.day,
        week: 'Both',
        location: 'MAIN',
        raw_cell: params.cellContent,
        lecturer,
    };
}

function calculateConfidence(sessions: TimetableSession[]): number {
    if (sessions.length === 0) return 0.3;

    let totalScore = 0;

    sessions.forEach(session => {
        let score = 100;

        if (!session.unit_code) score -= 20;
        if (!session.unit_name) score -= 10;
        if (!session.time_start || !session.time_end) score -= 25;
        if (!session.room) score -= 10;
        if (!session.day) score -= 20;

        totalScore += Math.max(0, score);
    });

    return Math.min(0.85, totalScore / (sessions.length * 100)); // Cap at 85% for PDF
}
