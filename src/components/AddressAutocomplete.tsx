"use client";

import { useEffect, useRef, useState } from "react";
import { searchAddresses, searchCommunes, type BanResult } from "@/lib/api/ban";
import { Input } from "@/components/ui/Input";

export function AddressAutocomplete({
  mode = "address",
  placeholder,
  onSelect,
  id,
}: {
  /** "address" = adresse complète, "commune" = communes uniquement */
  mode?: "address" | "commune";
  placeholder?: string;
  onSelect: (result: BanResult) => void;
  id?: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BanResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    if (timer.current) clearTimeout(timer.current);
    if (value.trim().length < 3) {
      setResults([]);
      setOpen(false);
      return;
    }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const search = mode === "commune" ? searchCommunes : searchAddresses;
        const found = await search(value);
        setResults(found);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
  }

  return (
    <div ref={containerRef} className="relative">
      <Input
        id={id}
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={
          placeholder ??
          (mode === "commune" ? "Ex. Colmar" : "Ex. 12 rue des Vignes, Colmar")
        }
        autoComplete="off"
        aria-expanded={open}
        role="combobox"
      />
      {loading && (
        <span className="absolute right-3 top-2.5 text-xs text-foreground/40">
          …
        </span>
      )}
      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-brand-900/10 bg-white shadow-lg">
          {results.map((r) => (
            <li key={`${r.citycode}-${r.label}`}>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm hover:bg-brand-50"
                onClick={() => {
                  setQuery(r.label);
                  setOpen(false);
                  onSelect(r);
                }}
              >
                <span className="font-medium">{r.label}</span>
                <span className="ml-2 text-xs text-foreground/50">
                  {r.context}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
