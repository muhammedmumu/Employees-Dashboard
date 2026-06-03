import mongoose, { Schema, type InferSchemaType } from "mongoose";

const employeeAuthSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export type EmployeeAuthDocument = InferSchemaType<typeof employeeAuthSchema>;

export default mongoose.models.EmployeeAuth ||
  mongoose.model("EmployeeAuth", employeeAuthSchema);
