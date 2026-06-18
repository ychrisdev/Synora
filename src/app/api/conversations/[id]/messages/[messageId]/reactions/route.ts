import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string; messageId: string }> };

const REACTION_SELECT = {
  id: true,
  emoji: true,
  userId: true,
  user: {
    select: {
      username: true,
      profile: { select: { displayName: true, avatarUrl: true } },
    },
  },
} as const;

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
    return NextResponse.json({ error: "Message not found" }, { status: 404 });

  const body = await req.json();
  const { emoji } = body as { emoji: string };
  if (!emoji?.trim())
    return NextResponse.json({ error: "Emoji is required" }, { status: 400 });

  const existingAny = await prisma.messageReaction.findFirst({
    where: { messageId, userId },
  });

  if (existingAny) {
    if (existingAny.emoji === emoji) {
      await prisma.messageReaction.delete({ where: { id: existingAny.id } });
    } else {
      await prisma.$transaction([
        prisma.messageReaction.delete({ where: { id: existingAny.id } }),
        prisma.messageReaction.create({
          data: { messageId, userId, emoji },
        }),
      ]);
    }
  } else {
    await prisma.messageReaction.create({
      data: { messageId, userId, emoji },
    });
  }

  const reactions = await prisma.messageReaction.findMany({
    where: { messageId },
    select: REACTION_SELECT,
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ reactions });
}

export async function GET(req: NextRequest, { params }: Params) {
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

  const reactions = await prisma.messageReaction.findMany({
    where: { messageId },
    select: REACTION_SELECT,
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ reactions });
}
