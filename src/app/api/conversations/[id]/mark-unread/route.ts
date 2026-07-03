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

  const membership = await prisma.conversationMember.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  if (!membership)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const markAsRead = body?.read === true;

  await prisma.conversationMember.update({
    where: { conversationId_userId: { conversationId, userId } },
    data: markAsRead
      ? { lastReadAt: new Date(), markedUnreadAt: null }
      : { markedUnreadAt: new Date() },
  });

  return NextResponse.json({ ok: true, read: markAsRead });
}
