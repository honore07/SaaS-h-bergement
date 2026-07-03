import Link from "next/link";
import { type ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "light" | "outline-light";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-brand-700 text-white shadow-sm hover:bg-brand-800",
  secondary: "bg-accent-500 text-brand-950 shadow-sm hover:bg-accent-400",
  outline: "border border-brand-700 text-brand-700 hover:bg-brand-50",
  light: "bg-white text-brand-950 shadow-sm hover:bg-brand-50",
  "outline-light": "border border-white/30 text-white hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3.5 text-base",
};

export function CtaLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
