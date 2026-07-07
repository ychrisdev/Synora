import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const username = process.env.SEED_ADMIN_USERNAME ?? "admin";

  if (!email || !password) {
    throw new Error(
      "Thiếu SEED_ADMIN_EMAIL hoặc SEED_ADMIN_PASSWORD trong biến môi trường",
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });
    console.log(`Đã nâng quyền tài khoản có sẵn "${email}" lên ADMIN`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      role: "ADMIN",
      profile: {
        create: {
          displayName: "Quản trị viên",
        },
      },
    },
  });

  console.log(`Đã tạo tài khoản admin đầu tiên: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });