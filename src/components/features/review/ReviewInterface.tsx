"use client";

import { useTimetableStore } from "@/store/timetableStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DocumentViewer from "./DocumentViewer";
import TimetableGrid from "./TimetableGrid";
import { ArrowRight, Save } from "lucide-react";

export default function ReviewInterface() {
    const { currentTimetable } = useTimetableStore();
    const router = useRouter();

    useEffect(() => {
        if (!currentTimetable) {
            router.push('/upload');
        }
    }, [currentTimetable, router]);

    if (!currentTimetable) return null;

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 shrink-0">
                <h1 className="text-xl font-bold text-white">Review Timetable</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                        Confidence: {(currentTimetable.confidence * 100).toFixed(0)}%
                    </span>
                    <button className="text-gray-300 hover:text-white flex items-center space-x-2 transition-colors">
                        <Save className="w-4 h-4" />
                        <span>Save Draft</span>
                    </button>
                    <button
                        onClick={() => router.push('/customize')}
                        className="bg-primary-DEFAULT hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-lg shadow-blue-900/20"
                    >
                        <span>Approve & Continue</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Document Viewer */}
                <div className="w-1/2 border-r border-slate-700 bg-slate-900/50 hidden md:block">
                    <DocumentViewer />
                </div>

                {/* Right: Editable Grid */}
                <div className="w-full md:w-1/2 bg-slate-900 overflow-y-auto custom-scrollbar">
                    <TimetableGrid />
                </div>
            </div>
        </div>
    );
}
