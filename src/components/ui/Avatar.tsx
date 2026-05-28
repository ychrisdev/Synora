interface AvatarProps {
  src?: string | null;
  name: string;
  initials: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  shadow?: boolean;
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

export default function Avatar({ src, name, initials, color = "bg-primary", size = "md", shadow }: AvatarProps) {
  const sizeClass = sizeMap[size];
  const shadowClass = shadow ? "shadow-md" : "";
  if (src) {
    return (
      <img src={src} alt={name} className={`${sizeClass} ${shadowClass} rounded-full object-cover shrink-0`} />
    );
  }
  return (
    <div className={`${sizeClass} ${shadowClass} rounded-full flex items-center justify-center text-white font-bold shrink-0 ${color}`}>
      {initials}
    </div>
  );
}