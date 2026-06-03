"use client";

import LoginForm from "../../../src/components/LoginForm";

export default function EmployeeLoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-950">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-400">Employee Portal</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Employee Login</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Access your employee workspace using your account credentials.</p>
        <div className="mt-8">
          <LoginForm role="employee" />
        </div>
      </div>
    </main>
  );
}
