/*
  Warnings:

  - A unique constraint covering the columns `[dmKey]` on the table `conversations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "conversations_dmKey_key" ON "conversations"("dmKey");
