"use client";

import { useTimetableStore } from "@/store/timetableStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FilterSidebar from "./FilterSidebar";
import TimetablePreview from "./TimetablePreview";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function CustomizeInterface() {
    const { currentTimetable } = useTimetableStore();
    const router = useRouter();
    const [selectedTemplate, setSelectedTemplate] = useState("minimal");

    useEffect(() => {
        if (!currentTimetable) {
            router.push('/upload');
        }
    }, [currentTimetable, router]);

    const handleExportPDF = async () => {
        const element = document.getElementById('timetable-preview');
        if (!element) return;

        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('timetable.pdf');
    };

    if (!currentTimetable) return null;

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 shrink-0">
                <h1 className="text-xl font-bold text-white">Customize & Export</h1>
                <div className="flex items-center space-x-4">
                    <div className="flex bg-slate-700 rounded-lg p-1">
                        {['minimal', 'colorful', 'dark'].map(t => (
                            <button
                                key={t}
                                onClick={() => setSelectedTemplate(t)}
                                className={`px-3 py-1 rounded-md text-sm capitalize transition-all ${selectedTemplate === t ? 'bg-slate-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleExportPDF}
                        className="bg-primary-DEFAULT hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-lg shadow-blue-900/20"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export PDF</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Filters */}
                <div className="w-80 border-r border-slate-700 bg-slate-800/50 hidden md:block overflow-y-auto">
                    <FilterSidebar />
                </div>

                {/* Right: Preview */}
                <div className="flex-1 bg-slate-900 overflow-auto p-8 flex items-center justify-center">
                    <TimetablePreview template={selectedTemplate} />
                </div>
            </div>
        </div>
    );
}
