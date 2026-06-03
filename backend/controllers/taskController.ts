import type { Response } from "express";
import Task from "../model/Task";
import Employee from "../model/Employee";
import EmployeeAuth from "../model/EmployeeAuth";
import type { AuthRequest } from "../middleware/authMiddleware";

const allowedTaskFields = [
  "title",
  "description",
  "employeeId",
  "priority",
  "status",
  "dueDate",
];

const allowedEmployeeUpdateFields = ["status"];
const allowedStatuses = ["Pending", "In Progress", "Completed"];

function pickFields(body: Record<string, unknown>, fields: string[]) {
  return fields.reduce<Record<string, unknown>>((updates, field) => {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }

    return updates;
  }, {});
}

function isAdmin(req: AuthRequest) {
  return req.user?.role === "admin";
}

async function getLoggedInEmployeeId(req: AuthRequest) {
  if (req.user?.employeeId) {
    return req.user.employeeId;
  }

  const employeeUser = await EmployeeAuth.findById(req.user?.id);
  if (employeeUser?.employeeId) {
    return employeeUser.employeeId;
  }

  if (!employeeUser?.name) {
    return undefined;
  }

  const employee = await Employee.findOne({ name: employeeUser.name });
  if (!employee?.employeeId) {
    return undefined;
  }

  employeeUser.employeeId = employee.employeeId;
  await employeeUser.save();

  return employee.employeeId;
}

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Only admin can create tasks" });
    }

    const { title, description, employeeId, priority, dueDate } = req.body;

    if (!title || !description || !employeeId || !dueDate) {
      return res.status(400).json({
        message: "title, description, employeeId and dueDate are required",
      });
    }

    const task = await Task.create({
      title,
      description,
      employeeId,
      priority,
      dueDate,
    });

    return res.status(201).json(task);
  } catch (err: any) {
    console.error("Failed to create task", err);
    return res
      .status(400)
      .json({ message: err.message || "Failed to create task" });
  }
};

export const getAllTasks = async (req: AuthRequest, res: Response) => {
  try {
    if (isAdmin(req)) {
      const tasks = await Task.find().sort({ createdAt: -1 });
      return res.status(200).json(tasks);
    }

    if (req.user?.role !== "employee") {
      return res.status(403).json({ message: "Access denied" });
    }

    const employeeId = await getLoggedInEmployeeId(req);
    if (!employeeId) {
      return res.status(400).json({
        message: "employeeId not found for logged-in employee",
      });
    }

    const tasks = await Task.find({ employeeId }).sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (err: any) {
    console.error("Failed to get tasks", err);
    return res.status(500).json({ message: "Failed to get tasks" });
  }
};

export const getMyTasks = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "employee") {
      return res
        .status(403)
        .json({ message: "Only employees can view assigned tasks" });
    }

    const employeeId = await getLoggedInEmployeeId(req);
    if (!employeeId) {
      return res.status(400).json({
        message: "employeeId not found for logged-in employee",
      });
    }

    const tasks = await Task.find({ employeeId }).sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (err: any) {
    console.error("Failed to get employee tasks", err);
    return res.status(500).json({ message: "Failed to get employee tasks" });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (!isAdmin(req)) {
      const employeeId = await getLoggedInEmployeeId(req);
      if (!employeeId || task.employeeId !== employeeId) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    return res.status(200).json(task);
  } catch (err: any) {
    console.error("Failed to get task", err);
    return res
      .status(400)
      .json({ message: err.message || "Failed to get task" });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const allowedFields = isAdmin(req)
      ? allowedTaskFields
      : allowedEmployeeUpdateFields;
    const updates = pickFields(req.body, allowedFields);

    if (!isAdmin(req)) {
      const employeeId = await getLoggedInEmployeeId(req);
      if (!employeeId || task.employeeId !== employeeId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const requestedFields = Object.keys(req.body);
      const hasOnlyStatus = requestedFields.every((field) =>
        allowedEmployeeUpdateFields.includes(field),
      );

      if (!hasOnlyStatus) {
        return res
          .status(403)
          .json({ message: "Employees can only update task status" });
      }
    }

    if (
      updates.status &&
      !allowedStatuses.includes(String(updates.status))
    ) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json(updatedTask);
  } catch (err: any) {
    console.error("Failed to update task", err);
    return res
      .status(400)
      .json({ message: err.message || "Failed to update task" });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Only admin can delete tasks" });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (err: any) {
    console.error("Failed to delete task", err);
    return res
      .status(400)
      .json({ message: err.message || "Failed to delete task" });
  }
};
