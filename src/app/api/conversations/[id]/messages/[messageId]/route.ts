import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string; messageId: string }> };

const RECALL_WINDOW_MS = 24 * 60 * 60 * 1000;

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
    return NextResponse.json({ error: "Message not found" }, { status: 404 });

  if (message.senderId !== userId)
    return NextResponse.json(
      { error: "Bạn chỉ có thể thu hồi tin nhắn của mình" },
      { status: 403 },
    );

  if (message.deletedAt)
    return NextResponse.json(
      { error: "Tin nhắn đã được thu hồi trước đó" },
      { status: 400 },
    );

  const elapsed = Date.now() - message.createdAt.getTime();
  if (elapsed > RECALL_WINDOW_MS)
    return NextResponse.json(
      { error: "Đã quá 24 giờ, không thể thu hồi tin nhắn này" },
      { status: 400 },
    );

  const updated = await prisma.message.update({
    where: { id: messageId },
    data: { deletedAt: new Date() },
    select: { id: true, deletedAt: true },
  });

  return NextResponse.json(updated);
}
