import Groq from 'groq-sdk';
import { StructuredRequirement } from './requirementParser';
import { SemanticCandidate } from './semanticResumeParser';
import { ScoreBreakdown } from './scoringEngine';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface AnalysisExplanation {
  key_strengths: string[];
  gaps_and_concerns: string[];
  recommendation_reasoning: string;
  interview_focus_areas: string[];
  overall_fit_summary: string;
}

/**
 * Uses AI to provide reasoning and explanations
 * Based on structured score breakdown, not pure AI scoring
 */
export async function analyzeCandidate(
  candidate: SemanticCandidate,
  requirement: StructuredRequirement,
  scoreBreakdown: ScoreBreakdown
): Promise<AnalysisExplanation> {
  const prompt = `You are an expert HR analyst. Analyze this candidate against the job requirement based on structured data.

JOB REQUIREMENT:
- Role: ${requirement.role_title} (${requirement.seniority_level})
- Required Skills: ${requirement.required_skills.join(', ')}
- Preferred Skills: ${requirement.preferred_skills.join(', ')}
- Experience: ${requirement.minimum_experience_years}-${requirement.maximum_experience_years} years

CANDIDATE PROFILE:
- Name: ${candidate.candidate_name}
- Seniority: ${candidate.seniority_level}
- Years of Experience: ${candidate.years_of_experience}
- Skills: ${candidate.skills.join(', ')}
- Inferred Skills: ${candidate.inferred_skills.join(', ')}
- Frontend: ${candidate.frontend_skills.join(', ')}
- Backend: ${candidate.backend_skills.join(', ')}
- DevOps: ${candidate.devops_skills.join(', ')}
- Key Achievements: ${candidate.key_achievements.slice(0, 3).join(', ')}
- Industries: ${candidate.industries_experience.join(', ')}
- Startup Experience: ${candidate.company_types_experience.includes('startup') ? 'Yes' : 'No'}
- Leadership: ${candidate.leadership_experience ? 'Yes' : 'No'}

SCORING BREAKDOWN:
- Skills Score: ${scoreBreakdown.skills_score}% (40% weight)
- Experience Score: ${scoreBreakdown.experience_score}% (30% weight)
- Seniority Score: ${scoreBreakdown.seniority_score}% (20% weight)
- Education Score: ${scoreBreakdown.education_score}% (10% weight)
- Total Score: ${scoreBreakdown.total_score}/100

MISSING SKILLS:
${scoreBreakdown.details.skills.missing_required.join(', ')}

Provide analysis in JSON format ONLY:
{
  "key_strengths": [
    "strength 1 - explain why this matters",
    "strength 2 - explain why this matters"
  ],
  "gaps_and_concerns": [
    "gap 1 - explain impact",
    "gap 2 - explain impact"
  ],
  "recommendation_reasoning": "2-3 sentences explaining the recommendation based on the score",
  "interview_focus_areas": [
    "area 1 to explore",
    "area 2 to explore"
  ],
  "overall_fit_summary": "1-2 sentence summary of how well this candidate fits the role"
}

Rules:
- Base analysis on the scores provided, not intuition
- Focus on objective factors (skills, experience, seniority)
- Acknowledge both strengths and gaps
- Be specific and actionable
- Return ONLY JSON`;

  const message = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1000,
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

  const result = JSON.parse(jsonText) as AnalysisExplanation;

  return result;
}

/**
 * Generates hiring recommendation with reasoning
 */
export async function getHiringRecommendation(
  candidate: SemanticCandidate,
  requirement: StructuredRequirement,
  scoreBreakdown: ScoreBreakdown,
  analysis: AnalysisExplanation
): Promise<string> {
  const score = scoreBreakdown.total_score;

  const recommendation = score >= 80 ? 'STRONG_YES' : score >= 65 ? 'YES' : score >= 50 ? 'MAYBE' : 'NO';

  return `
${candidate.candidate_name} - ${recommendation}

Overall Score: ${score}/100

${analysis.overall_fit_summary}

Key Strengths:
${analysis.key_strengths.map((s) => `• ${s}`).join('\n')}

Gaps & Concerns:
${analysis.gaps_and_concerns.map((g) => `• ${g}`).join('\n')}

Why This Recommendation:
${analysis.recommendation_reasoning}

Interview Focus Areas:
${analysis.interview_focus_areas.map((area) => `• ${area}`).join('\n')}

Scoring Breakdown:
• Skills: ${scoreBreakdown.skills_score}%
• Experience: ${scoreBreakdown.experience_score}%
• Seniority: ${scoreBreakdown.seniority_score}%
• Education: ${scoreBreakdown.education_score}%
  `;
}

/**
 * Compares multiple candidates
 */
export function compareCandidates(
  candidates: Array<{
    name: string;
    score: number;
    recommendation: string;
  }>
): {
  ranked: typeof candidates;
  top3: typeof candidates;
  comparison_summary: string;
} {
  const ranked = [...candidates].sort((a, b) => b.score - a.score);
  const top3 = ranked.slice(0, 3);

  const comparison_summary = `
Top Candidate: ${top3[0].name} (${top3[0].score}/100 - ${top3[0].recommendation})

Top candidates are well-matched for the role. Review interview focus areas for each.
  `;

  return {
    ranked,
    top3,
    comparison_summary,
  };
}
