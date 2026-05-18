"use client";

import { useRef, useEffect, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { SORT_OPTIONS } from "@/lib/search/data";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function SortDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = SORT_OPTIONS.find((o) => o.value === value);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs font-medium text-text-secondary border border-surface-200 px-3 py-1.5 rounded-lg hover:border-primary hover:text-primary transition-colors bg-white"
      >
        {current?.label}
        <ChevronDown
          size={12}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-surface-200 py-1 z-30">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                value === opt.value
                  ? "text-primary font-semibold bg-primary/5"
                  : "text-text-secondary hover:bg-surface-50"
              }`}
            >
              {opt.label}
              {value === opt.value && <Check size={11} className="text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}