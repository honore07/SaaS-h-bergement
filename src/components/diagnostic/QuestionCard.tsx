"use client";

import { type ReactNode } from "react";
import { Card } from "@/components/ui/Card";

export interface QuestionOption {
  value: string;
  label: string;
}

export function QuestionCard({
  numero,
  libelle,
  name,
  options,
  value,
  onChange,
  children,
}: {
  numero: number;
  libelle: string;
  name: string;
  options: QuestionOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  /** Contenu additionnel affiché sous les options (ex. sélecteur de classe DPE). */
  children?: ReactNode;
}) {
  return (
    <Card className="p-5">
      <p className="mb-3 text-sm font-semibold text-foreground">
        <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-800">
          {numero}
        </span>
        {libelle}
      </p>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={libelle}>
        {options.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                checked
                  ? "border-brand-700 bg-brand-50 text-brand-800"
                  : "border-brand-900/15 bg-white text-foreground/70 hover:border-brand-400 hover:text-foreground"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
      {children}
    </Card>
  );
}
