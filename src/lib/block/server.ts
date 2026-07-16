import { prisma } from "@/lib/prisma";

export async function isBlockedEitherWay(userIdA: string, userIdB: string) {
  const block = await prisma.block.findFirst({
    where: {
      OR: [
        { blockerId: userIdA, blockedId: userIdB },
        { blockerId: userIdB, blockedId: userIdA },
      ],
    },
    select: { id: true },
  });
  return !!block;
}

export async function getBlockStatus(viewerId: string, otherId: string) {
  const blocks = await prisma.block.findMany({
    where: {
      OR: [
        { blockerId: viewerId, blockedId: otherId },
        { blockerId: otherId, blockedId: viewerId },
      ],
    },
    select: { blockerId: true },
  });
  return {
    blockedByMe: blocks.some((b) => b.blockerId === viewerId),
    blockedMe: blocks.some((b) => b.blockerId === otherId),
  };
}

export async function getBlockedIds(userId: string): Promise<string[]> {
  const blocks = await prisma.block.findMany({
    where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
    select: { blockerId: true, blockedId: true },
  });
  return blocks.map((b) =>
    b.blockerId === userId ? b.blockedId : b.blockerId,
  );
}