/**
 * XLSX Parser
 * Extracts timetable data from Excel files
 */

import * as XLSX from 'xlsx';
import { TimetableData, TimetableSession } from '@/types/timetable';
import { classifyLine, extractUnitCode } from './cell-classifier';
import { splitMultiUnit, hasMultipleUnits } from './multi-unit-splitter';

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

interface CellData {
    row: number;
    col: number;
    value: string;
}

export async function parseXLSX(file: File): Promise<TimetableData> {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to 2D array
    const data: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

    // Detect structure
    const { headerRow, timeColumn, dayColumns } = detectTableStructure(data);

    // Extract sessions
    const sessions: TimetableSession[] = [];

    // Iterate through time slots (rows after header)
    for (let row = headerRow + 1; row < data.length; row++) {
        const timeSlot = extractTimeSlot(data[row][timeColumn]);
        if (!timeSlot) continue;

        // Iterate through days (columns)
        Object.entries(dayColumns).forEach(([day, colIndex]) => {
            const cellContent = String(data[row][colIndex] || '').trim();
            if (!cellContent) return;

            // Check if multi-unit cell
            if (hasMultipleUnits(cellContent)) {
                const units = splitMultiUnit(cellContent);
                units.forEach(unit => {
                    sessions.push(createSession({
                        cellContent: `${unit.unitCode}\n${unit.unitName || ''}`,
                        day,
                        timeSlot,
                        unitCode: unit.unitCode,
                        unitName: unit.unitName,
                        lecturer: unit.lecturer,
                        room: unit.room,
                    }));
                });
            } else {
                sessions.push(createSession({ cellContent, day, timeSlot }));
            }
        });
    }

    // Calculate confidence
    const confidence = calculateConfidence(sessions);

    return {
        sessions,
        metadata: {
            generated_at: new Date().toISOString(),
        },
        confidence,
    };
}

function detectTableStructure(data: any[][]): {
    headerRow: number;
    timeColumn: number;
    dayColumns: Record<string, number>;
} {
    let headerRow = -1;
    let timeColumn = -1;
    const dayColumns: Record<string, number> = {};

    // Find header row (contains day names)
    for (let i = 0; i < Math.min(10, data.length); i++) {
        const row = data[i];
        const dayMatches = row.filter((cell: any) =>
            DAYS_OF_WEEK.some(day => String(cell).toLowerCase().includes(day))
        );

        if (dayMatches.length >= 3) {
            headerRow = i;
            break;
        }
    }

    if (headerRow === -1) {
        throw new Error('Could not detect table header with days of week');
    }

    // Find time column (usually first column)
    const headerRowData = data[headerRow];
    for (let col = 0; col < headerRowData.length; col++) {
        const cell = String(headerRowData[col]).toLowerCase();
        if (cell.includes('time') || cell.includes('hour') || /\d{1,2}:\d{2}/.test(cell)) {
            timeColumn = col;
            break;
        }
    }

    if (timeColumn === -1) {
        timeColumn = 0; // Default to first column
    }

    // Map day columns
    headerRowData.forEach((cell: any, index: number) => {
        const cellStr = String(cell).toLowerCase();
        const matchedDay = DAYS_OF_WEEK.find(day => cellStr.includes(day));
        if (matchedDay) {
            dayColumns[matchedDay.charAt(0).toUpperCase() + matchedDay.slice(1)] = index;
        }
    });

    return { headerRow, timeColumn, dayColumns };
}

function extractTimeSlot(cellValue: any): { start: string; end: string; duration: number } | null {
    const str = String(cellValue).trim();

    // Match patterns like "10:00 - 12:00" or "10:00-12:00"
    const match = str.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
    if (match) {
        const [, startH, startM, endH, endM] = match;
        const start = `${startH.padStart(2, '0')}:${startM}`;
        const end = `${endH.padStart(2, '0')}:${endM}`;
        const duration = parseInt(endH) - parseInt(startH);
        return { start, end, duration };
    }

    // Match single time like "10:00" (assume 1 hour)
    const singleMatch = str.match(/(\d{1,2}):(\d{2})/);
    if (singleMatch) {
        const [, h, m] = singleMatch;
        const start = `${h.padStart(2, '0')}:${m}`;
        const endHour = parseInt(h) + 1;
        const end = `${String(endHour).padStart(2, '0')}:${m}`;
        return { start, end, duration: 1 };
    }

    return null;
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

    // Extract fields
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
        week: 'Both', // Default, can be refined later
        location: 'MAIN', // Default
        raw_cell: params.cellContent,
        lecturer,
    };
}

function calculateConfidence(sessions: TimetableSession[]): number {
    if (sessions.length === 0) return 0;

    let totalScore = 0;

    sessions.forEach(session => {
        let score = 100;

        // Deduct points for missing fields
        if (!session.unit_code) score -= 15;
        if (!session.unit_name) score -= 5;
        if (!session.time_start || !session.time_end) score -= 20;
        if (!session.room) score -= 5;
        if (!session.day) score -= 15;

        totalScore += Math.max(0, score);
    });

    return totalScore / (sessions.length * 100);
}
