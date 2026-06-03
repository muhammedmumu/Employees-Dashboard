import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string };

export default function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={
        "inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-sky-200 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 dark:focus:ring-slate-800 " +
        className
      }
    >
      {children}
    </button>
  );
}
