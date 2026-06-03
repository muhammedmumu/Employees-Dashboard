import React from "react";

export default function KpiCard({
  value,
  label,
  delta,
  icon,
  className = "",
}: {
  value: React.ReactNode;
  label: string;
  delta?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={"rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 " + className}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{label}</p>
        </div>
        {icon && <div className="rounded-full bg-slate-100 p-2 dark:bg-slate-800">{icon}</div>}
      </div>
      {delta && <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{delta}</p>}
    </div>
  );
}
