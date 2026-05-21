# Semantic AI Resume Screening - Architecture Guide

## 🎯 The Transformation

### Before (Keyword Matching)
```
Resume has "React" → Check
Resume has "JavaScript" → Check
Resume has "3 years" → Check
Match Score: Based on keyword presence
```

**Problem:** Fails on variations, inference, and semantic understanding.

### After (Semantic Understanding)
```
Resume says: "Built scalable frontend systems"
AI infers: React, Vue, Angular, SPA concepts, Frontend Architecture
AI understands: Frontend Developer

Job says: "Senior web developer"
AI transforms: Required skills, preferred skills, experience level, tech stack
AI understands: Full-Stack Developer Role

Semantic Matching: Intelligent comparison based on understanding
Deterministic Score: Weighted scoring (40% skills, 30% exp, 20% seniority, 10% education)
AI Explanation: Reasoning based on structured data
```

---

## 📊 The Five-Service Architecture

### **STEP 1: Requirement Parser Service**
**File:** `src/services/requirementParser.ts`

Converts vague recruiter input into structured criteria.

**Input:**
```
"Senior web developer"
"Need React guy urgently"
"Backend lead with startup experience"
```

**Output:**
```typescript
{
  role_title: "Senior Web Developer",
  role_category: "Full-Stack",
  required_skills: ["React", "Node.js", "TypeScript", "APIs", "CSS"],
  preferred_skills: ["AWS", "Docker", "GraphQL"],
  minimum_experience_years: 5,
  maximum_experience_years: 100,
  seniority_level: "Senior",
  related_technologies: ["Next.js", "Express", "PostgreSQL", ...],
  must_have_skills: [...],
  nice_to_have_skills: [...]
}
```

**Key Functions:**
- `parseRequirement()` - Converts text to structured format
- `normalizeSkills()` - Standardizes skill names
- `getRelatedSkills()` - Builds skill ontology
- `determineSeniority()` - Infers from years/context

**Why It Matters:**
- HR people never write clean requirements
- AI must interpret intent from vague input
- Creates consistent evaluation criteria

---

### **STEP 2: Semantic Resume Parser**
**File:** `src/services/semanticResumeParser.ts`

Extracts AND INFERS candidate information.

**Input:**
```
Resume text from PDF/DOCX
```

**Output:**
```typescript
{
  candidate_name: "John Anderson",
  email: "john@example.com",
  skills: ["React", "Node.js", "TypeScript"],
  inferred_skills: ["Express", "REST APIs", "Frontend Architecture"],
  frontend_skills: ["React", "HTML", "CSS", "TypeScript"],
  backend_skills: ["Node.js", "Express", "PostgreSQL"],
  devops_skills: ["Docker", "AWS"],
  years_of_experience: 5,
  seniority_level: "Senior",
  key_achievements: [...],
  projects: [{title, description, technologies, impact}],
  industries_experience: ["fintech", "healthtech"],
  company_types_experience: ["startup", "enterprise"],
  remote_experience: true,
  leadership_experience: true
}
```

**Key Functions:**
- `parseResumeSemantics()` - Extracts and infers
- `calculateSkillSimilarity()` - Compares skills semantically
- `hasRelevantExperience()` - Domain matching
- `hasStartupExperience()` - Detects startup background

**Why It Matters:**
- Extracts what's explicitly stated (skills: React)
- INFERS what's implied (related: Express, REST APIs)
- Detects seniority from progression
- Identifies domain expertise
- Finds leadership experience

---

### **STEP 3: Scoring Engine**
**File:** `src/services/scoringEngine.ts`

Deterministic, explainable scoring (NOT pure AI guessing).

**Scoring Formula:**
```
Total Score = 
  (Skills Score × 40%) +
  (Experience Score × 30%) +
  (Seniority Score × 20%) +
  (Education Score × 10%)
```

**Example Breakdown:**
```
Skills Score (40%): 85
  - 8/10 required skills matched
  - 2 related skills matched
  - Missing: Python, Kubernetes

Experience Score (30%): 95
  - 5 years required, has 5 years
  - Perfect range match

Seniority Score (20%): 100
  - Senior required, candidate is Senior
  - Perfect match

Education Score (10%): 100
  - Has CS degree (relevant)

Total: (85×0.4) + (95×0.3) + (100×0.2) + (100×0.1) = 91/100
```

**Key Functions:**
- `calculateScore()` - Weighted scoring
- `calculateSkillsScore()` - Analyzes skill alignment
- `calculateExperienceScore()` - Years of experience match
- `calculateSeniorityScore()` - Seniority alignment
- `getRecommendation()` - Converts score to STRONG_YES/YES/MAYBE/NO

**Score Interpretation:**
```
80+: STRONG_YES - Move to phone screen
65-79: YES - Consider for interview
50-64: MAYBE - Review carefully
<50: NO - Look for other candidates
```

