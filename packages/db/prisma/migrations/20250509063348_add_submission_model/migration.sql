-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "status" INTEGER,
    "message" TEXT,
    "solution" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "time" INTEGER,
    "memory" INTEGER,
    "stdin" TEXT,
    "stdout" TEXT,
    "stderr" TEXT,
    "exptectedOutput" TEXT,
    "testsPassed" INTEGER,
    "problemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
