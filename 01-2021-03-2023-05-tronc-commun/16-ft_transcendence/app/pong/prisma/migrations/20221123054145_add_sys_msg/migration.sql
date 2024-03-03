-- CreateEnum
CREATE TYPE "TypeMessage" AS ENUM ('ACTION', 'NOTIF', 'MSG');

-- CreateTable
CREATE TABLE "SysMessage" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "typeMsg" "TypeMessage" NOT NULL,

    CONSTRAINT "SysMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SysMessage_userId_key" ON "SysMessage"("userId");

-- AddForeignKey
ALTER TABLE "SysMessage" ADD CONSTRAINT "SysMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
