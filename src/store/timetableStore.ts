import { create } from 'zustand';
import { TimetableData, TimetableSession } from '@/types/timetable';

interface TimetableStore {
    currentTimetable: TimetableData | null;
    setTimetable: (data: TimetableData) => void;
    updateSession: (index: number, session: Partial<TimetableSession>) => void;
}

export const useTimetableStore = create<TimetableStore>((set) => ({
    currentTimetable: null,
    setTimetable: (data) => set({ currentTimetable: data }),
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
}));
