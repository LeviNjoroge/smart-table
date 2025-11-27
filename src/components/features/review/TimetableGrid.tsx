"use client";

import { useTimetableStore } from "@/store/timetableStore";
import { TimetableSession } from "@/types/timetable";
import { motion } from "framer-motion";

export default function TimetableGrid() {
    const { currentTimetable, updateSession } = useTimetableStore();

    if (!currentTimetable) return null;

    return (
        <div className="p-6 space-y-4 pb-20">
            {currentTimetable.sessions.map((session, index) => (
                <SessionCard
                    key={index}
                    session={session}
                    index={index}
                    onUpdate={(updates) => updateSession(index, updates)}
                />
            ))}
        </div>
    );
}

function SessionCard({ session, index, onUpdate }: { session: TimetableSession, index: number, onUpdate: (updates: Partial<TimetableSession>) => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-primary-purple/50 transition-colors shadow-sm"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-gray-400 mb-1 font-medium">Unit Code</label>
                    <input
                        type="text"
                        value={session.unit_code}
                        onChange={(e) => onUpdate({ unit_code: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:border-primary-purple focus:outline-none focus:ring-1 focus:ring-primary-purple transition-all"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-400 mb-1 font-medium">Unit Name</label>
                    <input
                        type="text"
                        value={session.unit_name}
                        onChange={(e) => onUpdate({ unit_name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:border-primary-purple focus:outline-none focus:ring-1 focus:ring-primary-purple transition-all"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-400 mb-1 font-medium">Day</label>
                    <select
                        value={session.day}
                        onChange={(e) => onUpdate({ day: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:border-primary-purple focus:outline-none focus:ring-1 focus:ring-primary-purple transition-all"
                    >
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                </div>
                <div className="flex space-x-2">
                    <div className="flex-1">
                        <label className="block text-xs text-gray-400 mb-1 font-medium">Start</label>
                        <input
                            type="time"
                            value={session.time_start}
                            onChange={(e) => onUpdate({ time_start: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:border-primary-purple focus:outline-none focus:ring-1 focus:ring-primary-purple transition-all"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs text-gray-400 mb-1 font-medium">End</label>
                        <input
                            type="time"
                            value={session.time_end}
                            onChange={(e) => onUpdate({ time_end: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:border-primary-purple focus:outline-none focus:ring-1 focus:ring-primary-purple transition-all"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs text-gray-400 mb-1 font-medium">Room</label>
                    <input
                        type="text"
                        value={session.room}
                        onChange={(e) => onUpdate({ room: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:border-primary-purple focus:outline-none focus:ring-1 focus:ring-primary-purple transition-all"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-400 mb-1 font-medium">Mode</label>
                    <select
                        value={session.mode}
                        onChange={(e) => onUpdate({ mode: e.target.value as "inperson" | "lms" })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:border-primary-purple focus:outline-none focus:ring-1 focus:ring-primary-purple transition-all"
                    >
                        <option value="inperson">In Person</option>
                        <option value="lms">Online (LMS)</option>
                    </select>
                </div>
            </div>
        </motion.div>
    );
}
