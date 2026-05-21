# Integration Guide - Semantic Services into API

## How to Integrate New Semantic Services

### STEP 1: Update API Route to Use New Services

**File:** `src/app/api/analyze/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromFile } from '@/lib/parser';
import { parseRequirement } from '@/services/requirementParser';
import { parseResumeSemantics } from '@/services/semanticResumeParser';
import { calculateScore, getRecommendation, getScoreExplanation } from '@/services/scoringEngine';
import { semanticMatch } from '@/services/semanticMatcher';
import { analyzeCandidate } from '@/services/aiAnalyzer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const jobDescriptionInput = formData.get('jobDescription') as string;

    // Validation
    if (!file || !jobDescriptionInput?.trim()) {
      return NextResponse.json(
        { error: 'File and job description required' },
        { status: 400 }
      );
    }

    // STEP 1: Parse recruiter input into structured requirement
    const requirement = await parseRequirement(jobDescriptionInput);

    // STEP 2: Extract resume text
    const resumeText = await extractTextFromFile(file);
    if (!resumeText) {
      return NextResponse.json(
        { error: 'Could not extract resume text' },
        { status: 400 }
      );
    }

    // STEP 3: Parse resume semantically
    const candidate = await parseResumeSemantics(resumeText);

    // STEP 4: Semantic matching
    const matching = semanticMatch(candidate, requirement);

    // STEP 5: Deterministic scoring
    const scoreBreakdown = calculateScore(candidate, requirement);

    // STEP 6: AI-powered analysis
    const analysis = await analyzeCandidate(candidate, requirement, scoreBreakdown);

    // STEP 7: Get recommendation
    const recommendation = getRecommendation(scoreBreakdown.total_score);

    // STEP 8: Format response
    const response = {
      // Candidate info
      candidate_name: candidate.candidate_name,
      email: candidate.email,
      years_of_experience: candidate.years_of_experience,
      seniority_level: candidate.seniority_level,

      // Structured requirement
      job_requirement: requirement,

      // Semantic matching
      semantic_match: {
        overall_match: matching.overall_match,
        skill_match: matching.skill_match,
        experience_match: matching.experience_match,
        seniority_match: matching.seniority_match,
        matched_skills: matching.matched_skills,
        unmatched_skills: matching.unmatched_required_skills,
        bonus_skills: matching.bonus_skills,
        reasoning: matching.match_reasoning,
      },

      // Deterministic scoring
      scoring: {
        total_score: scoreBreakdown.total_score,
        skills_score: scoreBreakdown.skills_score,
        experience_score: scoreBreakdown.experience_score,
        seniority_score: scoreBreakdown.seniority_score,
        education_score: scoreBreakdown.education_score,
        breakdown: scoreBreakdown.details,
        score_explanation: getScoreExplanation(scoreBreakdown),
      },

      // AI analysis
      analysis: {
        key_strengths: analysis.key_strengths,
        gaps_and_concerns: analysis.gaps_and_concerns,
        recommendation_reasoning: analysis.recommendation_reasoning,
        interview_focus_areas: analysis.interview_focus_areas,
        overall_fit_summary: analysis.overall_fit_summary,
      },

      // Final recommendation
      recommendation: recommendation.recommendation,
      recommendation_message: recommendation.message,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error analyzing resume:', error);
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
```

---

### STEP 2: Update TypeScript Types

**File:** `src/types/index.ts` - Add new types:

```typescript
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
}

export interface SemanticCandidate {
  candidate_name: string;
  email: string;
  skills: string[];
  inferred_skills: string[];
  frontend_skills: string[];
  backend_skills: string[];
  devops_skills: string[];
  years_of_experience: number;
  seniority_level: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  key_achievements: string[];
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    impact: string;
  }>;
}

export interface SemanticAnalysisResult {
  candidate_name: string;
  job_requirement: StructuredRequirement;
  semantic_match: {
    overall_match: number;
    skill_match: number;
    experience_match: number;
    seniority_match: number;
  };
  scoring: {
    total_score: number;
    skills_score: number;
    experience_score: number;
    seniority_score: number;
  };
  analysis: {
    key_strengths: string[];
    gaps_and_concerns: string[];
    recommendation_reasoning: string;
    interview_focus_areas: string[];
  };
  recommendation: 'STRONG_YES' | 'YES' | 'MAYBE' | 'NO';
}
```

---

### STEP 3: Update UI to Display New Insights

**Update components/ResumeUploader.tsx** - New result display:

