import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import tasksRouters from "../src/routes/tasksRouters.js";
import taskRepository from "../src/repositories/taskRepository.js";

// Mock the protect middleware
vi.mock("../src/middleware/authMiddleware.js", () => {
    return {
        protect: (req, res, next) => {
            req.user = { _id: "user123", username: "testuser", email: "test@example.com" };
            next();
        }
    };
});

// Mock the taskRepository
vi.mock("../src/repositories/taskRepository.js", () => {
    return {
        default: {
            countTasks: vi.fn(),
            findTask: vi.fn(),
            findTasks: vi.fn(),
            createTask: vi.fn(),
            updateTask: vi.fn(),
            deleteTask: vi.fn(),
        }
    };
});

// Setup express app
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/tasks", tasksRouters);

describe("Task Controller Tests", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("GET /api/tasks", () => {
        it("should return tasks, pagination, and status stats successfully", async () => {
            taskRepository.countTasks.mockImplementation(async (query) => {
                if (query.status === "TODO") return 2;
                if (query.status === "IN_PROGRESS") return 1;
                if (query.status === "UNDER_REVIEW") return 0;
                if (query.status === "COMPLETED") return 5;
                return 8; // total
            });

            taskRepository.findTasks.mockResolvedValue([
                { _id: "t1", title: "Task 1", status: "TODO", priority: "Medium" }
            ]);

            const res = await request(app).get("/api/tasks");

            expect(res.statusCode).toBe(200);
            expect(res.body.tasks).toHaveLength(1);
            expect(res.body.stats.todo).toBe(2);
            expect(res.body.stats.inProgress).toBe(1);
            expect(res.body.stats.completed).toBe(5);
            expect(res.body.pagination.totalPages).toBe(2); // total 8, limit 5 -> 2 pages
        });
    });

    describe("POST /api/tasks", () => {
        it("should create a new task successfully with defaults", async () => {
            taskRepository.createTask.mockResolvedValue({
                _id: "newTask",
                title: "Build features",
                status: "TODO",
                priority: "Medium"
            });

            const res = await request(app)
                .post("/api/tasks")
                .send({ title: "Build features" });

            expect(res.statusCode).toBe(201);
            expect(res.body.title).toBe("Build features");
            expect(res.body.status).toBe("TODO");
            expect(res.body.priority).toBe("Medium");
            expect(taskRepository.createTask).toHaveBeenCalledWith(expect.objectContaining({
                title: "Build features",
                priority: "Medium",
                status: "TODO"
            }));
        });

        it("should return 400 if title is empty", async () => {
            const res = await request(app)
                .post("/api/tasks")
                .send({ title: "   " });

            expect(res.statusCode).toBe(400);
            expect(res.body.field).toBe("title");
            expect(res.body.message).toContain("không được để trống");
        });

        it("should return 400 if title exceeds 100 characters", async () => {
            const longTitle = "a".repeat(101);
            const res = await request(app)
                .post("/api/tasks")
                .send({ title: longTitle });

            expect(res.statusCode).toBe(400);
            expect(res.body.field).toBe("title");
            expect(res.body.message).toContain("phải dưới 100 ký tự");
        });

        it("should return 400 if priority is invalid", async () => {
            const res = await request(app)
                .post("/api/tasks")
                .send({ title: "Task title", priority: "Urgent" });

            expect(res.statusCode).toBe(400);
            expect(res.body.field).toBe("priority");
            expect(res.body.message).toContain("Mức độ ưu tiên không hợp lệ");
        });
    });

    describe("PUT /api/tasks/:id", () => {
        it("should update task title or priority without status change", async () => {
            taskRepository.findTask.mockResolvedValue({
                _id: "t1",
                user: "user123",
                title: "Task 1",
                status: "TODO",
                priority: "Medium"
            });

            taskRepository.updateTask.mockResolvedValue({
                _id: "t1",
                title: "Task 1 Updated",
                status: "TODO",
                priority: "High"
            });

            const res = await request(app)
                .put("/api/tasks/t1")
                .send({ title: "Task 1 Updated", priority: "High" });

            expect(res.statusCode).toBe(200);
            expect(res.body.title).toBe("Task 1 Updated");
            expect(res.body.priority).toBe("High");
        });

        it("should allow valid state machine transitions (TODO -> IN_PROGRESS)", async () => {
            taskRepository.findTask.mockResolvedValueOnce({
                _id: "t1",
                user: "user123",
                title: "Task 1",
                status: "TODO"
            }).mockResolvedValueOnce(null); // No other IN_PROGRESS tasks

            taskRepository.updateTask.mockResolvedValue({
                _id: "t1",
                status: "IN_PROGRESS"
            });

            const res = await request(app)
                .put("/api/tasks/t1")
                .send({ status: "IN_PROGRESS" });

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("IN_PROGRESS");
        });

        it("should reject invalid state machine transitions (TODO -> COMPLETED)", async () => {
            taskRepository.findTask.mockResolvedValue({
                _id: "t1",
                user: "user123",
                title: "Task 1",
                status: "TODO"
            });

            const res = await request(app)
                .put("/api/tasks/t1")
                .send({ status: "COMPLETED" });

            expect(res.statusCode).toBe(400);
            expect(res.body.field).toBe("status");
            expect(res.body.message).toContain("Không thể chuyển đổi trạng thái");
        });

        it("should trigger Auto-Pause: pause other active tasks when transitioning to IN_PROGRESS", async () => {
            taskRepository.findTask
                // First call: find task to update
                .mockResolvedValueOnce({
                    _id: "t1",
                    user: "user123",
                    title: "Task 1",
                    status: "TODO"
                })
                // Second call: find another active task
                .mockResolvedValueOnce({
                    _id: "t2",
                    user: "user123",
                    title: "Task 2 (Active)",
                    status: "IN_PROGRESS"
                });

            taskRepository.updateTask.mockResolvedValue({
                _id: "t1",
                status: "IN_PROGRESS"
            });

            const res = await request(app)
                .put("/api/tasks/t1")
                .send({ status: "IN_PROGRESS" });

            expect(res.statusCode).toBe(200);
            // Verify that the other task (t2) was updated to TODO
            expect(taskRepository.updateTask).toHaveBeenCalledWith(
                { _id: "t2", user: "user123" },
                { status: "TODO" }
            );
            // Verify that the target task (t1) was updated to IN_PROGRESS
            expect(taskRepository.updateTask).toHaveBeenCalledWith(
                { _id: "t1", user: "user123" },
                expect.objectContaining({ status: "IN_PROGRESS" })
            );
        });
    });

    describe("DELETE /api/tasks/:id", () => {
        it("should delete task successfully", async () => {
            taskRepository.deleteTask.mockResolvedValue({ _id: "t1" });

            const res = await request(app).delete("/api/tasks/t1");

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toContain("Xoá thành công");
        });

        it("should return 404 if task to delete does not exist", async () => {
            taskRepository.deleteTask.mockResolvedValue(null);

            const res = await request(app).delete("/api/tasks/nonexistent");

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toContain("Không tìm thấy");
        });
    });
});
