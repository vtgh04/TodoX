import taskRepository from "../repositories/taskRepository.js";

class TaskService {
    async getTasks(userId, queryParams) {
        const { status, timeRange, date, page = 1, limit = 5 } = queryParams;

        // Build query object
        const query = { user: userId };

        // 1. Status Filter
        if (status && status !== "ALL") {
            query.status = status;
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

        const activeCount = await taskRepository.countTasks({ user: userId, status: "ACTIVE" });
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
                active: activeCount,
                completed: completedCount
            }
        };
    }

    async createTask(userId, title) {
        return await taskRepository.createTask({ title, user: userId });
    }

    async updateTask(userId, taskId, updateData) {
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
