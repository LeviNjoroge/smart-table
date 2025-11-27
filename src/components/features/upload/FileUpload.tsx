"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTimetableStore } from "@/store/timetableStore";
import { parseTimetable } from "@/lib/parsing/unified-parser";

export default function FileUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [isParsing, setIsParsing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("");
    const router = useRouter();
    const setTimetable = useTimetableStore((state) => state.setTimetable);

    const handleUpload = async (file: File) => {
        setIsParsing(true);
        setStatus("Detecting file type...");
        setProgress(10);

        try {
            // Simulate steps
            setTimeout(() => {
                setStatus("Extracting content...");
                setProgress(40);
            }, 1000);

            setTimeout(() => {
                setStatus("Analyzing table structure...");
                setProgress(70);
            }, 2000);

            const data = await parseTimetable(file);

            setStatus("Finalizing...");
            setProgress(90);

            setTimeout(() => {
                setProgress(100);
                setStatus("Done!");
                setTimetable(data);

                // Always navigate to unit selection
                router.push('/select-units');
            }, 500);
        } catch (error) {
            setStatus("Error parsing file");
            setIsParsing(false);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            handleUpload(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
        },
        maxFiles: 1
    });

    return (
        <div className="w-full animate-fade-in">
            <div
                {...getRootProps()}
                className={`
          relative glass glass-hover border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-500
          ${isDragActive ? 'border-primary-purple !bg-primary-purple/20 scale-[1.02] shadow-2xl shadow-primary-purple/50' : 'border-white/20 hover:border-white/40'}
        `}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center justify-center space-y-6">
                    <motion.div
                        className={`p-6 rounded-full glass-dark ${isDragActive ? 'animate-bounce' : ''}`}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Upload className="w-12 h-12 text-primary-purple" />
                    </motion.div>

                    <div className="space-y-3">
                        <p className="text-2xl font-semibold text-white">
                            {isDragActive ? "Drop your timetable here" : "Drag & drop your timetable"}
                        </p>
                        <p className="text-base text-gray-300">
                            PDF, DOCX, or XLSX • Max 25MB
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress & Status */}
            <AnimatePresence>
                {file && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-8 glass-dark rounded-2xl p-6 border border-white/10 animate-slide-up"
                    >
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="p-3 gradient-apple rounded-xl">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-semibold truncate">{file.name}</p>
                                <p className="text-sm text-gray-300">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            {progress === 100 && <CheckCircle className="w-7 h-7 text-green-400" />}
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-200 font-medium">{status}</span>
                                <span className="text-primary-purple font-bold">{progress}%</span>
                            </div>
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full gradient-shimmer"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
