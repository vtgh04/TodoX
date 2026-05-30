import { create } from "zustand";
import api from "../../../lib/axios";

// Helper to generate temporary ID for offline created tasks
const generateTempId = () => `temp_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;

export const useTodoStore = create((set, get) => {
    // Check if offline queue is stored in localStorage
    const savedQueue = JSON.parse(localStorage.getItem("todo_sync_queue")) || [];

    return {
        tasks: [],
        stats: { todo: 0, inProgress: 0, underReview: 0, completed: 0, active: 0 },
        pagination: { total: 0, page: 1, limit: 5, totalPages: 1 },
        loading: false,
        syncQueue: savedQueue,
        isSyncing: false,

        // Set state helpers
        setTasks: (tasks) => set({ tasks }),
        setStats: (stats) => set({ stats }),

        fetchTasks: async (filters = {}) => {
            const { activeFilter = 'ALL', timeFilter = 'all', selectedDate = null, page = 1 } = filters;
            
            // If offline, we cannot fetch the latest, so we keep current tasks
            if (!navigator.onLine) {
                return;
            }

            set({ loading: true });
            try {
                const response = await api.get("/tasks", {
                    params: {
                        status: activeFilter,
                        timeRange: timeFilter,
                        date: selectedDate,
                        page,
                        limit: 5
                    }
                });

                if (response.data) {
                    const fetchedTasks = response.data.tasks || [];
                    // Keep offline pending tasks in the view if they match current filters
                    const pendingTasks = get().tasks.filter(t => t.pendingSync);
                    
                    // Merge fetched tasks and pending tasks, ensuring no duplicates
                    const mergedTasks = [...pendingTasks, ...fetchedTasks.filter(ft => !pendingTasks.some(pt => pt._id === ft._id))];

                    set({
                        tasks: mergedTasks,
                        pagination: response.data.pagination || get().pagination,
                        stats: response.data.stats || get().stats,
                        loading: false
                    });
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
                set({ loading: false });
            }
        },

        createTask: async (title, priority = "Medium", filters = {}) => {
            const tempId = generateTempId();
            const newTask = {
                _id: tempId,
                title: title.trim(),
                status: "TODO",
                priority,
                createdAt: new Date().toISOString(),
                pendingSync: true
            };

            // Optimistic Update: Add to local state immediately
            const currentTasks = get().tasks;
            const currentStats = get().stats;
            
            set({
                tasks: [newTask, ...currentTasks],
                stats: {
                    ...currentStats,
                    todo: (currentStats.todo || 0) + 1,
                    active: (currentStats.active || 0) + 1
                }
            });

            if (!navigator.onLine) {
                // Save to queue if offline
                const newQueue = [...get().syncQueue, { type: "CREATE", title, priority, tempId }];
                set({ syncQueue: newQueue });
                localStorage.setItem("todo_sync_queue", JSON.stringify(newQueue));
                return { success: true, offline: true };
            }

            try {
                const response = await api.post("/tasks", { title, priority });
                if (response.status === 201) {
                    // Replace temp task with real task returned from backend
                    const realTask = response.data;
                    set({
                        tasks: get().tasks.map(t => t._id === tempId ? realTask : t)
                    });
                    // Refresh stats and full list to keep parity
                    await get().fetchTasks(filters);
                    return { success: true };
                }
            } catch (error) {
                console.error("Error creating task:", error);
                // Rollback optimistic update
                set({
                    tasks: get().tasks.filter(t => t._id !== tempId),
                    stats: currentStats
                });
                return { success: false, error };
            }
        },

        updateTaskStatus: async (taskId, newStatus, filters = {}) => {
            const currentTasks = get().tasks;
            const currentStats = get().stats;
            const taskToUpdate = currentTasks.find(t => t._id === taskId);
            
            if (!taskToUpdate) return { success: false };

            const oldStatus = taskToUpdate.status;

            // Perform Local State Machine transition check
            const allowed = {
                "TODO": ["IN_PROGRESS"],
                "IN_PROGRESS": ["TODO", "UNDER_REVIEW"],
                "UNDER_REVIEW": ["IN_PROGRESS", "COMPLETED"],
                "COMPLETED": ["TODO"]
            };

            if (oldStatus !== newStatus) {
                const isAllowed = (allowed[oldStatus] || []).includes(newStatus);
                if (!isAllowed) {
                    return { success: false, error: new Error(`Không thể chuyển từ ${oldStatus} sang ${newStatus}`) };
                }
            }

            // Optimistic Update: Transition status locally
            let updatedTasks = currentTasks.map(t => {
                if (t._id === taskId) {
                    return {
                        ...t,
                        status: newStatus,
                        pendingSync: true,
                        completedAt: newStatus === "COMPLETED" ? new Date().toISOString() : null
                    };
                }
                // Handle Auto-Pause: if newStatus is IN_PROGRESS, any other IN_PROGRESS task becomes TODO
                if (newStatus === "IN_PROGRESS" && t.status === "IN_PROGRESS" && t._id !== taskId) {
                    return { ...t, status: "TODO", pendingSync: true };
                }
                return t;
            });

            // Recalculate local stats optimistically
            const newStats = { ...currentStats };
            // decrement old status
            if (oldStatus === "TODO") newStats.todo = Math.max(0, (newStats.todo || 0) - 1);
            else if (oldStatus === "IN_PROGRESS") newStats.inProgress = Math.max(0, (newStats.inProgress || 0) - 1);
            else if (oldStatus === "UNDER_REVIEW") newStats.underReview = Math.max(0, (newStats.underReview || 0) - 1);
            else if (oldStatus === "COMPLETED") newStats.completed = Math.max(0, (newStats.completed || 0) - 1);

            // increment new status
            if (newStatus === "TODO") newStats.todo = (newStats.todo || 0) + 1;
            else if (newStatus === "IN_PROGRESS") {
                // If we changed to IN_PROGRESS, another task might have auto-paused from IN_PROGRESS -> TODO
                const hadAnotherInProgress = currentTasks.some(t => t.status === "IN_PROGRESS" && t._id !== taskId);
                if (hadAnotherInProgress) {
                    newStats.inProgress = Math.max(0, (newStats.inProgress || 0) - 1); // remove the other active task
                    newStats.todo = (newStats.todo || 0) + 1; // pause it to TODO
                }
                newStats.inProgress = (newStats.inProgress || 0) + 1;
            }
            else if (newStatus === "UNDER_REVIEW") newStats.underReview = (newStats.underReview || 0) + 1;
            else if (newStatus === "COMPLETED") newStats.completed = (newStats.completed || 0) + 1;

            newStats.active = (newStats.todo || 0) + (newStats.inProgress || 0) + (newStats.underReview || 0);

            set({ tasks: updatedTasks, stats: newStats });

            if (!navigator.onLine || taskId.startsWith("temp_")) {
                // Save to offline queue
                const newQueue = [...get().syncQueue, { type: "UPDATE_STATUS", id: taskId, status: newStatus }];
                set({ syncQueue: newQueue });
                localStorage.setItem("todo_sync_queue", JSON.stringify(newQueue));
                return { success: true, offline: true };
            }

            try {
                const response = await api.put(`/tasks/${taskId}`, { status: newStatus });
                if (response.status === 200) {
                    // Update task with clean response from server
                    set({
                        tasks: get().tasks.map(t => t._id === taskId ? { ...response.data, pendingSync: false } : t)
                    });
                    await get().fetchTasks(filters);
                    return { success: true };
                }
            } catch (error) {
                console.error("Error updating task status:", error);
                // Rollback on error
                set({ tasks: currentTasks, stats: currentStats });
                return { success: false, error };
            }
        },

        deleteTask: async (taskId, filters = {}) => {
            const currentTasks = get().tasks;
            const currentStats = get().stats;
            const taskToDelete = currentTasks.find(t => t._id === taskId);
            
            if (!taskToDelete) return { success: false };

            // Optimistic Update: Remove task immediately
            set({
                tasks: currentTasks.filter(t => t._id !== taskId)
            });

            // Adjust stats
            const newStats = { ...currentStats };
            if (taskToDelete.status === "TODO") newStats.todo = Math.max(0, (newStats.todo || 0) - 1);
            else if (taskToDelete.status === "IN_PROGRESS") newStats.inProgress = Math.max(0, (newStats.inProgress || 0) - 1);
            else if (taskToDelete.status === "UNDER_REVIEW") newStats.underReview = Math.max(0, (newStats.underReview || 0) - 1);
            else if (taskToDelete.status === "COMPLETED") newStats.completed = Math.max(0, (newStats.completed || 0) - 1);
            
            newStats.active = (newStats.todo || 0) + (newStats.inProgress || 0) + (newStats.underReview || 0);
            set({ stats: newStats });

            if (!navigator.onLine || taskId.startsWith("temp_")) {
                const newQueue = [...get().syncQueue, { type: "DELETE", id: taskId }];
                set({ syncQueue: newQueue });
                localStorage.setItem("todo_sync_queue", JSON.stringify(newQueue));
                return { success: true, offline: true };
            }

            try {
                const response = await api.delete(`/tasks/${taskId}`);
                if (response.status === 200) {
                    await get().fetchTasks(filters);
                    return { success: true };
                }
            } catch (error) {
                console.error("Error deleting task:", error);
                // Rollback
                set({ tasks: currentTasks, stats: currentStats });
                return { success: false, error };
            }
        },

        processSyncQueue: async (filters = {}) => {
            const queue = get().syncQueue;
            if (queue.length === 0 || get().isSyncing) return;

            set({ isSyncing: true });
            
            // Map to track tempIds -> realIds mapping
            const idMap = {};
            const remainingQueue = [...queue];

            try {
                for (const action of queue) {
                    if (action.type === "CREATE") {
                        try {
                            const response = await api.post("/tasks", { title: action.title, priority: action.priority });
                            if (response.status === 201) {
                                idMap[action.tempId] = response.data._id;
                            }
                        } catch (err) {
                            console.error("Sync: failed to create task", err);
                        }
                    } else if (action.type === "UPDATE_STATUS") {
                        // If it's a tempId, map it to the realId first
                        const realId = idMap[action.id] || action.id;
                        if (!realId.startsWith("temp_")) {
                            try {
                                await api.put(`/tasks/${realId}`, { status: action.status });
                            } catch (err) {
                                console.error(`Sync: failed to update task ${realId}`, err);
                            }
                        }
                    } else if (action.type === "DELETE") {
                        const realId = idMap[action.id] || action.id;
                        if (!realId.startsWith("temp_")) {
                            try {
                                await api.delete(`/tasks/${realId}`);
                            } catch (err) {
                                console.error(`Sync: failed to delete task ${realId}`, err);
                            }
                        }
                    }
                    remainingQueue.shift();
                }

                // Update sync queue in store and localStorage
                set({ syncQueue: remainingQueue });
                localStorage.setItem("todo_sync_queue", JSON.stringify(remainingQueue));
            } catch (error) {
                console.error("Error during queue synchronization:", error);
            } finally {
                set({ isSyncing: false });
                // Force fetch fresh tasks from DB to override any client sync drift
                await get().fetchTasks(filters);
            }
        }
    };
});
