// src/lib/feed/types.ts

export interface PostAuthor {
  name: string;
  initials: string;
  color: string;
  role: string;
  username?: string;
  avatarUrl?: string | null;
}

export interface Post {
  id: number | string;
  authorId: string;
  author: PostAuthor;
  time: string;
  content: string;
  images?: string[];
  mediaTypes?: string[];
  mediaDocIds?: string[];
  visibility?: "PUBLIC" | "FRIENDS_ONLY" | "PRIVATE";
  tags: string[];
  attachment?: Attachment;
  attachments?: Attachment[];
  likes: number;
  isLikedByMe?: boolean;
  comments: number;
  editedAt?: string | null;
}

export interface Attachment {
  name: string;
  size: string;
  type: string;
  url?: string;
  docId?: string;
}

export interface AttachedFile {
  name: string;
  size: string;
  type: string;
  dataUrl?: string;
  isImage: boolean;
  isVideo?: boolean;
  previewUrl?: string;
}

export interface Comment {
  id: string;
  authorId: string;
  author: {
    name: string;
    initials: string;
    color: string;
    avatarUrl?: string | null;
    username?: string;
  };
  time: string;
  content: string;
  editedAt?: string | null;
  imageUrl?: string;
  videoUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  likes: number;
  liked: boolean;
  replies: Reply[];
  showReplyInput: boolean;
  hidden?: boolean;
  hiddenByAuthor?: string | null;
}

export interface Reply {
  id: string;
  authorId: string;
  author: {
    name: string;
    initials: string;
    color: string;
    avatarUrl?: string | null;
    username?: string;
  };
  time: string;
  content: string;
  replyTo?: string;
  likes: number;
  liked: boolean;
  hidden?: boolean;
}

export interface CommentPayload {
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
}

export type CommentSort = "default" | "newest" | "oldest";
export type CommentRole = "own" | "hidden-own" | "post-author" | "viewer";
export type EditVisibility = "PUBLIC" | "FRIENDS_ONLY" | "PRIVATE";