-- CreateEnum
CREATE TYPE "FriendRequestPermission" AS ENUM ('EVERYONE', 'FRIENDS_OF_FRIENDS', 'NOBODY');

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "friendRequestPermission" "FriendRequestPermission" NOT NULL DEFAULT 'EVERYONE',
ADD COLUMN     "messageFromFriendsOnly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showFriendsList" BOOLEAN NOT NULL DEFAULT true;
