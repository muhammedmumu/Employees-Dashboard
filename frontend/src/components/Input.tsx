import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  id?: string;
  name: string;
};

export default function Input({ label, id, name, type = "text", placeholder, ...props }: InputProps) {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor={id || name}>
      {label && <span>{label}</span>}
      <input
        id={id || name}
        name={name}
        type={type}
        placeholder={placeholder}
        {...props}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:ring-sky-950"
      />
    </label>
  );
}
