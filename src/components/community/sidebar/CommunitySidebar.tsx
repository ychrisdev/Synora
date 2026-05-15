import { MyGroupsCard } from "./MyGroupsCard";
import { InvitationsCard } from "./InvitationsCard";
import { SuggestionsCard } from "./SuggestionsCard";
import type { MyGroup, Invitation, Suggestion } from "../../_data/community.data";

type CommunitySidebarProps = {
  myGroups: MyGroup[];
  invitations: Invitation[];
  suggestions: Suggestion[];
  joinedSuggestions: Set<string>;
  onAcceptInvitation: (id: number) => void;
  onDeclineInvitation: (id: number) => void;
  onToggleSuggestion: (name: string) => void;
};

export function CommunitySidebar({
  myGroups,
  invitations,
  suggestions,
  joinedSuggestions,
  onAcceptInvitation,
  onDeclineInvitation,
  onToggleSuggestion,
}: CommunitySidebarProps) {
  return (
    <aside className="w-[260px] shrink-0 flex flex-col gap-3">
      <MyGroupsCard groups={myGroups} />
      <InvitationsCard
        invitations={invitations}
        onAccept={onAcceptInvitation}
        onDecline={onDeclineInvitation}
      />
      <SuggestionsCard
        suggestions={suggestions}
        joinedNames={joinedSuggestions}
        onToggle={onToggleSuggestion}
      />
    </aside>
  );
}