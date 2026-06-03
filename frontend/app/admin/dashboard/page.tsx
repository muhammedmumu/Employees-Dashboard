"use client";

import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../../../src/components/Navbar";
import Sidebar from "../../../src/components/Sidebar";
import KpiCard from "../../../src/components/KpiCard";
import Button from "../../../src/components/Button";
import Input from "../../../src/components/Input";
import { employeesApi, tasksApi } from "../../../src/services/api";

type Employee = {
  _id?: string;
  employeeId?: string;
  name?: string;
  age?: number | string;
  gender?: string;
  mobile?: string;
  experience?: number | string;
  salary?: number | string;
  joiningDate?: string;
};

type Task = {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  employeeId?: string;
  employee?: { name?: string; employeeId?: string };
  priority?: string;
  status?: string;
  dueDate?: string;
};

const employeeFields = [
  ["Employee ID", "employeeId", "EMP001", "text"],
  ["Name", "name", "John", "text"],
  ["Age", "age", "25", "number"],
  ["Gender", "gender", "Male", "text"],
  ["Mobile", "mobile", "9876543210", "text"],
  ["Experience", "experience", "2", "number"],
  ["Salary", "salary", "35000", "number"],
  ["Joining Date", "joiningDate", "", "date"],
];

export default function AdminDashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadDashboard() {
    setError(null);
    setLoading(true);
    try {
      const [employeeData, taskData] = await Promise.all([employeesApi.list(), tasksApi.list()]);
      setEmployees(Array.isArray(employeeData) ? employeeData : []);
      setTasks(Array.isArray(taskData) ? taskData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("ems_token");
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }
    void Promise.resolve().then(loadDashboard);
  }, []);

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === "Completed").length;
    const pending = tasks.filter((task) => task.status === "Pending").length;
    return {
      totalEmployees: employees.length,
      activeEmployees: employees.length,
      totalTasks: tasks.length,
      pending,
      completed,
    };
  }, [employees, tasks]);

  async function submitEmployee(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      await employeesApi.create(payload);
      setMessage("Employee created successfully.");
      form.reset();
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function submitTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      await tasksApi.create(payload);
      setMessage("Task assigned successfully.");
      form.reset();
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar role="admin" />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar role="admin" />
        <section className="flex-1 space-y-6 p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-400">Admin Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Employee Management System</h1>
          </div>

          {error && <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}
          {message && <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{message}</p>}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <KpiCard value={stats.totalEmployees} label="Total Employees" />
            <KpiCard value={stats.activeEmployees} label="Active Employees" />
            <KpiCard value={stats.totalTasks} label="Total Tasks" />
            <KpiCard value={stats.pending} label="Pending Tasks" />
            <KpiCard value={stats.completed} label="Completed Tasks" />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <form onSubmit={submitEmployee} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Create Employee</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {employeeFields.map(([label, name, placeholder, type]) => (
                  <Input key={name} label={label} name={name} placeholder={placeholder} type={type} required />
                ))}
              </div>
              <div className="mt-5 flex justify-end">
                <Button type="submit">Add Employee</Button>
              </div>
            </form>

            <form onSubmit={submitTask} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Assign Task</h2>
              <div className="mt-5 grid gap-4">
                <Input label="Title" name="title" placeholder="Create Employee Dashboard" required />
                <Input label="Description" name="description" placeholder="Build dashboard UI" required />
                <Input label="Employee ID" name="employeeId" placeholder="EMP001" required />
                <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span>Priority</span>
                  <select name="priority" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 shadow-sm outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </label>
                <Input label="Due Date" name="dueDate" type="date" required />
              </div>
              <div className="mt-5 flex justify-end">
                <Button type="submit">Assign Task</Button>
              </div>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Task Progress</h2>
              <a href="/employees" className="text-sm font-semibold text-sky-600 hover:text-sky-500">View Employees</a>
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.2em] text-slate-500 dark:border-slate-800">
                  <tr>
                    <th className="py-3 pr-4">Task Name</th>
                    <th className="py-3 pr-4">Assigned Employee</th>
                    <th className="py-3 pr-4">Priority</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {loading ? (
                    <tr><td className="py-5 text-slate-500" colSpan={5}>Loading dashboard...</td></tr>
                  ) : tasks.length === 0 ? (
                    <tr><td className="py-5 text-slate-500" colSpan={5}>No tasks assigned yet.</td></tr>
                  ) : (
                    tasks.map((task) => (
                      <tr key={task._id ?? task.id ?? task.title} className="text-slate-700 dark:text-slate-200">
                        <td className="py-4 pr-4 font-medium text-slate-950 dark:text-white">{task.title ?? "-"}</td>
                        <td className="py-4 pr-4">{task.employee?.name ?? task.employeeId ?? "-"}</td>
                        <td className="py-4 pr-4">{task.priority ?? "-"}</td>
                        <td className="py-4 pr-4">{task.status ?? "Pending"}</td>
                        <td className="py-4 pr-4">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
