export interface Candidate {
  candidate_name: string;
  email: string;
  skills: string[];
  years_of_experience: number;
  education: EducationEntry[];
  projects: ProjectEntry[];
  score: number;
  recommendation: string;
}

export interface EducationEntry {
  degree: string;
  school: string;
  graduation_year: number;
}

export interface ProjectEntry {
  title: string;
  description: string;
  technologies: string[];
}

export interface ScreeningResult extends Candidate {
  match_score: number;
  strengths: string[];
  weaknesses: string[];
  missing_skills: string[];
  summary: string;
}

export interface AnalyzeRequest {
  resumeText: string;
  jobDescription: string;
}

// Semantic Analysis Types
export interface StructuredRequirement {
  role_title: string;
  role_category: string;
  required_skills: string[];
  preferred_skills: string[];
  minimum_experience_years: number;
  maximum_experience_years: number;
  seniority_level: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  related_technologies: string[];
}

export interface SemanticMatch {
  overall_match: number;
  skill_match: number;
  experience_match: number;
  seniority_match: number;
  matched_skills: string[];
  unmatched_required_skills: string[];
  bonus_skills: string[];
  reasoning: string[];
}

export interface ScoreBreakdown {
  total_score: number;
  skills_score: number;
  experience_score: number;
  seniority_score: number;
  education_score: number;
}

export interface AnalysisInsight {
  key_strengths: string[];
  gaps_and_concerns: string[];
  recommendation_reasoning: string;
  interview_focus_areas: string[];
  overall_fit_summary: string;
}

export interface SemanticAnalysisResult {
  candidate_name: string;
  email: string;
  years_of_experience: number;
  seniority_level: string;
  job_requirement: StructuredRequirement;
  semantic_match: SemanticMatch;
  scoring: {
    total_score: number;
    skills_score: number;
    experience_score: number;
    seniority_score: number;
    education_score: number;
  };
  analysis: AnalysisInsight;
  recommendation: 'STRONG_YES' | 'YES' | 'MAYBE' | 'NO';
  recommendation_message: string;
}
