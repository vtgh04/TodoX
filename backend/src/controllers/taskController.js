import Task from "../model/task.js"



export const getAllTask = async (req, res) => {
    try {
        const { status, timeRange, date, page = 1, limit = 5 } = req.query;

        // Build query object
        const query = {};

        // 1. Status Filter
        if (status && status !== "ALL") {
            query.status = status; // "ACTIVE" or "COMPLETED"
        }

        // 2. Date or Time Range Filter
        if (date) {
            // Assuming Vietnam timezone (UTC+7)
            const startOfDay = new Date(`${date}T00:00:00.000+07:00`);
            const endOfDay = new Date(`${date}T23:59:59.999+07:00`);
            query.createdAt = { $gte: startOfDay, $lte: endOfDay };
        } else if (timeRange && timeRange !== "all" && timeRange !== "custom") {
            const now = new Date();
            let startDate = new Date();

            if (timeRange === "today") {
                // Get current date/time shifted to Vietnam timezone (UTC+7)
                const nowVN = new Date(now.getTime() + (7 * 60 * 60 * 1000));
                const vnYear = nowVN.getUTCFullYear();
                const vnMonth = String(nowVN.getUTCMonth() + 1).padStart(2, '0');
                const vnDay = String(nowVN.getUTCDate()).padStart(2, '0');
                startDate = new Date(`${vnYear}-${vnMonth}-${vnDay}T00:00:00.000+07:00`);
            } else if (timeRange === "week") {
                // start of current week (7 days ago)
                startDate.setDate(now.getDate() - 7);
            } else if (timeRange === "month") {
                // start of current month (30 days ago)
                startDate.setMonth(now.getMonth() - 1);
            }

            query.createdAt = { $gte: startDate };
        }

        // 3. Pagination Setup
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Get total count of documents matching the query
        const total = await Task.countDocuments(query);

        // Fetch tasks
        const tasks = await Task.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        // Fetch stats (overall counts) for badges
        const activeCount = await Task.countDocuments({ status: "ACTIVE" });
        const completedCount = await Task.countDocuments({ status: "COMPLETED" });

        res.status(200).json({
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
        });
    } catch (error) {
        console.error("Lỗi hệ thống getAlltask: " + error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const createTask = async (req, res) => {
    try {
        const { title } = req.body;
        const task = new Task({ title });

        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {

        console.error("Lỗi hệ thống createTask: " + error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const updateTask = async (req, res) => {
    try {
        const { title, status, completedAt } = req.body;
        const upDatedTask = await Task.findByIdAndUpdate(
            req.params.id, {
            title,
            status,
            completedAt,
        },
            {
                returnDocument: 'after'
            }
        );

        if (!upDatedTask) {
            return res.status(404).json({ message: "Không tìm thấy công việc" });
        }

        res.status(200).json(upDatedTask);
    } catch (error) {
        console.error("Lỗi hệ thống updateTask: " + error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const deleteTask = async (req, res) => {
    try {
        const deleteTask = await Task.findByIdAndDelete(req.params.id);
        if (!deleteTask) {
            return res.status(404).json({ message: "Không tìm thấy công việc" });
        }
        res.status(200).json({ message: "Xoá thành công công việc" });
    } catch (error) {
        console.error("Lỗi hệ thống deleteTask: " + error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}