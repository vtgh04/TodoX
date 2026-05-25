import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus } from 'lucide-react';

const AddTask = ({ onAdd }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAdd(title);
        setTitle('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 w-full p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <Input
                type="text"
                placeholder="Cần phải làm gì?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 bg-slate-50 border-slate-200/80 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl"
            />
            <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-xl px-5 transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5 cursor-pointer"
            >
                <Plus className="w-4 h-4" />
                Thêm
            </Button>
        </form>
    );
};

export default AddTask;