import Task from "../model/task.js";

class TaskRepository {
    async countTasks(query) {
        return await Task.countDocuments(query);
    }

    async findTask(query) {
        return await Task.findOne(query);
    }

    async findTasks(query, sort, skip, limit) {
        return await Task.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit);
    }

    async createTask(taskData) {
        const task = new Task(taskData);
        return await task.save();
    }

    async updateTask(query, updateData) {
        return await Task.findOneAndUpdate(
            query,
            updateData,
            { returnDocument: 'after' }
        );
    }

    async deleteTask(query) {
        return await Task.findOneAndDelete(query);
    }
}

export default new TaskRepository();
