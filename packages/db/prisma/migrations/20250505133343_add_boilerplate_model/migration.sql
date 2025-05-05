-- CreateTable
CREATE TABLE "Boilerplate" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "longCode" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Boilerplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Boilerplate" ADD CONSTRAINT "Boilerplate_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
