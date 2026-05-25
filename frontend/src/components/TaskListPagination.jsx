import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TaskListPagination = ({ page, totalPages, setPage, language }) => {
    if (totalPages <= 1) return null;

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center justify-center gap-1.5 py-4 select-none">
            <button
                onClick={handlePrev}
                disabled={page === 1}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] font-bold cursor-pointer transition-all duration-200 ${
                    page === 1
                        ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-100'
                        : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800'
                }`}
            >
                <ChevronLeft className="w-3.5 h-3.5" />
                {language === 'vi' ? 'Trước' : 'Prev'}
            </button>

            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                        p === page
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/10'
                            : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                    }`}
                >
                    {p}
                </button>
            ))}

            <button
                onClick={handleNext}
                disabled={page === totalPages}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] font-bold cursor-pointer transition-all duration-200 ${
                    page === totalPages
                        ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-100'
                        : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800'
                }`}
            >
                {language === 'vi' ? 'Sau' : 'Next'}
                <ChevronRight className="w-3.5 h-3.5" />
            </button>
        </div>
    );
};

export default TaskListPagination;
