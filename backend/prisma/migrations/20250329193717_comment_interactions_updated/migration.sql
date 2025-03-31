/*
  Warnings:

  - You are about to drop the column `totalDislikes` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `totalLikes` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "totalDislikes",
DROP COLUMN "totalLikes",
ADD COLUMN     "totalCommentDislikes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalCommentLikes" INTEGER NOT NULL DEFAULT 0;
