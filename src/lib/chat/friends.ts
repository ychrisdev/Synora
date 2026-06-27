import { prisma } from "@/lib/prisma";

export async function areFriends(userIdA: string, userIdB: string) {
  const accepted = await prisma.friendRequest.findFirst({
    where: {
      status: "ACCEPTED",
      OR: [
        { senderId: userIdA, receiverId: userIdB },
        { senderId: userIdB, receiverId: userIdA },
      ],
    },
    select: { id: true },
  });
  return !!accepted;
}