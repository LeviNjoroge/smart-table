"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTimetableStore } from "@/store/timetableStore";
import { parseTimetableMock } from "@/lib/parsing/mock-parser";

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

            const data = await parseTimetableMock(file);

            setStatus("Finalizing...");
            setProgress(90);

            setTimeout(() => {
                setProgress(100);
                setStatus("Done!");
                setTimetable(data);

                // Navigate based on confidence
                if (data.confidence < 0.9) {
                    router.push('/review');
                } else {
                    router.push('/select-units');
                }
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
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`
          relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300
          ${isDragActive ? 'border-primary-purple bg-primary-purple/10 scale-[1.02]' : 'border-gray-600 hover:border-gray-500 hover:bg-slate-800/50'}
        `}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className={`p-4 rounded-full bg-slate-800 ${isDragActive ? 'animate-bounce' : ''}`}>
                        <Upload className="w-10 h-10 text-primary-purple" />
                    </div>

                    <div className="space-y-2">
                        <p className="text-xl font-medium text-white">
                            {isDragActive ? "Drop your timetable here" : "Drag & drop your timetable"}
                        </p>
                        <p className="text-sm text-gray-400">
                            PDF, DOCX, or XLSX (Max 25MB)
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
                        className="mt-8 bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700"
                    >
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <FileText className="w-6 h-6 text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-medium truncate">{file.name}</p>
                                <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            {progress === 100 && <CheckCircle className="w-6 h-6 text-green-400" />}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-300">{status}</span>
                                <span className="text-blue-400">{progress}%</span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
