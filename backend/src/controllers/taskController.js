import taskService from "../services/taskService.js";

export const getAllTask = async (req, res) => {
    try {
        const result = await taskService.getTasks(req.user._id, req.query);
        res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi hệ thống getAlltask: " + error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const createTask = async (req, res) => {
    try {
        const { title, priority } = req.body;
        const newTask = await taskService.createTask(req.user._id, title, priority);
        res.status(201).json(newTask);
    } catch (error) {
        console.error("Lỗi hệ thống createTask: " + error);
        res.status(error.statusCode || 500).json({ 
            message: error.message || "Lỗi hệ thống", 
            field: error.field 
        });
    }
}

export const updateTask = async (req, res) => {
    try {
        const upDatedTask = await taskService.updateTask(
            req.user._id, 
            req.params.id, 
            {
                title: req.body.title,
                status: req.body.status,
                priority: req.body.priority,
                completedAt: req.body.completedAt,
            }
        );

        if (!upDatedTask) {
            return res.status(404).json({ message: "Không tìm thấy công việc" });
        }

        res.status(200).json(upDatedTask);
    } catch (error) {
        console.error("Lỗi hệ thống updateTask: " + error);
        res.status(error.statusCode || 500).json({ 
            message: error.message || "Lỗi hệ thống", 
            field: error.field 
        });
    }
}

export const deleteTask = async (req, res) => {
    try {
        const deletedTask = await taskService.deleteTask(req.user._id, req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ message: "Không tìm thấy công việc" });
        }
        res.status(200).json({ message: "Xoá thành công công việc" });
    } catch (error) {
        console.error("Lỗi hệ thống deleteTask: " + error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}