```typescript
function DetailedResult({ item }: { item: BatchResult }) {
  const candidate = item.result;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900">
          {candidate.candidate_name}
        </h3>
        <p className="text-blue-600">{candidate.email}</p>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-slate-50 rounded">
        <div>
          <p className="text-xs text-slate-600 mb-1">Skills (40%)</p>
          <p className="text-2xl font-bold text-blue-600">
            {candidate.scoring?.skills_score || 0}%
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-600 mb-1">Experience (30%)</p>
          <p className="text-2xl font-bold text-green-600">
            {candidate.scoring?.experience_score || 0}%
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-600 mb-1">Seniority (20%)</p>
          <p className="text-2xl font-bold text-purple-600">
            {candidate.scoring?.seniority_score || 0}%
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-600 mb-1">Education (10%)</p>
          <p className="text-2xl font-bold text-orange-600">
            {candidate.scoring?.education_score || 0}%
          </p>
        </div>
      </div>

      {/* Job Requirement */}
      {candidate.job_requirement && (
        <div className="mb-8 p-4 bg-blue-50 rounded border border-blue-200">
          <h4 className="font-bold text-slate-900 mb-3">Job Requirement</h4>
          <p className="text-sm font-medium mb-2">
            {candidate.job_requirement.role_title}
          </p>
          <p className="text-xs text-slate-600">
            Required: {candidate.job_requirement.required_skills.join(', ')}
          </p>
          <p className="text-xs text-slate-600">
            {candidate.job_requirement.minimum_experience_years}-
            {candidate.job_requirement.maximum_experience_years} years,{' '}
            {candidate.job_requirement.seniority_level}
          </p>
        </div>
      )}

      {/* Semantic Matching */}
      {candidate.semantic_match && (
        <div className="mb-8">
          <h4 className="font-bold text-slate-900 mb-3">Semantic Matching</h4>
          <div className="space-y-2">
            {candidate.semantic_match.reasoning?.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-slate-700">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Analysis */}
      {candidate.analysis && (
        <>
          <div className="mb-8">
            <h4 className="font-bold text-slate-900 mb-3">Key Strengths</h4>
            <ul className="space-y-2">
              {candidate.analysis.key_strengths?.map((strength, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-slate-700">
                  <span className="text-green-600">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h4 className="font-bold text-slate-900 mb-3">Gaps & Concerns</h4>
            <ul className="space-y-2">
              {candidate.analysis.gaps_and_concerns?.map((gap, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-slate-700">
                  <span className="text-red-600">!</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h4 className="font-bold text-slate-900 mb-3">Interview Focus Areas</h4>
            <ul className="space-y-2">
              {candidate.analysis.interview_focus_areas?.map((area, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-slate-700">
                  <span className="text-blue-600">→</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Recommendation */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded border border-blue-200">
        <p className="text-sm font-semibold text-slate-900 mb-2">
          Recommendation: {candidate.recommendation}
        </p>
        <p className="text-sm text-slate-700">{candidate.analysis?.recommendation_reasoning}</p>
      </div>
    </div>
  );
}
```

---

## Real-World Example

### Input
```
Recruiter: "Looking for senior backend developer with some DevOps"
Resume: "Built microservices with Node.js and Docker at startup"
```

### Processing
```
1. Requirement Parser:
   ✓ Role: Senior Backend Engineer
   ✓ Required: Node.js, Express, SQL, APIs
   ✓ Preferred: Docker, Kubernetes, AWS
   ✓ Min Years: 5, Seniority: Senior

2. Resume Parser:
   ✓ Extracted: Node.js, Docker, Express
   ✓ Inferred: REST APIs, Microservices, System Design
   ✓ Years: 4, Seniority: Mid

3. Semantic Match:
   ✓ Skills: 85% (has core backend stack)
   ✓ Experience: 80% (1 year below requirement)
   ✓ Seniority: 75% (Mid vs Senior)

4. Score Breakdown:
   ✓ Skills: 85% (40% weight) = 34 points
   ✓ Experience: 80% (30% weight) = 24 points
   ✓ Seniority: 75% (20% weight) = 15 points
   ✓ Education: 100% (10% weight) = 10 points
   → Total: 83/100 = YES

5. AI Analysis:
   ✓ Strengths: "Solid backend engineer with DevOps skills"
   ✓ Gaps: "One year below Senior level requirement"
   ✓ Interview: "Ask about leadership in last role"
   ✓ Fit: "Strong technical match, consider for Senior role with mentoring"
```

### Output
```json
{
  "candidate_name": "Alex Johnson",
  "recommendation": "YES",
  "total_score": 83,
  "scoring": {
    "skills_score": 85,
    "experience_score": 80,
    "seniority_score": 75,
    "education_score": 100
  },
  "analysis": {
    "key_strengths": [
      "Solid Node.js and Express backend expertise",
      "Docker experience shows DevOps thinking",
      "Startup background demonstrates adaptability"
    ],
    "gaps_and_concerns": [
      "4 years vs 5 year minimum - junior by 1 year",
      "No explicit Kubernetes or cloud platform mentioned",
      "Mid level vs Senior requirement - growth opportunity"
    ],
    "recommendation_reasoning": "Strong backend engineer (83%) with DevOps foundations. One year below Senior level but has right trajectory. Recommend for interview - could be Senior with right mentoring.",
    "interview_focus_areas": [
      "Leadership and mentoring experience in startup",
      "Scaling systems beyond current scope",
      "Cloud platform and Kubernetes learning plans"
    ]
  }
}
```

---

## Benefits of This Approach

✅ **Explainable AI** - Show HR exactly why a score is 83/100
✅ **Consistent** - Same candidate gets same score every time
✅ **Flexible** - Handles vague recruiter input
✅ **Semantic** - Understands framework similarities, startup experience
✅ **Data-Driven** - 40/30/20/10 weighting is auditable
✅ **Actionable** - Interview focus areas ready to go
✅ **Smart** - Infers hidden skills from experience

---

## Next: Advanced Features

### 1. Candidate Comparison
```typescript
const candidates = [alex, jane, bob];
const ranked = rankCandidates(candidates, requirement);
// Returns: Top 3 with reasoning why each is better/worse
```

### 2. Skill Gap Analysis
```typescript
const gaps = findSkillGaps(candidate, requirement);
// Returns: "Python", "Kubernetes", "AWS"
// With: "Can learn in 2-3 months with training"
```

### 3. Training Recommendations
```typescript
const training = recommendTraining(candidate, requirement);
// Returns: Course recommendations for missing skills
```

### 4. Team Composition Analysis
```typescript
const team = analyzeTeamFit(candidate, existingTeam);
// Returns: "Complements team well - you need this DevOps expertise"
```

---

This is the semantic recruiting intelligence platform! 🚀
