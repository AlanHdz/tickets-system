/*
  Warnings:

  - Added the required column `createdId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "createdId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_createdId_fkey" FOREIGN KEY ("createdId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
