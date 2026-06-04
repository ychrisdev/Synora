"use client";

import clsx from "clsx";
import { LEVEL_TABS, THPT_GRADES, THPT_SUBJECTS, UNIVERSITY_MAJORS } from "@/lib/library/data";
import type { LevelKey } from "@/lib/library/types";
import SubjectDropdown from "./SubjectDropdown";

interface LevelFilterBarProps {
  activeLevel:    LevelKey;
  onLevelChange:  (v: LevelKey) => void;
  activeGrade:    string;
  onGradeChange:  (v: string) => void;
  activeSubject:  string;
  onSubjectChange:(v: string) => void;
  activeMajor:    string;
  onMajorChange:  (v: string) => void;
}

export default function LevelFilterBar({
  activeLevel, onLevelChange,
  activeGrade, onGradeChange,
  activeSubject, onSubjectChange,
  activeMajor, onMajorChange,
}: LevelFilterBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        {LEVEL_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onLevelChange(tab.id as LevelKey)}
            className={clsx(
              "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              activeLevel === tab.id
                ? "bg-primary text-white shadow-sm"
                : "bg-white border border-surface-200 text-text-secondary hover:border-primary hover:text-primary",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeLevel === "thpt" && (
        <div className="flex items-center gap-2 flex-wrap">
          <SubjectDropdown
            label="Chọn lớp"
            options={THPT_GRADES}
            value={activeGrade}
            onChange={onGradeChange}
          />
          <SubjectDropdown
            label="Chọn môn"
            options={THPT_SUBJECTS}
            value={activeSubject}
            onChange={onSubjectChange}
          />
        </div>
      )}

      {activeLevel === "university" && (
        <div className="flex items-center gap-2">
          <SubjectDropdown
            label="Chọn khối ngành"
            options={UNIVERSITY_MAJORS}
            value={activeMajor}
            onChange={onMajorChange}
          />
        </div>
      )}
    </div>
  );
}