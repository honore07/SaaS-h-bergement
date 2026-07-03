import { type InputHTMLAttributes, type SelectHTMLAttributes } from "react";

const base =
  "w-full rounded-lg border border-brand-900/15 bg-white px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${base} ${className}`} {...props} />;
}

export function Select({
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${base} ${className}`} {...props}>
      {children}
    </select>
  );
}

export function Label({
  htmlFor,
  children,
  className = "",
}: {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-1.5 block text-sm font-medium text-foreground/80 ${className}`}
    >
      {children}
    </label>
  );
}
