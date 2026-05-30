import React from 'react';
import { Calendar, Trash2, Play, Pause, Send, Check, X, RotateCcw, CloudOff } from 'lucide-react';

const BoardView = ({ tasks, onToggle, onDelete, language }) => {
    const columns = [
        { id: 'TODO', title: language === 'vi' ? 'Chờ làm' : 'To Do', color: 'border-t-slate-400 bg-slate-50/40' },
        { id: 'IN_PROGRESS', title: language === 'vi' ? 'Đang làm' : 'In Progress', color: 'border-t-blue-500 bg-blue-50/10' },
        { id: 'UNDER_REVIEW', title: language === 'vi' ? 'Chờ duyệt' : 'Under Review', color: 'border-t-indigo-500 bg-indigo-50/10' },
        { id: 'COMPLETED', title: language === 'vi' ? 'Hoàn thành' : 'Completed', color: 'border-t-emerald-500 bg-emerald-50/10' }
    ];

    const priorityBadges = {
        Low: { vi: 'Thấp', en: 'Low', class: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
        Medium: { vi: 'Trung bình', en: 'Medium', class: 'bg-amber-50 text-amber-600 border-amber-100' },
        High: { vi: 'Cao', en: 'High', class: 'bg-rose-50 text-rose-600 border-rose-100' }
    };

    // Filter tasks for each column
    const getTasksByStatus = (status) => {
        return tasks.filter(t => t.status === status);
    };

    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData('text/plain', taskId);
        e.currentTarget.classList.add('opacity-40');
    };

    const handleDragEnd = (e) => {
        e.currentTarget.classList.remove('opacity-40');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('bg-slate-100/60');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('bg-slate-100/60');
    };

    const handleDrop = (e, targetStatus) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-slate-100/60');
        const taskId = e.dataTransfer.getData('text/plain');
        if (taskId) {
            onToggle(taskId, targetStatus);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US', {
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 select-none">
            {columns.map((col) => {
                const columnTasks = getTasksByStatus(col.id);

                return (
                    <div
                        key={col.id}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, col.id)}
                        className={`flex flex-col min-h-[350px] p-4 rounded-2xl border border-slate-100/80 border-t-4 shadow-sm transition-all duration-300 ${col.color}`}
                    >
                        {/* Column Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                {col.title}
                            </h3>
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
                                {columnTasks.length}
                            </span>
                        </div>

                        {/* Cards Container */}
                        <div className="flex-1 space-y-3 overflow-y-auto max-h-[450px] pr-1">
                            {columnTasks.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-slate-200/60 rounded-xl">
                                    <span className="text-[10px] font-semibold text-slate-400">
                                        {language === 'vi' ? 'Thả việc vào đây' : 'Drop tasks here'}
                                    </span>
                                </div>
                            ) : (
                                columnTasks.map((task) => {
                                    const priorityInfo = priorityBadges[task.priority || 'Medium'];
                                    const isCompleted = task.status === 'COMPLETED';

                                    return (
                                        <div
                                            key={task._id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, task._id)}
                                            onDragEnd={handleDragEnd}
                                            className={`p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-grab active:cursor-grabbing relative group ${
                                                isCompleted ? 'bg-slate-50/50 border-slate-100' : ''
                                            }`}
                                        >
                                            {/* Top badges */}
                                            <div className="flex justify-between items-start gap-2 mb-2 flex-wrap">
                                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border select-none ${priorityInfo.class}`}>
                                                    {language === 'vi' ? priorityInfo.vi : priorityInfo.en}
                                                </span>

                                                {task.pendingSync && (
                                                    <span className="text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-100 px-1 py-0.5 rounded flex items-center gap-0.5 animate-pulse" title={language === 'vi' ? 'Chờ đồng bộ' : 'Pending Sync'}>
                                                        <CloudOff className="w-2.5 h-2.5" />
                                                    </span>
                                                )}
                                            </div>

                                            {/* Task Title */}
                                            <p className={`text-xs font-bold text-slate-700 leading-relaxed mb-3 break-words ${
                                                isCompleted ? 'line-through text-slate-400 font-semibold' : ''
                                            }`}>
                                                {task.title}
                                            </p>

                                            {/* Bottom actions & info */}
                                            <div className="flex items-center justify-between border-t border-slate-50 pt-2 text-[9px] text-slate-400 font-semibold select-none">
                                                <span className="flex items-center gap-0.5">
                                                    <Calendar className="w-2.5 h-2.5" />
                                                    {formatDate(task.createdAt)}
                                                </span>

                                                {/* Mini transition buttons & delete */}
                                                <div className="flex items-center gap-1">
                                                    {/* Quick Shift buttons for touch/click backup */}
                                                    {task.status === 'TODO' && (
                                                        <button
                                                            onClick={() => onToggle(task._id, 'IN_PROGRESS')}
                                                            className="text-blue-500 hover:bg-blue-50 p-1 rounded cursor-pointer border border-blue-100"
                                                            title={language === 'vi' ? 'Bắt đầu' : 'Start'}
                                                        >
                                                            <Play className="w-2.5 h-2.5 fill-current" />
                                                        </button>
                                                    )}
                                                    {task.status === 'IN_PROGRESS' && (
                                                        <>
                                                            <button
                                                                onClick={() => onToggle(task._id, 'TODO')}
                                                                className="text-slate-500 hover:bg-slate-50 p-1 rounded cursor-pointer border border-slate-200"
                                                                title={language === 'vi' ? 'Tạm dừng' : 'Pause'}
                                                            >
                                                                <Pause className="w-2.5 h-2.5 fill-current" />
                                                            </button>
                                                            <button
                                                                onClick={() => onToggle(task._id, 'UNDER_REVIEW')}
                                                                className="text-indigo-500 hover:bg-indigo-50 p-1 rounded cursor-pointer border border-indigo-100"
                                                                title={language === 'vi' ? 'Gửi duyệt' : 'Submit'}
                                                            >
                                                                <Send className="w-2.5 h-2.5" />
                                                            </button>
                                                        </>
                                                    )}
                                                    {task.status === 'UNDER_REVIEW' && (
                                                        <>
                                                            <button
                                                                onClick={() => onToggle(task._id, 'IN_PROGRESS')}
                                                                className="text-red-500 hover:bg-red-50 p-1 rounded cursor-pointer border border-red-100"
                                                                title={language === 'vi' ? 'Từ chối' : 'Reject'}
                                                            >
                                                                <X className="w-2.5 h-2.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => onToggle(task._id, 'COMPLETED')}
                                                                className="text-emerald-500 hover:bg-emerald-50 p-1 rounded cursor-pointer border border-emerald-100"
                                                                title={language === 'vi' ? 'Duyệt' : 'Approve'}
                                                            >
                                                                <Check className="w-2.5 h-2.5" />
                                                            </button>
                                                        </>
                                                    )}
                                                    {task.status === 'COMPLETED' && (
                                                        <button
                                                            onClick={() => onToggle(task._id, 'TODO')}
                                                            className="text-slate-500 hover:bg-slate-50 p-1 rounded cursor-pointer border border-slate-200"
                                                            title={language === 'vi' ? 'Mở lại' : 'Reopen'}
                                                        >
                                                            <RotateCcw className="w-2.5 h-2.5" />
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => onDelete(task._id)}
                                                        className="text-slate-400 hover:text-rose-500 p-1 rounded hover:bg-rose-50 cursor-pointer transition-colors"
                                                        title={language === 'vi' ? 'Xoá' : 'Delete'}
                                                    >
                                                        <Trash2 className="w-2.5 h-2.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BoardView;
