/*
  Warnings:

  - You are about to drop the column `isLike` on the `BlogInteraction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BlogInteraction" DROP COLUMN "isLike",
ADD COLUMN     "isLiked" BOOLEAN;
