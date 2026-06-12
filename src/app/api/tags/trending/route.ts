import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const take = Math.min(parseInt(searchParams.get("take") ?? "5", 10), 50);

  const visibilityFilter = { post: { visibility: "PUBLIC" as const } };

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
