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
  if (!session?.user?.id)
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  if (!user || user.id !== session.user.id)
    return NextResponse.json({ error: "Không có quyền" }, { status: 403 });

  const received = await prisma.friendRequest.findMany({
    where: { receiverId: user.id, status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          profile: { select: { displayName: true, avatarUrl: true } },
          _count: { select: { followers: true } },
        },
      },
    },
  });

  const requests = received.map((r) => ({
    id: r.id,
    senderId: r.sender.id,
    username: r.sender.username,
    displayName: r.sender.profile?.displayName ?? r.sender.username,
    avatarUrl: r.sender.profile?.avatarUrl ?? null,
    followerCount: r.sender._count.followers,
    createdAt: r.createdAt,
  }));

  return NextResponse.json({ requests });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  if (!user || user.id !== session.user.id)
    return NextResponse.json({ error: "Không có quyền" }, { status: 403 });

  const { requestId, action } = await req.json();
  if (!requestId || !["accept", "reject"].includes(action))
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ" },
      { status: 400 },
    );

  const request = await prisma.friendRequest.findUnique({
    where: { id: requestId },
    select: { id: true, senderId: true, receiverId: true, status: true },
  });
  if (
    !request ||
    request.receiverId !== user.id ||
    request.status !== "PENDING"
  )
    return NextResponse.json(
      { error: "Yêu cầu không hợp lệ" },
      { status: 400 },
    );

  if (action === "accept") {
    await prisma.$transaction([
      prisma.friendRequest.update({
        where: { id: requestId },
        data: { status: "ACCEPTED" },
      }),
      prisma.follow.upsert({
        where: {
          followerId_followingId: {
            followerId: request.receiverId,
            followingId: request.senderId,
          },
        },
        create: {
          followerId: request.receiverId,
          followingId: request.senderId,
        },
        update: {},
      }),
    ]);
    return NextResponse.json({ success: true, action: "accepted" });
  }

  await prisma.$transaction([
    prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: "REJECTED" },
    }),
    prisma.follow.deleteMany({
      where: { followerId: request.senderId, followingId: request.receiverId },
    }),
  ]);
  return NextResponse.json({ success: true, action: "rejected" });
}
