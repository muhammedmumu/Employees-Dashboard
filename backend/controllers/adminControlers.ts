import type { Request, Response } from "express";
import Admin from "../model/Admin";

export const getAllAdmins = async (_req: Request, res: Response) => {
  try {
    console.log("GET /admin - fetching all admins");
    const admins = await Admin.find().sort({ createdAt: -1 });
    res.status(200).json(admins);
  } catch (err: any) {
    console.error("Failed to get admins", err);
    return res.status(500).json({ message: "Failed to get admins" });
  }
};

export const getAdminById = async (req: Request, res: Response) => {
  try {
    console.log(`GET /admin/${req.params.id} - fetching one admin`);
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    return res.status(200).json(admin);
  } catch (err: any) {
    console.error("Failed to get admin", err);
    return res.status(400).json({ message: "Failed to get admin" });
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  try {
    console.log("POST /admin - creating admin", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({ email, password });
    return res.status(201).json(admin);
  } catch (err: any) {
    console.error("Failed to create admin", err);
    return res.status(400).json({ message: "Failed to create admin" });
  }
};

export const updateAdmin = async (req: Request, res: Response) => {
  try {
    console.log(`PUT /admin/${req.params.id} - updating admin`, req.body);
    const { email, password } = req.body;
    const updated = await Admin.findByIdAndUpdate(
      req.params.id,
      { email, password },
      { new: true, runValidators: true },
    );
    if (!updated) return res.status(404).json({ message: "Admin not found" });
    return res.status(200).json(updated);
  } catch (err: any) {
    console.error("Failed to update admin", err);
    return res.status(400).json({ message: "Failed to update admin" });
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    console.log(`DELETE /admin/${req.params.id} - deleting admin`);
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    return res.status(200).json({ message: "Admin deleted" });
  } catch (err: any) {
    console.error("Failed to delete admin", err);
    return res.status(400).json({ message: "Failed to delete admin" });
  }
};

export default {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};
