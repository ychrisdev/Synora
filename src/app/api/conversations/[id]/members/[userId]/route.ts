import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string; userId: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const requesterId = session.user.id;
  const { id: conversationId, userId: targetUserId } = await params;

  const requester = await prisma.conversationMember.findUnique({
    where: { conversationId_userId: { conversationId, userId: requesterId } },
  });
  if (!requester)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!requester.isLeader)
    return NextResponse.json(
      { error: "Chỉ trưởng nhóm mới có thể xóa thành viên" },
      { status: 403 },
    );
  if (targetUserId === requesterId)
    return NextResponse.json(
      { error: "Không thể tự xóa mình, hãy dùng chức năng rời nhóm" },
      { status: 400 },
    );

  const target = await prisma.conversationMember.findUnique({
    where: { conversationId_userId: { conversationId, userId: targetUserId } },
  });
  if (!target)
    return NextResponse.json(
      { error: "Thành viên không tồn tại trong nhóm" },
      { status: 404 },
    );

  const [actor, targetUser] = await Promise.all([
    prisma.user.findUnique({
      where: { id: requesterId },
      select: { username: true, profile: { select: { displayName: true } } },
    }),
    prisma.user.findUnique({
      where: { id: targetUserId },
      select: { username: true, profile: { select: { displayName: true } } },
    }),
  ]);
  const actorName =
    actor?.profile?.displayName ?? actor?.username ?? "Trưởng nhóm";
  const targetName =
    targetUser?.profile?.displayName ?? targetUser?.username ?? "Thành viên";

  await prisma.$transaction([
    prisma.conversationMember.delete({
      where: {
        conversationId_userId: { conversationId, userId: targetUserId },
      },
    }),
    prisma.message.create({
      data: {
        conversationId,
        senderId: requesterId,
        content: `${actorName} đã xóa ${targetName} khỏi nhóm`,
        status: "SENT",
        isSystemMessage: true,
      },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    }),
  ]);

  return NextResponse.json({ removed: true });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const requesterId = session.user.id;
  const { id: conversationId, userId: targetUserId } = await params;

  const body = await req.json();
  const { action } = body as { action?: "transfer_leader" };
  if (action !== "transfer_leader")
    return NextResponse.json(
      { error: "Hành động không hợp lệ" },
      { status: 400 },
    );

  const requester = await prisma.conversationMember.findUnique({
    where: { conversationId_userId: { conversationId, userId: requesterId } },
  });
  if (!requester)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!requester.isLeader)
    return NextResponse.json(
      { error: "Chỉ trưởng nhóm mới có thể chuyển quyền" },
      { status: 403 },
    );
  if (targetUserId === requesterId)
    return NextResponse.json(
      { error: "Bạn đã là trưởng nhóm" },
      { status: 400 },
    );

  const target = await prisma.conversationMember.findUnique({
    where: { conversationId_userId: { conversationId, userId: targetUserId } },
  });
  if (!target)
    return NextResponse.json(
      { error: "Thành viên không tồn tại trong nhóm" },
      { status: 404 },
    );

  const [actor, targetUser] = await Promise.all([
    prisma.user.findUnique({
      where: { id: requesterId },
      select: { username: true, profile: { select: { displayName: true } } },
    }),
    prisma.user.findUnique({
      where: { id: targetUserId },
      select: { username: true, profile: { select: { displayName: true } } },
    }),
  ]);
  const actorName =
    actor?.profile?.displayName ?? actor?.username ?? "Trưởng nhóm";
  const targetName =
    targetUser?.profile?.displayName ?? targetUser?.username ?? "Thành viên";

  await prisma.$transaction([
    prisma.conversationMember.update({
      where: { conversationId_userId: { conversationId, userId: requesterId } },
      data: { isLeader: false },
    }),
    prisma.conversationMember.update({
      where: {
        conversationId_userId: { conversationId, userId: targetUserId },
      },
      data: { isLeader: true },
    }),
    prisma.message.create({
      data: {
        conversationId,
        senderId: requesterId,
        content: `${actorName} đã chuyển quyền trưởng nhóm cho ${targetName}`,
        status: "SENT",
        isSystemMessage: true,
      },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    }),
  ]);

  return NextResponse.json({ transferred: true });
}
