import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { showFriendsList: true },
  });

  return NextResponse.json({
    showFriendsList: profile?.showFriendsList ?? true,
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const value =
    typeof body?.showFriendsList === "boolean" ? body.showFriendsList : null;

  if (value === null) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ" },
      { status: 400 },
    );
  }

  await prisma.profile.upsert({
    where: { userId: session.user.id },
    update: { showFriendsList: value },
    create: { userId: session.user.id, showFriendsList: value },
  });

  return NextResponse.json({ showFriendsList: value });
}
