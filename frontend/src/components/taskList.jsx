import React from 'react';
import { Trash2, Calendar } from 'lucide-react';

const TaskList = ({ tasks, onToggle, onDelete, language }) => {
    if (!tasks || tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-slate-100 shadow-sm select-none">
                <div className="text-blue-100 mb-4 animate-bounce" style={{ animationDuration: '3s' }}>
                    <svg className="w-16 h-16 stroke-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                    </svg>
                </div>
                <p className="text-slate-500 font-bold text-sm">
                    {language === 'vi' ? 'Tuyệt vời! Không còn việc gì cần làm.' : 'Awesome! No tasks left to do.'}
                </p>
                <p className="text-slate-400 text-xs mt-1 font-semibold">
                    {language === 'vi' ? 'Bắt đầu ngày mới bằng cách lập danh sách công việc cần làm!' : 'Start your day by listing tasks to do!'}
                </p>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="space-y-3">
            {tasks.map((task) => {
                const isCompleted = task.status === 'COMPLETED';
                return (
                    <div
                        key={task._id}
                        className={`group flex items-center justify-between p-4 bg-white rounded-2xl border transition-all duration-300 ${
                            isCompleted
                                ? 'border-slate-100 bg-slate-50/50'
                                : 'border-slate-100/80 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5'
                        }`}
                    >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            {/* Custom Circular Checkbox */}
                            <button
                                onClick={() => onToggle(task._id, task.status)}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 focus:outline-none cursor-pointer shrink-0 ${
                                    isCompleted
                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 border-transparent text-white shadow-md shadow-blue-500/10'
                                        : 'border-slate-300 hover:border-blue-400'
                                }`}
                            >
                                {isCompleted && (
                                    <svg className="w-3 h-3 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="3.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>

                            {/* Task Content */}
                            <div className="min-w-0 flex-1">
                                <p
                                    className={`text-sm font-bold text-slate-700 truncate transition-all duration-200 ${
                                        isCompleted ? 'line-through text-slate-400 font-semibold' : ''
                                    }`}
                                >
                                    {task.title}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-semibold select-none">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(task.createdAt)}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <button
                            onClick={() => onDelete(task._id)}
                            className="text-slate-400 hover:text-rose-500 p-2 rounded-xl hover:bg-rose-50 transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default TaskList;