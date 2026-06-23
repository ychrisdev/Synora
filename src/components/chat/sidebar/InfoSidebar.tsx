"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Bell,
  BellOff,
  Users,
  ChevronRight,
  ShieldAlert,
  LogOut,
  Flag,
  Download,
  User,
  MoreHorizontal,
  MessageSquare,
  PhoneCall,
  VideoIcon,
  BanIcon,
  Play,
  FileText,
} from "lucide-react";
import { clsx } from "clsx";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import Avatar from "@/components/ui/Avatar";
import { RoleBadge } from "@/components/chat/RoleBadge";
import { useOutsideClick } from "@/lib/chat/hooks";
import { groupMembers } from "@/lib/chat/data";
import {
  fetchConversationAttachments,
  formatBytes,
  getFileExt,
  getFileColor,
  downloadFile,
} from "@/lib/chat/utils";
import type {
  Conversation,
  Member,
  ConfirmAction,
  SharedAttachment,
} from "@/lib/chat/types";

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function MediaModal({
  tab: init,
  media,
  docs,
  initialIndex,
  onClose,
}: {
  tab: "images" | "files";
  media: SharedAttachment[];
  docs: SharedAttachment[];
  initialIndex?: number;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"images" | "files">(init);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(
    initialIndex ?? null,
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[60]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-[380px] bg-white z-[60] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
          <p className="text-sm font-bold text-text-primary">
            Ảnh &amp; File đã chia sẻ
          </p>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-surface-100 rounded-lg transition-colors text-text-muted"
          >
            <X size={15} />
          </button>
        </div>
        <div className="flex border-b border-surface-100 px-5">
          {(["images", "files"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                "py-3 mr-7 text-xs font-semibold border-b-2 transition-colors",
                tab === t
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-text-secondary",
              )}
            >
              {t === "images"
                ? `Ảnh & Video (${media.length})`
                : `File (${docs.length})`}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {tab === "images" ? (
            media.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-8">
                Chưa có ảnh/video nào
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {media.map((m, i) => (
                  <button
                    key={m.id}
                    onClick={() => setLightboxIndex(i)}
                    className="relative aspect-square rounded-xl overflow-hidden border border-surface-200 hover:opacity-80 transition-opacity"
                  >
                    {m.type === "VIDEO" ? (
                      <>
                        <video
                          src={m.url}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                          <Play size={14} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <img
                        src={m.url}
                        alt={m.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )
          ) : docs.length === 0 ? (
            <p className="text-xs text-text-muted text-center py-8">
              Chưa có file nào
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {docs.map((f) => {
                const ext = getFileExt(f.name);
                return (
                  <button
                    key={f.id}
                    onClick={() => downloadFile(f.url, f.name)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-50 transition-colors group border border-surface-100 text-left w-full"
                  >
                    <div
                      className={clsx(
                        "w-9 h-9 rounded-xl flex items-center justify-center text-white text-[9px] font-bold shrink-0",
                        getFileColor(ext),
                      )}
                    >
                      {ext}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text-primary truncate">
                        {f.name}
                      </p>
                      <p className="text-[10px] text-text-muted">
                        {formatBytes(f.size)}
                      </p>
                    </div>
                    <Download
                      size={13}
                      className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {lightboxIndex !== null && media[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadFile(
                  media[lightboxIndex].url,
                  media[lightboxIndex].name,
                );
              }}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              title="Tải xuống"
            >
              <Download size={16} />
            </button>
            <button
              onClick={() => setLightboxIndex(null)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <X size={18} />
            </button>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            {media[lightboxIndex].type === "VIDEO" ? (
              <video
                src={media[lightboxIndex].url}
                controls
                autoPlay
                className="max-w-[85vw] max-h-[85vh] rounded-lg"
              />
            ) : (
              <img
                src={media[lightboxIndex].url}
                alt={media[lightboxIndex].name}
                className="max-w-[85vw] max-h-[85vh] rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function MemberMenu({
  member,
  onClose,
}: {
  member: Member;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, onClose);
  const isMe = member.name.includes("Bạn");
  return (
    <div
      ref={ref}
      className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-lg border border-surface-200 py-1 z-50 overflow-hidden"
    >
      {isMe ? (
        <div className="px-3 py-2 text-xs text-text-muted">Đây là bạn</div>
      ) : (
        <>
          <Link
            href="/profile"
            onClick={onClose}
            className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-text-primary hover:bg-surface-50 transition-colors"
          >
            <User size={13} className="text-text-muted shrink-0" />
            Trang cá nhân
          </Link>
          {[
            { icon: <MessageSquare size={13} />, label: "Nhắn tin" },
            { icon: <PhoneCall size={13} />, label: "Gọi âm thanh" },
            { icon: <VideoIcon size={13} />, label: "Gọi video" },
          ].map(({ icon, label }) => (
            <button
              key={label}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-text-primary hover:bg-surface-50 transition-colors"
            >
              <span className="text-text-muted shrink-0">{icon}</span>
              {label}
            </button>
          ))}
          <div className="h-px bg-surface-100 my-0.5" />
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors">
            <BanIcon size={13} className="shrink-0" />
            Chặn
          </button>
        </>
      )}
    </div>
  );
}

function MembersModal({ onClose }: { onClose: () => void }) {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[60]" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-[320px] bg-white z-[60] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
          <div>
            <p className="text-sm font-bold text-text-primary">
              Thành viên nhóm
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              {groupMembers.length} thành viên
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-surface-100 rounded-lg transition-colors text-text-muted"
          >
            <X size={15} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {groupMembers.map((m, i) => (
            <div
              key={i}
              className="relative flex items-center gap-3 px-5 py-3 hover:bg-surface-50 transition-colors group"
            >
              <div className="relative shrink-0">
                <Avatar
                  initials={m.initials}
                  color={m.color}
                  size="md"
                  shape="circle"
                />
                {m.active && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {m.name}
                  </p>
                  <RoleBadge role={m.role} />
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  {m.active ? "Đang hoạt động" : "Không hoạt động"}
                </p>
              </div>
              {!m.name.includes("Bạn") && (
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === i ? null : i)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-surface-200 rounded-lg transition-all text-text-muted"
                  >
                    <MoreHorizontal size={15} />
                  </button>
                  {openMenu === i && (
                    <MemberMenu member={m} onClose={() => setOpenMenu(null)} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

interface InfoSidebarProps {
  conv: Conversation;
  onClose: () => void;
}

export function InfoSidebar({ conv, onClose }: InfoSidebarProps) {
  const [notifOn, setNotifOn] = useState(true);
  const [mediaModalTab, setMediaModalTab] = useState<"images" | "files" | null>(
    null,
  );
  const [mediaModalIndex, setMediaModalIndex] = useState<number | undefined>(
    undefined,
  );
  const [membersOpen, setMembersOpen] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmAction | null>(null);

  const [attachments, setAttachments] = useState<SharedAttachment[]>([]);
  const [loadingAttachments, setLoadingAttachments] = useState(true);

  useEffect(() => {
    setLoadingAttachments(true);
    fetchConversationAttachments(conv.id)
      .then(setAttachments)
      .catch(() => setAttachments([]))
      .finally(() => setLoadingAttachments(false));
  }, [conv.id]);

  const mediaAttachments = attachments.filter(
    (a) => a.type === "IMAGE" || a.type === "VIDEO",
  );
  const docAttachments = attachments.filter((a) => a.type === "DOCUMENT");

  const initials = getInitials(conv.name);

  return (
    <>
      <div className="w-[280px] shrink-0 border-l border-surface-200 bg-white flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface-100 shrink-0">
          <p className="text-sm font-bold text-text-primary">Thông tin</p>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-surface-100 rounded-lg transition-colors text-text-muted"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex flex-col items-center pt-5 pb-4 px-4 border-b border-surface-100">
          <Avatar
            src={conv.avatarUrl}
            initials={initials}
            size="xl"
            shape="circle"
            className="mb-3"
          />
          <p className="text-sm font-bold text-text-primary text-center">
            {conv.name}
          </p>
          {conv.isGroup ? (
            <p className="text-xs text-text-muted mt-0.5">
              Nhóm · {groupMembers.length} thành viên
            </p>
          ) : (
            <p className="text-xs text-green-500 mt-0.5 font-medium">
              ● Đang hoạt động
            </p>
          )}
          {!conv.isGroup && conv.otherUsername && (
            <Link
              href={`/profile/${conv.otherUsername}`}
              className="mt-2.5 px-3.5 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full hover:bg-primary/20 transition-colors flex items-center gap-1.5"
            >
              <User size={11} />
              Xem trang cá nhân
            </Link>
          )}
        </div>

        <div className="px-4 py-3 border-b border-surface-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={clsx(
                  "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                  notifOn ? "bg-primary/10" : "bg-surface-100",
                )}
              >
                {notifOn ? (
                  <Bell size={14} className="text-primary" />
                ) : (
                  <BellOff size={14} className="text-text-muted" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-text-primary">
                  Thông báo
                </p>
                <p className="text-[11px] text-text-muted">
                  {notifOn ? "Đang bật" : "Đã tắt"}
                </p>
              </div>
            </div>
            <ToggleSwitch
              checked={notifOn}
              onChange={() => setNotifOn((v) => !v)}
            />
          </div>
        </div>

        {conv.isGroup && (
          <div className="px-4 py-3 border-b border-surface-100">
            <button
              onClick={() => setMembersOpen(true)}
              className="w-full flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Users size={14} className="text-blue-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-semibold text-text-primary">
                  Thành viên
                </p>
                <p className="text-[11px] text-text-muted">
                  {groupMembers.length} người
                </p>
              </div>
              <ChevronRight
                size={13}
                className="text-text-muted group-hover:text-text-secondary transition-colors"
              />
            </button>
          </div>
        )}

        <div className="px-4 py-3 border-b border-surface-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-text-primary">
              Ảnh &amp; File
            </p>
            {(mediaAttachments.length > 0 || docAttachments.length > 0) && (
              <button
                onClick={() => setMediaModalTab("images")}
                className="text-xs text-primary font-semibold shrink-0 cursor-pointer"
              >
                Xem tất cả
              </button>
            )}
          </div>

          {loadingAttachments ? (
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-surface-100 animate-pulse"
                />
              ))}
            </div>
          ) : mediaAttachments.length === 0 && docAttachments.length === 0 ? (
            <p className="text-[11px] text-text-muted py-2">
              Chưa có ảnh/file nào được chia sẻ
            </p>
          ) : (
            <>
              {mediaAttachments.length > 0 && (
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  {mediaAttachments.slice(0, 6).map((m, i) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setMediaModalTab("images");
                        setMediaModalIndex(i);
                      }}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                    >
                      {m.type === "VIDEO" ? (
                        <>
                          <video
                            src={m.url}
                            className="w-full h-full object-cover"
                            muted
                            preload="metadata"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                            <Play size={11} className="text-white" />
                          </div>
                        </>
                      ) : (
                        <img
                          src={m.url}
                          alt={m.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {docAttachments.length > 0 && (
                <>
                  <div className="h-px bg-surface-100 mb-2.5" />
                  <div className="flex flex-col gap-1">
                    {docAttachments.slice(0, 2).map((f) => {
                      const ext = getFileExt(f.name);
                      return (
                        <button
                          key={f.id}
                          onClick={() => downloadFile(f.url, f.name)}
                          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-surface-50 transition-colors group cursor-pointer text-left w-full"
                        >
                          <div
                            className={clsx(
                              "w-7 h-7 rounded-lg flex items-center justify-center text-white text-[8px] font-bold shrink-0",
                              getFileColor(ext),
                            )}
                          >
                            {ext}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-text-primary truncate">
                              {f.name}
                            </p>
                            <p className="text-[11px] text-text-muted">
                              {formatBytes(f.size)}
                            </p>
                          </div>
                          <Download
                            size={11}
                            className="text-text-muted opacity-0 group-hover:opacity-100 transition-all shrink-0"
                          />
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="px-4 py-3 flex flex-col gap-0.5">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 px-1">
            {conv.isGroup ? "Tuỳ chọn nhóm" : "Tuỳ chọn"}
          </p>
          {!conv.isGroup && (
            <button
              onClick={() => setConfirm("block")}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors group w-full text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-surface-100 group-hover:bg-red-100 flex items-center justify-center transition-colors shrink-0">
                <ShieldAlert
                  size={13}
                  className="text-text-muted group-hover:text-red-500 transition-colors"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-text-secondary group-hover:text-red-500 transition-colors">
                  Chặn người dùng
                </p>
                <p className="text-[11px] text-text-muted">
                  Ngừng nhận tin từ người này
                </p>
              </div>
            </button>
          )}
          {conv.isGroup && (
            <button
              onClick={() => setConfirm("leave")}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-orange-50 transition-colors group w-full text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-surface-100 group-hover:bg-orange-100 flex items-center justify-center transition-colors shrink-0">
                <LogOut
                  size={13}
                  className="text-text-muted group-hover:text-orange-500 transition-colors"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-text-secondary group-hover:text-orange-500 transition-colors">
                  Rời nhóm
                </p>
                <p className="text-[11px] text-text-muted">
                  Bạn sẽ không nhận tin nhắn nữa
                </p>
              </div>
            </button>
          )}
          <button
            onClick={() => setConfirm("report")}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors group w-full text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-surface-100 group-hover:bg-red-100 flex items-center justify-center transition-colors shrink-0">
              <Flag
                size={13}
                className="text-text-muted group-hover:text-red-500 transition-colors"
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-secondary group-hover:text-red-500 transition-colors">
                Báo cáo
              </p>
              <p className="text-[11px] text-text-muted">
                Gửi phản ánh đến quản trị viên
              </p>
            </div>
          </button>
        </div>
      </div>

      {mediaModalTab && (
        <MediaModal
          tab={mediaModalTab}
          media={mediaAttachments}
          docs={docAttachments}
          initialIndex={mediaModalIndex}
          onClose={() => {
            setMediaModalTab(null);
            setMediaModalIndex(undefined);
          }}
        />
      )}
      {membersOpen && <MembersModal onClose={() => setMembersOpen(false)} />}

      {confirm && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[70]"
            onClick={() => setConfirm(null)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] bg-white rounded-2xl shadow-2xl z-[70] p-6">
            <p className="text-sm font-bold text-text-primary mb-1">
              {confirm === "block"
                ? "Chặn người dùng?"
                : confirm === "leave"
                  ? "Rời nhóm?"
                  : "Báo cáo?"}
            </p>
            <p className="text-xs text-text-muted mb-5">
              {confirm === "block"
                ? `Bạn sẽ không nhận được tin nhắn từ ${conv.name} nữa.`
                : confirm === "leave"
                  ? `Bạn sẽ rời ${conv.name}. Cần được mời lại để tham gia tiếp.`
                  : "Mô tả vấn đề sẽ giúp chúng tôi xử lý nhanh hơn."}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 py-2 rounded-xl border border-surface-200 text-xs font-semibold text-text-secondary hover:bg-surface-50 transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={() => setConfirm(null)}
                className={clsx(
                  "flex-1 py-2 rounded-xl text-xs font-semibold text-white transition-colors",
                  confirm === "leave"
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-red-500 hover:bg-red-600",
                )}
              >
                {confirm === "block"
                  ? "Chặn"
                  : confirm === "leave"
                    ? "Rời nhóm"
                    : "Báo cáo"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
