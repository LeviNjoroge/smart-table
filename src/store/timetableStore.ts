import { create } from 'zustand';
import { TimetableData, TimetableSession } from '@/types/timetable';

interface TimetableStore {
    originalTimetable: TimetableData | null;
    currentTimetable: TimetableData | null;
    setTimetable: (data: TimetableData) => void;
    updateSession: (index: number, session: Partial<TimetableSession>) => void;
    filterTimetable: (selectedUnitCodes: string[]) => void;
}

export const useTimetableStore = create<TimetableStore>((set) => ({
    originalTimetable: null,
    currentTimetable: null,
    setTimetable: (data) => set({ originalTimetable: data, currentTimetable: data }),
    updateSession: (index, session) => set((state) => {
        if (!state.currentTimetable) return state;
        const newSessions = [...state.currentTimetable.sessions];
        newSessions[index] = { ...newSessions[index], ...session };
        return {
            currentTimetable: {
                ...state.currentTimetable,
                sessions: newSessions
            }
        };
    }),
    filterTimetable: (selectedUnitCodes) => set((state) => {
        if (!state.originalTimetable) return state;
        const filteredSessions = state.originalTimetable.sessions.filter(session =>
            selectedUnitCodes.includes(session.unit_code)
        );
        return {
            currentTimetable: {
                ...state.originalTimetable,
                sessions: filteredSessions
            }
        };
    }),
}));
