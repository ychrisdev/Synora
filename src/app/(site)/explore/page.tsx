"use client";

import { useState } from "react";
import type { SortKey } from "@/lib/explore/types";
import ExploreSearchBar from "@/components/explore/ExploreSearchBar";
import ExploreCategoryTabs from "@/components/explore/ExploreCategoryTabs";
import ExploreSortBar from "@/components/explore/ExploreSortBar";
import ExplorePostFeed from "@/components/explore/ExplorePostFeed";
import ActiveGroupsWidget from "@/components/explore/widgets/ActiveGroupsWidget";
import TopContributorsWidget from "@/components/explore/widgets/TopContributorsWidget";

export default function ExplorePage() {
  const [activeTab, setActiveTab]   = useState("Tất cả");
  const [activeSort, setActiveSort] = useState<SortKey>("hot");
  const [query, setQuery]           = useState("");

  return (
    <div className="flex gap-5 py-5 max-w-[1100px] mx-auto w-full items-start">

      <div className="flex-1 min-w-0 flex flex-col gap-4">
        <ExploreSearchBar value={query} onChange={setQuery} />

        <div className="flex items-center justify-between gap-3">
          <ExploreCategoryTabs active={activeTab} onChange={setActiveTab} />
          <ExploreSortBar active={activeSort} onChange={setActiveSort} />
        </div>

        <ExplorePostFeed
          activeTab={activeTab}
          activeSort={activeSort}
          query={query}
        />
      </div>

      <div className="w-[268px] shrink-0 flex flex-col gap-4">
        <ActiveGroupsWidget />
        <TopContributorsWidget />
      </div>

    </div>
  );
}