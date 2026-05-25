import React from 'react';
import { Calendar, X } from 'lucide-react';

const DateTimeFilter = ({ timeFilter, setTimeFilter, selectedDate, setSelectedDate }) => {
    const handleDateChange = (e) => {
        const val = e.target.value; // "YYYY-MM-DD"
        if (val) {
            setSelectedDate(val);
            setTimeFilter('custom');
        }
    };

    const clearCustomDate = () => {
        setSelectedDate(null);
        setTimeFilter('all');
    };

    // Timezone-safe formatting of YYYY-MM-DD to DD/MM/YYYY
    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };

    const handleInputClick = (e) => {
        if (e.target && typeof e.target.showPicker === 'function') {
            try {
                e.target.showPicker();
            } catch (err) {
                console.warn('showPicker error:', err);
            }
        }
    };

    return (
        <div className="flex items-center gap-2 select-none">
            {/* Calendar Icon Button with Overlaid Transparent Date Input */}
            <div className="relative flex items-center justify-center group">
                <button
                    type="button"
                    className={`p-2.5 rounded-xl border transition-all duration-200 ${
                        selectedDate
                            ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-md shadow-blue-500/5'
                            : 'bg-white border-slate-200 text-slate-400 group-hover:border-blue-300 group-hover:text-slate-600'
                    }`}
                    title="Chọn ngày cụ thể"
                >
                    <Calendar className="w-4 h-4" />
                </button>
                {/* Overlaid Transparent Date Input */}
                <input
                    type="date"
                    value={selectedDate || ''}
                    onChange={handleDateChange}
                    onClick={handleInputClick}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
            </div>

            {/* Select Options */}
            <div className="relative">
                <select
                    value={selectedDate ? 'custom' : timeFilter}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val !== 'custom') {
                            setSelectedDate(null);
                            setTimeFilter(val);
                        }
                    }}
                    className="appearance-none bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2 pr-8 rounded-xl text-xs hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                    <option value="all">Tất cả thời gian</option>
                    <option value="today">Hôm nay</option>
                    <option value="week">Tuần này</option>
                    <option value="month">Tháng này</option>
                    {selectedDate && (
                        <option value="custom">
                            Ngày: {formatDisplayDate(selectedDate)}
                        </option>
                    )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>

            {/* Clear Custom Date Button */}
            {selectedDate && (
                <button
                    onClick={clearCustomDate}
                    className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                    title="Xóa bộ lọc ngày"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    );
};

export default DateTimeFilter;
