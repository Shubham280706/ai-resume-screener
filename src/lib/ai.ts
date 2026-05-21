import Groq from 'groq-sdk';
import { ScreeningResult } from '@/types';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SCREENING_PROMPT = `You are an expert HR recruiter analyzing a resume against a job description.
Extract detailed candidate information and provide a comprehensive screening report.

Resume:
{RESUME}

Job Description:
{JOB_DESCRIPTION}

Analyze and extract the following JSON format:
{
  "candidate_name": "Full name from resume",
  "email": "Email address if found, otherwise empty string",
  "skills": ["skill1", "skill2", "skill3", ...],
  "years_of_experience": number (total years, 0 if not found),
  "education": [
    {
      "degree": "Bachelor of Science",
      "school": "University Name",
      "graduation_year": 2019
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "Brief description",
      "technologies": ["tech1", "tech2"]
    }
  ],
  "match_score": number between 0-100,
  "strengths": ["strength 1", "strength 2", ...],
  "weaknesses": ["weakness 1", "weakness 2", ...],
  "missing_skills": ["missing skill 1", "missing skill 2", ...],
  "recommendation": "STRONG_YES|YES|MAYBE|NO",
  "summary": "2-3 sentence summary of the candidate"
}

Requirements:
- Extract ALL skills mentioned in resume as array
- Calculate years_of_experience from dates in experience section
- Extract ALL education entries with degree, school, and graduation year
- Extract top 3-5 projects/achievements with technologies used
- match_score: 0-100 based on skill alignment, experience level, and job fit
- strengths: 3-5 key strengths relevant to the job
- weaknesses: 3-5 areas where candidate falls short
- missing_skills: specific technical/soft skills missing
- recommendation: STRONG_YES (90+), YES (70-89), MAYBE (50-69), NO (<50)
- summary: actionable insights about the candidate

Return ONLY valid JSON, no markdown code blocks, no explanations.`;

export async function analyzeResume(
  resumeText: string,
  jobDescription: string
): Promise<ScreeningResult> {
  const prompt = SCREENING_PROMPT.replace('{RESUME}', resumeText).replace(
    '{JOB_DESCRIPTION}',
    jobDescription
  );

  const message = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const responseText = message.choices[0].message.content || '';

  // Extract JSON from response (remove markdown code blocks if present)
  let jsonText = responseText.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }

  const result = JSON.parse(jsonText) as ScreeningResult;
  return result;
}
