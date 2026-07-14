import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ userId: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const { userId: targetId } = await params;
  const userId = session.user.id;

  if (targetId === userId) {
    return NextResponse.json(
      { error: "Không thể tự chặn chính mình" },
      { status: 400 },
    );
  }

  const target = await prisma.user.findUnique({
    where: { id: targetId },
    select: { id: true },
  });
  if (!target) {
    return NextResponse.json(
      { error: "Không tìm thấy người dùng" },
      { status: 404 },
    );
  }

  await prisma.$transaction([
    prisma.block.upsert({
      where: { blockerId_blockedId: { blockerId: userId, blockedId: targetId } },
      update: {},
      create: { blockerId: userId, blockedId: targetId },
    }),
    prisma.friendRequest.deleteMany({
      where: {
        OR: [
          { senderId: userId, receiverId: targetId },
          { senderId: targetId, receiverId: userId },
        ],
      },
    }),
    prisma.follow.deleteMany({
      where: {
        OR: [
          { followerId: userId, followingId: targetId },
          { followerId: targetId, followingId: userId },
        ],
      },
    }),
  ]);

  return NextResponse.json({ blocked: true });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const { userId: targetId } = await params;
  const userId = session.user.id;

  await prisma.block.deleteMany({
    where: { blockerId: userId, blockedId: targetId },
  });

  return NextResponse.json({ blocked: false });
}