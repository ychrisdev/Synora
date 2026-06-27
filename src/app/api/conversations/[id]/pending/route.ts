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

  const body = await req.json();
  const { action } = body as { action: "accept" | "reject" };

  if (!["accept", "reject"].includes(action))
    return NextResponse.json(
      { error: "Hành động không hợp lệ" },
      { status: 400 },
    );

  const membership = await prisma.conversationMember.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });

  if (!membership)
    return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });

  if (membership.isAccepted)
    return NextResponse.json({ error: "Đã chấp nhận rồi" }, { status: 400 });

  if (action === "accept") {
    await prisma.conversationMember.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { isAccepted: true },
    });
    return NextResponse.json({ accepted: true });
  }

  await prisma.conversationMember.delete({
    where: { conversationId_userId: { conversationId, userId } },
  });
  return NextResponse.json({ rejected: true });
}
