import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { utapi } from "@/lib/uploadthing-server";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
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

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { isGroup: true, avatarKey: true },
  });
  if (!conversation)
    return NextResponse.json({ error: "Không tồn tại" }, { status: 404 });

  if (conversation.isGroup && !membership.isLeader)
    return NextResponse.json(
      { error: "Chỉ trưởng nhóm mới có thể đổi thông tin nhóm" },
      { status: 403 },
    );

  const body = await req.json();
  const { avatarUrl, avatarKey, name } = body as {
    avatarUrl?: string;
    avatarKey?: string;
    name?: string;
  };

  if (avatarUrl === undefined && name === undefined)
    return NextResponse.json(
      { error: "Không có dữ liệu cập nhật" },
      { status: 400 },
    );

  const actor = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true, profile: { select: { displayName: true } } },
  });
  const actorName = actor?.profile?.displayName ?? actor?.username ?? "Ai đó";

  const systemContent =
    name !== undefined
      ? `${actorName} đã đổi tên nhóm thành "${name.trim()}"`
      : `${actorName} đã đổi ảnh nhóm`;

  const now = new Date();
  const oldAvatarKey = conversation.avatarKey;

  const [updated] = await prisma.$transaction([
    prisma.conversation.update({
      where: { id: conversationId },
      data: {
        ...(avatarUrl !== undefined ? { avatarUrl } : {}),
        ...(avatarKey !== undefined ? { avatarKey } : {}),
        ...(name !== undefined ? { name: name.trim() } : {}),
        lastMessageAt: now,
      },
      select: { id: true, name: true, avatarUrl: true },
    }),
    prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        content: systemContent,
        status: "SENT",
        isSystemMessage: true,
      },
    }),
  ]);

  if (avatarUrl !== undefined && oldAvatarKey) {
    try {
      await utapi.deleteFiles([oldAvatarKey]);
    } catch (err) {
      console.error("Xóa avatar cũ trên UploadThing thất bại:", err);
    }
  }

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: Params) {
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

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
      isGroup: true,
      avatarKey: true,
      messages: {
        select: { attachments: { select: { key: true } } },
      },
    },
  });
  if (!conversation)
    return NextResponse.json(
      { error: "Không tìm thấy cuộc trò chuyện" },
      { status: 404 },
    );

  if (!conversation.isGroup) {
    await prisma.conversationMember.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { hiddenAt: new Date() },
    });
    return NextResponse.json({ hidden: true });
  }

  if (!membership.isLeader)
    return NextResponse.json(
      { error: "Chỉ trưởng nhóm mới có thể giải tán nhóm" },
      { status: 403 },
    );

  const attachmentKeys = conversation.messages.flatMap((m) =>
    m.attachments.map((a) => a.key),
  );
  const allKeys = [
    ...attachmentKeys,
    ...(conversation.avatarKey ? [conversation.avatarKey] : []),
  ];

  await prisma.conversation.delete({ where: { id: conversationId } });

  if (allKeys.length > 0) {
    try {
      await utapi.deleteFiles(allKeys);
    } catch (err) {
      console.error(
        "Xóa file trên UploadThing khi giải tán nhóm thất bại:",
        err,
      );
    }
  }

  return NextResponse.json({ disbanded: true });
}
