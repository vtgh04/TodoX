import express from "express";
import taskRouters from "./routes/tasksRouters.js"
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();


const PORT = process.env.PORT || 5001
const app = express();

connectDB();
app.use("/api/tasks", taskRouters);

app.listen(5001, () => {
    console.log(`Server started on port ${PORT}`);
});
