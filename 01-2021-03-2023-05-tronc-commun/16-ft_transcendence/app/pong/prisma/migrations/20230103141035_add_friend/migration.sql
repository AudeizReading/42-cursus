-- CreateEnum
CREATE TYPE "StateFriend" AS ENUM ('WAITING', 'FRIEND');

-- CreateTable
CREATE TABLE "Friend" (
    "userAId" INTEGER NOT NULL,
    "userBId" INTEGER NOT NULL,
    "state" "StateFriend" NOT NULL DEFAULT 'WAITING',

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("userAId","userBId")
);

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_userAId_fkey" FOREIGN KEY ("userAId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_userBId_fkey" FOREIGN KEY ("userBId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
