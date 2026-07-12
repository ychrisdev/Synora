import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const currentPassword =
    typeof body?.currentPassword === "string" ? body.currentPassword : "";
  const newPassword =
    typeof body?.newPassword === "string" ? body.newPassword : "";

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Vui lòng nhập đầy đủ thông tin" },
      { status: 400 },
    );
  }
  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "Mật khẩu mới phải có ít nhất 8 ký tự" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user?.passwordHash) {
    return NextResponse.json(
      { error: "Tài khoản này không hỗ trợ đổi mật khẩu bằng cách này" },
      { status: 400 },
    );
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    return NextResponse.json(
      { error: "Mật khẩu hiện tại không đúng" },
      { status: 400 },
    );
  }

  const sameAsOld = await bcrypt.compare(newPassword, user.passwordHash);
  if (sameAsOld) {
    return NextResponse.json(
      { error: "Mật khẩu mới phải khác mật khẩu hiện tại" },
      { status: 400 },
    );
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash },
  });

  return NextResponse.json({ success: true });
}