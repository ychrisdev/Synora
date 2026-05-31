import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  let followingIds: string[] = [];
  if (session?.user?.id) {
    const following = await prisma.follow.findMany({
      where: { followerId: session.user.id },
      select: { followingId: true },
    });
    followingIds = following.map((f) => f.followingId);
  }

  const excludeIds = session?.user?.id
    ? [session.user.id, ...followingIds]
    : [];

  const users = await prisma.user.findMany({
    where: {
      id: { notIn: excludeIds.length > 0 ? excludeIds : undefined },
      profile: { isNot: null },
    },
    take: 5,
    orderBy: { followers: { _count: "desc" } },
    select: {
      id: true,
      username: true,
      profile: {
        select: { displayName: true, avatarUrl: true, major: true, school: true },
      },
      _count: { select: { followers: true } },
    },
  });

  const result = users.map((u) => ({
    id: u.id,
    username: u.username,
    displayName: u.profile?.displayName ?? u.username,
    avatarUrl: u.profile?.avatarUrl ?? null,
    role: [u.profile?.major, u.profile?.school].filter(Boolean).join(" · ") || "Thành viên",
    followerCount: u._count.followers,
  }));

  return NextResponse.json(result);
}