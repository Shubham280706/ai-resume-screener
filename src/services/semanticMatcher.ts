import { StructuredRequirement } from './requirementParser';
import { SemanticCandidate } from './semanticResumeParser';

export interface MatchingResult {
  overall_match: number;
  skill_match: number;
  experience_match: number;
  seniority_match: number;
  match_reasoning: string[];
  matched_skills: string[];
  unmatched_required_skills: string[];
  bonus_skills: string[];
}

/**
 * Semantic matching engine
 * Compares candidates against requirements intelligently
 */
export function semanticMatch(
  candidate: SemanticCandidate,
  requirement: StructuredRequirement
): MatchingResult {
  // Build skill ontology for intelligent matching
  const skillOntology = buildSkillOntology();

  // Match skills semantically
  const skillMatch = matchSkillsSemantics(
    candidate,
    requirement,
    skillOntology
  );

  // Match experience
  const experienceMatch = matchExperience(candidate, requirement);

  // Match seniority
  const seniorityMatch = matchSeniority(candidate, requirement);

  // Calculate overall match
  const overallMatch = Math.round(
    skillMatch.score * 0.5 + experienceMatch * 0.3 + seniorityMatch * 0.2
  );

  // Build reasoning
  const reasoning = buildMatchingReasoning(
    candidate,
    requirement,
    skillMatch,
    experienceMatch,
    seniorityMatch
  );

  return {
    overall_match: overallMatch,
    skill_match: skillMatch.score,
    experience_match: experienceMatch,
    seniority_match: seniorityMatch,
    match_reasoning: reasoning,
    matched_skills: skillMatch.matched,
    unmatched_required_skills: skillMatch.unmatched,
    bonus_skills: skillMatch.bonus,
  };
}

/**
 * Builds skill ontology for semantic understanding
 */
function buildSkillOntology(): Record<string, string[]> {
  return {
    // Frontend frameworks
    React: ['JavaScript', 'TypeScript', 'JSX', 'HTML', 'CSS', 'State Management'],
    'Next.js': ['React', 'Node.js', 'TypeScript', 'API Routes', 'SSR', 'Full-Stack'],
    Vue: ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Vuex', 'Vue Router'],
    Angular: ['TypeScript', 'HTML', 'CSS', 'RxJS', 'Dependency Injection'],
    Svelte: ['JavaScript', 'HTML', 'CSS', 'Reactive Programming'],

    // Backend
    'Node.js': ['JavaScript', 'Express', 'APIs', 'Backend'],
    Python: ['Django', 'FastAPI', 'Flask', 'Data Science'],
    Java: ['Spring Boot', 'OOP', 'Backend'],
    'Go/Golang': ['Concurrency', 'DevOps', 'Backend'],

    // Databases
    PostgreSQL: ['SQL', 'Database Design', 'Relational Database'],
    MongoDB: ['NoSQL', 'Document Database', 'JSON'],
    Redis: ['Caching', 'NoSQL', 'Data Structures'],

    // DevOps/Cloud
    Docker: ['Containerization', 'DevOps', 'Kubernetes'],
    Kubernetes: ['Orchestration', 'DevOps', 'Container Management'],
    AWS: ['Cloud', 'Infrastructure', 'Microservices'],
    'Google Cloud': ['Cloud', 'Infrastructure'],
    Azure: ['Cloud', 'Infrastructure'],

    // APIs
    'REST APIs': ['Backend', 'API Design', 'HTTP'],
    GraphQL: ['API Design', 'Query Language', 'Backend'],

    // Frontend concepts
    'CSS': ['Styling', 'Responsive Design', 'Frontend'],
    'HTML': ['Markup', 'Semantic HTML', 'Frontend'],
    'Responsive Design': ['CSS', 'Mobile-First', 'Frontend'],

    // Testing
    Jest: ['Unit Testing', 'JavaScript', 'Frontend Testing'],
    'React Testing Library': ['Component Testing', 'React', 'Frontend Testing'],
    Cypress: ['E2E Testing', 'Frontend Testing'],

    // Version control
    Git: ['Version Control', 'Collaboration', 'Source Control'],

    // Leadership
    'Team Leadership': ['Management', 'People Skills'],
    'Mentoring': ['Leadership', 'Teaching'],
    'Architecture': ['System Design', 'Technical Leadership'],
  };
}

/**
 * Matches skills semantically
 */
