import taskRepository from "../repositories/taskRepository.js";

class TaskService {
    async getTasks(userId, queryParams) {
        const { status, timeRange, date, page = 1, limit = 5 } = queryParams;

        // Build query object
        const query = { user: userId };

        // 1. Status Filter
        if (status && status !== "ALL") {
            if (status === "ACTIVE") {
                // For backward compatibility
                query.status = { $in: ["TODO", "IN_PROGRESS", "UNDER_REVIEW"] };
            } else {
                query.status = status;
            }
        }

        // 2. Date or Time Range Filter
        if (date) {
            const startOfDay = new Date(`${date}T00:00:00.000+07:00`);
            const endOfDay = new Date(`${date}T23:59:59.999+07:00`);
            query.createdAt = { $gte: startOfDay, $lte: endOfDay };
        } else if (timeRange && timeRange !== "all" && timeRange !== "custom") {
            const now = new Date();
            let startDate = new Date();

            if (timeRange === "today") {
                const nowVN = new Date(now.getTime() + (7 * 60 * 60 * 1000));
                const vnYear = nowVN.getUTCFullYear();
                const vnMonth = String(nowVN.getUTCMonth() + 1).padStart(2, '0');
                const vnDay = String(nowVN.getUTCDate()).padStart(2, '0');
                startDate = new Date(`${vnYear}-${vnMonth}-${vnDay}T00:00:00.000+07:00`);
            } else if (timeRange === "week") {
                startDate.setDate(now.getDate() - 7);
            } else if (timeRange === "month") {
                startDate.setMonth(now.getMonth() - 1);
            }

            query.createdAt = { $gte: startDate };
        }

        // 3. Pagination Setup
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const total = await taskRepository.countTasks(query);
        const tasks = await taskRepository.findTasks(query, { createdAt: -1 }, skip, limitNum);

        const todoCount = await taskRepository.countTasks({ user: userId, status: "TODO" });
        const inProgressCount = await taskRepository.countTasks({ user: userId, status: "IN_PROGRESS" });
        const underReviewCount = await taskRepository.countTasks({ user: userId, status: "UNDER_REVIEW" });
        const completedCount = await taskRepository.countTasks({ user: userId, status: "COMPLETED" });

        return {
            tasks,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            },
            stats: {
                todo: todoCount,
                inProgress: inProgressCount,
                underReview: underReviewCount,
                completed: completedCount,
                active: todoCount + inProgressCount + underReviewCount,
                completed: completedCount
            }
        };
    }

    async createTask(userId, title, priority = "Medium") {
        if (!title || typeof title !== 'string' || !title.trim()) {
            const error = new Error("Tiêu đề công việc không được để trống.");
            error.statusCode = 400;
            error.field = "title";
            throw error;
        }
        if (title.length > 100) {
            const error = new Error("Tiêu đề công việc phải dưới 100 ký tự.");
            error.statusCode = 400;
            error.field = "title";
            throw error;
        }

        const validPriorities = ["Low", "Medium", "High"];
        if (priority && !validPriorities.includes(priority)) {
            const error = new Error("Mức độ ưu tiên không hợp lệ.");
            error.statusCode = 400;
            error.field = "priority";
            throw error;
        }

        return await taskRepository.createTask({
            title: title.trim(),
            user: userId,
            status: "TODO",
            priority
        });
    }

    async updateTask(userId, taskId, updateData) {
        const existingTask = await taskRepository.findTask({ _id: taskId, user: userId });
        if (!existingTask) {
            return null;
        }

        // Validate title if present
        if (updateData.title !== undefined) {
            const title = updateData.title;
            if (!title || typeof title !== 'string' || !title.trim()) {
                const error = new Error("Tiêu đề công việc không được để trống.");
                error.statusCode = 400;
                error.field = "title";
                throw error;
            }
            if (title.length > 100) {
                const error = new Error("Tiêu đề công việc phải dưới 100 ký tự.");
                error.statusCode = 400;
                error.field = "title";
                throw error;
            }
            updateData.title = title.trim();
        }

        // Validate priority if present
        if (updateData.priority !== undefined) {
            const priority = updateData.priority;
            const validPriorities = ["Low", "Medium", "High"];
            if (!validPriorities.includes(priority)) {
                const error = new Error("Mức độ ưu tiên không hợp lệ.");
                error.statusCode = 400;
                error.field = "priority";
                throw error;
            }
        }

        // Validate state machine status transition
        if (updateData.status !== undefined) {
            const newStatus = updateData.status;
            const oldStatus = existingTask.status;

            // Map old system statuses (ACTIVE/COMPLETED) to new system if needed
            let mappedOldStatus = oldStatus;
            if (oldStatus === "ACTIVE") mappedOldStatus = "TODO";

            const allowed = {
                "TODO": ["IN_PROGRESS"],
                "IN_PROGRESS": ["TODO", "UNDER_REVIEW"],
                "UNDER_REVIEW": ["IN_PROGRESS", "COMPLETED"],
                "COMPLETED": ["TODO"] // Allow reopening
            };

            if (mappedOldStatus !== newStatus) {
                const isAllowed = (allowed[mappedOldStatus] || []).includes(newStatus);
                if (!isAllowed) {
                    const error = new Error(`Không thể chuyển đổi trạng thái từ ${mappedOldStatus} sang ${newStatus}.`);
                    error.statusCode = 400;
                    error.field = "status";
                    throw error;
                }
            }

            // Auto-pause rule: If transitioning to IN_PROGRESS, pause any other IN_PROGRESS tasks for this user
            if (newStatus === "IN_PROGRESS" && mappedOldStatus !== "IN_PROGRESS") {
                const activeTask = await taskRepository.findTask({
                    user: userId,
                    status: "IN_PROGRESS",
                    _id: { $ne: taskId }
                });
                if (activeTask) {
                    await taskRepository.updateTask(
                        { _id: activeTask._id, user: userId },
                        { status: "TODO" }
                    );
                }
            }

            // Set completedAt accordingly
            if (newStatus === "COMPLETED" && mappedOldStatus !== "COMPLETED") {
                updateData.completedAt = new Date();
            } else if (newStatus !== "COMPLETED" && mappedOldStatus === "COMPLETED") {
                updateData.completedAt = null;
            }
        }

        return await taskRepository.updateTask(
            { _id: taskId, user: userId },
            updateData
        );
    }

    async deleteTask(userId, taskId) {
        return await taskRepository.deleteTask({ _id: taskId, user: userId });
    }
}

export default new TaskService();
