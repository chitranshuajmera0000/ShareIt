/*
  Warnings:

  - You are about to drop the column `isLike` on the `CommentInteraction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CommentInteraction" DROP COLUMN "isLike",
ADD COLUMN     "isLiked" BOOLEAN;
