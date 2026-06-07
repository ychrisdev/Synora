import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const target = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  if (!target)
    return NextResponse.json(
      { error: "Không tìm thấy người dùng" },
      { status: 404 },
    );
  if (target.id === session.user.id)
    return NextResponse.json({ error: "Không thể tự follow" }, { status: 400 });

  const senderId = session.user.id;
  const receiverId = target.id;

  return await prisma.$transaction(async (tx) => {
    const existingRequest = await tx.friendRequest.findUnique({
      where: { senderId_receiverId: { senderId, receiverId } },
    });

    if (existingRequest) {
      if (existingRequest.status === "ACCEPTED") {
        await tx.friendRequest.delete({ where: { id: existingRequest.id } });
        await tx.friendRequest.deleteMany({
          where: { senderId: receiverId, receiverId: senderId },
        });
        await tx.follow.deleteMany({
          where: {
            OR: [
              { followerId: senderId, followingId: receiverId },
              { followerId: receiverId, followingId: senderId },
            ],
          },
        });
        return NextResponse.json({ status: "none" });
      }

      await tx.friendRequest.delete({ where: { id: existingRequest.id } });
      await tx.follow.deleteMany({
        where: { followerId: senderId, followingId: receiverId },
      });
      return NextResponse.json({ status: "none" });
    }

    const reverseRequest = await tx.friendRequest.findUnique({
      where: {
        senderId_receiverId: { senderId: receiverId, receiverId: senderId },
      },
    });

    if (reverseRequest?.status === "PENDING") {
      await tx.friendRequest.update({
        where: { id: reverseRequest.id },
        data: { status: "ACCEPTED" },
      });
      await tx.follow.upsert({
        where: {
          followerId_followingId: {
            followerId: senderId,
            followingId: receiverId,
          },
        },
        create: { followerId: senderId, followingId: receiverId },
        update: {},
      });
      return NextResponse.json({ status: "friends" });
    }

    if (reverseRequest?.status === "ACCEPTED") {
      return NextResponse.json({ status: "friends" });
    }

    await tx.friendRequest.create({
      data: { senderId, receiverId, status: "PENDING" },
    });
    await tx.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: senderId,
          followingId: receiverId,
        },
      },
      create: { followerId: senderId, followingId: receiverId },
      update: {},
    });
    return NextResponse.json({ status: "pending" });
  });
}
