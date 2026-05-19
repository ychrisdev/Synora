import { MapPin, School, Globe, Calendar } from "lucide-react";
import { profileData } from "@/lib/profile/data";

export function ProfileInfo() {
  return (
    <div className="px-1 mb-4">
      <div className="flex items-center gap-2 mb-0.5">
        <h1 className="text-lg font-bold text-text-primary">{profileData.name}</h1>
      </div>
      <p className="text-xs text-text-muted mb-2">{profileData.username}</p>
      <p className="text-sm text-text-primary max-w-[540px] leading-relaxed mb-3">{profileData.bio}</p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
        <span className="flex items-center gap-1.5">
          <School size={12} />
          {profileData.school}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin size={12} />
          {profileData.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar size={12} />
          Tham gia {profileData.joinDate}
        </span>
        <span className="flex items-center gap-1.5 text-primary">
          <Globe size={12} />
          {profileData.website}
        </span>
      </div>
    </div>
  );
}