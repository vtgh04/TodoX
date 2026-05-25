import React from 'react';
import { ListTodo, CheckCircle2, CircleDot } from 'lucide-react';

const StatsAndFilters = ({ activeFilter, setActiveFilter, stats, language }) => {
    const filters = [
        { id: 'ALL', label: language === 'vi' ? 'Tất Cả' : 'All', icon: ListTodo },
        { id: 'ACTIVE', label: language === 'vi' ? 'Đang Làm' : 'Active', icon: CircleDot },
        { id: 'COMPLETED', label: language === 'vi' ? 'Hoàn Thành' : 'Completed', icon: CheckCircle2 },
    ];

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-2 select-none">
            {/* Stats badges */}
            <div className="flex items-center gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-full font-bold bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    {stats?.active || 0} {language === 'vi' ? 'đang làm' : 'active'}
                </span>
                <span className="px-3 py-1.5 rounded-full font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {stats?.completed || 0} {language === 'vi' ? 'hoàn thành' : 'completed'}
                </span>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/50 self-start md:self-auto">
                {filters.map((filter) => {
                    const Icon = filter.icon;
                    const isActive = activeFilter === filter.id;
                    return (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                                isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/10'
                                    : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-800'
                            }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {filter.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default StatsAndFilters;
