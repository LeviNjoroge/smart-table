"use client";

import UnitSelection from "@/components/features/select-units/UnitSelection";

export default function SelectUnitsPage() {
    return (
        <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary-purple/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-secondary-teal/20 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 w-full">
                <UnitSelection />
            </div>
        </main>
    );
}
