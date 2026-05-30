import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const existing = await prisma.save.findUnique({
    where: { userId_postId: { userId: session.user.id, postId: id } },
  });

  if (existing) {
    await prisma.save.delete({
      where: { userId_postId: { userId: session.user.id, postId: id } },
    });
    return NextResponse.json({ saved: false });
  }

  await prisma.save.create({
    data: { userId: session.user.id, postId: id },
  });
  return NextResponse.json({ saved: true });
}