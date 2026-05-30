import mongoose from "mongoose"
const taskSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: "String",
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["TODO", "IN_PROGRESS", "UNDER_REVIEW", "COMPLETED"],
            default: "TODO"
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },
        completedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true // auto tao createAt va UpdataAt
    }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;