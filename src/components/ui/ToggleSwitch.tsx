import { clsx } from "clsx";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
}

export const ToggleSwitch = ({ checked, onChange }: ToggleSwitchProps) => (
  <button
    onClick={onChange}
    className={clsx(
      "w-10 h-5 rounded-full transition-all relative shrink-0",
      checked ? "bg-blue-500" : "bg-slate-300",
    )}
  >
    <span
      className={clsx(
        "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
        checked ? "left-[22px]" : "left-[2px]",
      )}
    />
  </button>
);