import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { commentId } = await params;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true, postId: true, hidden: true },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Không tìm thấy bình luận" },
        { status: 404 },
      );
    }

    if (comment.hidden) {
      return NextResponse.json(
        { error: "Bình luận đã bị ẩn" },
        { status: 403 },
      );
    }

    const existing = await prisma.like.findUnique({
      where: {
        userId_commentId: { userId: session.user.id, commentId },
      },
    });

    if (existing) {
      await prisma.like.delete({
        where: {
          userId_commentId: { userId: session.user.id, commentId },
        },
      });
      return NextResponse.json({ liked: false });
    } else {
      await prisma.like.create({
        data: { userId: session.user.id, commentId },
      });
      if (comment.authorId !== session.user.id) {
        await prisma.notification.create({
          data: {
            recipientId: comment.authorId,
            actorId: session.user.id,
            type: "LIKE",
            postId: comment.postId,
            commentId,
          },
        });
      }
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Like comment error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
