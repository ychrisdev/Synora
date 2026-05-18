"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import {
  MOCK_RESULTS,
  TYPE_TO_TAB,
  SECTION_LABELS,
  RESULT_SECTION_ORDER,
  TAB_CONFIG,
} from "@/lib/search/data";

import type { TabKey, ResultType } from "@/lib/search/types";

import { SearchTabs } from "@/components/search/SearchTabs";
import { FilterPanel } from "@/components/search/FilterPanel";

import { ResultCard } from "@/components/search/cards/ResultCard";

import { TrendingTopics } from "@/components/search/widgets/TrendingTopics";
import { SuggestedPeople } from "@/components/search/widgets/SuggestedPeople";

export function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const initialTab = (searchParams.get("tab") as TabKey) ?? "all";

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [sortBy, setSortBy] = useState("relevant");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  useEffect(() => {
    setActiveTab((searchParams.get("tab") as TabKey) ?? "all");
    setActiveFilters({});
  }, [query, searchParams]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setActiveFilters({});
  };

  const toggleFilter = (group: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[group] ?? [];
      return {
        ...prev,
        [group]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const clearFilters = () => setActiveFilters({});

  const totalActiveFilters = Object.values(activeFilters).flat().length;

  const filteredResults = MOCK_RESULTS.filter((r) => {
    if (activeTab !== "all" && TYPE_TO_TAB[r.type] !== activeTab) return false;
    return true;
  });

  const groupedAll = RESULT_SECTION_ORDER.map((type) => ({
    type,
    items: filteredResults.filter((r) => r.type === type),
  })).filter((g) => g.items.length > 0);

  const tabCounts: Partial<Record<TabKey, number>> = Object.fromEntries(
    TAB_CONFIG.map((t) => [
      t.key,
      t.key === "all"
        ? MOCK_RESULTS.length
        : MOCK_RESULTS.filter((r) => TYPE_TO_TAB[r.type] === t.key).length,
    ])
  );

  return (
    <div className="min-h-screen bg-surface-50">
      <SearchTabs
        activeTab={activeTab}
        tabCounts={tabCounts}
        sortBy={sortBy}
        onTabChange={handleTabChange}
        onSortChange={setSortBy}
      />

      <div className="max-w-6xl mx-auto px-6 py-6 flex gap-6">
        <aside className="w-[220px] shrink-0 hidden lg:block">
          <FilterPanel
            tab={activeTab}
            activeFilters={activeFilters}
            onToggle={toggleFilter}
            onClear={clearFilters}
          />
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {query && (
              <p className="text-sm text-text-secondary">
                Kết quả cho{" "}
                <span className="font-semibold text-text-primary">"{query}"</span>
                {" "}· {filteredResults.length} kết quả
              </p>
            )}
            {totalActiveFilters > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(activeFilters).flatMap(([group, values]) =>
                  values.map((v) => (
                    <button
                      key={`${group}-${v}`}
                      onClick={() => toggleFilter(group, v)}
                      className="flex items-center gap-1 text-[11px] font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full hover:bg-primary/20 transition-colors"
                    >
                      {v} <X size={9} />
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {activeTab === "all" ? (
            <div className="flex flex-col gap-6">
              {groupedAll.map((group) => (
                <section key={group.type}>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                      {SECTION_LABELS[group.type as ResultType]}
                    </h2>
                    <button
                      onClick={() => handleTabChange(TYPE_TO_TAB[group.type as ResultType])}
                      className="text-xs text-primary font-medium hover:underline flex items-center gap-0.5"
                    >
                      Xem thêm
                    </button>
                  </div>
                  <div className="bg-white rounded-xl border border-surface-200 divide-y divide-surface-100 overflow-hidden">
                    {group.items.slice(0, 3).map((r) => (
                      <ResultCard key={r.id} r={r} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-surface-200 divide-y divide-surface-100 overflow-hidden">
              {filteredResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-text-muted gap-3">
                  <Search size={32} strokeWidth={1.2} />
                  <p className="text-sm">Không tìm thấy kết quả nào</p>
                </div>
              ) : (
                filteredResults.map((r) => <ResultCard key={r.id} r={r} />)
              )}
            </div>
          )}
        </div>

        <aside className="w-[240px] shrink-0 hidden xl:flex flex-col gap-4">
          <TrendingTopics />
          <SuggestedPeople />
        </aside>
      </div>
    </div>
  );
}