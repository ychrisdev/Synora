
type CommunityHeroProps = {
  onExplore?: () => void;
};

export function CommunityHero({ onExplore }: CommunityHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary via-primary-600 to-indigo-600 p-6 text-white">
      <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute right-10 -bottom-12 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />

      <h1 className="text-xl font-extrabold mb-1">Cộng đồng học tập Synora</h1>
      <p className="text-sm text-blue-100 mb-4">Kết nối với hàng nghìn bạn học trên toàn quốc</p>

      <button
        onClick={onExplore}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-primary text-xs font-bold rounded-lg hover:opacity-90 transition-opacity hover:cursor-pointer"
      >
        Khám phá nhóm
      </button>
    </div>
  );
}