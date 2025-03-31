/*
  Warnings:

  - You are about to drop the column `replies` on the `CommentInteraction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,commentId]` on the table `CommentInteraction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CommentInteraction" DROP COLUMN "replies";

-- AlterTable
ALTER TABLE "Comments" ADD COLUMN     "parentCommentId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "CommentInteraction_userId_commentId_key" ON "CommentInteraction"("userId", "commentId");

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "Comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
