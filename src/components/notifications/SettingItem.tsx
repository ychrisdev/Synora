import { ToggleSwitch } from "../ui/ToggleSwitch";

interface SettingItemProps {
  title: string;
  desc: string;
  checked: boolean;
  onChange: () => void;
}

export const SettingItem = ({ title, desc, checked, onChange }: SettingItemProps) => (
  <div className="flex items-center justify-between gap-4 py-1">
    <div className="min-w-0 flex-1">
      <p className="text-xs font-semibold text-slate-700 leading-tight">
        {title}
      </p>
      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{desc}</p>
    </div>
    <ToggleSwitch checked={checked} onChange={onChange} />
  </div>
);