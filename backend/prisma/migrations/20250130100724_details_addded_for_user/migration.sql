-- CreateTable
CREATE TABLE "Details" (
    "userId" INTEGER NOT NULL,
    "name" TEXT,
    "profession" TEXT,
    "about" TEXT,
    "profileUrl" TEXT,

    CONSTRAINT "Details_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Details" ADD CONSTRAINT "Details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
