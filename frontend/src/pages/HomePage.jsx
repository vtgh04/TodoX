import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Header from '../components/Header';
import AddTask from '../features/todos/components/addTask';
import StatsAndFilters from '../features/todos/components/StatsAndFilters';
import TaskList from '../features/todos/components/taskList';
import BoardView from '../features/todos/components/BoardView';
import TaskListPagination from '../features/todos/components/TaskListPagination';
import DateTimeFilter from '../features/todos/components/DateTimeFilter';
import Footer from '../components/footer';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { Loader2, LogOut, User, List, LayoutGrid, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTodoStore } from '../features/todos/store/useTodoStore';

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
    const {
        tasks,
        stats,
        pagination,
        loading,
        fetchTasks,
        createTask,
        updateTaskStatus,
        deleteTask,
        processSyncQueue
    } = useTodoStore();

    const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL', 'ACTIVE', 'COMPLETED'
    const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'today', 'week', 'month'
    const [selectedDate, setSelectedDate] = useState(null); // YYYY-MM-DD
    const [page, setPage] = useState(1);
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'board'
    const [searchQuery, setSearchQuery] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('ALL'); // 'ALL', 'Low', 'Medium', 'High'
    
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('todo_lang') || 'vi';
    });

    const handleSetLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('todo_lang', lang);
    };

    // Load tasks from Zustand store when filters change
    useEffect(() => {
        fetchTasks({ activeFilter, timeFilter, selectedDate, page });
    }, [activeFilter, timeFilter, selectedDate, page]);

    // Reset page to 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [activeFilter, timeFilter, selectedDate]);

    // Handle offline auto-sync listeners
    useEffect(() => {
        const handleOnline = () => {
            toast.success(language === 'vi' ? 'Đã khôi phục kết nối! Đang tự động đồng bộ dữ liệu...' : 'Connection restored! Auto-syncing data...');
            processSyncQueue({ activeFilter, timeFilter, selectedDate, page });
        };
        const handleOffline = () => {
            toast.warning(language === 'vi' ? 'Mất kết nối mạng. Đã chuyển sang chế độ ngoại tuyến.' : 'Network lost. Switched to offline mode.');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Attempt sync on mount if online
        if (navigator.onLine) {
            processSyncQueue({ activeFilter, timeFilter, selectedDate, page });
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [activeFilter, timeFilter, selectedDate, page, language]);

    const handleAddTask = async (title, priority) => {
        const res = await createTask(title, priority, { activeFilter, timeFilter, selectedDate, page });
        if (res.success) {
            if (res.offline) {
                toast.info(language === 'vi' ? 'Lưu tạm thời ngoại tuyến thành công!' : 'Saved offline temporarily!');
            } else {
                toast.success(translations[language].addSuccess);
            }
        } else {
            toast.error(res.error?.message || translations[language].addError);
        }
    };

    const handleToggleTask = async (id, newStatus) => {
        const res = await updateTaskStatus(id, newStatus, { activeFilter, timeFilter, selectedDate, page });
        if (res.success) {
            if (res.offline) {
                toast.info(language === 'vi' ? 'Cập nhật tạm thời ngoại tuyến!' : 'Updated offline temporarily!');
            } else {
                toast.success(
                    newStatus === 'COMPLETED'
                        ? translations[language].completeSuccess
                        : translations[language].reopenSuccess
                );
            }
        } else {
            toast.error(res.error?.message || translations[language].updateError);
        }
    };

    const handleDeleteTask = async (id) => {
        const res = await deleteTask(id, { activeFilter, timeFilter, selectedDate, page });
        if (res.success) {
            if (res.offline) {
                toast.info(language === 'vi' ? 'Xoá tạm thời ngoại tuyến!' : 'Deleted offline temporarily!');
            } else {
                toast.success(translations[language].deleteSuccess);
            }
        } else {
            toast.error(res.error?.message || translations[language].deleteError);
        }
    };

    const handleLogout = async () => {
        await logout();
        toast.success(language === 'vi' ? 'Đã đăng xuất! Hẹn gặp lại.' : 'Logged out! See you again.');
    };

    // Client-side instant filtering (AC 1: latency < 50ms)
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = searchQuery.trim() === '' || 
            task.title.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesPriority = priorityFilter === 'ALL' || 
            task.priority === priorityFilter;

        return matchesSearch && matchesPriority;
    });

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
                <div className="w-full max-w-4xl px-6 mx-auto space-y-6">
                    {/* Đầu Trang */}
                    <Header language={language} />

                    {/* Tạo Nhiệm Vụ */}
                    <AddTask onAdd={handleAddTask} language={language} />

                    {/* Bộ lọc Thống Kê & View mode */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 backdrop-blur-md p-3 rounded-2xl border border-slate-100 shadow-sm">
                        <StatsAndFilters 
                            activeFilter={activeFilter} 
                            setActiveFilter={setActiveFilter} 
                            stats={stats} 
                            language={language}
                        />
                        
                        {/* View Mode Toggle */}
                        <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200/50 self-end sm:self-auto select-none">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                <List className="w-3.5 h-3.5" />
                                <span>{language === 'vi' ? 'Danh sách' : 'List'}</span>
                            </button>
                            <button
                                onClick={() => setViewMode('board')}
                                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    viewMode === 'board' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                <LayoutGrid className="w-3.5 h-3.5" />
                                <span>{language === 'vi' ? 'Bảng' : 'Board'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Instant Search & Priority Filter Row */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full p-4 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm select-none">
                        <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                <Search className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                placeholder={language === 'vi' ? 'Tìm kiếm nhanh công việc...' : 'Quick search tasks...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50/80 border border-slate-200/80 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none transition-all text-slate-700 font-medium"
                            />
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            <span className="text-slate-400 text-xs font-semibold">{language === 'vi' ? 'Lọc ưu tiên:' : 'Priority Filter:'}</span>
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="bg-slate-50 border border-slate-200/80 rounded-xl py-2 px-3 text-xs focus:border-blue-400 focus:outline-none transition-all text-slate-600 font-semibold cursor-pointer"
                            >
                                <option value="ALL">{language === 'vi' ? 'Tất cả' : 'All'}</option>
                                <option value="Low">{language === 'vi' ? 'Thấp (Low)' : 'Low'}</option>
                                <option value="Medium">{language === 'vi' ? 'Trung bình (Medium)' : 'Medium'}</option>
                                <option value="High">{language === 'vi' ? 'Cao (High)' : 'High'}</option>
                            </select>
                        </div>
                    </div>

                    {/* Danh Sách Nhiệm Vụ */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                            <p className="text-xs font-semibold">{translations[language].loading}</p>
                        </div>
                    ) : viewMode === 'list' ? (
                        <TaskList 
                            tasks={filteredTasks} 
                            onToggle={handleToggleTask} 
                            onDelete={handleDeleteTask} 
                            language={language}
                        />
                    ) : (
                        <BoardView 
                            tasks={filteredTasks} 
                            onToggle={handleToggleTask} 
                            onDelete={handleDeleteTask} 
                            language={language}
                        />
                    )}

                    {/* Phân Trang và Lọc Theo Date */}
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                        <TaskListPagination 
                            page={page} 
                            totalPages={pagination.totalPages || 1} 
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