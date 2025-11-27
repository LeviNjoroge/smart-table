"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { useTimetableStore } from "@/store/timetableStore";

export default function UnitSelection() {
    const router = useRouter();
    const { originalTimetable, filterTimetable } = useTimetableStore();
    const [selectedUnits, setSelectedUnits] = useState<string[]>([]);

    useEffect(() => {
        if (!originalTimetable) {
            router.push("/upload");
            return;
        }

        // Extract unique units from the original timetable
        const uniqueUnits = Array.from(new Set(originalTimetable.sessions.map(s => s.unit_code)));
        setSelectedUnits(uniqueUnits);
    }, [originalTimetable, router]);

    const toggleUnit = (unitCode: string) => {
        setSelectedUnits(prev =>
            prev.includes(unitCode)
                ? prev.filter(code => code !== unitCode)
                : [...prev, unitCode]
        );
    };

    const handleContinue = () => {
        filterTimetable(selectedUnits);
        router.push("/customize");
    };

    if (!originalTimetable) return null;

    // Group sessions by unit code to get details
    const units = Array.from(new Set(originalTimetable.sessions.map(s => s.unit_code))).map(code => {
        const session = originalTimetable.sessions.find(s => s.unit_code === code);
        return {
            code,
            name: session?.unit_name || "Unknown Unit",
            lecturer: session?.lecturer || "Unknown Lecturer"
        };
    });

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Select Your Units
                </h1>
                <p className="text-lg text-gray-400">
                    Uncheck the units you don't want to include in your timetable.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {units.map((unit) => (
                    <motion.div
                        key={unit.code}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`
                            relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                            ${selectedUnits.includes(unit.code)
                                ? "bg-primary-purple/10 border-primary-purple"
                                : "bg-slate-800/50 border-slate-700 hover:border-slate-600"}
                        `}
                        onClick={() => toggleUnit(unit.code)}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">
                                    {unit.code}
                                </h3>
                                <p className="text-gray-300 text-sm mb-1">{unit.name}</p>
                                <p className="text-gray-500 text-xs">{unit.lecturer}</p>
                            </div>

                            <div className={`
                                w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                                ${selectedUnits.includes(unit.code)
                                    ? "bg-primary-purple border-primary-purple"
                                    : "border-gray-500"}
                            `}>
                                {selectedUnits.includes(unit.code) && (
                                    <Check className="w-4 h-4 text-white" />
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-center">
                <button
                    onClick={handleContinue}
                    disabled={selectedUnits.length === 0}
                    className={`
                        flex items-center space-x-2 px-8 py-4 rounded-full font-semibold text-lg transition-all
                        ${selectedUnits.length > 0
                            ? "bg-gradient-to-r from-primary-purple to-secondary-teal text-white hover:shadow-lg hover:shadow-primary-purple/25 hover:scale-105"
                            : "bg-slate-700 text-gray-400 cursor-not-allowed"}
                    `}
                >
                    <span>Continue to Customize</span>
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
