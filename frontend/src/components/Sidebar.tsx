"use client";

import React from "react";

export default function Sidebar({ role = "admin" }: { role?: "admin" | "employee" }) {
  function logout() {
    localStorage.removeItem("ems_token");
    localStorage.removeItem("ems_role");
    localStorage.removeItem("ems_user");
    window.location.href = "/";
  }

  const links =
    role === "admin"
      ? [
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Employees", href: "/employees" },
        ]
      : [{ label: "Dashboard", href: "/employee/dashboard" }];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="space-y-6">
        <div className="text-sm font-semibold">Menu</div>
        <nav className="space-y-2">
          {links.map((link) => (
            <a key={link.href} className="block rounded px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href={link.href}>
              {link.label}
            </a>
          ))}
          <button onClick={logout} className="w-full text-left rounded px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Logout</button>
        </nav>
      </div>
    </aside>
  );
}
