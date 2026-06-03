"use client";

import RegisterForm from "../../../src/components/RegisterForm";

const employeeFields = [
  {
    label: "Employee ID",
    name: "employeeId",
    type: "text",
    placeholder: "EMP001",
  },
  {
    label: "Full Name",
    name: "name",
    type: "text",
    placeholder: "John Doe",
  },
  {
    label: "Email Address",
    name: "email",
    type: "email",
    placeholder: "employee@company.com",
  },
  {
    label: "Age",
    name: "age",
    type: "number",
    placeholder: "25",
  },
  {
    label: "Gender",
    name: "gender",
    type: "text",
    placeholder: "Male",
  },
  {
    label: "Mobile",
    name: "mobile",
    type: "text",
    placeholder: "9876543210",
  },
  {
    label: "Experience",
    name: "experience",
    type: "number",
    placeholder: "2",
  },
  {
    label: "Salary",
    name: "salary",
    type: "number",
    placeholder: "35000",
  },
  {
    label: "Joining Date",
    name: "joiningDate",
    type: "date",
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    placeholder: "Create a password",
  },
  {
    label: "Confirm Password",
    name: "confirmPassword",
    type: "password",
    placeholder: "Confirm password",
  },
];

export default function EmployeeRegisterPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <RegisterForm
          title="Employee Account Registration"
          subtitle="Create your employee account and submit your employee details."
          fields={employeeFields}
          actionLabel="Register Account"
          role="employee"
        />
      </div>
    </main>
  );
}
