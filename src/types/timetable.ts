export interface TimetableSession {
    unit_code: string;
    unit_name: string;
    time_start: string;
    time_end: string;
    duration_hours: number;
    mode: "inperson" | "lms";
    room: string;
    day: string;
    week: string; // "A", "B", "Both"
    cpt_number?: string;
    location: string;
    raw_cell: string;
    lecturer?: string;
}

export interface TimetableData {
    sessions: TimetableSession[];
    metadata: {
        semester?: string;
        academic_year?: string;
        campus?: string;
        generated_at: string;
    };
    confidence: number;
}
