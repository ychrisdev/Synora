import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }
  const userId = session.user.id;

  const memberships = await prisma.conversationMember.findMany({
    where: { userId },
    select: {
      lastReadAt: true,
      conversation: {
        select: {
          id: true,
          isGroup: true,
          name: true,
          avatarUrl: true,
          lastMessageAt: true,
          members: {
            where: { userId: { not: userId } },
            select: {
              user: {
                select: {
                  id: true,
                  username: true,
                  profile: { select: { displayName: true, avatarUrl: true } },
                },
              },
            },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              content: true,
              fileType: true,
              senderId: true,
              createdAt: true,
              deletedAt: true,
            },
          },
        },
      },
    },
    orderBy: { conversation: { lastMessageAt: "desc" } },
  });

  const result = await Promise.all(
    memberships.map(async (m) => {
      const conv = m.conversation;

      const unreadCount = await prisma.message.count({
        where: {
          conversationId: conv.id,
          senderId: { not: userId },
          deletedAt: null,
          ...(m.lastReadAt ? { createdAt: { gt: m.lastReadAt } } : {}),
        },
      });

      const other = conv.members[0]?.user;
      const name = conv.isGroup
        ? (conv.name ?? "Nhóm chat")
        : (other?.profile?.displayName ?? other?.username ?? "Người dùng");
      const avatarUrl = conv.isGroup
        ? conv.avatarUrl
        : (other?.profile?.avatarUrl ?? null);

      const lastMsg = conv.messages[0];
      const lastMessage = !lastMsg
        ? ""
        : lastMsg.deletedAt
          ? "Tin nhắn đã bị xóa"
          : (lastMsg.content ?? (lastMsg.fileType ? "Đã gửi một tệp" : ""));

      return {
        id: conv.id,
        isGroup: conv.isGroup,
        name,
        avatarUrl,
        otherUsername: conv.isGroup ? undefined : other?.username,
        lastMessage,
        lastMessageAt: conv.lastMessageAt,
        unreadCount,
      };
    }),
  );

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }
  const userId = session.user.id;

  const body = await req.json();
  const { targetUsername, isGroup, name, usernames } = body as {
    targetUsername?: string;
    isGroup?: boolean;
    name?: string;
    usernames?: string[];
  };

  if (isGroup) {
    if (!name?.trim()) {
      return NextResponse.json({ error: "Thiếu tên nhóm" }, { status: 400 });
    }
    if (!usernames || usernames.length < 2) {
      return NextResponse.json(
        { error: "Cần ít nhất 2 thành viên" },
        { status: 400 },
      );
    }

    const members = await prisma.user.findMany({
      where: { username: { in: usernames } },
      select: { id: true },
    });
    if (members.length !== usernames.length) {
      return NextResponse.json(
        { error: "Không tìm thấy một số người dùng" },
        { status: 404 },
      );
    }

    const memberIds = Array.from(
      new Set([userId, ...members.map((m) => m.id)]),
    );

    const conversation = await prisma.conversation.create({
      data: {
        isGroup: true,
        name: name.trim(),
        members: { create: memberIds.map((id) => ({ userId: id })) },
      },
      select: { id: true, isGroup: true, name: true, avatarUrl: true },
    });

    return NextResponse.json({
      id: conversation.id,
      isGroup: true,
      name: conversation.name,
      avatarUrl: conversation.avatarUrl,
    });
  }

  if (!targetUsername) {
    return NextResponse.json(
      { error: "Thiếu targetUsername" },
      { status: 400 },
    );
  }

  const target = await prisma.user.findUnique({
    where: { username: targetUsername },
    select: {
      id: true,
      username: true,
      profile: { select: { displayName: true, avatarUrl: true } },
    },
  });
  if (!target) {
    return NextResponse.json(
      { error: "Không tìm thấy người dùng" },
      { status: 404 },
    );
  }
  if (target.id === userId) {
    return NextResponse.json(
      { error: "Không thể tự chat với mình" },
      { status: 400 },
    );
  }

  const existing = await prisma.conversation.findFirst({
    where: {
      isGroup: false,
      AND: [
        { members: { some: { userId } } },
        { members: { some: { userId: target.id } } },
      ],
    },
    select: { id: true },
  });

  const conversationId =
    existing?.id ??
    (
      await prisma.conversation.create({
        data: {
          isGroup: false,
          members: { create: [{ userId }, { userId: target.id }] },
        },
        select: { id: true },
      })
    ).id;

  return NextResponse.json({
    id: conversationId,
    isGroup: false,
    name: target.profile?.displayName ?? target.username,
    avatarUrl: target.profile?.avatarUrl ?? null,
    otherUsername: target.username,
  });
}
