import clsx from "clsx";
import { PRIMARY_SUBJECT_TABS } from "@/lib/library/data";
import SubjectDropdown from "./SubjectDropdown";

interface SubjectTabsProps {
  activeSubject: string;
  onSelect: (id: string) => void;
}

export default function SubjectTabs({ activeSubject, onSelect }: SubjectTabsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {PRIMARY_SUBJECT_TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className={clsx(
            "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shrink-0 transition-all",
            activeSubject === tab.id
              ? "bg-primary text-white shadow-sm"
              : "bg-white border border-surface-200 text-text-secondary hover:border-primary hover:text-primary",
          )}
        >
          {tab.label}
        </button>
      ))}
      <SubjectDropdown activeSubject={activeSubject} onSelect={onSelect} />
    </div>
  );
}