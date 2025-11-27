import { TimetableData } from "@/types/timetable";

export const MOCK_DATA: TimetableData = {
    sessions: [
        {
            unit_code: "BCS 202",
            unit_name: "Operating Systems",
            time_start: "10:00",
            time_end: "12:00",
            duration_hours: 2,
            mode: "inperson",
            room: "LH3",
            day: "Monday",
            week: "A",
            cpt_number: "CPT 1",
            location: "MAIN",
            raw_cell: "BCS 202\nOPERATING SYSTEMS\nLH3\nDr Achieng",
            lecturer: "Dr Achieng"
        },
        {
            unit_code: "BCS 204",
            unit_name: "Data Structures",
            time_start: "14:00",
            time_end: "17:00",
            duration_hours: 3,
            mode: "inperson",
            room: "LAB 1",
            day: "Tuesday",
            week: "Both",
            location: "MAIN",
            raw_cell: "BCS 204\nDATA STRUCTURES\nLAB 1",
            lecturer: "Mr. Kamau"
        },
        {
            unit_code: "BCOT 305",
            unit_name: "Research Methods",
            time_start: "08:00",
            time_end: "11:00",
            duration_hours: 3,
            mode: "lms",
            room: "ONLINE",
            day: "Wednesday",
            week: "Both",
            location: "ELIMU",
            raw_cell: "BCOT 305\nRESEARCH METHODS\nONLINE",
            lecturer: "Prof. Omondi"
        }
    ],
    metadata: {
        semester: "Sep-Dec 2023",
        academic_year: "2023/2024",
        campus: "MAIN",
        generated_at: new Date().toISOString()
    },
    confidence: 0.85 // To trigger review
};

export async function parseTimetableMock(file: File): Promise<TimetableData> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_DATA);
        }, 3000);
    });
}
