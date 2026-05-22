-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "seniority_level" TEXT NOT NULL DEFAULT 'Mid',
    "min_experience" INTEGER NOT NULL DEFAULT 0,
    "max_experience" INTEGER NOT NULL DEFAULT 5,
    "required_skills" TEXT[],
    "preferred_skills" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'open',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "candidate_name" TEXT NOT NULL,
    "email" TEXT,
    "years_of_experience" INTEGER NOT NULL DEFAULT 0,
    "seniority_level" TEXT,
    "scoring" JSONB NOT NULL,
    "semantic_match" JSONB NOT NULL,
    "analysis" JSONB,
    "job_requirement" JSONB NOT NULL,
    "recommendation" TEXT NOT NULL DEFAULT 'MAYBE',
    "recommendation_message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Job_status_idx" ON "Job"("status");

-- CreateIndex
CREATE INDEX "Job_created_at_idx" ON "Job"("created_at");

-- CreateIndex
CREATE INDEX "Candidate_jobId_idx" ON "Candidate"("jobId");

-- CreateIndex
CREATE INDEX "Candidate_status_idx" ON "Candidate"("status");

-- CreateIndex
CREATE INDEX "Candidate_recommendation_idx" ON "Candidate"("recommendation");

-- CreateIndex
CREATE INDEX "Candidate_created_at_idx" ON "Candidate"("created_at");

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
