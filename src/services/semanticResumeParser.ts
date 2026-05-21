import Groq from 'groq-sdk';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface SemanticCandidate {
  candidate_name: string;
  email: string;
  phone?: string;
  skills: string[];
  inferred_skills: string[]; // Skills inferred from context, not explicitly mentioned
  frontend_skills: string[];
  backend_skills: string[];
  devops_skills: string[];
  years_of_experience: number;
  seniority_level: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  experience_summary: string;
  key_achievements: string[];
  projects: {
    title: string;
    description: string;
    technologies: string[];
    impact: string;
  }[];
  education: {
    degree: string;
    school: string;
    year: number;
  }[];
  industries_experience: string[];
  company_types_experience: string[]; // startup, scaleup, enterprise
  remote_experience: boolean;
  leadership_experience: boolean;
  certifications: string[];
}

const SEMANTIC_RESUME_PARSER_PROMPT = `You are an expert HR AI that extracts and infers candidate information from resumes.

Resume Text:
{RESUME}

Extract and infer candidate information comprehensively.

IMPORTANT: Infer technologies and skills even if wording differs from exact mentions.

Example:
If resume says: "Built scalable frontend systems using modern JavaScript frameworks"
Infer: React, Vue, Angular (likely used), Frontend Architecture, SPA development

Return ONLY valid JSON:
{
  "candidate_name": "string",
  "email": "string or empty",
  "phone": "string or empty",
  "skills": ["skill1", "skill2", ...],
  "inferred_skills": ["inferred1", "inferred2", ...],
  "frontend_skills": ["React", "Vue", ...],
  "backend_skills": ["Node.js", "Python", ...],
  "devops_skills": ["Docker", "Kubernetes", ...],
  "years_of_experience": number,
  "seniority_level": "Junior|Mid|Senior|Lead",
  "experience_summary": "string (2-3 sentences)",
  "key_achievements": ["achievement1", "achievement2", ...],
  "projects": [
    {
      "title": "string",
      "description": "string",
      "technologies": ["tech1", "tech2", ...],
      "impact": "string (business impact)"
    }
  ],
  "education": [
    {
      "degree": "string",
      "school": "string",
      "year": number
    }
  ],
  "industries_experience": ["fintech", "healthtech", ...],
  "company_types_experience": ["startup", "scaleup", "enterprise", ...],
  "remote_experience": boolean,
  "leadership_experience": boolean,
  "certifications": ["cert1", "cert2", ...]
}

Rules:
- Infer skills semantically (don't just extract explicit mentions)
- Categorize skills by domain (frontend, backend, devops)
- Detect years of experience from timeline
- Infer seniority from progression and responsibilities
- Extract key achievements with business impact
- Infer technologies used in projects even if not explicitly mentioned
- Identify startup/scaleup/enterprise experience
- Detect if candidate worked remotely
- Identify leadership/mentoring experience
- Return ONLY JSON`;

/**
 * Semantically parses resume to extract and infer candidate information
 */
export async function parseResumeSemantics(
  resumeText: string
): Promise<SemanticCandidate> {
  if (!resumeText || resumeText.trim().length === 0) {
    throw new Error('Resume text cannot be empty');
  }

  const prompt = SEMANTIC_RESUME_PARSER_PROMPT.replace('{RESUME}', resumeText);

  const message = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const responseText = message.choices[0].message.content || '';

  // Extract JSON
  let jsonText = responseText.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }

  const result = JSON.parse(jsonText) as SemanticCandidate;

  // Validate
  if (!result.candidate_name) {
    throw new Error('Could not extract candidate name from resume');
  }

  return result;
}

/**
 * Calculates skill similarity between candidate skills and required skills
 * Accounts for related skills and semantic similarity
 */
export function calculateSkillSimilarity(
  candidateSkills: string[],
  requiredSkills: string[],
  skillOntology: Record<string, string[]>
): {
  exactMatches: string[];
  relatedMatches: string[];
  matchPercentage: number;
} {
  const candidateSkillsLower = candidateSkills.map((s) => s.toLowerCase());
  const requiredSkillsLower = requiredSkills.map((s) => s.toLowerCase());

  // Exact matches
  const exactMatches = requiredSkillsLower.filter((req) =>
    candidateSkillsLower.includes(req)
  );

  // Related matches (candidate has related skill)
  const relatedMatches: string[] = [];
  for (const req of requiredSkillsLower) {
    if (!exactMatches.includes(req)) {
      const relatedSkills = skillOntology[req] || [];
      for (const related of relatedSkills) {
        if (candidateSkillsLower.includes(related.toLowerCase())) {
          relatedMatches.push(req);
          break;
        }
      }
    }
  }

  const totalMatches = new Set([...exactMatches, ...relatedMatches]).size;
  const matchPercentage =
    requiredSkillsLower.length > 0
      ? Math.round((totalMatches / requiredSkillsLower.length) * 100)
      : 0;

  return {
    exactMatches,
    relatedMatches,
    matchPercentage,
  };
}

/**
 * Detects if candidate has relevant domain experience
 */
export function hasRelevantExperience(
  candidateIndustries: string[],
  requiredIndustries: string[]
): boolean {
  if (requiredIndustries.length === 0) return true;

  return requiredIndustries.some((req) =>
    candidateIndustries.some(
      (cand) =>
        cand.toLowerCase().includes(req.toLowerCase()) ||
        req.toLowerCase().includes(cand.toLowerCase())
    )
  );
}

/**
 * Detects if candidate has startup experience (important for many roles)
 */
export function hasStartupExperience(
  candidateCompanyTypes: string[]
): boolean {
  return candidateCompanyTypes.some(
    (type) =>
      type.toLowerCase().includes('startup') ||
      type.toLowerCase().includes('early-stage') ||
      type.toLowerCase().includes('scale')
  );
}
