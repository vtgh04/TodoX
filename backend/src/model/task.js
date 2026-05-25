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
            enum: ["ACTIVE", "COMPLETED"],
            default: "ACTIVE"
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