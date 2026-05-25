import React, { useState, useEffect } from 'react';
import api from '../lib/axios';
import { toast } from 'sonner';
import Header from '../components/Header';
import AddTask from '../features/todos/components/addTask';
import StatsAndFilters from '../features/todos/components/StatsAndFilters';
import TaskList from '../features/todos/components/taskList';
import TaskListPagination from '../features/todos/components/TaskListPagination';
import DateTimeFilter from '../features/todos/components/DateTimeFilter';
import Footer from '../components/footer';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { Loader2, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const translations = {
    vi: {
        loading: "Đang tải danh sách công việc...",
        loadError: "Không thể tải danh sách công việc. Vui lòng thử lại!",
        addSuccess: "Thêm công việc thành công!",
        addError: "Không thể thêm công việc!",
        completeSuccess: "Đã hoàn thành công việc! 🎉",
        reopenSuccess: "Đã mở lại công việc!",
        updateError: "Không thể cập nhật công việc!",
        deleteSuccess: "Đã xoá công việc!",
        deleteError: "Không thể xoá công việc!",
    },
    en: {
        loading: "Loading task list...",
        loadError: "Cannot load task list. Please try again!",
        addSuccess: "Task added successfully!",
        addError: "Cannot add task!",
        completeSuccess: "Task completed! 🎉",
        reopenSuccess: "Task reopened!",
        updateError: "Cannot update task!",
        deleteSuccess: "Task deleted!",
        deleteError: "Cannot delete task!",
    }
};

const HomePage = () => {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL', 'ACTIVE', 'COMPLETED'
    const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'today', 'week', 'month'
    const [selectedDate, setSelectedDate] = useState(null); // YYYY-MM-DD
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState({ active: 0, completed: 0 });
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('todo_lang') || 'vi';
    });

    const handleSetLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('todo_lang', lang);
    };

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await api.get('/tasks', {
                params: {
                    status: activeFilter,
                    timeRange: timeFilter,
                    date: selectedDate,
                    page: page,
                    limit: 5
                }
            });

            if (response.data) {
                setTasks(response.data.tasks || []);
                setTotalPages(response.data.pagination?.totalPages || 1);
                setStats(response.data.stats || { active: 0, completed: 0 });
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách công việc:", error);
            toast.error(translations[language].loadError);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [activeFilter, timeFilter, selectedDate, page]);

    useEffect(() => {
        setPage(1);
    }, [activeFilter, timeFilter, selectedDate]);

    const handleAddTask = async (title) => {
        try {
            const response = await api.post('/tasks', { title });
            if (response.status === 201) {
                toast.success(translations[language].addSuccess);
                fetchTasks();
            }
        } catch (error) {
            console.error("Lỗi khi thêm công việc:", error);
            toast.error(translations[language].addError);
        }
    };

    const handleToggleTask = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'ACTIVE' ? 'COMPLETED' : 'ACTIVE';
            const completedAt = newStatus === 'COMPLETED' ? new Date() : null;

            const response = await api.put(`/tasks/${id}`, {
                status: newStatus,
                completedAt
            });

            if (response.status === 200) {
                toast.success(
                    newStatus === 'COMPLETED'
                        ? translations[language].completeSuccess
                        : translations[language].reopenSuccess
                );
                fetchTasks();
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật công việc:", error);
            toast.error(translations[language].updateError);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            const response = await api.delete(`/tasks/${id}`);
            if (response.status === 200) {
                toast.success(translations[language].deleteSuccess);
                fetchTasks();
            }
        } catch (error) {
            console.error("Lỗi khi xoá công việc:", error);
            toast.error(translations[language].deleteError);
        }
    };

    const handleLogout = async () => {
        await logout();
        toast.success(language === 'vi' ? 'Đã đăng xuất! Hẹn gặp lại.' : 'Logged out! See you again.');
    };

    return (
        <div className="min-h-screen w-full bg-white relative overflow-hidden py-12 flex items-center justify-center"> 
            {/* User Profile & Logout */}
            {user && (
                <div className="fixed top-6 left-6 z-50 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl px-4 py-2 shadow-lg shadow-blue-500/5 flex items-center gap-3 select-none transition-all duration-300">
                    <div className="flex items-center gap-1.5 text-slate-700">
                        <User className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-bold">{user.username}</span>
                    </div>
                    <div className="w-[1px] h-4 bg-slate-200" />
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors text-xs font-bold cursor-pointer"
                        title={language === 'vi' ? 'Đăng xuất' : 'Log out'}
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{language === 'vi' ? 'Đăng xuất' : 'Logout'}</span>
                    </button>
                </div>
            )}

            {/* Language Switcher */}
            <LanguageSwitcher language={language} setLanguage={handleSetLanguage} />

            {/* Light Sky Blue Glow */}
            <div 
                className="absolute inset-0 z-0 pointer-events-none" 
                style={{
                    backgroundImage: `
                        radial-gradient(circle at center, #93c5fd 0%, transparent 70%)
                    `,
                    opacity: 0.6
                }} 
            />

            <div className="container mx-auto z-10">
                <div className="w-full max-w-2xl px-6 mx-auto space-y-6">
                    {/* Đầu Trang */}
                    <Header language={language} />

                    {/* Tạo Nhiệm Vụ */}
                    <AddTask onAdd={handleAddTask} language={language} />

                    {/* Thống Kê và Bộ lọc */}
                    <StatsAndFilters 
                        activeFilter={activeFilter} 
                        setActiveFilter={setActiveFilter} 
                        stats={stats} 
                        language={language}
                    />

                    {/* Danh Sách Nhiệm Vụ */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                            <p className="text-xs font-semibold">{translations[language].loading}</p>
                        </div>
                    ) : (
                        <TaskList 
                            tasks={tasks} 
                            onToggle={handleToggleTask} 
                            onDelete={handleDeleteTask} 
                            language={language}
                        />
                    )}

                    {/* Phân Trang và Lọc Theo Date */}
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                        <TaskListPagination 
                            page={page} 
                            totalPages={totalPages} 
                            setPage={setPage} 
                            language={language}
                        />
                        <DateTimeFilter 
                            timeFilter={timeFilter} 
                            setTimeFilter={setTimeFilter} 
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            language={language}
                        />
                    </div>

                    {/* Chân Trang */}
                    <Footer stats={stats} language={language} />
                </div>
            </div>
        </div>
    );
};

export default HomePage;