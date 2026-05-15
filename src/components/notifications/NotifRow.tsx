import { useState } from "react";
import {
  ThumbsUp,
  MessageSquare,
  FileText,
  Users,
  Trophy,
  Share2,
} from "lucide-react";
import { NotifItem, NotifType } from "@/types/notification";

const typeConfig: Record<NotifType, { icon: any; bg: string; color: string }> =
  {
    like: { icon: ThumbsUp, bg: "bg-rose-50", color: "text-rose-500" },
    comment: { icon: MessageSquare, bg: "bg-blue-50", color: "text-blue-500" },
    milestone: { icon: FileText, bg: "bg-amber-50", color: "text-amber-500" },
    invite: { icon: Users, bg: "bg-emerald-50", color: "text-emerald-500" },
    award: { icon: Trophy, bg: "bg-yellow-50", color: "text-yellow-500" },
    share: { icon: Share2, bg: "bg-violet-50", color: "text-violet-500" },
    group: { icon: Users, bg: "bg-teal-50", color: "text-teal-500" },
  };

export function NotifRow({
  notif,
  compact = false,
}: {
  notif: NotifItem;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<"pending" | "accepted" | "declined">(
    "pending",
  );
  const { icon: Icon, bg, color } = typeConfig[notif.type];

  return (
    <div
      className={`group flex items-start gap-3 rounded-xl cursor-pointer transition-all ${
        compact
          ? "px-3 py-2.5 hover:bg-slate-50"
          : "px-4 py-3.5 hover:bg-slate-50/80"
      } ${notif.unread ? "bg-blue-50/40" : ""}`}
    >
      <div className="shrink-0 mt-0.5">
        {notif.avatars.length > 0 ? (
          <div className="flex -space-x-2">
            {notif.avatars.slice(0, 2).map((av, i) => (
              <div
                key={i}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white ${notif.avatarColors[i]}`}
              >
                {av}
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}
          >
            <Icon size={15} className={color} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug text-slate-700 ${notif.unread ? "font-medium text-slate-900" : ""}`}
        >
          {notif.text}
        </p>
        {notif.sub && (
          <p className="text-xs text-slate-400 mt-0.5 truncate">{notif.sub}</p>
        )}
        {notif.action && !compact && status === "pending" && (
          <div className="flex items-center gap-2 mt-2.5">
            <button
              onClick={() => setStatus("accepted")}
              className="text-xs font-semibold text-white bg-blue-500 px-3 py-1.5 rounded-lg hover:bg-blue-600"
            >
              {notif.action.accept}
            </button>
            <button
              onClick={() => setStatus("declined")}
              className="text-xs font-medium text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100"
            >
              {notif.action.decline}
            </button>
          </div>
        )}
      </div>
      {notif.unread && (
        <div className="shrink-0 mt-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full block" />
        </div>
      )}
    </div>
  );
}
