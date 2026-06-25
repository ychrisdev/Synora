import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const { id: conversationId } = await params;

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { isGroup: true },
  });
  if (!conversation)
    return NextResponse.json({ error: "Không tìm thấy nhóm" }, { status: 404 });
  if (!conversation.isGroup)
    return NextResponse.json(
      { error: "Không thể rời một cuộc trò chuyện riêng tư" },
      { status: 400 },
    );

  const membership = await prisma.conversationMember.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  if (!membership)
    return NextResponse.json(
      { error: "Bạn không phải thành viên của nhóm này" },
      { status: 403 },
    );

  const memberCount = await prisma.conversationMember.count({
    where: { conversationId },
  });

  const actor = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true, profile: { select: { displayName: true } } },
  });
  const actorName = actor?.profile?.displayName ?? actor?.username ?? "Một thành viên";

  const body = await req.json().catch(() => ({}));
  const { transferToUserId } = body as { transferToUserId?: string };

  if (membership.isLeader) {
    if (memberCount <= 1) {
      return NextResponse.json(
        {
          error:
            "Bạn là thành viên cuối cùng của nhóm. Hãy giải tán nhóm thay vì rời nhóm.",
        },
        { status: 400 },
      );
    }

    if (!transferToUserId) {
      return NextResponse.json(
        {
          error:
            "Bạn cần chuyển quyền trưởng nhóm cho người khác trước khi rời nhóm.",
        },
        { status: 400 },
      );
    }

    if (transferToUserId === userId) {
      return NextResponse.json(
        { error: "Không thể chuyển quyền cho chính mình" },
        { status: 400 },
      );
    }

    const successor = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: { conversationId, userId: transferToUserId },
      },
      include: {
        user: {
          select: { username: true, profile: { select: { displayName: true } } },
        },
      },
    });
    if (!successor)
      return NextResponse.json(
        { error: "Không tìm thấy thành viên để chuyển quyền" },
        { status: 404 },
      );

    const successorName =
      successor.user.profile?.displayName ?? successor.user.username;

    await prisma.$transaction([
      prisma.conversationMember.update({
        where: {
          conversationId_userId: { conversationId, userId: transferToUserId },
        },
        data: { isLeader: true },
      }),
      prisma.conversationMember.delete({
        where: { conversationId_userId: { conversationId, userId } },
      }),
      prisma.message.create({
        data: {
          conversationId,
          senderId: userId,
          content: `${actorName} đã chuyển quyền trưởng nhóm cho ${successorName} và rời nhóm`,
          status: "SENT",
          isSystemMessage: true,
        },
      }),
      prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() },
      }),
    ]);

    return NextResponse.json({ left: true, newLeaderId: transferToUserId });
  }

  await prisma.$transaction([
    prisma.conversationMember.delete({
      where: { conversationId_userId: { conversationId, userId } },
    }),
    prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        content: `${actorName} đã rời nhóm`,
        status: "SENT",
        isSystemMessage: true,
      },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    }),
  ]);

  return NextResponse.json({ left: true });
}