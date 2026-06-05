import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalDocuments, totalContributors, downloads] = await Promise.all([
      prisma.document.count({
        where: { postId: null },
      }),
      prisma.document
        .groupBy({
          by: ["uploaderId"],
          where: { postId: null },
        })
        .then((r) => r.length),
      prisma.document.aggregate({
        where: { postId: null },
        _sum: { downloadCount: true },
      }),
    ]);

    return NextResponse.json({
      totalDocuments,
      totalContributors,
      totalDownloads: downloads._sum.downloadCount ?? 0,
    });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}