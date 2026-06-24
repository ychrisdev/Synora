import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    select: { isGroup: true },
  });
  if (!conversation)
    return NextResponse.json({ error: "Không tồn tại" }, { status: 404 });

  if (conversation.isGroup && !membership.isLeader)
    return NextResponse.json(
      { error: "Chỉ trưởng nhóm mới có thể đổi thông tin nhóm" },
      { status: 403 },
    );

  const body = await req.json();
  const { avatarUrl, name } = body as { avatarUrl?: string; name?: string };

  const updated = await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      ...(avatarUrl !== undefined ? { avatarUrl } : {}),
      ...(name !== undefined ? { name: name.trim() } : {}),
    },
    select: { id: true, name: true, avatarUrl: true },
  });

  return NextResponse.json(updated);
}
