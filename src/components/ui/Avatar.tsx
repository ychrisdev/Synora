import { clsx } from "clsx";

type AvatarProps = {
  initials: string;
  color: string;
  size?: "sm" | "md" | "lg";
  shape?: "rounded" | "circle";
};

const sizeMap: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "w-8 h-8 text-[11px]",
  md: "w-[42px] h-[42px] text-[13px]",
  lg: "w-12 h-12 text-sm",
};

export function Avatar({ initials, color, size = "md", shape = "rounded" }: AvatarProps) {
  return (
    <div
      className={clsx(
        "flex items-center justify-center text-white font-extrabold shrink-0",
        sizeMap[size],
        shape === "circle" ? "rounded-full" : "rounded-[9px]",
        color
      )}
    >
      {initials}
    </div>
  );
}