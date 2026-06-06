import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const session = await getServerSession(authOptions);

  const owner = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  if (!owner) return NextResponse.json({ docs: [], nextCursor: null });

  const isOwner =
    session?.user?.id === owner.id ||
    session?.user?.email ===
      (
        await prisma.user.findUnique({
          where: { id: owner.id },
          select: { email: true },
        })
      )?.email;

  if (!isOwner)
    return NextResponse.json({ error: "Không có quyền" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const take = 12;

  const saved = await prisma.savedDocument.findMany({
    where: {
      userId: owner.id,
      document: {
        type: { notIn: ["IMAGE", "VIDEO"] as any[] },
      },
    },
    orderBy: { createdAt: "desc" },
    take,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    select: {
      id: true,
      document: {
        select: {
          id: true,
          title: true,
          type: true,
          mimeType: true,
          pageCount: true,
          downloadCount: true,
          fileUrl: true,
          fileSize: true,
        },
      },
    },
  });

  const docs = saved.map((s) => s.document);
  const nextCursor = saved.length === take ? saved[saved.length - 1].id : null;

  return NextResponse.json({ docs, nextCursor });
}
