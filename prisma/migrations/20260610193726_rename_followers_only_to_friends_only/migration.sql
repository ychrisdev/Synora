/*
  Warnings:

  - The values [FOLLOWERS_ONLY] on the enum `PostVisibility` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PostVisibility_new" AS ENUM ('PUBLIC', 'FRIENDS_ONLY', 'PRIVATE');
ALTER TABLE "public"."posts" ALTER COLUMN "visibility" DROP DEFAULT;
ALTER TABLE "posts" ALTER COLUMN "visibility" TYPE "PostVisibility_new" USING ("visibility"::text::"PostVisibility_new");
ALTER TYPE "PostVisibility" RENAME TO "PostVisibility_old";
ALTER TYPE "PostVisibility_new" RENAME TO "PostVisibility";
DROP TYPE "public"."PostVisibility_old";
ALTER TABLE "posts" ALTER COLUMN "visibility" SET DEFAULT 'PUBLIC';
COMMIT;
