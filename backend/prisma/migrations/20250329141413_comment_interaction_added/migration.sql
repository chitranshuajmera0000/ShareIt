-- CreateTable
CREATE TABLE "CommentInteraction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,
    "isLike" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "replies" TEXT NOT NULL,

    CONSTRAINT "CommentInteraction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CommentInteraction" ADD CONSTRAINT "CommentInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentInteraction" ADD CONSTRAINT "CommentInteraction_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
