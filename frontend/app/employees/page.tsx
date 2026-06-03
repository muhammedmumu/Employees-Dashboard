"use client";

import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../src/components/Sidebar";
import Navbar from "../../src/components/Navbar";
import KpiCard from "../../src/components/KpiCard";
import { employeesApi } from "../../src/services/api";

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

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const pageSize = 5;

  async function loadEmployees() {
    setError(null);
    setLoading(true);
    try {
      const data = await employeesApi.list();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
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

    void Promise.resolve().then(loadEmployees);
  }, []);

  const filteredEmployees = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return employees;
    return employees.filter((employee) =>
      [employee.employeeId, employee.name, employee.gender, employee.mobile]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [employees, query]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const visibleEmployees = filteredEmployees.slice((page - 1) * pageSize, page * pageSize);

  function updateSearch(value: string) {
    setQuery(value);
    setPage(1);
  }

  async function submitEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingEmployee?._id) {
      setError("Employee id is missing.");
      return;
    }

    setError(null);
    setMessage(null);
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      await employeesApi.update(editingEmployee._id, payload);
      setMessage("Employee updated successfully.");
      setEditingEmployee(null);
      await loadEmployees();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function confirmDelete() {
    if (!deleteEmployee?._id) {
      setError("Employee id is missing.");
      return;
    }

    setError(null);
    setMessage(null);
    try {
      await employeesApi.remove(deleteEmployee._id);
      setMessage("Employee deleted successfully.");
      setDeleteEmployee(null);
      await loadEmployees();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  const totalEmployees = employees.length;
  const maleEmployees = employees.filter((employee) => String(employee.gender).toLowerCase() === "male").length;
  const femaleEmployees = employees.filter((employee) => String(employee.gender).toLowerCase() === "female").length;
  const totalSalary = employees.reduce((sum, employee) => sum + (Number(employee.salary) || 0), 0);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar role="admin" />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar />

        <section className="flex-1 p-6">
          <div className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.1)] dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-400">Employee Management</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Employee Table</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                  View all employee records, track staffing totals, and review key information from a single admin screen.
                </p>
              </div>
            </div>

            {loading ? (
              <p className="mt-8 text-sm text-slate-600 dark:text-slate-300">Loading employees...</p>
            ) : error ? (
              <p className="mt-8 text-sm font-medium text-rose-600">{error}</p>
            ) : (
              <>
                {message && <p className="mt-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{message}</p>}
                <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <KpiCard value={totalEmployees} label="Total Employees" delta="All records" />
                  <KpiCard value={maleEmployees} label="Male Employees" delta="Gender split" />
                  <KpiCard value={femaleEmployees} label="Female Employees" delta="Gender split" />
                  <KpiCard value={`$${totalSalary}`} label="Total Salary" delta="Payroll summary" />
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    <span className="sr-only">Search employees</span>
                    <input
                      value={query}
                      onChange={(event) => updateSearch(event.target.value)}
                      placeholder="Search by ID, name, gender, or mobile"
                      className="w-full min-w-72 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Showing {visibleEmployees.length} of {filteredEmployees.length} employees
                  </p>
                </div>

                <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-slate-200 dark:border-slate-800">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
                      <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                        <tr>
                          <th className="px-4 py-3">Employee ID</th>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Age</th>
                          <th className="px-4 py-3">Gender</th>
                          <th className="px-4 py-3">Mobile</th>
                          <th className="px-4 py-3">Experience</th>
                          <th className="px-4 py-3">Salary</th>
                          <th className="px-4 py-3">Joining Date</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950">
                        {visibleEmployees.map((employee) => (
                          <tr key={employee._id ?? employee.employeeId ?? `${employee.name}-${employee.mobile}`} className="text-slate-700 dark:text-slate-200">
                            <td className="px-4 py-4 font-medium text-slate-950 dark:text-white">{employee.employeeId ?? "-"}</td>
                            <td className="px-4 py-4">{employee.name ?? "-"}</td>
                            <td className="px-4 py-4">{employee.age ?? "-"}</td>
                            <td className="px-4 py-4">{employee.gender ?? "-"}</td>
                            <td className="px-4 py-4">{employee.mobile ?? "-"}</td>
                            <td className="px-4 py-4">{employee.experience ?? "-"} yrs</td>
                            <td className="px-4 py-4">${Number(employee.salary) || 0}</td>
                            <td className="px-4 py-4">
                              {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : "-"}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex gap-2">
                                <button onClick={() => setEditingEmployee(employee)} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200">
                                  Edit
                                </button>
                                <button onClick={() => setDeleteEmployee(employee)} className="rounded-full bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500">
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {visibleEmployees.length === 0 && (
                          <tr>
                            <td className="px-4 py-6 text-sm text-slate-500 dark:text-slate-400" colSpan={9}>
                              {query ? "No employees match your search." : "No employee records found."}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page === 1}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-200"
                  >
                    Previous
                  </button>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Page {page} of {totalPages}</p>
                  <button
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    disabled={page === totalPages}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-200"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <form onSubmit={submitEdit} className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-950">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Edit Employee</h2>
              <button type="button" onClick={() => setEditingEmployee(null)} className="rounded-full border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-800">Close</button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                ["Employee ID", "employeeId", "text"],
                ["Name", "name", "text"],
                ["Age", "age", "number"],
                ["Gender", "gender", "text"],
                ["Mobile", "mobile", "text"],
                ["Experience", "experience", "number"],
                ["Salary", "salary", "number"],
                ["Joining Date", "joiningDate", "date"],
              ].map(([label, name, type]) => (
                <label key={name} className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span>{label}</span>
                  <input
                    name={name}
                    type={type}
                    required
                    defaultValue={
                      name === "joiningDate" && editingEmployee.joiningDate
                        ? String(editingEmployee.joiningDate).slice(0, 10)
                        : String(editingEmployee[name as keyof Employee] ?? "")
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setEditingEmployee(null)} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-200">Cancel</button>
              <button type="submit" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {deleteEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-950">
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Delete Employee</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Delete {deleteEmployee.name ?? deleteEmployee.employeeId ?? "this employee"}? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setDeleteEmployee(null)} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-200">Cancel</button>
              <button onClick={confirmDelete} className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-500">Delete</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
