import express from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getMyTasks,
  getTaskById,
  updateTask,
} from "../controllers/taskController";
import authenticate from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticate, createTask);
router.get("/", authenticate, getAllTasks);
router.get("/my-tasks", authenticate, getMyTasks);
router.get("/:id", authenticate, getTaskById);
router.put("/:id", authenticate, updateTask);
router.delete("/:id", authenticate, deleteTask);

export default router;
