import express from "express";
import cookieParser from "cookie-parser";
import taskRouters from "./routes/tasksRouters.js";
import authRouters from "./routes/authRouters.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

dotenv.config();


const PORT = process.env.PORT || 5001
const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

// Enable CORS for frontend dev origins
app.use(cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173"], credentials: true }));

// API Routes
app.use("/api/auth", authRouters);
app.use("/api/tasks", taskRouters);




if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"))
    });
}
// Connect to DB asynchronously
connectDB();

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
