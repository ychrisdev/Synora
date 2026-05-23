import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { id: postId } = await params;

  try {
    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId: session.user.id, postId } },
    });

    if (existing) {
      await prisma.like.delete({
        where: { userId_postId: { userId: session.user.id, postId } },
      });
      await prisma.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
      });
      return NextResponse.json({ liked: false });
    } else {
      await prisma.like.create({
        data: { userId: session.user.id, postId },
      });
      await prisma.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
      });
      return NextResponse.json({ liked: true });
    }
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}