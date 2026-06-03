"use client";

import RegisterForm from "../../../src/components/RegisterForm";

const adminFields = [
  { label: "Admin name", name: "name", type: "text", placeholder: "Muhammad Karim" },
  { label: "Admin email", name: "email", type: "email", placeholder: "admin@company.com" },
  { label: "Password", name: "password", type: "password", placeholder: "Create a strong password" },
  { label: "Confirm password", name: "confirmPassword", type: "password", placeholder: "Repeat password" },
];

export default function AdminRegisterPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <RegisterForm
          title="Admin Register"
          subtitle="Create an administrator account for system management and operations control."
          fields={adminFields}
          actionLabel="Create Admin"
          role="admin"
        />
      </div>
    </main>
  );
}
