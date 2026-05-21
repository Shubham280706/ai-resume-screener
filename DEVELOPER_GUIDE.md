# Developer Guide - AI Resume Screener

## Quick Start

### 1. Setup
```bash
npm install
```

### 2. Environment Variables
```bash
echo "GROQ_API_KEY=your_key_here" > .env.local
```

Get your Groq API key from: https://console.groq.com/keys

### 3. Development Server
```bash
npm run dev
```

Open http://localhost:3000

### 4. Build
```bash
npm run build
```

## Using the Services

### Resume Service
Handles resume file analysis:

```typescript
import { analyzeResumeFile, batchAnalyzeResumes } from '@/services/resumeService';

// Single file analysis
const response = await analyzeResumeFile({
  file: resumeFile,
  jobDescription: jobDesc,
});

if (response.success) {
  console.log(response.data); // ScreeningResult
} else {
  console.log(response.error);
}

// Batch analysis with progress
const results = await batchAnalyzeResumes(
  files,
  jobDescription,
  (current, total) => console.log(`${current}/${total}`)
);
```

### Ranking Service
Sort and filter candidates:

```typescript
import {
  sortCandidates,
  filterCandidates,
  getRankingStats,
} from '@/services/rankingService';

// Sort by score (highest first)
const ranked = sortCandidates(candidates, 'score', 'desc');

// Filter strong candidates
const strong = filterCandidates(candidates, {
  minScore: 75,
  minExperience: 3,
});

// Get statistics
const stats = getRankingStats(candidates);
console.log(`Average: ${stats.averageScore}%`);
console.log(`Top: ${stats.topScore}%`);
```

## Using the Custom Hook

Manage batch analysis state:

```typescript
'use client';

import { useBatchAnalysis } from '@/hooks/useBatchAnalysis';

export function MyComponent() {
  const {
    files,
    jobDescription,
    isLoading,
    error,
    addFiles,
    removeFile,
    setJobDescription,
    analyzeBatch,
    getRankedResults,
    getStats,
    reset,
  } = useBatchAnalysis();

  return (
    <>
      {/* Upload files */}
      <input
        type="file"
        multiple
        onChange={(e) => addFiles(Array.from(e.target.files || []))}
      />

      {/* Job description */}
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      {/* Analyze */}
      <button onClick={analyzeBatch} disabled={isLoading}>
        Analyze
      </button>

      {/* Results */}
      {!isLoading && (
        <>
          <div>Stats: {JSON.stringify(getStats())}</div>
          <div>
            {getRankedResults().map((candidate) => (
              <div key={candidate.candidate_name}>
                {candidate.candidate_name} - {candidate.match_score}%
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
```

## Using Utilities

### File Utilities
```typescript
import {
  isValidResumeFile,
  validateResumeFiles,
  isFileSizeValid,
  formatFileSize,
  getFileDisplayName,
} from '@/utils/fileUtils';

// Validate file
if (!isValidResumeFile(file)) {
  console.error('Invalid file format');
}

// Validate batch
const { validFiles, invalidCount } = validateResumeFiles(files);

// Check size
if (!isFileSizeValid(file, 5)) {
  console.error('File too large');
}

// Format for display
console.log(formatFileSize(file.size)); // "2.5 MB"
console.log(getFileDisplayName(file.name)); // "resume"
```

### Formatters
```typescript
import {
  getScoreColor,
  getRecommendationColor,
  formatRecommendation,
  formatExperience,
  truncateText,
} from '@/utils/formatters';

// Colors for UI
<div className={getScoreColor(score)}>85%</div>
<div className={getRecommendationColor(recommendation)}>
  {formatRecommendation(recommendation)}
</div>

// Text formatting
<p>{formatExperience(5)}</p> // "5 years"
<p>{truncateText(summary, 100)}</p> // "Summary..." if too long
```

## API Endpoint

### POST /api/analyze

Request:
```typescript
FormData {
  file: File,
  jobDescription: string
}
```

