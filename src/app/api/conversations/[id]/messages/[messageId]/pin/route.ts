import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string; messageId: string }> };

const MAX_PINNED = 3;

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const { id: conversationId, messageId } = await params;

  const membership = await prisma.conversationMember.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  if (!membership)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const message = await prisma.message.findFirst({
    where: { id: messageId, conversationId },
  });
  if (!message)
    return NextResponse.json(
      { error: "Tin nhắn không tồn tại" },
      { status: 404 },
    );
  if (message.deletedAt)
    return NextResponse.json(
      { error: "Không thể ghim tin nhắn đã bị thu hồi" },
      { status: 400 },
    );
  if (message.pinnedAt)
    return NextResponse.json(
      { error: "Tin nhắn này đã được ghim" },
      { status: 400 },
    );

  const pinnedCount = await prisma.message.count({
    where: { conversationId, pinnedAt: { not: null } },
  });
  if (pinnedCount >= MAX_PINNED)
    return NextResponse.json(
      {
        error: `Đã đạt giới hạn ${MAX_PINNED} tin nhắn ghim. Hãy bỏ ghim tin khác trước.`,
      },
      { status: 400 },
    );

  const updated = await prisma.message.update({
    where: { id: messageId },
    data: { pinnedAt: new Date(), pinnedById: userId },
    select: {
      id: true,
      pinnedAt: true,
      pinnedBy: {
        select: { profile: { select: { displayName: true } }, username: true },
      },
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const { id: conversationId, messageId } = await params;

  const membership = await prisma.conversationMember.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  if (!membership)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const message = await prisma.message.findFirst({
    where: { id: messageId, conversationId },
  });
  if (!message)
    return NextResponse.json(
      { error: "Tin nhắn không tồn tại" },
      { status: 404 },
    );

  await prisma.message.update({
    where: { id: messageId },
    data: { pinnedAt: null, pinnedById: null },
  });

  return NextResponse.json({ id: messageId, unpinned: true });
}
