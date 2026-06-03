import mongoose, { Schema, type InferSchemaType } from "mongoose";

const employeeSchema = new Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export type EmployeeDocument = InferSchemaType<typeof employeeSchema>;

export default mongoose.models.Employee ||
  mongoose.model("Employee", employeeSchema);
