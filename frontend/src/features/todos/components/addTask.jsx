import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Plus } from 'lucide-react';

const AddTask = ({ onAdd, language }) => {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('Medium');

    const handleSubmit = (e) => {
        e?.preventDefault();
        if (!title.trim()) return;
        onAdd(title, priority);
        setTitle('');
    };

    const handleKeyDown = (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            handleSubmit();
        }
    };

    const placeholderText = language === 'vi' ? 'Cần phải làm gì? (Ctrl + Enter để lưu)' : 'What needs to be done? (Ctrl + Enter to save)';
    const buttonText = language === 'vi' ? 'Thêm' : 'Add';
    const priorityLabel = language === 'vi' ? 'Độ ưu tiên:' : 'Priority:';

    const priorities = [
        { value: 'Low', label: language === 'vi' ? 'Thấp' : 'Low', activeClass: 'bg-emerald-50 text-emerald-600 border-emerald-300 font-bold shadow-sm' },
        { value: 'Medium', label: language === 'vi' ? 'Trung bình' : 'Medium', activeClass: 'bg-amber-50 text-amber-600 border-amber-300 font-bold shadow-sm' },
        { value: 'High', label: language === 'vi' ? 'Cao' : 'High', activeClass: 'bg-rose-50 text-rose-600 border-rose-300 font-bold shadow-sm' }
    ];

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex gap-2">
                <Input
                    type="text"
                    placeholder={placeholderText}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-slate-50 border-slate-200/80 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl"
                />
                <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-xl px-5 transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    {buttonText}
                </Button>
            </div>

            {/* Priority Selector */}
            <div className="flex items-center gap-3 text-xs select-none">
                <span className="text-slate-400 font-semibold">{priorityLabel}</span>
                <div className="flex gap-1.5">
                    {priorities.map((p) => {
                        const isSelected = priority === p.value;
                        return (
                            <button
                                key={p.value}
                                type="button"
                                onClick={() => setPriority(p.value)}
                                className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold cursor-pointer transition-all duration-200 ${
                                    isSelected
                                        ? p.activeClass
                                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                            >
                                {p.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </form>
    );
};

export default AddTask;