**Why It Matters:**
- Consistent, explainable scoring
- No pure AI bias in final score
- Clear weight distribution
- Audit trail for hiring decisions
- Data-driven recommendations

---

### **STEP 4: AI Analyzer Service**
**File:** `src/services/aiAnalyzer.ts`

Uses AI for reasoning, explanations, and recommendations (NOT primary scoring).

**Input:**
```
Candidate data + Requirement data + Score breakdown
(All structured, no guessing)
```

**Output:**
```typescript
{
  key_strengths: [
    "5+ years React experience - matches Senior requirement",
    "Full-stack capability with Node.js backend"
  ],
  gaps_and_concerns: [
    "No Kubernetes experience - may need onboarding",
    "Startup background only - enterprise culture adjustment needed"
  ],
  recommendation_reasoning: "Strong technical match (91%) with excellent React/Node expertise. Limited DevOps knowledge is teachable. Recommend moving to interview.",
  interview_focus_areas: [
    "Kubernetes and container orchestration experience",
    "Scaling systems at enterprise level",
    "Leadership style and team mentoring approach"
  ],
  overall_fit_summary: "Excellent technical match. Strong startup background. May need enterprise processes training."
}
```

**Key Functions:**
- `analyzeCandidate()` - AI-powered analysis
- `getHiringRecommendation()` - Detailed recommendation
- `compareCandidates()` - Multi-candidate analysis

**Why It Matters:**
- AI provides context, not numbers
- Explains the "why" behind scores
- Identifies focus areas for interviews
- Uncovers hidden potential
- Creates conversational feedback

---

### **STEP 5: Semantic Matcher**
**File:** `src/services/semanticMatcher.ts`

Intelligent matching using skill ontology.

**Skill Ontology:**
```typescript
{
  React: ['JavaScript', 'TypeScript', 'JSX', 'State Management'],
  'Next.js': ['React', 'Node.js', 'API Routes', 'SSR', 'Full-Stack'],
  Docker: ['Containerization', 'DevOps', 'Kubernetes'],
  ...
}
```

**Example Match:**
```
Job requires: React
Candidate has: Vue + Angular + strong JavaScript

Matching algorithm:
- No exact React match (-10 points)
- Has Vue & Angular (related frameworks) (+7 points)
- Has JavaScript foundation (+5 points)
- Skill Match: 67% (trainable on React)

Recommendation: "Can learn React quickly - has solid frontend foundation"
```

**Key Functions:**
- `semanticMatch()` - Overall matching
- `matchSkillsSemantics()` - Intelligent skill comparison
- `buildSkillOntology()` - Technology relationships
- `matchExperience()` - Experience level matching

**Why It Matters:**
- Recognizes framework similarities
- Gives credit for related skills
- Identifies transferable knowledge
- More flexible than keyword matching
- Understands technology relationships

---

## 🔄 Complete Workflow

### 1️⃣ Recruiter Input
```
"Need a strong React developer with backend skills, startup experience preferred"
```

### 2️⃣ Requirement Parsing
```
requirementParser.parseRequirement(input)
↓
{
  role_title: "React Developer",
  role_category: "Full-Stack",
  required_skills: ["React", "JavaScript", "APIs", "Node.js"],
  preferred_skills: ["Startup", "Leadership"],
  minimum_experience_years: 3,
  seniority_level: "Mid",
  related_technologies: [...]
}
```

### 3️⃣ Resume Parsing
```
semanticResumeParser.parseResumeSemantics(resumeText)
↓
{
  candidate_name: "Jane Smith",
  skills: ["React", "JavaScript", "Express"],
  inferred_skills: ["REST APIs", "Frontend Architecture"],
  years_of_experience: 4,
  seniority_level: "Mid",
  company_types_experience: ["startup"],
  ...
}
```

### 4️⃣ Semantic Matching
```
semanticMatcher.semanticMatch(candidate, requirement)
↓
{
  overall_match: 87,
  skill_match: 90,
  experience_match: 95,
  seniority_match: 100,
  matched_skills: ["React", "JavaScript", "APIs"],
  unmatched_required_skills: ["Node.js"],
  bonus_skills: ["Express", "Startup exp"]
}
```

### 5️⃣ Deterministic Scoring
```
scoringEngine.calculateScore(candidate, requirement)
↓
{
  skills_score: 85,      // 40% weight
  experience_score: 95,  // 30% weight
  seniority_score: 100,  // 20% weight
  education_score: 100,  // 10% weight
  total_score: 91        // STRONG_YES
}
```

### 6️⃣ AI Analysis
```
aiAnalyzer.analyzeCandidate(candidate, requirement, scoreBreakdown)
↓
{
  key_strengths: [
    "Perfect React match - 4 years experience",
    "Startup background aligns with company"
  ],
  gaps_and_concerns: [
    "Express used, no Node.js explicitly mentioned - needs verification"
  ],
  recommendation_reasoning: "Strong match (91%) - React expert with startup culture fit. Missing piece is Node.js confirmation.",
  interview_focus_areas: [
    "Verify Node.js/Express backend experience",
    "Scaling challenges in startup"
  ]
}
```

