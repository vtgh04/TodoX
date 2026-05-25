import React from 'react';
import { Calendar } from 'lucide-react';

const DataTimeFilter = ({ timeFilter, setTimeFilter }) => {
    return (
        <div className="flex items-center gap-2 select-none">
            <span className="text-slate-400">
                <Calendar className="w-4 h-4" />
            </span>
            <div className="relative">
                <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2 pr-8 rounded-xl text-xs hover:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all cursor-pointer"
                >
                    <option value="all">Tất cả thời gian</option>
                    <option value="today">Hôm nay</option>
                    <option value="week">Tuần này</option>
                    <option value="month">Tháng này</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default DataTimeFilter;