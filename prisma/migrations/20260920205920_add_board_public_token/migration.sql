/*
  Warnings:

  - A unique constraint covering the columns `[publicToken]` on the table `Board` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "publicToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Board_publicToken_key" ON "Board"("publicToken");
