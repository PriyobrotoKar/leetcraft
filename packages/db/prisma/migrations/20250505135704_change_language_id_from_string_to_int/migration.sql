/*
  Warnings:

  - Changed the type of `languageId` on the `Boilerplate` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Boilerplate" DROP COLUMN "languageId",
ADD COLUMN     "languageId" INTEGER NOT NULL;
