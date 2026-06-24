import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const { id: conversationId } = await params;

  const membership = await prisma.conversationMember.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  if (!membership)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const members = await prisma.conversationMember.findMany({
    where: { conversationId },
    orderBy: [{ isLeader: "desc" }, { joinedAt: "asc" }],
    select: {
      isLeader: true,
      joinedAt: true,
      user: {
        select: {
          id: true,
          username: true,
          profile: { select: { displayName: true, avatarUrl: true } },
        },
      },
    },
  });

  return NextResponse.json(members);
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const { id: conversationId } = await params;

  const requester = await prisma.conversationMember.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  if (!requester)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!requester.isLeader)
    return NextResponse.json(
      { error: "Chỉ trưởng nhóm mới có thể thêm thành viên" },
      { status: 403 },
    );

  const body = await req.json();
  const { usernames } = body as { usernames?: string[] };
  if (!usernames || usernames.length === 0)
    return NextResponse.json(
      { error: "Thiếu danh sách thành viên" },
      { status: 400 },
    );

  const users = await prisma.user.findMany({
    where: { username: { in: usernames } },
    select: { id: true },
  });
  if (users.length === 0)
    return NextResponse.json(
      { error: "Không tìm thấy người dùng" },
      { status: 404 },
    );

  const existingIds = (
    await prisma.conversationMember.findMany({
      where: { conversationId, userId: { in: users.map((u) => u.id) } },
      select: { userId: true },
    })
  ).map((m) => m.userId);

  const newUserIds = users
    .map((u) => u.id)
    .filter((id) => !existingIds.includes(id));

  if (newUserIds.length === 0)
    return NextResponse.json(
      { error: "Tất cả đã là thành viên của nhóm" },
      { status: 400 },
    );

  await prisma.conversationMember.createMany({
    data: newUserIds.map((id) => ({ conversationId, userId: id })),
  });

  return NextResponse.json({ added: newUserIds.length }, { status: 201 });
}
