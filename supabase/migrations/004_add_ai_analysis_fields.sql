-- Add AI analysis fields to candidates table
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS skills_matched text[] DEFAULT '{}';
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS skills_missing text[] DEFAULT '{}';
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS "current_role" text;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS resume_text text;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS key_strengths text[] DEFAULT '{}';
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS gaps_and_concerns text[] DEFAULT '{}';
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS interview_focus_areas text[] DEFAULT '{}';
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS recommendation text;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS recommendation_message text;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS candidates_status_idx ON candidates(status);
CREATE INDEX IF NOT EXISTS candidates_created_at_idx ON candidates(created_at);
