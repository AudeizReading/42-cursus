/*
  Warnings:

  - The primary key for the `Invite` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userAId` on the `Invite` table. All the data in the column will be lost.
  - You are about to drop the column `userBId` on the `Invite` table. All the data in the column will be lost.
  - Added the required column `fromID` to the `Invite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toID` to the `Invite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_userAId_fkey";

-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_userBId_fkey";

-- AlterTable
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_pkey",
DROP COLUMN "userAId",
DROP COLUMN "userBId",
ADD COLUMN     "fromID" INTEGER NOT NULL,
ADD COLUMN     "toID" INTEGER NOT NULL,
ADD CONSTRAINT "Invite_pkey" PRIMARY KEY ("fromID", "toID", "settings");

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_fromID_fkey" FOREIGN KEY ("fromID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_toID_fkey" FOREIGN KEY ("toID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
