"use client";

import React, { useState } from "react";
import axios from "axios";
import Input from "./Input";
import Button from "./Button";
import { auth } from "../services/api";

type LoginRole = "employee" | "admin";

export default function LoginForm({ role = "employee" }: { role?: LoginRole }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.target as HTMLFormElement);
    const payload: Record<string, string> = {};
    fd.forEach((v, k) => (payload[k] = String(v)));
    try {
      const res =
        role === "admin"
          ? await auth.adminLogin(payload)
          : await auth.employeeLogin(payload);

      const body = res && typeof res === "object" ? (res as Record<string, unknown>) : {};
      const token = typeof body.token === "string" ? body.token : undefined;
      const user = body.user && typeof body.user === "object" ? (body.user as Record<string, unknown>) : undefined;
      const resolvedRole = typeof user?.role === "string" ? user.role : role;

      if (!token) throw new Error("No token returned from API");

      localStorage.setItem("ems_token", token);
      localStorage.setItem("ems_role", resolvedRole);
      if (user) localStorage.setItem("ems_user", JSON.stringify(user));

      window.location.href = resolvedRole === "admin" ? "/admin/dashboard" : "/employee/dashboard";
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          (err.response?.data as { message?: string } | undefined)?.message ||
          (err.response?.status === 404
            ? "Account not found for this login role"
            : err.message);
        setError(message);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <Input name="email" label="Email" type="email" placeholder="you@company.com" />
      <Input name="password" label="Password" type="password" placeholder="••••••••" />
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
      </div>
    </form>
  );
}
