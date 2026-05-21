import { StructuredRequirement } from './requirementParser';
import { SemanticCandidate } from './semanticResumeParser';

export interface ScoreBreakdown {
  skills_score: number; // 40%
  experience_score: number; // 30%
  seniority_score: number; // 20%
  education_score: number; // 10%
  total_score: number;
  details: {
    skills: {
      exact_matches: number;
      related_matches: number;
      missing_required: string[];
      score: number;
    };
    experience: {
      years_in_range: boolean;
      years: number;
      required_min: number;
      required_max: number;
      score: number;
    };
    seniority: {
      candidate_level: string;
      required_level: string;
      match: boolean;
      score: number;
    };
    education: {
      has_degree: boolean;
      relevant_field: boolean;
      score: number;
    };
  };
}

/**
 * Deterministic scoring engine
 * Uses weighted criteria instead of pure AI scoring
 */
export function calculateScore(
  candidate: SemanticCandidate,
  requirement: StructuredRequirement
): ScoreBreakdown {
  // STEP 1: Skills Scoring (40%)
  const skillsScore = calculateSkillsScore(candidate, requirement);

  // STEP 2: Experience Scoring (30%)
  const experienceScore = calculateExperienceScore(candidate, requirement);

  // STEP 3: Seniority Scoring (20%)
  const seniorityScore = calculateSeniorityScore(candidate, requirement);

  // STEP 4: Education Scoring (10%)
  const educationScore = calculateEducationScore(candidate);

  // Calculate weighted total
  const totalScore = Math.round(
    skillsScore.score * 0.4 +
      experienceScore.score * 0.3 +
      seniorityScore.score * 0.2 +
      educationScore.score * 0.1
  );

  return {
    skills_score: skillsScore.score,
    experience_score: experienceScore.score,
    seniority_score: seniorityScore.score,
    education_score: educationScore.score,
    total_score: totalScore,
    details: {
      skills: skillsScore,
      experience: experienceScore,
      seniority: seniorityScore,
      education: educationScore,
    },
  };
}

/**
 * Skills Score (40% weight)
 * Compares candidate skills against required skills
 */
function calculateSkillsScore(
  candidate: SemanticCandidate,
  requirement: StructuredRequirement
): {
  exact_matches: number;
  related_matches: number;
  missing_required: string[];
  score: number;
} {
  const allCandidateSkills = [
    ...candidate.skills,
    ...candidate.inferred_skills,
  ];
  const requiredSkillsLower = requirement.required_skills.map((s) =>
    s.toLowerCase()
  );
  const candidateSkillsLower = allCandidateSkills.map((s) => s.toLowerCase());

  // Exact matches
  const exactMatches = requiredSkillsLower.filter((req) =>
    candidateSkillsLower.includes(req)
  );

  // Missing required skills
  const missingRequired = requirement.required_skills.filter(
    (req) => !candidateSkillsLower.includes(req.toLowerCase())
  );

  // Related matches (partial credit for similar skills)
  let relatedMatches = 0;
  for (const missing of missingRequired) {
    // Check if candidate has frontend/backend/devops equivalent
    if (missing.toLowerCase().includes('react') && candidate.frontend_skills.length > 2) {
      relatedMatches++;
    } else if (
      missing.toLowerCase().includes('node') &&
      candidate.backend_skills.length > 2
    ) {
      relatedMatches++;
    } else if (
      missing.toLowerCase().includes('docker') &&
      candidate.devops_skills.length > 1
    ) {
      relatedMatches++;
    }
  }

  // Calculate score
  const totalRequired = requirement.required_skills.length;
  const matchPoints = exactMatches.length * 100 + relatedMatches * 50;
  const maxPoints = totalRequired * 100;
  const score = totalRequired > 0 ? Math.min(100, (matchPoints / maxPoints) * 100) : 100;

  return {
    exact_matches: exactMatches.length,
    related_matches: relatedMatches,
    missing_required: missingRequired,
    score: Math.round(score),
  };
}

/**
 * Experience Score (30% weight)
 * Checks if candidate has appropriate years of experience
 */
function calculateExperienceScore(
  candidate: SemanticCandidate,
  requirement: StructuredRequirement
): {
  years_in_range: boolean;
  years: number;
  required_min: number;
  required_max: number;
  score: number;
} {
  const candYears = candidate.years_of_experience;
  const minRequired = requirement.minimum_experience_years || 0;
  const maxRequired = requirement.maximum_experience_years || 100;

  // Check if within range
  const inRange = candYears >= minRequired && candYears <= maxRequired;

  // Score calculation
  let score = 0;
  if (candYears < minRequired) {
    // Below minimum: deduct points per year
    score = Math.max(0, 100 - (minRequired - candYears) * 10);
  } else if (candYears > maxRequired) {
    // Above maximum: slight deduction for overqualification
    score = Math.max(70, 100 - (candYears - maxRequired) * 5);
  } else {
    // Perfect range
    score = 100;
  }

  return {
    years_in_range: inRange,
    years: candYears,
    required_min: minRequired,
    required_max: maxRequired,
    score,
  };
}