function matchSkillsSemantics(
  candidate: SemanticCandidate,
  requirement: StructuredRequirement,
  ontology: Record<string, string[]>
): {
  score: number;
  matched: string[];
  unmatched: string[];
  bonus: string[];
} {
  const candSkills = [
    ...candidate.skills,
    ...candidate.inferred_skills,
  ].map((s) => s.toLowerCase());

  const reqSkills = requirement.required_skills.map((s) => s.toLowerCase());
  const prefSkills = requirement.preferred_skills.map((s) =>
    s.toLowerCase()
  );

  const matched: string[] = [];
  const unmatched: string[] = [];
  const bonus: string[] = [];

  // Check required skills
  for (const req of requirement.required_skills) {
    const reqLower = req.toLowerCase();

    if (candSkills.includes(reqLower)) {
      matched.push(req);
    } else if (hasRelatedSkill(req, candSkills, ontology)) {
      matched.push(`${req} (inferred)`);
    } else {
      unmatched.push(req);
    }
  }

  // Check bonus skills (preferred)
  for (const pref of requirement.preferred_skills) {
    const prefLower = pref.toLowerCase();
    if (candSkills.includes(prefLower)) {
      bonus.push(pref);
    }
  }

  // Calculate skill match score
  const matchPercentage =
    reqSkills.length > 0
      ? Math.round((matched.length / reqSkills.length) * 100)
      : 100;

  // Bonus for exceeding
  const bonusScore = Math.min(20, bonus.length * 5);
  const finalScore = Math.min(100, matchPercentage + bonusScore);

  return {
    score: finalScore,
    matched,
    unmatched,
    bonus,
  };
}

/**
 * Checks if candidate has related skill
 */
function hasRelatedSkill(
  skill: string,
  candSkills: string[],
  ontology: Record<string, string[]>
): boolean {
  const relatedSkills = ontology[skill] || [];
  return relatedSkills.some((related) =>
    candSkills.includes(related.toLowerCase())
  );
}

/**
 * Matches experience
 */
function matchExperience(
  candidate: SemanticCandidate,
  requirement: StructuredRequirement
): number {
  const candYears = candidate.years_of_experience;
  const minReq = requirement.minimum_experience_years || 0;
  const maxReq = requirement.maximum_experience_years || 100;

  if (candYears >= minReq && candYears <= maxReq) {
    return 100;
  } else if (candYears < minReq) {
    return Math.max(0, 100 - (minReq - candYears) * 10);
  } else {
    return Math.max(70, 100 - (candYears - maxReq) * 5);
  }
}

/**
 * Matches seniority
 */
function matchSeniority(
  candidate: SemanticCandidate,
  requirement: StructuredRequirement
): number {
  const levels = ['Junior', 'Mid', 'Senior', 'Lead'];
  const candIndex = levels.indexOf(candidate.seniority_level);
  const reqIndex = levels.indexOf(requirement.seniority_level);

  if (candIndex >= reqIndex) {
    return 100;
  } else {
    return Math.max(0, 100 - (reqIndex - candIndex) * 30);
  }
}

/**
 * Builds reasoning for matching
 */
function buildMatchingReasoning(
  candidate: SemanticCandidate,
  requirement: StructuredRequirement,
  skillMatch: any,
  experienceMatch: number,
  seniorityMatch: number
): string[] {
  const reasoning: string[] = [];

  // Skill reasoning
  if (skillMatch.score >= 90) {
    reasoning.push(`Strong technical match with ${skillMatch.matched.length}/${requirement.required_skills.length} required skills`);
  } else if (skillMatch.score >= 70) {
    reasoning.push(`Good skill match with ${skillMatch.unmatched.length} gaps`);
  } else {
    reasoning.push(`Limited skill overlap, missing key technologies`);
  }

  // Bonus skills
  if (skillMatch.bonus.length > 0) {
    reasoning.push(`Has ${skillMatch.bonus.length} preferred skill(s): ${skillMatch.bonus.slice(0, 2).join(', ')}`);
  }

  // Experience reasoning
  if (experienceMatch === 100) {
    reasoning.push(`Experience level aligns perfectly with requirement`);
  } else if (experienceMatch >= 70) {
    reasoning.push(`Experience is within acceptable range`);
  } else {
    reasoning.push(`Experience level below requirement`);
  }

  // Seniority reasoning
  if (seniorityMatch === 100) {
    reasoning.push(`${candidate.seniority_level} level matches requirement`);
  } else if (seniorityMatch >= 70) {
    reasoning.push(`Seniority slightly below requirement but potential present`);
  }

  // Domain/industry reasoning
  if (candidate.industries_experience.length > 0) {
    reasoning.push(`Has experience in ${candidate.industries_experience.slice(0, 2).join(', ')}`);
  }

  // Startup experience
  if (candidate.company_types_experience.includes('startup')) {
    reasoning.push(`Has startup experience`);
  }

  // Leadership
  if (candidate.leadership_experience) {
    reasoning.push(`Has leadership/mentoring experience`);
  }

  return reasoning;
}
