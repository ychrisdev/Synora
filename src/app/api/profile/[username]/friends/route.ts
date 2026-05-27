import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const session = await getServerSession(authOptions);

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
    }

    const followers = await prisma.follow.findMany({
      where: { followingId: user.id },
      take: 6,
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            profile: { select: { displayName: true, avatarUrl: true } },
            _count: { select: { followers: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const followerIds = followers.map((f) => f.follower.id);
    let followingBack: string[] = [];
    if (session?.user?.id) {
      const follows = await prisma.follow.findMany({
        where: {
          followerId: session.user.id,
          followingId: { in: followerIds },
        },
        select: { followingId: true },
      });
      followingBack = follows.map((f) => f.followingId);
    }

    const result = followers.map((f) => ({
      id: f.follower.id,
      username: f.follower.username,
      displayName:
        f.follower.profile?.displayName ?? f.follower.username,
      avatarUrl: f.follower.profile?.avatarUrl ?? null,
      followerCount: f.follower._count.followers,
      isFollowingBack: followingBack.includes(f.follower.id),
    }));

    return NextResponse.json({ friends: result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}