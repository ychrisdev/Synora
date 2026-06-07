import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  if (!user)
    return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });

  const acceptedRequests = await prisma.friendRequest.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ senderId: user.id }, { receiverId: user.id }],
    },
    orderBy: { updatedAt: "desc" },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          profile: { select: { displayName: true, avatarUrl: true } },
          _count: { select: { followers: true } },
        },
      },
      receiver: {
        select: {
          id: true,
          username: true,
          profile: { select: { displayName: true, avatarUrl: true } },
          _count: { select: { followers: true } },
        },
      },
    },
  });

  const seenIds = new Set<string>();
  const friends: object[] = [];
  for (const r of acceptedRequests) {
    const friend = r.senderId === user.id ? r.receiver : r.sender;
    if (seenIds.has(friend.id)) continue;
    seenIds.add(friend.id);
    friends.push({
      id: friend.id,
      username: friend.username,
      displayName: friend.profile?.displayName ?? friend.username,
      avatarUrl: friend.profile?.avatarUrl ?? null,
      followerCount: friend._count.followers,
      isFriend: true,
    });
  }

  let pendingSent: object[] = [];
  let suggestions: object[] = [];

  if (session?.user?.id === user.id) {
    const sent = await prisma.friendRequest.findMany({
      where: { senderId: user.id, status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: {
        receiver: {
          select: {
            id: true,
            username: true,
            profile: { select: { displayName: true, avatarUrl: true } },
            _count: { select: { followers: true } },
          },
        },
      },
    });

    const seenPendingIds = new Set<string>();
    pendingSent = sent
      .filter((r) => {
        if (seenPendingIds.has(r.receiver.id)) return false;
        seenPendingIds.add(r.receiver.id);
        return true;
      })
      .map((r) => ({
        id: r.receiver.id,
        username: r.receiver.username,
        displayName: r.receiver.profile?.displayName ?? r.receiver.username,
        avatarUrl: r.receiver.profile?.avatarUrl ?? null,
        followerCount: r.receiver._count.followers,
      }));

    const friendIds = (friends as any[]).map((f) => f.id);
    const pendingIds = (pendingSent as any[]).map((s) => s.id);
    const excludeIds = [user.id, ...friendIds, ...pendingIds];

    const suggestUsers = await prisma.user.findMany({
      where: {
        id: { notIn: excludeIds },
        profile: { isNot: null },
      },
      take: 6,
      orderBy: { followers: { _count: "desc" } },
      select: {
        id: true,
        username: true,
        profile: { select: { displayName: true, avatarUrl: true } },
        _count: { select: { followers: true } },
      },
    });
    suggestions = suggestUsers.map((u) => ({
      id: u.id,
      username: u.username,
      displayName: u.profile?.displayName ?? u.username,
      avatarUrl: u.profile?.avatarUrl ?? null,
      followerCount: u._count.followers,
    }));
  }

  return NextResponse.json({ friends, pendingSent, suggestions });
}
