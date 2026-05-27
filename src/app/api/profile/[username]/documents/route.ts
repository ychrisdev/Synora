import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const type = searchParams.get("type");
  const take = 12;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
    }

    const docs = await prisma.document.findMany({
      where: {
        uploaderId: user.id,
        ...(type && { type: type as any }),
      },
      orderBy: { createdAt: "desc" },
      take,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      select: {
        id: true,
        title: true,
        description: true,
        fileUrl: true,
        type: true,
        pageCount: true,
        downloadCount: true,
        createdAt: true,
        mimeType: true,
        fileSize: true,
      },
    });

    const nextCursor = docs.length === take ? docs[docs.length - 1].id : null;
    return NextResponse.json({ docs, nextCursor });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
