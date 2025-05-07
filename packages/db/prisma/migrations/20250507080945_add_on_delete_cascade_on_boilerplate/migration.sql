-- DropForeignKey
ALTER TABLE "Boilerplate" DROP CONSTRAINT "Boilerplate_problemId_fkey";

-- AddForeignKey
ALTER TABLE "Boilerplate" ADD CONSTRAINT "Boilerplate_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
