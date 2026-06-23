import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const name = searchParams.get("name") ?? "download";

  if (!url) return NextResponse.json({ error: "Thiếu url" }, { status: 400 });

  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return NextResponse.json({ error: "URL không hợp lệ" }, { status: 400 });
  }

  const allowedHosts = [".ufs.sh", ".utfs.io"];
  if (!allowedHosts.some((h) => target.hostname.endsWith(h))) {
    return NextResponse.json(
      { error: "Domain không được phép" },
      { status: 403 },
    );
  }

  const upstream = await fetch(target.toString());
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Không thể tải file" }, { status: 502 });
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    upstream.headers.get("content-type") ?? "application/octet-stream",
  );
  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);
  headers.set(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(name)}"`,
  );

  return new NextResponse(upstream.body, { headers });
}
