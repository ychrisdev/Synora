-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "pinnedAt" TIMESTAMP(3),
ADD COLUMN     "pinnedById" TEXT;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_pinnedById_fkey" FOREIGN KEY ("pinnedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