### 7️⃣ Final Result
```
{
  candidate: Jane Smith,
  score: 91/100,
  recommendation: STRONG_YES,
  reasoning: [
    "Strong technical match with 90% skill overlap",
    "4 years aligns perfectly with requirement",
    "Startup experience is bonus",
    "Small Node.js gap - easily trainable"
  ],
  action: "Move to phone screen"
}
```

---

## 💡 Key Insights

### Vague Job Input → Smart AI Interpretation
```
Input: "Senior backend expert with DevOps"

AI transforms to:
- Role: Backend Engineer (Senior)
- Required: Node.js, Python, SQL, APIs
- Preferred: Docker, AWS, Kubernetes
- Years: 5-10
- Inferred: Microservices, System Design
```

### Resume Inference
```
Resume says: "Architected microservices for 2M users"

AI infers:
- Backend expertise ✓
- System design ✓
- Scalability thinking ✓
- Probably: Docker, Kubernetes, APIs
- Probably: AWS or cloud background
```

### Semantic Skill Matching
```
Job: "Need React expert"

Candidate has: Vue + Angular + 5 years frontend

Match: 70% (has framework skills, not React specifically)
Reason: Can learn React quickly - has solid frontend foundation
Action: Interview + React technical assessment
```

---

## 📈 Advantages Over Old System

| Aspect | Old (Keyword) | New (Semantic) |
|--------|---------------|----------------|
| **Input** | Requires exact job description | Handles vague recruiter input |
| **Matching** | Keyword presence only | Semantic understanding |
| **Inference** | None - takes resume at face value | Infers related skills/experience |
| **Scoring** | Pure AI (black box) | Deterministic + weighted |
| **Consistency** | Varies by prompt | Consistent across candidates |
| **Explainability** | "AI says 75%" | "Skills 85%, Exp 95%, Seniority 100%" |
| **Edge Cases** | Fails on similar frameworks | "Vue developer can learn React" |
| **Hiring Quality** | Lower (misses good candidates) | Higher (identifies hidden potential) |

---

## 🚀 Implementation Priority

### Phase 1 (Now)
- ✅ RequirementParser - AI interprets vague input
- ✅ SemanticResumeParser - AI infers skills
- ✅ ScoringEngine - Deterministic scoring
- ✅ SemanticMatcher - Skill ontology matching

### Phase 2 (Soon)
- Update API route to use new services
- Migrate UI to display new insights
- A/B test new scoring vs. old

### Phase 3 (Later)
- Add candidate comparison
- Build skill gap training recommendations
- Create hiring trend analytics

---

## 📋 File Structure

```
src/services/
├── requirementParser.ts          # Parse vague input → structured requirements
├── semanticResumeParser.ts       # Extract + infer from resume
├── scoringEngine.ts              # Deterministic scoring (40/30/20/10)
├── aiAnalyzer.ts                 # AI reasoning & explanations
├── semanticMatcher.ts            # Intelligent skill matching
└── [old services]
```

---

## 🎓 Using the New Services

### Example: Complete Candidate Evaluation

```typescript
import { parseRequirement } from '@/services/requirementParser';
import { parseResumeSemantics } from '@/services/semanticResumeParser';
import { semanticMatch } from '@/services/semanticMatcher';
import { calculateScore } from '@/services/scoringEngine';
import { analyzeCandidate } from '@/services/aiAnalyzer';

// 1. Parse recruiter input
const requirement = await parseRequirement(
  "Senior React developer, startup background preferred"
);

// 2. Parse resume
const candidate = await parseResumeSemantics(resumeText);

// 3. Semantic matching
const matching = semanticMatch(candidate, requirement);

// 4. Deterministic scoring
const scoreBreakdown = calculateScore(candidate, requirement);

// 5. AI analysis
const analysis = await analyzeCandidate(
  candidate,
  requirement,
  scoreBreakdown
);

// Result: Complete candidate evaluation with explainable scoring!
```

---

## ✨ This Is Now

**A Real AI Recruiting Intelligence Platform**

Not:
- ❌ Keyword matcher
- ❌ Resume parser
- ❌ Simple score calculator

But:
- ✅ Semantic understanding engine
- ✅ Intelligent requirement interpreter
- ✅ Explainable AI scoring
- ✅ Multi-candidate ranking
- ✅ Interview preparation guide
- ✅ Hiring intelligence platform

---

## 🎯 Next Steps

1. **Update API route** to use new services
2. **Update UI** to show score breakdown
3. **Update database schema** to store requirement data
4. **Add candidate comparison** view
5. **Build skill gap analysis**
6. **Add training recommendations**

Each feature leverages the semantic foundation you've built.

---

**This is the future of AI-powered recruiting.** 🚀
