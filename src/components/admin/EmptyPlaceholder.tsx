import { LucideIcon, Inbox } from "lucide-react";

export function EmptyPlaceholder({
  icon: Icon = Inbox,
  title,
  description,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl py-16 flex flex-col items-center justify-center gap-3">
      <div className="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center">
        <Icon size={18} className="text-slate-300" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        {description && (
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}