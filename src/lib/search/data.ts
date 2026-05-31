import { Search, BookOpen, MessageSquare, UserCircle, Users, Hash } from "lucide-react";
import type { TabKey, ResultType } from "./types";

export const TAB_CONFIG: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "all",       label: "Tất cả",       icon: Search },
  { key: "documents", label: "Tài liệu",     icon: BookOpen },
  { key: "posts",     label: "Bài viết",     icon: MessageSquare },
  { key: "people",    label: "Mọi người",    icon: UserCircle },
  { key: "groups",    label: "Nhóm học tập", icon: Users },
  { key: "topics",    label: "Chủ đề",       icon: Hash },
];

export const TYPE_TO_TAB: Record<ResultType, TabKey> = {
  document: "documents",
  post:     "posts",
  person:   "people",
  group:    "groups",
  topic:    "topics",
};

export const SECTION_LABELS: Record<ResultType, string> = {
  document: "Tài liệu",
  post:     "Bài viết",
  person:   "Mọi người",
  group:    "Nhóm học tập",
  topic:    "Chủ đề",
};

export const RESULT_SECTION_ORDER: ResultType[] = [
  "document", "post", "person", "group", "topic",
];