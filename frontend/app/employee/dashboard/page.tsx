"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../../src/components/Navbar";
import Sidebar from "../../../src/components/Sidebar";
import Button from "../../../src/components/Button";
import Input from "../../../src/components/Input";
import { employeesApi, tasksApi } from "../../../src/services/api";

type Task = {
  _id?: string;
  id?: string;
  title?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  description?: string;
};

type Profile = {
  _id?: string;
  id?: string;
  employeeId?: string;
  name?: string;
  age?: number | string;
  gender?: string;
  mobile?: string;
  experience?: number | string;
  salary?: number | string;
  joiningDate?: string;
};

export default function EmployeeDashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profile, setProfile] = useState<Profile>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadTasks() {
    setLoading(true);
    setError(null);
    try {
      const data = await tasksApi.myTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function loadProfile() {
    const storedEmployee = localStorage.getItem("ems_employee");
    const storedUser = localStorage.getItem("ems_user");
    const localProfile = storedEmployee ?? storedUser;
    let parsedProfile: Profile = {};

    if (localProfile) {
      try {
        parsedProfile = JSON.parse(localProfile) as Profile;
      } catch {
        parsedProfile = {};
      }
    }

    const employeeRecordId = parsedProfile._id ?? parsedProfile.id;
    try {
      if (employeeRecordId) {
        const employee = await employeesApi.get(employeeRecordId);
        setProfile(employee);
        localStorage.setItem("ems_employee", JSON.stringify(employee));
        return;
      }

      if (parsedProfile.employeeId) {
        const employees = await employeesApi.list();
        const match = Array.isArray(employees)
          ? (employees as Profile[]).find((employee) => employee.employeeId === parsedProfile.employeeId)
          : undefined;
        if (match) {
          setProfile(match);
          localStorage.setItem("ems_employee", JSON.stringify(match));
        }
      }
    } catch {
      setProfile(parsedProfile);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("ems_token");
    if (!token) {
      window.location.href = "/employee/login";
      return;
    }

    void Promise.resolve().then(() => {
      loadProfile();
      loadTasks();
    });
  }, []);

  async function updateTask(task: Task, status: string) {
    const taskId = task._id ?? task.id;
    if (!taskId) {
      setError("Task id is missing from API response.");
      return;
    }

    setMessage(null);
    setError(null);
    try {
      await tasksApi.update(taskId, { status });
      setMessage("Task status updated.");
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function updateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    const employeeRecordId = profile._id ?? profile.id;
    try {
      const employee = employeeRecordId
        ? await employeesApi.update(employeeRecordId, payload)
        : await employeesApi.create(payload);
      setProfile(employee);
      localStorage.setItem("ems_employee", JSON.stringify(employee));
      setMessage("Profile updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar role="employee" />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar role="employee" />
        <section className="flex-1 space-y-6 p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-400">Employee Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">My Workspace</h1>
          </div>

          {error && <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}
          {message && <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{message}</p>}

          <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Profile</h2>
              <dl className="mt-5 grid gap-4 text-sm">
                {[
                  ["Employee ID", profile.employeeId],
                  ["Name", profile.name],
                  ["Age", profile.age],
                  ["Gender", profile.gender],
                  ["Mobile", profile.mobile],
                  ["Experience", profile.experience ? `${profile.experience} yrs` : undefined],
                  ["Salary", profile.salary],
                  ["Joining Date", profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : undefined],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 dark:border-slate-800">
                    <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
                    <dd className="font-medium text-slate-950 dark:text-white">{value ?? "-"}</dd>
                  </div>
                ))}
              </dl>

              <form onSubmit={updateProfile} className="mt-6 space-y-4 border-t border-slate-200 pt-6 dark:border-slate-800">
                <h3 className="text-base font-semibold text-slate-950 dark:text-white">Edit Employee Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Employee ID" name="employeeId" placeholder="EMP001" defaultValue={profile.employeeId ?? ""} />
                  <Input label="Name" name="name" placeholder="John" defaultValue={profile.name ?? ""} />
                  <Input label="Age" name="age" type="number" placeholder="25" defaultValue={profile.age ?? ""} />
                  <Input label="Gender" name="gender" placeholder="Male" defaultValue={profile.gender ?? ""} />
                  <Input label="Mobile" name="mobile" placeholder="9999999999" defaultValue={profile.mobile ?? ""} />
                  <Input label="Experience" name="experience" type="number" placeholder="2" defaultValue={profile.experience ?? ""} />
                  <Input label="Salary" name="salary" type="number" placeholder="35000" defaultValue={profile.salary ?? ""} />
                  <Input
                    label="Joining Date"
                    name="joiningDate"
                    type="date"
                    defaultValue={profile.joiningDate ? String(profile.joiningDate).slice(0, 10) : ""}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Save Details</Button>
                </div>
              </form>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Assigned Tasks</h2>
              <div className="mt-5 space-y-4">
                {loading ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">Loading tasks...</p>
                ) : tasks.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No assigned tasks yet.</p>
                ) : (
                  tasks.map((task) => (
                    <article key={task._id ?? task.id ?? task.title} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-950 dark:text-white">{task.title ?? "-"}</h3>
                          {task.description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{task.description}</p>}
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs font-semibold">
                          <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">{task.priority ?? "Priority"}</span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{task.status ?? "Pending"}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        {["Pending", "In Progress", "Completed"].map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => updateTask(task, status)}
                            className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
