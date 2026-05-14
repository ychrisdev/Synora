"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { SECONDARY_SUBJECT_TABS } from "@/lib/library/data";

interface SubjectDropdownProps {
  activeSubject: string;
  onSelect: (id: string) => void;
}

export default function SubjectDropdown({ activeSubject, onSelect }: SubjectDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef    = useRef<HTMLDivElement>(null);

  const isActiveInDropdown = SECONDARY_SUBJECT_TABS.some((t) => t.id === activeSubject);
  const activeLabel        = SECONDARY_SUBJECT_TABS.find((t) => t.id === activeSubject)?.label;

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const handleSelect = (id: string) => {
    onSelect(id);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={clsx(
          "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all",
          isActiveInDropdown
            ? "bg-primary text-white shadow-sm"
            : open
              ? "bg-surface-100 border border-surface-300 text-text-primary"
              : "bg-white border border-surface-200 text-text-secondary hover:border-primary hover:text-primary",
        )}
      >
        {isActiveInDropdown ? activeLabel : "Khác"}
        <ChevronDown
          size={13}
          className={clsx("transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={clsx(
            "absolute top-full left-0 mt-2 z-30",
            "w-44 bg-white border border-surface-200 rounded-xl shadow-lg py-1.5",
            "animate-in fade-in zoom-in-95 duration-150 origin-top-left",
          )}
        >
          {SECONDARY_SUBJECT_TABS.map((tab) => (
            <button
              key={tab.id}
              role="option"
              aria-selected={activeSubject === tab.id}
              onClick={() => handleSelect(tab.id)}
              className={clsx(
                "w-full text-left px-3.5 py-2 text-sm transition-colors",
                activeSubject === tab.id
                  ? "text-primary font-semibold bg-primary/5"
                  : "text-text-secondary hover:bg-surface-50 hover:text-text-primary",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}