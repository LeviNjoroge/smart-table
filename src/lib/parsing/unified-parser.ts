/**
 * Unified Parser
 * Routes to the appropriate parser based on file extension
 */

import { TimetableData } from '@/types/timetable';
import { parseXLSX } from './xlsx-parser';
import { parsePDF } from './pdf-parser';
import { parseDOCX } from './docx-parser';

export async function parseTimetable(file: File): Promise<TimetableData> {
    const extension = file.name.split('.').pop()?.toLowerCase();

    try {
        switch (extension) {
            case 'xlsx':
            case 'xls':
                return await parseXLSX(file);

            case 'pdf':
                return await parsePDF(file);

            case 'docx':
            case 'doc':
                return await parseDOCX(file);

            default:
                throw new Error(`Unsupported file format: ${extension}`);
        }
    } catch (error) {
        console.error('Error parsing timetable:', error);

        // Return low-confidence empty result instead of throwing
        return {
            sessions: [],
            metadata: {
                generated_at: new Date().toISOString(),
            },
            confidence: 0,
        };
    }
}

export { parseXLSX, parsePDF, parseDOCX };
