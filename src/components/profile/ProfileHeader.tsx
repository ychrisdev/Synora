"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Share2,
  MessageCircle,
  UserPlus,
  UserCheck,
  Pencil,
  Check,
  X,
  Users,
} from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { EditProfileModal } from "@/components/profile/EditProfileModal";

interface ProfileHeaderProps {
  coverUrl?: string | null;
  avatarUrl?: string | null;
  displayName: string;
  username: string;
  isOwner: boolean;
  isFollowing?: boolean;
  profileData?: any;
  onProfileSaved?: () => void;
  onSuggestOpen?: () => void;
}

export function ProfileHeader({
  coverUrl,
  avatarUrl,
  displayName,
  username,
  isOwner,
  isFollowing: initialFollowing = false,
  profileData,
  onProfileSaved,
  onSuggestOpen,
}: ProfileHeaderProps) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [followLoading, setFollowLoading] = useState(false);
  const [newCoverFile, setNewCoverFile] = useState<File | null>(null);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [newCoverPreview, setNewCoverPreview] = useState<string | null>(null);
  const [newAvatarPreview, setNewAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const { startUpload } = useUploadThing("postMedia");

  const handleFollowToggle = async () => {
    setFollowLoading(true);
    try {
      const res = await fetch(`/api/profile/${username}/follow`, {
        method: "POST",
      });
      const data = await res.json();
      setFollowing(data.following);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewCoverFile(file);
    setNewCoverPreview(URL.createObjectURL(file));
    setHasChanges(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewAvatarFile(file);
    setNewAvatarPreview(URL.createObjectURL(file));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let uploadedAvatarUrl: string | undefined;
      let uploadedCoverUrl: string | undefined;

      const filesToUpload: File[] = [];
      if (newAvatarFile) filesToUpload.push(newAvatarFile);
      if (newCoverFile) filesToUpload.push(newCoverFile);

      if (filesToUpload.length > 0) {
        const results = await startUpload(filesToUpload);
        if (results) {
          let idx = 0;
          if (newAvatarFile) uploadedAvatarUrl = results[idx++]?.url;
          if (newCoverFile) uploadedCoverUrl = results[idx++]?.url;
        }
      }

      await fetch(`/api/profile/${username}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(uploadedAvatarUrl && { avatarUrl: uploadedAvatarUrl }),
          ...(uploadedCoverUrl && { coverUrl: uploadedCoverUrl }),
        }),
      });

      setHasChanges(false);
      setNewCoverFile(null);
      setNewAvatarFile(null);
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    if (newCoverPreview) URL.revokeObjectURL(newCoverPreview);
    if (newAvatarPreview) URL.revokeObjectURL(newAvatarPreview);
    setNewCoverFile(null);
    setNewAvatarFile(null);
    setNewCoverPreview(null);
    setNewAvatarPreview(null);
    setHasChanges(false);
  };

  const displayCover = newCoverPreview ?? coverUrl;
  const displayAvatar = newAvatarPreview ?? avatarUrl;
  const ini = displayName
    .split(" ")
    .map((w) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative mb-16">
      <div className="h-40 rounded-2xl overflow-hidden relative bg-slate-200">
        {displayCover ? (
          <img
            src={displayCover}
            alt="cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[repeating-linear-gradient(45deg,#e2e5ec,#e2e5ec_10px,#eaecf2_10px,#eaecf2_20px)]" />
        )}
        {isOwner && (
          <label className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/20 hover:bg-black/30 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors cursor-pointer">
            <Camera size={11} />
            Đổi ảnh bìa
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />
          </label>
        )}
      </div>

      <div className="absolute -bottom-12">
        <div className="relative">
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt={displayName}
              className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary border-4 border-white flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {ini}
            </div>
          )}
          {isOwner && (
            <label className="absolute bottom-1 right-1 w-6 h-6 bg-white border border-surface-200 rounded-full flex items-center justify-center hover:bg-surface-100 transition-colors shadow-sm cursor-pointer">
              <Camera size={11} className="text-text-secondary" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          )}
        </div>
      </div>

      <div className="absolute -bottom-10 right-0 flex items-center gap-2">
        {hasChanges && isOwner ? (
          <>
            <button
              onClick={handleDiscard}
              className="flex items-center gap-1.5 border border-surface-200 bg-white text-text-secondary text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-surface-50 transition-colors"
            >
              <X size={13} /> Huỷ
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-60"
            >
              <Check size={13} />
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          </>
        ) : (
          <>
            <button className="flex items-center gap-1.5 border border-surface-200 bg-white text-text-secondary text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-surface-50 transition-colors">
              <Share2 size={13} /> Chia sẻ
            </button>
            {isOwner ? (
              <>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-1.5 border border-surface-200 bg-white text-text-secondary text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-surface-50 transition-colors"
                >
                  <Pencil size={13} /> Chỉnh sửa
                </button>
                <button
                  onClick={onSuggestOpen}
                  className="flex items-center gap-1.5 border border-primary/25 bg-primary/5 text-primary text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <Users size={13} /> Gợi ý kết bạn
                </button>
              </>
            ) : (
              <>
                <button className="flex items-center gap-1.5 border border-surface-200 bg-white text-text-secondary text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-surface-50 transition-colors">
                  <MessageCircle size={13} /> Nhắn tin
                </button>
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={clsx(
                    "flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors disabled:opacity-60",
                    following
                      ? "bg-surface-100 text-text-secondary border border-surface-200 hover:bg-surface-200"
                      : "bg-primary text-white hover:bg-primary-700",
                  )}
                >
                  {following ? (
                    <>
                      <UserCheck size={13} /> Đang theo dõi
                    </>
                  ) : (
                    <>
                      <UserPlus size={13} /> Kết bạn
                    </>
                  )}
                </button>
              </>
            )}
          </>
        )}
      </div>
      {showEditModal && (
        <EditProfileModal
          username={username}
          initial={{
            displayName: profileData?.profile?.displayName,
            bio: profileData?.profile?.bio,
            school: profileData?.profile?.school,
            location: profileData?.profile?.location,
            website: profileData?.profile?.website,
            grade: profileData?.profile?.grade,
            avatarUrl: profileData?.profile?.avatarUrl,
            coverUrl: profileData?.profile?.coverUrl,
          }}
          onClose={() => setShowEditModal(false)}
          onSaved={() => {
            setShowEditModal(false);
            onProfileSaved?.();
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
