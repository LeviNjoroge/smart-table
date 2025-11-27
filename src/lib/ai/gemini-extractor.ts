/**
 * AI Extraction Service
 * Uses Google Gemini to extract timetable data from PDF images
 */

import { TimetableData } from '@/types/timetable';

const EXTRACTION_PROMPT = `You are a timetable data extraction assistant. Analyze this university timetable image and extract ALL sessions into a JSON array.

For each class session, extract:
- unit_code: The course code (e.g., "BCS 202", "MBChB 113")
- unit_name: Full course name
- day: Day of the week (Monday, Tuesday, etc.)
- time_start: Start time in HH:MM format (24-hour)
- time_end: End time in HH:MM format (24-hour)
- duration_hours: Number of hours (calculate from start/end)
- room: Room/venue (e.g., "CR5", "LH3", "SKILLS LAB 2")
- lecturer: Lecturer name (if present)
- mode: Either "inperson" or "lms" (online/LMS/Zoom = "lms", otherwise "inperson")
- location: "MAIN" or "ELIMU" (extract from page header if present, otherwise "MAIN")
- week: "A", "B", or "Both" (if alternating weeks, otherwise "Both")

IMPORTANT:
1. If a cell contains multiple units separated by "/", create separate session objects for each
2. Include ALL sessions you can find in the table
3. Return ONLY valid JSON, no explanations
4. Format: { "sessions": [...], "metadata": { "semester": "...", "academic_year": "..." } }

Return the data as valid JSON only.`;

export async function extractTimetableFromImage(imageData: string): Promise<TimetableData> {
    try {
        // Dynamic import to avoid SSR issues
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent([
            EXTRACTION_PROMPT,
            {
                inlineData: {
                    mimeType: 'image/png',
                    data: imageData,
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Extract JSON from response (remove markdown code blocks if present)
        let jsonText = text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/g, '');
        }

        const data = JSON.parse(jsonText);

        // Calculate confidence based on completeness
        const sessions = data.sessions || [];
        let totalScore = 0;

        sessions.forEach((session: any) => {
            let score = 100;
            if (!session.unit_code) score -= 20;
            if (!session.unit_name) score -= 10;
            if (!session.time_start || !session.time_end) score -= 25;
            if (!session.day) score -= 20;
            if (!session.room) score -= 10;

            totalScore += Math.max(0, score);
        });

        const confidence = sessions.length > 0 ? totalScore / (sessions.length * 100) : 0.5;

        // Ensure all sessions have required fields with defaults
        const normalizedSessions = sessions.map((session: any) => ({
            unit_code: session.unit_code || '',
            unit_name: session.unit_name || '',
            time_start: session.time_start || '',
            time_end: session.time_end || '',
            duration_hours: session.duration_hours || 1,
            mode: (session.mode === 'lms' ? 'lms' : 'inperson') as 'inperson' | 'lms',
            room: session.room || '',
            day: session.day || '',
            week: session.week || 'Both',
            cpt_number: session.cpt_number,
            location: session.location || 'MAIN',
            raw_cell: session.raw_cell || `${session.unit_code}\n${session.unit_name}`,
            lecturer: session.lecturer || '',
        }));

        return {
            sessions: normalizedSessions,
            metadata: {
                semester: data.metadata?.semester,
                academic_year: data.metadata?.academic_year,
                campus: data.metadata?.campus,
                generated_at: new Date().toISOString(),
            },
            confidence,
        };
    } catch (error) {
        console.error('Error extracting timetable from image:', error);
        throw error;
    }
}
