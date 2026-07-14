import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const blocks = await prisma.block.findMany({
    where: { blockerId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      createdAt: true,
      blocked: {
        select: {
          id: true,
          username: true,
          profile: { select: { displayName: true, avatarUrl: true } },
        },
      },
    },
  });

  const result = blocks.map((b) => ({
    id: b.blocked.id,
    name: b.blocked.profile?.displayName ?? b.blocked.username,
    username: b.blocked.username,
    avatarUrl: b.blocked.profile?.avatarUrl ?? null,
    blockedAt: b.createdAt.toISOString(),
  }));

  return NextResponse.json(result);
}