import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id && !session?.user?.email)
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        ...(session.user.id    ? [{ id: session.user.id }]       : []),
        ...(session.user.email ? [{ email: session.user.email }] : []),
      ],
    },
    select: { id: true },
  });
  if (!user)
    return NextResponse.json({ error: "Phiên không hợp lệ" }, { status: 401 });

  const { id } = await params;

  try {
    const existing = await prisma.savedDocument.findUnique({
      where: { userId_documentId: { userId: user.id, documentId: id } },
    });

    if (existing) {
      await prisma.savedDocument.delete({ where: { id: existing.id } });
      return NextResponse.json({ saved: false });
    } else {
      await prisma.savedDocument.create({
        data: { userId: user.id, documentId: id },
      });
      return NextResponse.json({ saved: true });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}