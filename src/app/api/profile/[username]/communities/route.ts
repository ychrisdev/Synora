// src/app/api/profile/[username]/communities/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
    }

    const memberships = await prisma.communityMember.findMany({
      where: { userId: user.id },
      take: 5,
      include: {
        community: {
          select: {
            id: true,
            name: true,
            slug: true,
            avatarUrl: true,
            _count: { select: { members: true } },
          },
        },
      },
    });

    const communities = memberships.map((m) => ({
      id: m.community.id,
      name: m.community.name,
      slug: m.community.slug,
      avatarUrl: m.community.avatarUrl ?? null,
      memberCount: m.community._count.members,
      isAdmin: m.isAdmin,
    }));

    return NextResponse.json({ communities });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}