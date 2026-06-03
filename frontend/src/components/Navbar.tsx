"use client";

import React, { useEffect, useMemo, useState } from "react";

type NavbarLink = { label: string; href: string };

type NavbarProps = {
  role?: "employee" | "admin";
  links?: NavbarLink[];
  actionLabel?: string;
  actionHref?: string;
};

export default function Navbar({
  role = "employee",
  links,
}: NavbarProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = useMemo(
    () => {
      const defaultLabels = role === "admin" ? ["Overview", "Employees", "Attendance", "Reports"] : ["My Tasks", "Time Entry", "Profile"];
      return links ?? defaultLabels.map((label) => ({ label, href: "#" }));
    },
    [links, role]
  );

  useEffect(() => {
    function updateActiveIndex() {
      const hash = window.location.hash;
      const currentHref = hash || window.location.pathname;
      const matchingIndex = items.findIndex((item) => item.href === currentHref);
      setActiveIndex(matchingIndex >= 0 ? matchingIndex : 0);
    }

    updateActiveIndex();
    window.addEventListener("hashchange", updateActiveIndex);
    return () => window.removeEventListener("hashchange", updateActiveIndex);
  }, [items]);

  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-white/75 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white shadow-lg shadow-slate-950/20 dark:bg-white dark:text-slate-950">EM</div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-950 dark:text-white">Employee Manager</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{role === "admin" ? "Admin workspace" : "Employee workspace"}</p>
          </div>
        </div>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex">
          {items.map((item, idx) => {
            const isActive = idx === activeIndex;

            return (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setActiveIndex(idx)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${isActive ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
            >
              {item.label}
            </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
