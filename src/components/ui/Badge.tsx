import { type ReactNode } from "react";

type Tone = "brand" | "amber" | "red" | "neutral" | "green";

const tones: Record<Tone, string> = {
  brand: "bg-brand-100 text-brand-800",
  amber: "bg-accent-100 text-accent-800",
  red: "bg-red-100 text-red-800",
  green: "bg-emerald-100 text-emerald-800",
  neutral: "bg-slate-100 text-slate-700",
};

export function Badge({
  tone = "brand",
  children,
  className = "",
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
