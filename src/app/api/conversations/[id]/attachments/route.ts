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

  const attachments = await prisma.messageAttachment.findMany({
    where: {
      message: { conversationId, deletedAt: null },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      url: true,
      name: true,
      size: true,
      type: true,
      mimeType: true,
      createdAt: true,
      messageId: true,
    },
  });

  return NextResponse.json(attachments);
}