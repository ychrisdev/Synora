import { Check, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import type { Invitation } from "@/lib/community/data";

type InvitationsCardProps = {
  invitations: Invitation[];
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
};

export function InvitationsCard({ invitations, onAccept, onDecline }: InvitationsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-bold text-text-primary">Lời mời tham gia</h3>
        {invitations.length > 0 && (
          <span className="bg-primary text-white text-[10px] font-extrabold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
            {invitations.length}
          </span>
        )}
      </div>

      {invitations.length === 0 ? (
        <p className="text-xs text-text-muted text-center py-2">Không có lời mời nào</p>
      ) : (
        <div className="flex flex-col divide-y divide-surface-100">
          {invitations.map((inv) => (
            <div key={inv.id} className="flex flex-col gap-2 py-2.5 first:pt-0 last:pb-0">
              <div className="flex items-center gap-2">
                <Avatar initials={inv.initials} color={inv.color} size="sm" shape="rounded" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-text-primary truncate">{inv.name}</p>
                  <p className="text-[10px] text-text-muted truncate">Mời bởi {inv.invitedBy}</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => onAccept(inv.id)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-primary text-white text-[11px] font-bold rounded-lg hover:bg-primary-600 transition-colors hover:cursor-pointer"
                >
                  Chấp nhận
                </button>
                <button
                  onClick={() => onDecline(inv.id)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-surface-200 text-text-secondary text-[11px] font-bold rounded-lg hover:bg-surface-100 transition-colors hover:cursor-pointer"
                >
                  Từ chối
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}