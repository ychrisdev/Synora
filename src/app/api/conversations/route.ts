import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildAttachmentLabel } from "@/lib/chat/utils";
import { areFriends } from "@/lib/chat/friends";

export async function GET(_req: NextRequest) {
  const { searchParams } = new URL(_req.url);
  const showArchived = searchParams.get("archived") === "true";
  const q = searchParams.get("q")?.trim().toLowerCase() || null;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }
  const userId = session.user.id;

  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      username: true,
      profile: { select: { displayName: true, avatarUrl: true } },
    },
  });

  const memberships = await prisma.conversationMember.findMany({
    where: { userId, isAccepted: true, isArchived: showArchived },
    select: {
      lastReadAt: true,
      markedUnreadAt: true,
      hiddenAt: true,
      conversation: {
        select: {
          id: true,
          isGroup: true,
          name: true,
          avatarUrl: true,
          lastMessageAt: true,
          dmKey: true,
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
              id: true,
              content: true,
              senderId: true,
              createdAt: true,
              deletedAt: true,
              attachments: { select: { type: true } },
            },
          },
          _count: { select: { members: true } },
        },
      },
    },
    orderBy: { conversation: { lastMessageAt: "desc" } },
  });

  const visibleMemberships = memberships.filter((m) => {
    if (!m.hiddenAt) return true;
    if (q) return true;
    const lastMsgAt = m.conversation.lastMessageAt;
    return !!lastMsgAt && lastMsgAt > m.hiddenAt;
  });

  const result = await Promise.all(
    visibleMemberships.map(async (m) => {
      const conv = m.conversation;
      const isSelf = !conv.isGroup && conv.dmKey === `${userId}_${userId}`;

      let unreadCount = await prisma.message.count({
        where: {
          conversationId: conv.id,
          senderId: { not: userId },
          deletedAt: null,
          isSystemMessage: false,
          ...(m.lastReadAt ? { createdAt: { gt: m.lastReadAt } } : {}),
        },
      });
      if (unreadCount === 0 && m.markedUnreadAt) unreadCount = 1;

      const other = conv.members[0]?.user;
      const name = conv.isGroup
        ? (conv.name ?? "Nhóm chat")
        : isSelf
          ? "Bạn"
          : (other?.profile?.displayName ?? other?.username ?? "Người dùng");
      const avatarUrl = conv.isGroup
        ? conv.avatarUrl
        : isSelf
          ? (me?.profile?.avatarUrl ?? null)
          : (other?.profile?.avatarUrl ?? null);

      const lastMsg = conv.messages[0];

      let lastMessage = "";
      let lastEventAt: Date | null = null;
      if (lastMsg) {
        lastEventAt = new Date(lastMsg.createdAt);
        if (lastMsg.deletedAt) {
          lastMessage = "Tin nhắn đã bị thu hồi";
        } else if (lastMsg.content) {
          lastMessage = lastMsg.content;
        } else if (lastMsg.attachments.length > 0) {
          lastMessage = buildAttachmentLabel(lastMsg.attachments);
        }
      }

      if (lastMsg && !lastMsg.deletedAt) {
        const latestReaction = await prisma.messageReaction.findFirst({
          where: {
            message: { conversationId: conv.id },
            NOT: { userId: lastMsg.senderId },
          },
          orderBy: { createdAt: "desc" },
          select: {
            emoji: true,
            createdAt: true,
            userId: true,
            message: { select: { senderId: true } },
            user: {
              select: {
                username: true,
                profile: { select: { displayName: true } },
              },
            },
          },
        });

        if (
          latestReaction &&
          latestReaction.createdAt > new Date(lastMsg.createdAt) &&
          latestReaction.userId !== latestReaction.message.senderId
        ) {
          const reactorName =
            latestReaction.user.profile?.displayName ??
            latestReaction.user.username;
          lastMessage = `${reactorName} đã thả ${latestReaction.emoji}`;
          lastEventAt = latestReaction.createdAt;
        }
      }

      const latestPin = await prisma.message.findFirst({
        where: { conversationId: conv.id, pinnedAt: { not: null } },
        orderBy: { pinnedAt: "desc" },
        select: {
          pinnedAt: true,
          pinnedById: true,
          pinnedBy: {
            select: {
              username: true,
              profile: { select: { displayName: true } },
            },
          },
        },
      });

      const convLastMessageAt = conv.lastMessageAt
        ? new Date(conv.lastMessageAt)
        : null;
      const pinAt = latestPin?.pinnedAt ? new Date(latestPin.pinnedAt) : null;

      const candidates: { ts: number; label: string }[] = [];

      if (lastEventAt) {
        candidates.push({ ts: lastEventAt.getTime(), label: lastMessage });
      }

      if (pinAt) {
        const isCurrentUser = latestPin!.pinnedById === userId;
        const pinnerName = isCurrentUser
          ? "Bạn"
          : (latestPin!.pinnedBy?.profile?.displayName ??
            latestPin!.pinnedBy?.username);
        candidates.push({
          ts: pinAt.getTime(),
          label: `${pinnerName} đã ghim tin nhắn`,
        });
      }

      if (convLastMessageAt) {
        const maxKnownTs = candidates.length
          ? Math.max(...candidates.map((c) => c.ts))
          : 0;
        if (convLastMessageAt.getTime() > maxKnownTs) {
          candidates.push({
            ts: convLastMessageAt.getTime(),
            label: "Đã bỏ ghim một tin nhắn",
          });
        }
      }

      if (candidates.length > 0) {
        candidates.sort((a, b) => b.ts - a.ts);
        lastMessage = candidates[0].label;
      }

      return {
        id: conv.id,
        isGroup: conv.isGroup,
        name,
        avatarUrl,
        otherUsername: conv.isGroup
          ? undefined
          : isSelf
            ? me?.username
            : other?.username,
        otherUserId: conv.isGroup ? undefined : isSelf ? userId : other?.id,
        isSelf,
        lastMessage,
        lastMessageAt: conv.lastMessageAt,
        unreadCount,
        memberCount: conv._count.members,
        isHidden: !!m.hiddenAt,
      };
    }),
  );

  const filtered = q
    ? result.filter((c) => c.name.toLowerCase().includes(q))
    : result;

  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  try {
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

      const trimmedName = name.trim();

      const duplicateGroup = await prisma.conversation.findFirst({
        where: {
          isGroup: true,
          name: { equals: trimmedName, mode: "insensitive" },
          members: { some: { userId, isLeader: true } },
        },
        select: { id: true },
      });
      if (duplicateGroup) {
        return NextResponse.json(
          { error: "Bạn đã là trưởng nhóm của một nhóm có tên này rồi" },
          { status: 409 },
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
          name: trimmedName,
          members: {
            create: memberIds.map((id) => ({
              userId: id,
              isLeader: id === userId,
            })),
          },
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

    const isSelfChat = target.id === userId;
    const dmKey = [userId, target.id].sort().join("_");

    let conversationId: string;
    let isAccepted: boolean;
    let lastMessageAt: Date | null;

    const existing = await prisma.conversation.findUnique({
      where: { dmKey },
      select: {
        id: true,
        lastMessageAt: true,
        members: {
          where: { userId },
          select: { isAccepted: true, hiddenAt: true },
        },
      },
    });

    if (existing) {
      conversationId = existing.id;
      lastMessageAt = existing.lastMessageAt;
      isAccepted = existing.members[0]?.isAccepted ?? false;

      await prisma.conversationMember.update({
        where: { conversationId_userId: { conversationId, userId } },
        data: { hiddenAt: null, isArchived: false },
      });
    } else {
      const friends = isSelfChat ? true : await areFriends(userId, target.id);
      const memberData = isSelfChat
        ? [{ userId, isAccepted: true }]
        : [
            { userId, isAccepted: true },
            { userId: target.id, isAccepted: friends },
          ];

      try {
        const created = await prisma.conversation.create({
          data: {
            isGroup: false,
            dmKey,
            members: { create: memberData },
          },
          select: { id: true, lastMessageAt: true },
        });
        conversationId = created.id;
        lastMessageAt = created.lastMessageAt;
        isAccepted = true;
      } catch (innerErr: any) {
        if (innerErr?.code === "P2002") {
          const raceWinner = await prisma.conversation.findUnique({
            where: { dmKey },
            select: {
              id: true,
              lastMessageAt: true,
              members: { where: { userId }, select: { isAccepted: true } },
            },
          });
          if (!raceWinner) throw innerErr;
          conversationId = raceWinner.id;
          lastMessageAt = raceWinner.lastMessageAt;
          isAccepted = raceWinner.members[0]?.isAccepted ?? false;
        } else {
          throw innerErr;
        }
      }
    }

    return NextResponse.json({
      id: conversationId,
      isGroup: false,
      name: isSelfChat
        ? "Bạn"
        : (target.profile?.displayName ?? target.username),
      avatarUrl: target.profile?.avatarUrl ?? null,
      otherUsername: target.username,
      otherUserId: target.id,
      isAccepted,
      isSelf: isSelfChat,
      lastMessageAt: lastMessageAt ? lastMessageAt.toISOString() : null,
    });
  } catch (err) {
    console.error("POST /api/conversations error:", err);
    console.error("Stack:", err instanceof Error ? err.stack : String(err));
    return NextResponse.json(
      {
        error: "Không thể tạo cuộc trò chuyện",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
