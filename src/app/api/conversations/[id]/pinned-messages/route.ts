import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
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

  const pinned = await prisma.message.findMany({
    where: { conversationId, pinnedAt: { not: null } },
    orderBy: { pinnedAt: "asc" },
    select: {
      id: true,
      content: true,
      fileType: true,
      fileUrl: true,
      deletedAt: true,
      pinnedAt: true,
      senderId: true,
      sender: {
        select: { username: true, profile: { select: { displayName: true } } },
      },
      pinnedBy: {
        select: { username: true, profile: { select: { displayName: true } } },
      },
    },
  });

  return NextResponse.json(pinned);
}
