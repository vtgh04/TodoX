import express from "express";
import { getAllTask } from "../controllers/taskController.js";
import { createTask } from "../controllers/taskController.js";
import { updateTask } from "../controllers/taskController.js";
import { deleteTask } from "../controllers/taskController.js";
const router = express.Router();


router.get("/", getAllTask);


router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);


export default router