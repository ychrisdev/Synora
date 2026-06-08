import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    let excludeIds: string[] = [];
    if (session?.user?.id) {
      const sentRequests = await prisma.friendRequest.findMany({
        where: {
          senderId: session.user.id,
          status: { in: ["PENDING", "ACCEPTED"] },
        },
        select: { receiverId: true },
      });
      excludeIds = [session.user.id, ...sentRequests.map((r) => r.receiverId)];
    }

    const users = await prisma.user.findMany({
      where: {
        ...(excludeIds.length > 0 && { id: { notIn: excludeIds } }),
        profile: { isNot: null },
      },
      take: 10,
      select: {
        id: true,
        username: true,
        profile: {
          select: {
            displayName: true,
            avatarUrl: true,
            major: true,
            school: true,
          },
        },
      },
    });

    const pendingCounts = await prisma.friendRequest.groupBy({
      by: ["receiverId"],
      where: {
        receiverId: { in: users.map((u) => u.id) },
        status: "PENDING",
      },
      _count: { receiverId: true },
    });

    const pendingMap = Object.fromEntries(
      pendingCounts.map((p) => [p.receiverId, p._count.receiverId]),
    );

    const result = users
      .map((u) => ({
        id: u.id,
        username: u.username,
        displayName: u.profile?.displayName ?? u.username,
        avatarUrl: u.profile?.avatarUrl ?? null,
        role:
          [u.profile?.major, u.profile?.school].filter(Boolean).join(" · ") ||
          "",
        followerCount: pendingMap[u.id] ?? 0,
      }))
      .sort((a, b) => b.followerCount - a.followerCount)
      .slice(0, 5);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[/api/users/suggested]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
