import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import Header from '../components/Header';
import AddTask from '../components/addTask';
import StatsAndFilters from '../components/StatsAndFilters';
import TaskList from '../components/taskList';
import TaskListPagination from '../components/tasklistPagination';
import DateTimeFilter from '../components/DateTimeFilter';
import Footer from '../components/footer';
import { Loader2 } from 'lucide-react';

const HomePage = () => {
    const [tasks, setTasks] = useState([]);
    const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL', 'ACTIVE', 'COMPLETED'
    const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'today', 'week', 'month'
    const [selectedDate, setSelectedDate] = useState(null); // YYYY-MM-DD
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState({ active: 0, completed: 0 });
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/tasks', {
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
            toast.error("Không thể tải danh sách công việc. Vui lòng thử lại!");
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
            const response = await axios.post('/api/tasks', { title });
            if (response.status === 201) {
                toast.success("Thêm công việc thành công!");
                fetchTasks();
            }
        } catch (error) {
            console.error("Lỗi khi thêm công việc:", error);
            toast.error("Không thể thêm công việc!");
        }
    };

    const handleToggleTask = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'ACTIVE' ? 'COMPLETED' : 'ACTIVE';
            const completedAt = newStatus === 'COMPLETED' ? new Date() : null;

            const response = await axios.put(`/api/tasks/${id}`, {
                status: newStatus,
                completedAt
            });

            if (response.status === 200) {
                toast.success(newStatus === 'COMPLETED' ? "Đã hoàn thành công việc! 🎉" : "Đã mở lại công việc!");
                fetchTasks();
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật công việc:", error);
            toast.error("Không thể cập nhật công việc!");
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            const response = await axios.delete(`/api/tasks/${id}`);
            if (response.status === 200) {
                toast.success("Đã xoá công việc!");
                fetchTasks();
            }
        } catch (error) {
            console.error("Lỗi khi xoá công việc:", error);
            toast.error("Không thể xoá công việc!");
        }
    };

    return (
        <div className="min-h-screen w-full bg-white relative overflow-hidden py-12 flex items-center justify-center"> 
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
                    <Header />

                    {/* Tạo Nhiệm Vụ */}
                    <AddTask onAdd={handleAddTask} />

                    {/* Thống Kê và Bộ lọc */}
                    <StatsAndFilters 
                        activeFilter={activeFilter} 
                        setActiveFilter={setActiveFilter} 
                        stats={stats} 
                    />

                    {/* Danh Sách Nhiệm Vụ */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                            <p className="text-xs font-semibold">Đang tải danh sách công việc...</p>
                        </div>
                    ) : (
                        <TaskList 
                            tasks={tasks} 
                            onToggle={handleToggleTask} 
                            onDelete={handleDeleteTask} 
                        />
                    )}

                    {/* Phân Trang và Lọc Theo Date */}
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                        <TaskListPagination 
                            page={page} 
                            totalPages={totalPages} 
                            setPage={setPage} 
                        />
                        <DateTimeFilter 
                            timeFilter={timeFilter} 
                            setTimeFilter={setTimeFilter} 
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                        />
                    </div>

                    {/* Chân Trang */}
                    <Footer stats={stats} />
                </div>
            </div>
        </div>
    );
};

export default HomePage;