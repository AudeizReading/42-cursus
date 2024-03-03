-- AlterTable
-- Original: ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL;

-- Guillaume: J'ai ajouté à la main cette règle :)
-- https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/customizing-migrations#example-change-the-direction-of-a-1-1-relation
ALTER TABLE "User" ADD COLUMN "name" TEXT;

UPDATE "User"
SET "name" = "User".login;

ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
