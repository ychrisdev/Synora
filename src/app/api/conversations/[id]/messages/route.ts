import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
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

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const limit = Math.min(Number(searchParams.get("limit") ?? 30), 50);

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      content: true,
      fileUrl: true,
      fileType: true,
      status: true,
      createdAt: true,
      deletedAt: true,
      senderId: true,
      sender: {
        select: {
          id: true,
          username: true,
          profile: { select: { displayName: true, avatarUrl: true } },
        },
      },
      replyToId: true,
      replyTo: {
        select: {
          id: true,
          content: true,
          senderId: true,
          sender: {
            select: {
              profile: { select: { displayName: true } },
              username: true,
            },
          },
        },
      },
      reactions: {
        select: {
          id: true,
          emoji: true,
          userId: true,
          user: {
            select: {
              username: true,
              profile: { select: { displayName: true, avatarUrl: true } },
            },
          },
        },
        orderBy: { createdAt: "asc" as const },
      },
    },
  });

  const hasMore = messages.length > limit;
  if (hasMore) messages.pop();

  messages.reverse();

  await prisma.conversationMember.update({
    where: { conversationId_userId: { conversationId, userId } },
    data: { lastReadAt: new Date() },
  });

  const nextCursor = hasMore ? messages[0]?.id : null;

  return NextResponse.json({ messages, nextCursor });
}

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

  const body = await req.json();
  const { content, fileUrl, fileType, replyToId } = body as {
    content?: string;
    fileUrl?: string;
    fileType?: string;
    replyToId?: string;
  };

  if (!content?.trim() && !fileUrl)
    return NextResponse.json(
      { error: "Tin nhắn không được rỗng" },
      { status: 400 },
    );

  const [message] = await prisma.$transaction([
    prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        content: content?.trim() ?? null,
        fileUrl: fileUrl ?? null,
        fileType: fileType ?? null,
        replyToId: replyToId ?? null,
        status: "SENT",
      },
      select: {
        id: true,
        content: true,
        fileUrl: true,
        fileType: true,
        status: true,
        createdAt: true,
        deletedAt: true,
        senderId: true,
        sender: {
          select: {
            id: true,
            username: true,
            profile: { select: { displayName: true, avatarUrl: true } },
          },
        },
        replyToId: true,
        replyTo: {
          select: {
            id: true,
            content: true,
            senderId: true,
            sender: {
              select: {
                profile: { select: { displayName: true } },
                username: true,
              },
            },
          },
        },
        reactions: {
          select: {
            id: true,
            emoji: true,
            userId: true,
            user: {
              select: {
                username: true,
                profile: { select: { displayName: true, avatarUrl: true } },
              },
            },
          },
          orderBy: { createdAt: "asc" as const },
        },
      },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    }),
  ]);

  return NextResponse.json(message, { status: 201 });
}
