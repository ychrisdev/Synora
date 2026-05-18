import { Crown, Shield } from "lucide-react";
import type { Member } from "@/lib/chat/types";

export function RoleBadge({ role }: { role: Member["role"] }) {
  if (role === "admin")
    return (
      <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full leading-none">
        <Crown size={8} />
        Quản trị
      </span>
    );
  if (role === "mod")
    return (
      <span className="flex items-center gap-0.5 text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full leading-none">
        <Shield size={8} />
        Mod
      </span>
    );
  return null;
}