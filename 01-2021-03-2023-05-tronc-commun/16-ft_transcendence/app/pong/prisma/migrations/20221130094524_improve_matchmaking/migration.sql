/*
  Warnings:

  - You are about to drop the column `matched` on the `MatchMaking` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "StateMatchMaking" AS ENUM ('WAITING', 'MATCHED', 'CONFIRMED');

-- AlterTable
ALTER TABLE "MatchMaking" DROP COLUMN "matched",
ADD COLUMN     "state" "StateMatchMaking" NOT NULL DEFAULT 'WAITING';
