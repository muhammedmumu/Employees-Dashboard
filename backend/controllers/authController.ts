import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../model/Admin";
import EmployeeAuth from "../model/EmployeeAuth";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

function normalizeEmail(email: unknown) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function createToken(id: string, role: string, employeeId?: string) {
  return jwt.sign({ id, role, employeeId }, JWT_SECRET, { expiresIn: "7d" });
}

function userResponse(user: any, role: string) {
  return {
    token: createToken(String(user._id), role, user.employeeId),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      employeeId: user.employeeId,
      role,
    },
  };
}

export const registerEmployee = async (req: Request, res: Response) => {
  try {
    const { name, email, password, employeeId } = req.body;
    const normalizedEmail = normalizeEmail(email);
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password required" });
    }

    const existing = await EmployeeAuth.findOne({ email: normalizedEmail });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const emp = await EmployeeAuth.create({
      name,
      email: normalizedEmail,
      employeeId,
      password: hashed,
    });

    return res.status(201).json(userResponse(emp, "employee"));
  } catch (err: any) {
    console.error("registerEmployee error", err);
    if (err?.code === 11000) {
      return res.status(400).json({ message: "Email already registered" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

export const loginEmployee = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await EmployeeAuth.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    const matched = await bcrypt.compare(password, user.password);
    if (!matched)
      return res.status(401).json({ message: "Invalid credentials" });

    return res.status(200).json(userResponse(user, "employee"));
  } catch (err: any) {
    console.error("loginEmployee error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password required" });
    }

    const existing = await Admin.findOne({ email: normalizedEmail });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      name,
      email: normalizedEmail,
      password: hashed,
    });
    return res.status(201).json(userResponse(admin, "admin"));
  } catch (err: any) {
    console.error("registerAdmin error", err);
    if (err?.code === 11000) {
      return res.status(400).json({ message: "Email already registered" });
    }
    if (
      typeof err?.message === "string" &&
      err.message.includes("user is not allowed to do action [insert]")
    ) {
      return res.status(500).json({
        message:
          "MongoDB user does not have insert permission for the admins collection",
      });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await Admin.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    const matched = await bcrypt.compare(password, user.password);
    if (!matched)
      return res.status(401).json({ message: "Invalid credentials" });

    return res.status(200).json(userResponse(user, "admin"));
  } catch (err: any) {
    console.error("loginAdmin error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export default {
  registerEmployee,
  loginEmployee,
  registerAdmin,
  loginAdmin,
};
