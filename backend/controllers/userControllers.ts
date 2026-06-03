import type { Request, Response } from "express";
import Employee from "../model/Employee";

export const getAllEmployees = async (_req: Request, res: Response) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    return res.status(200).json(employees);
  } catch (err: any) {
    console.error("Failed to get employees", err);
    return res.status(500).json({ message: "Failed to get employees" });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const {
      employeeId,
      name,
      age,
      gender,
      mobile,
      experience,
      salary,
      joiningDate,
    } = req.body;

    if (!employeeId || !name) {
      return res
        .status(400)
        .json({ message: "employeeId and name are required" });
    }

    const parsedAge = typeof age === "string" ? Number(age) : age;
    if (
      parsedAge != null &&
      (Number.isNaN(parsedAge) || typeof parsedAge !== "number")
    ) {
      return res.status(400).json({ message: "Age must be a number" });
    }

    const employee = await Employee.create({
      employeeId,
      name,
      age: parsedAge,
      gender,
      mobile,
      experience,
      salary,
      joiningDate,
    });

    return res.status(201).json(employee);
  } catch (err: any) {
    console.error("Failed to create employee", err);
    return res
      .status(400)
      .json({ message: err.message || "Failed to create employee" });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    console.log(`PUT /users/${req.params.id} - updating employee`, req.body);
    const {
      employeeId,
      name,
      age,
      gender,
      mobile,
      experience,
      salary,
      joiningDate,
    } = req.body;

    const parsedAge = typeof age === "string" ? Number(age) : age;
    if (
      parsedAge != null &&
      (Number.isNaN(parsedAge) || typeof parsedAge !== "number")
    ) {
      return res.status(400).json({ message: "Age must be a number" });
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        employeeId,
        name,
        age: parsedAge,
        gender,
        mobile,
        experience,
        salary,
        joiningDate,
      },
      { new: true, runValidators: true },
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json(employee);
  } catch (err: any) {
    console.error("Failed to update employee", err);
    return res
      .status(400)
      .json({ message: err.message || "Failed to update employee" });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    console.log(`DELETE /users/${req.params.id} - deleting employee`);
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err: any) {
    console.error("Failed to delete employee", err);
    return res
      .status(400)
      .json({ message: err.message || "Failed to delete employee" });
  }
};
