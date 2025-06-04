/*
  Warnings:

  - You are about to drop the column `exptectedOutput` on the `Submission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "exptectedOutput",
ADD COLUMN     "expectedOutput" TEXT;
