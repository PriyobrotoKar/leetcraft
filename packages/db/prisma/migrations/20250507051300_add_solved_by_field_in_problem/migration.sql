-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "solvedById" TEXT[];

-- CreateTable
CREATE TABLE "_SolvedProblems" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SolvedProblems_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SolvedProblems_B_index" ON "_SolvedProblems"("B");

-- AddForeignKey
ALTER TABLE "_SolvedProblems" ADD CONSTRAINT "_SolvedProblems_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SolvedProblems" ADD CONSTRAINT "_SolvedProblems_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
