import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  try {
    const likesInclude = session?.user?.id
      ? { where: { userId: session.user.id }, select: { id: true } }
      : undefined;

    const comments = await prisma.comment.findMany({
      where: {
        postId: id,
        parentId: null,
        OR: [
          { hidden: false },
          { hidden: true, hiddenByAuthor: session?.user?.id ?? "" },
          { authorId: session?.user?.id ?? "" },
        ],
      },
      orderBy: { createdAt: "asc" },
      include: {
        author: { include: { profile: true } },
        replies: {
          where: {
        OR: [
          { hidden: false },
          { hidden: true, hiddenByAuthor: session?.user?.id ?? "" },
          { authorId: session?.user?.id ?? "" },
        ],
      },
          include: {
            author: { include: { profile: true } },
            _count: { select: { likes: true } },
            ...(likesInclude && { likes: likesInclude }),
          },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { likes: true } },
        ...(likesInclude && { likes: likesInclude }),
      },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Comments error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const {
      content,
      parentId,
      imageUrl,
      videoUrl,
      fileUrl,
      fileName,
      fileSize,
      fileType,
    } = await req.json();

    const comment = await prisma.comment.create({
      data: {
        content: content ?? "",
        postId: id,
        authorId: session.user.id,
        parentId: parentId ?? null,
        imageUrl: imageUrl ?? null,
        videoUrl: videoUrl ?? null,
        fileUrl: fileUrl ?? null,
        fileName: fileName ?? null,
        fileSize: fileSize ?? null,
        fileType: fileType ?? null,
      },
      include: {
        author: { include: { profile: true } },
      },
    });

    await prisma.post.update({
      where: { id },
      data: { commentCount: { increment: 1 } },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
