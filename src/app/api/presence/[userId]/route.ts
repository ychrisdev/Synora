import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ONLINE_THRESHOLD_MS } from "@/lib/presence/constants";

type Params = { params: Promise<{ userId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      lastActiveAt: true,
      profile: { select: { showActivityStatus: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Không tồn tại" }, { status: 404 });
  }

  const allowsVisibility = user.profile?.showActivityStatus ?? true;

  if (!allowsVisibility) {
    return NextResponse.json({ isOnline: false, lastActiveAt: null });
  }

  const isOnline =
    !!user.lastActiveAt &&
    Date.now() - new Date(user.lastActiveAt).getTime() < ONLINE_THRESHOLD_MS;

  return NextResponse.json({
    isOnline,
    lastActiveAt: user.lastActiveAt,
  });
}