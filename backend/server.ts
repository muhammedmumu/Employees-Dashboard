import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import userRouter from "./routes/userRoutes";
import adminRouter from "./routes/AdminRouter";
import taskRoutes from "./routes/taskRoutes";
import mongoose from "mongoose";
import {
  employeeRouter,
  adminRouter as authAdminRouter,
} from "./routes/authRoutes";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({ message: "API running" });
});

app.use("/api", userRouter);
app.use("/api", adminRouter);
app.use("/api/tasks", taskRoutes);

app.use("/api/auth/employee", employeeRouter);
app.use("/api/auth/admin", authAdminRouter);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGOURL || "");
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
