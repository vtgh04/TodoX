import express from "express";
import taskRouters from "./routes/tasksRouters.js"
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();


const PORT = process.env.PORT || 5001
const app = express();




app.use(express.json());
app.use("/api/tasks", taskRouters);

// Connect to DB asynchronously
connectDB();

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