Response:
```typescript
{
  candidate_name: string;
  email: string;
  skills: string[];
  years_of_experience: number;
  education: EducationEntry[];
  projects: ProjectEntry[];
  match_score: number;
  recommendation: string;
  strengths: string[];
  weaknesses: string[];
  missing_skills: string[];
  summary: string;
}
```

Error Response:
```typescript
{
  error: string
}
```

## Extending the System

### Adding New Sort Options

Edit `services/rankingService.ts`:

```typescript
export type SortBy = 'score' | 'name' | 'experience' | 'email'; // Add new type

export function sortCandidates(
  candidates: ScreeningResult[],
  sortBy: SortBy = 'score',
  order: SortOrder = 'desc'
): ScreeningResult[] {
  // Add case in switch
  case 'email':
    comparison = a.email.localeCompare(b.email);
    break;
  // ...
}
```

### Adding New Filters

Edit `services/rankingService.ts`:

```typescript
export interface RankingFilter {
  // Add new filter field
  hasProjectExperience?: boolean;
  requiredSkill?: string;
}

export function filterCandidates(
  candidates: ScreeningResult[],
  filter: RankingFilter
): ScreeningResult[] {
  // Add filter logic
  if (filter.requiredSkill) {
    candidates = candidates.filter((c) =>
      c.skills.includes(filter.requiredSkill)
    );
  }
  // ...
}
```

### Changing AI Model

Edit `src/lib/ai.ts`:

```typescript
const message = await client.chat.completions.create({
  model: 'mixtral-8x7b-32768', // Change model here
  max_tokens: 2048,
  messages: [/*...*/],
});
```

Available Groq models:
- `llama-3.3-70b-versatile`
- `gemma-2-9b-it`
- `llama-3.1-8b-instant`

### Adding Batch Retry Logic

Edit `services/resumeService.ts`:

```typescript
export async function analyzeResumeFileWithRetry(
  request: ResumeAnalysisRequest,
  maxRetries: number = 3
): Promise<ResumeAnalysisResponse> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await analyzeResumeFile(request);
    if (response.success) return response;

    // Exponential backoff
    await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
  }
  return { success: false, error: 'Max retries exceeded' };
}
```

## Testing

### Test Resume Parsing
```typescript
import { extractTextFromFile } from '@/lib/parser';

const text = await extractTextFromFile(pdfFile);
console.log(text); // Extracted text
```

### Test Rankings
```typescript
import { sortCandidates, filterCandidates } from '@/services/rankingService';

const candidates = [/* ... */];
const ranked = sortCandidates(candidates);
const filtered = filterCandidates(candidates, { minScore: 75 });
```

### Test Formatters
```typescript
import { getScoreColor, formatExperience } from '@/utils/formatters';

expect(getScoreColor(85)).toBe('bg-green-100 text-green-800');
expect(formatExperience(5)).toBe('5 years');
```

## Debugging

### Enable Logs
```typescript
// In services/resumeService.ts
console.log('Processing:', request.file.name);
console.log('Response:', response.data);
```

### Check API Response
```typescript
const response = await fetch('/api/analyze', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
console.log('API Response:', data);
```

### Monitor Progress
```typescript
const results = await batchAnalyzeResumes(
  files,
  jobDescription,
  (current, total) => {
    console.log(`Progress: ${current}/${total}`);
    // Update UI progress bar
  }
);
```

## Performance Tips

1. **Batch Size** - Process max 10-20 resumes per batch
2. **Delay** - 500ms between API calls prevents rate limiting
3. **UI Updates** - Use progress callback for responsive UI
4. **File Size** - Keep resumes under 5MB
5. **Caching** - Results are cached in hook state

## Common Issues

### API Rate Limit
- Check Groq API quota
- Increase delay in `batchAnalyzeResumes`
- Process smaller batches

### PDF Parsing Errors
- Ensure PDF is not corrupted
- Try DOCX format instead
- Check file encoding

### Out of Memory
- Process fewer files per batch
- Clear results between batches
- Use pagination for large datasets

## Support

For issues or questions:
1. Check ARCHITECTURE.md
2. Review service implementations
3. Check TypeScript types for guidance
4. Test with sample resume