/**
 * Seniority Score (20% weight)
 * Checks if candidate seniority matches requirement
 */
function calculateSeniorityScore(
  candidate: SemanticCandidate,
  requirement: StructuredRequirement
): {
  candidate_level: string;
  required_level: string;
  match: boolean;
  score: number;
} {
  const seniorityLevels = ['Junior', 'Mid', 'Senior', 'Lead'];
  const candIndex = seniorityLevels.indexOf(candidate.seniority_level);
  const reqIndex = seniorityLevels.indexOf(requirement.seniority_level);

  const match = candIndex >= reqIndex;

  // Scoring: perfect match = 100, one level below = 75, two levels below = 50, etc.
  const diff = candIndex - reqIndex;
  const score = Math.max(0, 100 - Math.abs(Math.min(diff, 0)) * 25);

  return {
    candidate_level: candidate.seniority_level,
    required_level: requirement.seniority_level,
    match,
    score,
  };
}

/**
 * Education Score (10% weight)
 * Checks if candidate has relevant education
 */
function calculateEducationScore(candidate: SemanticCandidate): {
  has_degree: boolean;
  relevant_field: boolean;
  score: number;
} {
  const hasDegree = candidate.education.length > 0;

  // Check for relevant field
  const relevantFields = [
    'computer science',
    'engineering',
    'information technology',
    'software',
    'mathematics',
    'physics',
  ];
  const relevantField = candidate.education.some((edu) =>
    relevantFields.some((field) =>
      edu.degree.toLowerCase().includes(field)
    )
  );

  // Scoring: relevant degree = 100, any degree = 70, no degree = 50
  const score = !hasDegree ? 50 : relevantField ? 100 : 70;

  return {
    has_degree: hasDegree,
    relevant_field: relevantField,
    score,
  };
}

/**
 * Gets recommendation based on score
 */
export function getRecommendation(score: number): {
  recommendation: 'STRONG_YES' | 'YES' | 'MAYBE' | 'NO';
  message: string;
} {
  if (score >= 80) {
    return {
      recommendation: 'STRONG_YES',
      message: 'Excellent match - move to phone screen',
    };
  }
  if (score >= 65) {
    return {
      recommendation: 'YES',
      message: 'Good match - consider for interview',
    };
  }
  if (score >= 50) {
    return {
      recommendation: 'MAYBE',
      message: 'Moderate match - review carefully',
    };
  }
  return {
    recommendation: 'NO',
    message: 'Poor match - consider other candidates',
  };
}

/**
 * Gets detailed score explanation
 */
export function getScoreExplanation(breakdown: ScoreBreakdown): string[] {
  const explanations: string[] = [];

  // Skills explanation
  const skillPercentage = breakdown.details.skills.score;
  if (skillPercentage >= 90) {
    explanations.push(`Skills: ${skillPercentage}% - Excellent technical match`);
  } else if (skillPercentage >= 75) {
    explanations.push(
      `Skills: ${skillPercentage}% - Good match with ${breakdown.details.skills.missing_required.length} missing skills`
    );
  } else {
    explanations.push(
      `Skills: ${skillPercentage}% - Missing ${breakdown.details.skills.missing_required.length} required skills`
    );
  }

  // Experience explanation
  const expPercentage = breakdown.details.experience.score;
  if (breakdown.details.experience.years_in_range) {
    explanations.push(
      `Experience: ${expPercentage}% - ${breakdown.details.experience.years} years fits requirement`
    );
  } else if (breakdown.details.experience.years < breakdown.details.experience.required_min) {
    const gap = breakdown.details.experience.required_min - breakdown.details.experience.years;
    explanations.push(
      `Experience: ${expPercentage}% - ${gap} year(s) below requirement`
    );
  } else {
    const extra = breakdown.details.experience.years - breakdown.details.experience.required_max;
    explanations.push(`Experience: ${expPercentage}% - ${extra} year(s) overqualified`);
  }

  // Seniority explanation
  if (breakdown.details.seniority.match) {
    explanations.push(
      `Seniority: ${breakdown.details.seniority.score}% - ${breakdown.details.seniority.candidate_level} candidate fits ${breakdown.details.seniority.required_level} requirement`
    );
  } else {
    explanations.push(
      `Seniority: ${breakdown.details.seniority.score}% - ${breakdown.details.seniority.candidate_level} below required ${breakdown.details.seniority.required_level}`
    );
  }

  // Education explanation
  if (breakdown.details.education.has_degree) {
    if (breakdown.details.education.relevant_field) {
      explanations.push(
        `Education: ${breakdown.details.education.score}% - Relevant degree`
      );
    } else {
      explanations.push(
        `Education: ${breakdown.details.education.score}% - Degree in different field`
      );
    }
  } else {
    explanations.push(
      `Education: ${breakdown.details.education.score}% - No formal degree`
    );
  }

  return explanations;
}
