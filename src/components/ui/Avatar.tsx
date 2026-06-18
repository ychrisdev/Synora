interface AvatarProps {
  src?: string | null;
  name?: string;
  initials: string;
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "rounded";
  shadow?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-xl",
};

export default function Avatar({
  src,
  name,
  initials,
  color = "bg-primary",
  size = "md",
  shape = "circle",
  shadow,
  className = "",
}: AvatarProps) {
  const sizeClass = sizeMap[size];
  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-xl";
  const shadowClass = shadow ? "shadow-md" : "";

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? initials}
        className={`${sizeClass} ${shapeClass} ${shadowClass} object-cover shrink-0 ${className}`}
      />
    );
  }
  return (
    <div
      className={`${sizeClass} ${shapeClass} ${shadowClass} flex items-center justify-center text-white font-bold shrink-0 ${color} ${className}`}
    >
      {initials}
    </div>
  );
}
