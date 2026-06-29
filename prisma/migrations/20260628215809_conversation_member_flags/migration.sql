-- AlterTable
ALTER TABLE "conversation_members" ADD COLUMN     "hiddenAt" TIMESTAMP(3),
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "markedUnreadAt" TIMESTAMP(3);
