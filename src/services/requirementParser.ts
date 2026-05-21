import Groq from 'groq-sdk';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface StructuredRequirement {
  role_title: string;
  role_category: string;
  required_skills: string[];
  preferred_skills: string[];
  minimum_experience_years: number;
  maximum_experience_years: number;
  seniority_level: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  related_technologies: string[];
  must_have_skills: string[];
  nice_to_have_skills: string[];
  key_responsibilities: string[];
  company_stage?: string;
  industries?: string[];
  remote_status?: 'Remote' | 'Hybrid' | 'On-site';
}

const REQUIREMENT_PARSER_PROMPT = `You are an expert HR AI that converts vague recruiter requirements into structured hiring criteria.

Recruiter Input:
{INPUT}

Analyze this recruiter requirement and extract structured hiring criteria.

Infer:
1. Role title and category (Frontend, Backend, Full-Stack, DevOps, Mobile, etc.)
2. Required skills (must-have technologies/abilities)
3. Preferred skills (nice-to-have technologies/abilities)
4. Related technologies (ecosystem skills)
5. Seniority level (Junior/Mid/Senior/Lead)
6. Years of experience (minimum and maximum)
7. Key responsibilities (infer from role)
8. Company stage (startup/scaleup/enterprise if mentioned)
9. Industries (if mentioned)
10. Remote status (if mentioned)

Return ONLY valid JSON in this format:
{
  "role_title": "string (e.g., 'Senior React Developer')",
  "role_category": "string (Frontend/Backend/Full-Stack/DevOps/Mobile/Data)",
  "required_skills": ["skill1", "skill2", ...],
  "preferred_skills": ["skill1", "skill2", ...],
  "minimum_experience_years": number,
  "maximum_experience_years": number,
  "seniority_level": "Junior|Mid|Senior|Lead",
  "related_technologies": ["tech1", "tech2", ...],
  "must_have_skills": ["skill1", "skill2", ...],
  "nice_to_have_skills": ["skill1", "skill2", ...],
  "key_responsibilities": ["resp1", "resp2", ...],
  "company_stage": "string or null",
  "industries": ["industry1", "industry2", ...] or [],
  "remote_status": "Remote|Hybrid|On-site|null"
}

Rules:
- Be comprehensive in inferring skills
- Map vague terms to concrete technologies
- Infer seniority from context clues
- Related technologies should include ecosystem tools
- Return both required_skills and must_have_skills for redundancy
- If information not mentioned, use sensible defaults
- Return ONLY JSON, no markdown or explanations`;

/**
 * Parses vague recruiter input into structured hiring requirements
 * Handles inputs like "Need React guy" or "Senior backend lead"
 */
export async function parseRequirement(
  recruiterInput: string
): Promise<StructuredRequirement> {
  if (!recruiterInput || recruiterInput.trim().length === 0) {
    throw new Error('Recruiter input cannot be empty');
  }

  const prompt = REQUIREMENT_PARSER_PROMPT.replace('{INPUT}', recruiterInput);

  const message = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const responseText = message.choices[0].message.content || '';

  // Extract JSON from response
  let jsonText = responseText.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }

  const result = JSON.parse(jsonText) as StructuredRequirement;

  // Validate required fields
  if (!result.role_title || !result.role_category) {
    throw new Error('Invalid requirement structure: missing role_title or role_category');
  }

  return result;
}

/**
 * Normalizes skill names to standard format
 * Maps variations to canonical names
 */
export function normalizeSkills(skills: string[]): string[] {
  const skillMap: Record<string, string> = {
    'js': 'JavaScript',
    'ts': 'TypeScript',
    'py': 'Python',
    'react.js': 'React',
    'node.js': 'Node.js',
    'sql': 'SQL',
    'nosql': 'NoSQL',
    'postgres': 'PostgreSQL',
    'mongo': 'MongoDB',
    'aws': 'AWS',
    'gcp': 'Google Cloud',
    'azure': 'Microsoft Azure',
    'docker': 'Docker',
    'k8s': 'Kubernetes',
    'rest': 'REST APIs',
    'graphql': 'GraphQL',
    'html': 'HTML',
    'css': 'CSS',
    'sass': 'SASS/SCSS',
    'tailwind': 'Tailwind CSS',
    'git': 'Git',
    'ci/cd': 'CI/CD',
  };

  return skills.map((skill) => {
    const normalized = skillMap[skill.toLowerCase().trim()] || skill.trim();
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  });
}

/**
 * Gets related skills based on primary skill
 * Creates skill ontology mapping
 */
export function getRelatedSkills(skill: string): string[] {
  const skillOntology: Record<string, string[]> = {
    'React': ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'State Management', 'JSX'],
    'Next.js': ['React', 'Node.js', 'TypeScript', 'APIs', 'SSR', 'Full-Stack'],
    'Vue': ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Vuex', 'Vue Router'],
    'Angular': ['TypeScript', 'HTML', 'CSS', 'RxJS', 'Dependency Injection'],
    'Node.js': ['JavaScript', 'Express', 'APIs', 'Databases', 'Backend'],
    'Python': ['Django', 'FastAPI', 'Flask', 'Data Science'],
    'TypeScript': ['JavaScript', 'Type Safety', 'OOP'],
    'PostgreSQL': ['SQL', 'Database Design', 'Optimization'],
    'MongoDB': ['NoSQL', 'Database Design', 'JSON'],
    'AWS': ['Cloud', 'DevOps', 'Infrastructure', 'Microservices'],
    'Docker': ['Containerization', 'DevOps', 'Kubernetes'],
    'Git': ['Version Control', 'Collaboration', 'CI/CD'],
    'REST APIs': ['API Design', 'Backend', 'HTTP'],
    'GraphQL': ['API Design', 'Data Fetching', 'Backend'],
  };

  return skillOntology[skill] || [];
}

/**
 * Determines seniority from years of experience
 */
export function determineSeniority(
  yearsOfExperience: number
): 'Junior' | 'Mid' | 'Senior' | 'Lead' {
  if (yearsOfExperience < 2) return 'Junior';
  if (yearsOfExperience < 5) return 'Mid';
  if (yearsOfExperience < 10) return 'Senior';
  return 'Lead';
}

/**
 * Gets typical years of experience for seniority level
 */
export function getExperienceRangeForSeniority(
  seniority: string
): { min: number; max: number } {
  const ranges: Record<string, { min: number; max: number }> = {
    Junior: { min: 0, max: 2 },
    Mid: { min: 2, max: 5 },
    Senior: { min: 5, max: 10 },
    Lead: { min: 10, max: 100 },
  };
  return ranges[seniority] || { min: 0, max: 100 };
}
