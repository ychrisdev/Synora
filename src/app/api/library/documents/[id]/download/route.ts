import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const doc = await prisma.document.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
      select: { fileUrl: true, downloadCount: true },
    });
    return NextResponse.json(doc);
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}