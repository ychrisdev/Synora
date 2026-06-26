import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { utapi } from "@/lib/uploadthing-server";

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
    select: {
      id: true,
      senderId: true,
      deletedAt: true,
      createdAt: true,
      attachments: { select: { key: true } },
    },
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

  const attachmentKeys = message.attachments.map((a) => a.key);

  const [updated] = await prisma.$transaction([
    prisma.message.update({
      where: { id: messageId },
      data: { deletedAt: new Date() },
      select: { id: true, deletedAt: true },
    }),
    prisma.messageAttachment.deleteMany({
      where: { messageId },
    }),
  ]);

  if (attachmentKeys.length > 0) {
    try {
      await utapi.deleteFiles(attachmentKeys);
    } catch (err) {
      console.error(
        "Xóa file đính kèm thu hồi tin nhắn thất bại:",
        err,
      );
    }
  }

  return NextResponse.json(updated);
}
