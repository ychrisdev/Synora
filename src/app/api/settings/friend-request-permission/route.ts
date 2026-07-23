import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const VALID = ["EVERYONE", "FRIENDS_OF_FRIENDS", "NOBODY"] as const;
type Permission = (typeof VALID)[number];

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { friendRequestPermission: true },
  });

  return NextResponse.json({
    friendRequestPermission: profile?.friendRequestPermission ?? "EVERYONE",
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const value = body?.friendRequestPermission;

  if (typeof value !== "string" || !VALID.includes(value as Permission)) {
    return NextResponse.json(
      { error: "Dữ liệu không hợp lệ" },
      { status: 400 },
    );
  }

  await prisma.profile.upsert({
    where: { userId: session.user.id },
    update: { friendRequestPermission: value as Permission },
    create: {
      userId: session.user.id,
      friendRequestPermission: value as Permission,
    },
  });

  return NextResponse.json({ friendRequestPermission: value });
}
