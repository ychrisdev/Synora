import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const tags = await prisma.tag.findMany({
    where: {
      posts: { some: {} },
    },
    take: 5,
    orderBy: { posts: { _count: "desc" } },
    include: { _count: { select: { posts: true } } },
  });
  return NextResponse.json(tags);
}