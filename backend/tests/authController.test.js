import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import authRouters from "../src/routes/authRouters.js";
import authRepository from "../src/repositories/authRepository.js";
import jwt from "jsonwebtoken";

// Mock the protect middleware
vi.mock("../src/middleware/authMiddleware.js", () => {
    return {
        protect: (req, res, next) => {
            req.user = { _id: "user123", username: "testuser", email: "test@example.com" };
            next();
        }
    };
});

// Mock the authRepository
vi.mock("../src/repositories/authRepository.js", () => {
    return {
        default: {
            findUserByEmail: vi.fn(),
            findUserByUsername: vi.fn(),
            findUserByIdentifier: vi.fn(),
            findUserByResetToken: vi.fn(),
            createUser: vi.fn(),
            saveUser: vi.fn(),
        }
    };
});

// Setup express app for test
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouters);

describe("Auth Controller Tests", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.JWT_SECRET = "testsecretkey123456789";
    });

    describe("POST /api/auth/register", () => {
        it("should register a new user successfully", async () => {
            authRepository.findUserByEmail.mockResolvedValue(null);
            authRepository.findUserByUsername.mockResolvedValue(null);
            authRepository.createUser.mockResolvedValue({
                _id: "user123",
                username: "testuser",
                email: "test@example.com"
            });

            const res = await request(app)
                .post("/api/auth/register")
                .send({
                    username: "testuser",
                    email: "test@example.com",
                    password: "password123"
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.user.username).toBe("testuser");
            expect(res.headers["set-cookie"]).toBeDefined();
        });

        it("should return 400 if email is already registered", async () => {
            authRepository.findUserByEmail.mockResolvedValue({ _id: "existing_user" });

            const res = await request(app)
                .post("/api/auth/register")
                .send({
                    username: "testuser",
                    email: "test@example.com",
                    password: "password123"
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain("Email is already registered");
        });

        it("should return 400 if validation fails (empty username)", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({
                    email: "test@example.com",
                    password: "password123"
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.field).toBe("username");
        });
    });

    describe("POST /api/auth/login", () => {
        it("should login successfully with valid credentials", async () => {
            const mockUser = {
                _id: "user123",
                username: "testuser",
                email: "test@example.com",
                matchPassword: vi.fn().mockResolvedValue(true)
            };
            authRepository.findUserByIdentifier.mockResolvedValue(mockUser);

            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    identifier: "test@example.com",
                    password: "password123"
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.user.username).toBe("testuser");
        });

        it("should fail login with invalid identifier", async () => {
            authRepository.findUserByIdentifier.mockResolvedValue(null);

            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    identifier: "nonexistent",
                    password: "password123"
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it("should fail login with incorrect password", async () => {
            const mockUser = {
                _id: "user123",
                username: "testuser",
                email: "test@example.com",
                matchPassword: vi.fn().mockResolvedValue(false)
            };
            authRepository.findUserByIdentifier.mockResolvedValue(mockUser);

            const res = await request(app)
                .post("/api/auth/login")
                .send({
                    identifier: "testuser",
                    password: "wrongpassword"
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe("POST /api/auth/logout", () => {
        it("should clear cookie and logout successfully", async () => {
            const res = await request(app).post("/api/auth/logout");
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.headers["set-cookie"]).toBeDefined();
        });
    });

    describe("POST /api/auth/forgot-password", () => {
        it("should generate reset token for valid email", async () => {
            const mockUser = {
                _id: "user123",
                email: "test@example.com",
                username: "testuser",
                save: vi.fn()
            };
            authRepository.findUserByEmail.mockResolvedValue(mockUser);

            const res = await request(app)
                .post("/api/auth/forgot-password")
                .send({ email: "test@example.com" });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
        });

        it("should return 404 for unregistered email", async () => {
            authRepository.findUserByEmail.mockResolvedValue(null);

            const res = await request(app)
                .post("/api/auth/forgot-password")
                .send({ email: "notfound@example.com" });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe("POST /api/auth/reset-password/:resettoken", () => {
        it("should reset password successfully with valid token", async () => {
            const mockUser = {
                _id: "user123",
                email: "test@example.com",
                username: "testuser",
                password: "oldpassword",
                save: vi.fn()
            };
            authRepository.findUserByResetToken.mockResolvedValue(mockUser);

            const res = await request(app)
                .post("/api/auth/reset-password/sometoken")
                .send({ password: "newpassword123" });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(mockUser.password).toBe("newpassword123");
        });

        it("should return 400 for invalid/expired token", async () => {
            authRepository.findUserByResetToken.mockResolvedValue(null);

            const res = await request(app)
                .post("/api/auth/reset-password/expiredtoken")
                .send({ password: "newpassword123" });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });
});
