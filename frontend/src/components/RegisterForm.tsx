"use client";

import React from "react";
import { useState } from "react";
import axios from "axios";
import Input from "./Input";
import Button from "./Button";
import { auth, employeesApi } from "../services/api";

export default function RegisterForm({
  title,
  subtitle,
  fields,
  actionLabel,
  role = "employee",
}: {
  title: string;
  subtitle?: string;
  fields: Array<{ label: string; name: string; type: string; placeholder?: string }>;
  actionLabel: string;
  role?: "employee" | "admin";
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validateForm(values: Record<string, string>) {
    for (const field of fields) {
      if (!values[field.name]?.trim()) return `${field.label} is required`;
    }

    if (values.password !== values.confirmPassword) return "Passwords do not match";

    if (values.mobile && !/^\d{10}$/.test(values.mobile)) {
      return "Mobile number must be 10 digits";
    }

    const age = Number(values.age);
    if (values.age && (!Number.isFinite(age) || age < 18 || age > 70)) {
      return "Age must be between 18 and 70";
    }

    const salary = Number(values.salary);
    if (values.salary && (!Number.isFinite(salary) || salary <= 0)) {
      return "Salary must be greater than 0";
    }

    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.target as HTMLFormElement);
    const obj: Record<string, string> = {};
    fd.forEach((v, k) => (obj[k] = String(v)));
    const validationError = validateForm(obj);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }
    delete obj.confirmPassword;
    try {
      const res =
        role === "admin"
          ? await auth.adminRegister(obj)
          : await auth.employeeRegister(obj);

      if (role === "admin") {
        const body = res && typeof res === "object" ? (res as Record<string, unknown>) : {};
        const token = typeof body.token === "string" ? body.token : undefined;
        if (token) {
          localStorage.setItem("ems_token", token);
          localStorage.setItem("ems_role", "admin");
          if (body.user) localStorage.setItem("ems_user", JSON.stringify(body.user));
          window.location.href = "/admin/login";
          return;
        }
        window.location.href = "/admin/login";
      } else {
        const employeePayload = {
          employeeId: obj.employeeId,
          name: obj.name,
          age: obj.age,
          gender: obj.gender,
          mobile: obj.mobile,
          experience: obj.experience,
          salary: obj.salary,
          joiningDate: obj.joiningDate,
        };
        const employee = await employeesApi.create(employeePayload);
        localStorage.setItem("ems_employee", JSON.stringify(employee));
        window.location.href = "/employee/login";
      }
      (e.target as HTMLFormElement).reset();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError((err.response?.data as { message?: string } | undefined)?.message || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950">
      <div className="space-y-6 p-6 sm:p-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h2>
          {subtitle && <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{subtitle}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <Input key={f.name} label={f.label} name={f.name} type={f.type} placeholder={f.placeholder} required />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">{loading ? "Submitting..." : "All fields are ready for API wiring."}</p>
            <div className="flex items-center gap-3">
              {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
              <Button type="submit" disabled={loading}>{loading ? "Please wait" : actionLabel}</Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
