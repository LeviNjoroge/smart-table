"use client";

import { Search } from "lucide-react";

export default function FilterSidebar() {
    return (
        <div className="p-6 space-y-8">
            <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Search</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search units..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:border-primary-purple focus:outline-none focus:ring-1 focus:ring-primary-purple"
                    />
                </div>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Filters</h3>
                <div className="space-y-4">
                    <FilterGroup title="Year" options={['Year 1', 'Year 2', 'Year 3', 'Year 4']} />
                    <FilterGroup title="Group" options={['Group A', 'Group B', 'Group C']} />
                    <FilterGroup title="Mode" options={['In Person', 'Online']} />
                </div>
            </div>
        </div>
    );
}

function FilterGroup({ title, options }: { title: string, options: string[] }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-white">{title}</label>
            <div className="space-y-1">
                {options.map(opt => (
                    <label key={opt} className="flex items-center space-x-2 cursor-pointer group">
                        <input type="checkbox" className="rounded border-slate-700 bg-slate-900 text-primary-purple focus:ring-primary-purple" />
                        <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{opt}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}
