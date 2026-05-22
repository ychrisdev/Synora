import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { visibility: "PUBLIC" },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        author: {
          include: { profile: true },
        },
        tags: { include: { tag: true } },
        documents: true,
        _count: { select: { likes: true, comments: true } },
      },
    });
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const { content, visibility = "PUBLIC", tags = [] } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: "Nội dung không được trống" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        content,
        visibility,
        authorId: session.user.id,
        tags: {
          create: await Promise.all(
            tags.map(async (tagName: string) => {
              const slug = tagName.replace(/^#/, "").toLowerCase();
              const tag = await prisma.tag.upsert({
                where: { slug },
                update: {},
                create: { name: slug, slug },
              });
              return { tagId: tag.id };
            })
          ),
        },
      },
      include: {
        author: { include: { profile: true } },
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}