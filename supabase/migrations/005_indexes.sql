-- Performance optimization indexes

-- Index for dashboard/analytics: fetch candidates by org_id sorted by score
CREATE INDEX idx_candidates_org_score ON candidates(org_id, score DESC);

-- Index for job detail page: filter candidates by job_id
CREATE INDEX idx_candidates_job_id ON candidates(job_id);

-- Index for jobs page: fetch org jobs
CREATE INDEX idx_jobs_org_id ON jobs(org_id);

-- Index for jobs sorted by creation date
CREATE INDEX idx_jobs_org_created ON jobs(org_id, created_at DESC);

-- Index for status filtering
CREATE INDEX idx_candidates_org_status ON candidates(org_id, status);

-- Index for analytics recent activity (sorted by creation)
CREATE INDEX idx_candidates_org_created ON candidates(org_id, created_at DESC);

-- Index for score-based queries and filtering
CREATE INDEX idx_candidates_score ON candidates(score DESC);
