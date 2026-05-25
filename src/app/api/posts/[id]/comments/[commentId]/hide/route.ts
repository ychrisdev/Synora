import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id, commentId } = await params;

  const post = await prisma.post.findUnique({ where: { id } });
  if (post?.authorId !== session.user.id)
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { _count: { select: { replies: true } } },
  });
  if (!comment) return Response.json({ error: "Not found" }, { status: 404 });

  const newHidden = !comment.hidden;

  await prisma.$transaction([
    prisma.comment.update({
      where: { id: commentId },
      data: {
        hidden: newHidden,
        hiddenByAuthor: newHidden ? session.user.id : null,
      },
    }),
    prisma.comment.updateMany({
      where: { parentId: commentId },
      data: {
        hidden: newHidden,
        hiddenByAuthor: newHidden ? session.user.id : null,
      },
    }),
  ]);

  return Response.json({
    ok: true,
    hidden: newHidden,
    replyCount: comment._count.replies,
  });
}
