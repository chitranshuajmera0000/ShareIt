/*
  Warnings:

  - You are about to drop the column `thumbnail` on the `Blog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "thumbnail",
ADD COLUMN     "thumbnailUrl" TEXT;
