import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { hashResetToken } from "@/lib/email/token";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const rawToken = typeof body?.token === "string" ? body.token : "";
    const newPassword =
      typeof body?.newPassword === "string" ? body.newPassword : "";

    if (!rawToken || !newPassword) {
      return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Mật khẩu mới phải có ít nhất 8 ký tự" },
        { status: 400 },
      );
    }

    const hashedToken = hashResetToken(rawToken);

    const record = await prisma.verificationToken.findUnique({
      where: { token: hashedToken },
    });

    if (!record || record.expires < new Date()) {
      return NextResponse.json(
        {
          error: "Link đã hết hạn hoặc không hợp lệ, vui lòng gửi lại yêu cầu",
        },
        { status: 400 },
      );
    }

    const email = record.identifier;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Tài khoản không tồn tại" },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
      prisma.verificationToken.delete({ where: { token: hashedToken } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("RESET_PASSWORD_ERROR:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
