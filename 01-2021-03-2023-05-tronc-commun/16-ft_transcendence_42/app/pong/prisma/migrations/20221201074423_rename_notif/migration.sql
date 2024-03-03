/*
  Warnings:

  - You are about to drop the `SysMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TypeNotif" AS ENUM ('ACTION', 'NOTIF', 'MSG');

-- DropForeignKey
ALTER TABLE "SysMessage" DROP CONSTRAINT "SysMessage_userId_fkey";

-- DropTable
DROP TABLE "SysMessage";

-- DropEnum
DROP TYPE "TypeMessage";

-- CreateTable
CREATE TABLE "Notif" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "typeMsg" "TypeNotif" NOT NULL DEFAULT 'NOTIF',
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notif_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notif" ADD CONSTRAINT "Notif_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
