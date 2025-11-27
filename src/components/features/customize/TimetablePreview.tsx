"use client";

import { useTimetableStore } from "@/store/timetableStore";
import { TimetableSession } from "@/types/timetable";

export default function TimetablePreview({ template }: { template: string }) {
    const { currentTimetable } = useTimetableStore();

    if (!currentTimetable) return null;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8 to 18

    return (
        <div id="timetable-preview" className={`p-8 rounded-xl shadow-2xl min-w-[800px] min-h-[600px] transition-colors duration-300 ${template === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold">University Timetable</h2>
                <p className={`text-sm ${template === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    {currentTimetable.metadata.semester} • {currentTimetable.metadata.academic_year}
                </p>
            </div>

            <div className={`grid grid-cols-6 border-l border-t ${template === 'dark' ? 'border-slate-800' : 'border-gray-200'}`}>
                {/* Header Row */}
                <div className={`border-b border-r p-2 ${template === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-gray-50'}`}></div>
                {days.map(day => (
                    <div key={day} className={`border-b border-r p-2 font-bold text-center ${template === 'dark' ? 'border-slate-800 bg-slate-900 text-slate-200' : 'border-gray-200 bg-gray-50 text-slate-700'}`}>
                        {day}
                    </div>
                ))}

                {/* Time Rows */}
                {hours.map(hour => (
                    <>
                        <div key={`time-${hour}`} className={`border-b border-r p-2 text-xs text-right h-[60px] ${template === 'dark' ? 'border-slate-800 text-slate-500' : 'border-gray-200 text-gray-500'}`}>
                            {hour}:00
                        </div>
                        {days.map(day => (
                            <div key={`${day}-${hour}`} className={`border-b border-r relative h-[60px] ${template === 'dark' ? 'border-slate-800' : 'border-gray-200'}`}>
                                {/* Render sessions for this day/hour */}
                                {currentTimetable.sessions
                                    .filter(s => s.day === day && parseInt(s.time_start.split(':')[0]) === hour)
                                    .map((session, i) => (
                                        <div
                                            key={i}
                                            className={`absolute inset-x-1 rounded p-2 text-xs overflow-hidden shadow-sm transition-all hover:scale-[1.02] cursor-pointer ${template === 'colorful' ? 'bg-blue-100 text-blue-900 border-l-4 border-blue-500' :
                                                    template === 'dark' ? 'bg-slate-800 text-slate-100 border border-slate-700' :
                                                        'bg-white text-slate-800 border border-slate-200 shadow-sm'
                                                }`}
                                            style={{ height: `${session.duration_hours * 60 - 4}px`, zIndex: 10 }}
                                        >
                                            <div className="font-bold">{session.unit_code}</div>
                                            <div className="truncate font-medium">{session.unit_name}</div>
                                            <div className="mt-1 opacity-75 flex items-center gap-1">
                                                <span>{session.room}</span>
                                                {session.mode === 'lms' && <span className="px-1 py-0.5 rounded bg-green-500/20 text-green-600 text-[10px]">ONLINE</span>}
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        ))}
                    </>
                ))}
            </div>
        </div>
    );
}
