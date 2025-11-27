"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Plus, X } from "lucide-react";
import { useTimetableStore } from "@/store/timetableStore";

export default function UnitSelection() {
    const router = useRouter();
    const { originalTimetable, filterTimetable } = useTimetableStore();
    const [unitCodes, setUnitCodes] = useState<string[]>([""]);

    useEffect(() => {
        if (!originalTimetable) {
            router.push("/upload");
        }
    }, [originalTimetable, router]);

    const handleAddUnit = () => {
        setUnitCodes([...unitCodes, ""]);
    };

    const handleRemoveUnit = (index: number) => {
        if (unitCodes.length > 1) {
            setUnitCodes(unitCodes.filter((_, i) => i !== index));
        }
    };

    const handleUnitChange = (index: number, value: string) => {
        const newUnits = [...unitCodes];
        newUnits[index] = value.toUpperCase();
        setUnitCodes(newUnits);
    };

    const handleContinue = () => {
        // Filter out empty strings and trim whitespace
        const validUnits = unitCodes
            .map(code => code.trim())
            .filter(code => code !== "");

        if (validUnits.length === 0) {
            return;
        }

        filterTimetable(validUnits);
        router.push("/review");
    };

    if (!originalTimetable) return null;

    const hasValidUnits = unitCodes.some(code => code.trim() !== "");

    return (
        <div className="w-full max-w-3xl mx-auto p-6">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Enter Your Unit Codes
                </h1>
                <p className="text-lg text-gray-400">
                    Type the unit codes for the classes you're taking this semester.
                </p>
            </div>

            <div className="space-y-4 mb-8">
                {unitCodes.map((code, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-3"
                    >
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => handleUnitChange(index, e.target.value)}
                                placeholder={`e.g., SOEN ${200 + index}`}
                                className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-white placeholder-gray-500 focus:border-primary-purple focus:outline-none transition-colors text-lg"
                            />
                        </div>
                        {unitCodes.length > 1 && (
                            <button
                                onClick={() => handleRemoveUnit(index)}
                                className="p-3 bg-slate-800 hover:bg-red-500/10 border-2 border-slate-700 hover:border-red-500/50 rounded-xl transition-all"
                            >
                                <X className="w-5 h-5 text-gray-400 hover:text-red-400" />
                            </button>
                        )}
                    </motion.div>
                ))}

                <button
                    onClick={handleAddUnit}
                    className="w-full p-3 bg-slate-800/50 border-2 border-dashed border-slate-700 hover:border-primary-purple/50 rounded-xl text-gray-400 hover:text-primary-purple transition-all flex items-center justify-center space-x-2"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Another Unit</span>
                </button>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={handleContinue}
                    disabled={!hasValidUnits}
                    className={`
                        flex items-center space-x-2 px-8 py-4 rounded-full font-semibold text-lg transition-all
                        ${hasValidUnits
                            ? "bg-gradient-to-r from-primary-purple to-secondary-teal text-white hover:shadow-lg hover:shadow-primary-purple/25 hover:scale-105"
                            : "bg-slate-700 text-gray-400 cursor-not-allowed"}
                    `}
                >
                    <span>Continue to Review</span>
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
