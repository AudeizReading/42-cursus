/*
  Warnings:

  - You are about to drop the column `typeMsg` on the `Notif` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notif" DROP COLUMN "typeMsg",
ADD COLUMN     "type" "TypeNotif" NOT NULL DEFAULT 'NOTIF';
