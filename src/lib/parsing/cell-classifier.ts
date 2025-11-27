/**
 * Cell Classifier
 * Identifies different types of content in timetable cells using pattern matching
 */

export type LineType =
    | 'unit_code'
    | 'unit_name'
    | 'lecturer'
    | 'room'
    | 'group'
    | 'mode'
    | 'cpt_number'
    | 'location'
    | 'week'
    | 'unknown';

const patterns = {
    unitCode: /^[A-Z]{2,5}\s?\d{3}/i,          // BCS 202, MBChB 113, BCOT 305
    time: /\d{1,2}:\d{2}/,                      // 10:00, 8:00
    room: /^(CR|LH|LAB|SKILLS LAB|LECTURE HALL|COMPUTER LAB)\s?\d*/i, // CR5, LH3
    mode: /(LMS|ONLINE|ZOOM|VIRTUAL|INPERSON|IN-PERSON)/i,
    cpt: /CPT[\s\/]?\d+|CPT[\s\/]?NO/i,        // CPT 1, CPT/no.
    location: /^(MAIN|ELIMU)$/i,
    week: /^(WEEK\s?)?[AB]$/i,                  // A, B, WEEK A
    lecturer: /(DR|PROF|MR|MS|MRS)\s+[A-Z]/i,  // Dr Mwangi, Prof. Omondi
};

export function classifyLine(line: string): LineType {
    const trimmed = line.trim();

    if (!trimmed) return 'unknown';

    // Check patterns in order of specificity
    if (patterns.unitCode.test(trimmed)) return 'unit_code';
    if (patterns.cpt.test(trimmed)) return 'cpt_number';
    if (patterns.room.test(trimmed)) return 'room';
    if (patterns.mode.test(trimmed)) return 'mode';
    if (patterns.location.test(trimmed)) return 'location';
    if (patterns.week.test(trimmed)) return 'week';
    if (patterns.lecturer.test(trimmed)) return 'lecturer';

    // If no pattern matches and it's uppercase, likely unit name
    if (trimmed === trimmed.toUpperCase() && trimmed.length > 3) {
        return 'unit_name';
    }

    return 'unknown';
}

export function extractUnitCode(text: string): string | null {
    const match = text.match(patterns.unitCode);
    return match ? match[0].trim() : null;
}

export function extractRoom(text: string): string | null {
    const match = text.match(patterns.room);
    return match ? match[0].trim() : null;
}

export function extractLecturer(text: string): string | null {
    const match = text.match(patterns.lecturer);
    return match ? match[0].trim() : null;
}

export function isMultiUnit(text: string): boolean {
    // Check if cell contains multiple units separated by /
    const unitCodeMatches = text.match(new RegExp(patterns.unitCode, 'gi'));
    return (unitCodeMatches?.length || 0) > 1;
}
