import React from 'react';
import { Trash2, Calendar, Play, Pause, Send, Check, X, RotateCcw, CloudOff } from 'lucide-react';

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
            hour12: true
        });
    };

    const priorityBadges = {
        Low: {
            vi: 'Thấp', en: 'Low',
            class: 'bg-emerald-50 text-emerald-600 border-emerald-100'
        },
        Medium: {
            vi: 'T.Bình', en: 'Medium',
            class: 'bg-amber-50 text-amber-600 border-amber-100'
        },
        High: {
            vi: 'Cao', en: 'High',
            class: 'bg-rose-50 text-rose-600 border-rose-100'
        }
    };

    const statusLabels = {
        TODO: { vi: 'Chờ làm', en: 'To Do', class: 'bg-slate-100 text-slate-600 border-slate-200' },
        IN_PROGRESS: { vi: 'Đang làm', en: 'In Progress', class: 'bg-blue-50 text-blue-600 border-blue-100' },
        UNDER_REVIEW: { vi: 'Chờ duyệt', en: 'Under Review', class: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
        COMPLETED: { vi: 'Hoàn thành', en: 'Completed', class: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
    };

    return (
        <div className="space-y-3">
            {tasks.map((task) => {
                const isCompleted = task.status === 'COMPLETED';
                const priorityInfo = priorityBadges[task.priority || 'Medium'];
                const statusInfo = statusLabels[task.status] || statusLabels.TODO;

                return (
                    <div
                        key={task._id}
                        className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-2xl border transition-all duration-300 gap-3 ${
                            isCompleted
                                ? 'border-slate-100 bg-slate-50/50'
                                : 'border-slate-100/80 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5'
                        }`}
                    >
                        {/* Task Content */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                            {/* Priority Badge */}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 mt-0.5 select-none ${priorityInfo.class}`}>
                                {language === 'vi' ? priorityInfo.vi : priorityInfo.en}
                            </span>

                            {/* Title & Status */}
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p
                                        className={`text-sm font-bold text-slate-700 truncate transition-all duration-200 ${
                                            isCompleted ? 'line-through text-slate-400 font-semibold' : ''
                                        }`}
                                    >
                                        {task.title}
                                    </p>
                                    
                                    {/* Status Badge */}
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border select-none ${statusInfo.class}`}>
                                        {language === 'vi' ? statusInfo.vi : statusInfo.en}
                                    </span>

                                    {/* Pending Sync Badge */}
                                    {task.pendingSync && (
                                        <span className="text-[9px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded flex items-center gap-0.5 animate-pulse select-none" title={language === 'vi' ? 'Chờ đồng bộ mạng' : 'Pending connection sync'}>
                                            <CloudOff className="w-2.5 h-2.5" />
                                            <span>{language === 'vi' ? 'Chờ đồng bộ' : 'Pending Sync'}</span>
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-semibold select-none">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(task.createdAt)}
                                </p>
                            </div>
                        </div>

                        {/* Interactive Controls aligned with State Machine */}
                        <div className="flex items-center justify-end gap-2 shrink-0">
                            <div className="flex items-center gap-1">
                                {/* TODO -> IN_PROGRESS */}
                                {task.status === 'TODO' && (
                                    <button
                                        onClick={() => onToggle(task._id, 'IN_PROGRESS')}
                                        className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                                        title={language === 'vi' ? 'Bắt đầu' : 'Start'}
                                    >
                                        <Play className="w-3 h-3 fill-current" />
                                        <span>{language === 'vi' ? 'Bắt đầu' : 'Start'}</span>
                                    </button>
                                )}

                                {/* IN_PROGRESS -> TODO or UNDER_REVIEW */}
                                {task.status === 'IN_PROGRESS' && (
                                    <>
                                        <button
                                            onClick={() => onToggle(task._id, 'TODO')}
                                            className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                                            title={language === 'vi' ? 'Tạm dừng' : 'Pause'}
                                        >
                                            <Pause className="w-3 h-3 fill-current" />
                                            <span>{language === 'vi' ? 'Tạm dừng' : 'Pause'}</span>
                                        </button>
                                        <button
                                            onClick={() => onToggle(task._id, 'UNDER_REVIEW')}
                                            className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                                            title={language === 'vi' ? 'Gửi duyệt' : 'Submit'}
                                        >
                                            <Send className="w-3 h-3" />
                                            <span>{language === 'vi' ? 'Gửi duyệt' : 'Submit'}</span>
                                        </button>
                                    </>
                                )}

                                {/* UNDER_REVIEW -> IN_PROGRESS or COMPLETED */}
                                {task.status === 'UNDER_REVIEW' && (
                                    <>
                                        <button
                                            onClick={() => onToggle(task._id, 'IN_PROGRESS')}
                                            className="flex items-center gap-0.5 text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 px-2 py-1.5 rounded-lg cursor-pointer transition-colors"
                                            title={language === 'vi' ? 'Từ chối' : 'Reject'}
                                        >
                                            <X className="w-3 h-3" />
                                            <span>{language === 'vi' ? 'Sửa lại' : 'Reject'}</span>
                                        </button>
                                        <button
                                            onClick={() => onToggle(task._id, 'COMPLETED')}
                                            className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 px-2 py-1.5 rounded-lg cursor-pointer transition-colors"
                                            title={language === 'vi' ? 'Duyệt' : 'Approve'}
                                        >
                                            <Check className="w-3 h-3" />
                                            <span>{language === 'vi' ? 'Duyệt' : 'Approve'}</span>
                                        </button>
                                    </>
                                )}

                                {/* COMPLETED -> TODO (Reopen) */}
                                {task.status === 'COMPLETED' && (
                                    <button
                                        onClick={() => onToggle(task._id, 'TODO')}
                                        className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                                        title={language === 'vi' ? 'Mở lại' : 'Reopen'}
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                        <span>{language === 'vi' ? 'Mở lại' : 'Reopen'}</span>
                                    </button>
                                )}
                            </div>

                            {/* Delete Task */}
                            <button
                                onClick={() => onDelete(task._id)}
                                className="text-slate-400 hover:text-rose-500 p-2 rounded-xl hover:bg-rose-50 transition-all duration-200 cursor-pointer"
                                title={language === 'vi' ? 'Xoá' : 'Delete'}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TaskList;
