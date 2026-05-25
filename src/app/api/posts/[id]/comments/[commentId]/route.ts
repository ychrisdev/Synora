import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id: postId, commentId } = await params;

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { _count: { select: { replies: true } } },
  });
  if (!comment) return Response.json({ error: "Not found" }, { status: 404 });

  const post = await prisma.post.findUnique({ where: { id: postId } });
  const isOwner = comment.authorId === session.user.id;
  const isPostAuthor = post?.authorId === session.user.id;
  if (!isOwner && !isPostAuthor)
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const replyCount = comment._count.replies;
  const isTopLevel = comment.parentId === null;

  await prisma.$transaction(async (tx) => {
    await tx.comment.delete({ where: { id: commentId } });
    if (isTopLevel) {
      await tx.post.update({
        where: { id: postId },
        data: { commentCount: { decrement: 1 + replyCount } },
      });
    }
  });

  return Response.json({ ok: true, replyCount });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id, commentId } = await params;

  const { content } = await req.json();
  if (!content?.trim())
    return Response.json({ error: "Content required" }, { status: 400 });

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });
  if (!comment) return Response.json({ error: "Not found" }, { status: 404 });
  if (comment.authorId !== session.user.id)
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const updated = await prisma.comment.update({
    where: { id: commentId },
    data: { content: content.trim(), editedAt: new Date() },
  });
  return Response.json(updated);
}
