import express from "express";
import {
  registerEmployee,
  loginEmployee,
  registerAdmin,
  loginAdmin,
} from "../controllers/authController";

const employeeRouter = express.Router();
employeeRouter.post("/register", registerEmployee);
employeeRouter.post("/login", loginEmployee);

const adminRouter = express.Router();
adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);

export { employeeRouter, adminRouter };
