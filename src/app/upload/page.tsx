"use client";

import FileUpload from "@/components/features/upload/FileUpload";
import { motion } from "framer-motion";

export default function UploadPage() {
    return (
        <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-purple/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary-teal/20 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl relative z-10"
            >
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Upload Your Timetable
                    </h1>
                    <p className="text-xl text-gray-400">
                        We support PDF, Word, and Excel files.
                    </p>
                </div>

                <FileUpload />
            </motion.div>
        </main>
    );
}
