import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const take = Math.min(parseInt(searchParams.get("take") ?? "5", 10), 50);

  const friendIds: string[] = [];
  if (session?.user?.id) {
    const accepted = await prisma.friendRequest.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ senderId: session.user.id }, { receiverId: session.user.id }],
      },
      select: { senderId: true, receiverId: true },
    });
    for (const r of accepted) {
      friendIds.push(
        r.senderId === session.user.id ? r.receiverId : r.senderId,
      );
    }
  }

  const visibilityFilter = session?.user?.id
    ? {
        OR: [
          { post: { visibility: "PUBLIC" as const } },
          { post: { authorId: session.user.id } },
          {
            post: {
              visibility: "FRIENDS_ONLY" as const,
              authorId: { in: friendIds },
            },
          },
        ],
      }
    : { post: { visibility: "PUBLIC" as const } };

  const tags = await prisma.tag.findMany({
    where: {
      posts: { some: visibilityFilter },
    },
    take,
    orderBy: { posts: { _count: "desc" } },
    include: { _count: { select: { posts: true } } },
  });

  const tagsWithCorrectCount = await Promise.all(
    tags.map(async (tag) => {
      const count = await prisma.tagsOnPosts.count({
        where: {
          tagId: tag.id,
          ...visibilityFilter,
        },
      });
      return { ...tag, _count: { posts: count } };
    }),
  );

  return NextResponse.json(tagsWithCorrectCount);
}
