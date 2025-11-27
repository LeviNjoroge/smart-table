/**
 * PDF Parser - Client-Side Only
 * Note: Full AI extraction requires client-side execution
 * This is a stub for build purposes
 */

import { TimetableData } from '@/types/timetable';

export async function parsePDF(file: File): Promise<TimetableData> {
    // PDF parsing with AI works client-side only
    // Actual implementation requires running in browser
    console.log('PDF parsing called with file:', file.name);

    return {
        sessions: [],
        metadata: {
            generated_at: new Date().toISOString(),
        },
        confidence: 0.5, // Triggers review
    };
}
