"use client";

import { useRef, useState } from "react";

import {
  featuredGroups,
  allActiveMembers,
  myGroups,
  initialInvitations,
  suggestions,
  stats,
} from "@/lib/community/data";

import {
  toggleSetItem,
  removeById,
  clampPage,
  getTotalPages,
} from "@/lib/community/types";

import { CommunityHero } from "@/components/community/CommunityHero";
import { CommunityStats } from "@/components/community/CommunityStats";
import { FeaturedGroups } from "@/components/community/FeaturedGroups";
import { ActiveMembersCarousel } from "@/components/community/ActiveMemberCarousel";
import { CommunitySidebar } from "@/components/community/sidebar/CommunitySidebar";

export default function CommunityPage() {
  // ── Refs ──────────────────────────────────────────────────────────────────
  const groupsSectionRef = useRef<HTMLElement>(null);

  // ── State ─────────────────────────────────────────────────────────────────
  const [memberPage, setMemberPage] = useState(0);
  const [joinedGroups, setJoinedGroups] = useState<Set<number>>(
    new Set(featuredGroups.filter((g) => g.joined).map((g) => g.id)),
  );
  const [invitations, setInvitations] = useState(initialInvitations);
  const [joinedSuggestions, setJoinedSuggestions] = useState<Set<string>>(
    new Set(),
  );
  const [showAllGroups, setShowAllGroups] = useState(false);

  const totalPages = getTotalPages(allActiveMembers);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleExplore = () =>
    groupsSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

  const handleToggleJoin = (id: number) =>
    setJoinedGroups((prev) => toggleSetItem(prev, id));

  const handlePrevPage = () =>
    setMemberPage((p) => clampPage(p - 1, totalPages));

  const handleNextPage = () =>
    setMemberPage((p) => clampPage(p + 1, totalPages));

  const handleAcceptInvitation = (id: number) =>
    setInvitations((prev) => removeById(prev, id));

  const handleDeclineInvitation = (id: number) =>
    setInvitations((prev) => removeById(prev, id));

  const handleToggleSuggestion = (name: string) =>
    setJoinedSuggestions((prev) => toggleSetItem(prev, name));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex gap-5 p-5 max-w-[1100px] mx-auto">
      {/* Main column */}
      <main className="flex-1 min-w-0 flex flex-col gap-4">
        <CommunityHero onExplore={handleExplore} />

        <CommunityStats stats={stats} />

        <section ref={groupsSectionRef}>
          <FeaturedGroups
            groups={featuredGroups}
            joinedIds={joinedGroups}
            showAll={showAllGroups}
            onToggleShowAll={() => setShowAllGroups((v) => !v)}
            onToggleJoin={handleToggleJoin}
          />
        </section>

        <ActiveMembersCarousel
          members={allActiveMembers}
          page={memberPage}
          onPrev={handlePrevPage}
          onNext={handleNextPage}
          onGoToPage={setMemberPage}
        />
      </main>

      {/* Sidebar */}
      <CommunitySidebar
        myGroups={myGroups}
        invitations={invitations}
        suggestions={suggestions}
        joinedSuggestions={joinedSuggestions}
        onAcceptInvitation={handleAcceptInvitation}
        onDeclineInvitation={handleDeclineInvitation}
        onToggleSuggestion={handleToggleSuggestion}
      />
    </div>
  );
}
