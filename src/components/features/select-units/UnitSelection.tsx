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
        <div className="w-full max-w-3xl mx-auto p-6 animate-fade-in">
            <div className="text-center mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
                >
                    Enter Your Unit Codes
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-gray-300"
                >
                    Type the unit codes for the classes you're taking this semester
                </motion.p>
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
                                className="w-full px-5 py-4 glass-dark border-2 border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-primary-purple focus:outline-none transition-all duration-300 text-lg font-medium hover:border-white/20"
                            />
                        </div>
                        {unitCodes.length > 1 && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleRemoveUnit(index)}
                                className="p-4 glass-dark hover:!bg-red-500/20 border-2 border-white/10 hover:border-red-500/50 rounded-2xl transition-all duration-300"
                            >
                                <X className="w-5 h-5 text-gray-300 hover:text-red-400" />
                            </motion.button>
                        )}
                    </motion.div>
                ))}

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={handleAddUnit}
                    className="w-full p-4 glass border-2 border-dashed border-white/20 hover:border-primary-purple/50 rounded-2xl text-gray-300 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 font-medium"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Another Unit</span>
                </motion.button>
            </div>

            <div className="flex justify-center">
                <motion.button
                    whileHover={hasValidUnits ? { scale: 1.05, boxShadow: "0 20px 60px rgba(168, 85, 247, 0.4)" } : {}}
                    whileTap={hasValidUnits ? { scale: 0.98 } : {}}
                    onClick={handleContinue}
                    disabled={!hasValidUnits}
                    className={`
                        flex items-center space-x-3 px-10 py-5 rounded-full font-bold text-lg transition-all duration-300
                        ${hasValidUnits
                            ? "gradient-apple text-white shadow-2xl shadow-primary-purple/50"
                            : "glass-dark text-gray-400 cursor-not-allowed border-2 border-white/10"}
                    `}
                >
                    <span>Continue to Review</span>
                    <ChevronRight className="w-6 h-6" />
                </motion.button>
            </div>
        </div>
    );
}
