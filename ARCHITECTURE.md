# NexHire - Architecture & Project Structure

## Overview
Batch AI resume screening system for HR teams built with Next.js 15, TypeScript, Tailwind CSS, and Groq AI API.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts         # API endpoint for resume analysis
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Tailwind styles
│
├── components/
│   └── ResumeUploader.tsx        # Main UI component (batch upload & results)
│
├── hooks/
│   └── useBatchAnalysis.ts       # Custom hook for batch processing state
│
├── services/
│   ├── resumeService.ts          # Resume file analysis logic
│   └── rankingService.ts         # Candidate ranking & filtering logic
│
├── lib/
│   ├── parser.ts                 # PDF/DOCX text extraction
│   └── ai.ts                     # Groq AI API integration
│
├── types/
│   └── index.ts                  # TypeScript interfaces
│
└── utils/
    ├── fileUtils.ts              # File validation & formatting
    └── formatters.ts             # UI text & styling formatters
```

## Core Features

### 1. **Resume Upload** (`components/ResumeUploader.tsx`)
- Drag-and-drop multi-file upload
- PDF & DOCX support
- File list with remove option
- Job description textarea with helper guide

### 2. **Batch Processing** (`services/resumeService.ts`)
- Sequential resume analysis (prevents API overload)
- Error handling per file
- Progress tracking
- Rate limiting (500ms between requests)

### 3. **AI Analysis** (`lib/ai.ts`)
- Groq LLaMA 3.3 integration
- Extracts detailed candidate data:
  - Name, email
  - Skills (array)
  - Years of experience
  - Education (degree, school, year)
  - Projects (title, description, technologies)
  - Match score (0-100)
  - Recommendation (STRONG_YES|YES|MAYBE|NO)
  - Strengths & weaknesses
  - Summary

### 4. **Candidate Ranking** (`services/rankingService.ts`)
- Sort by score, name, or experience
- Filter by score range, recommendation, experience
- Ranking statistics (avg score, top/bottom, strong candidates)

### 5. **Custom Hook** (`hooks/useBatchAnalysis.ts`)
- Manages batch analysis state
- File management
- Result ranking and statistics
- Progress tracking

## Data Flow

```
User Input
    ↓
ResumeUploader Component
    ├── File Upload
    ├── Job Description
    ↓
useBatchAnalysis Hook
    ├── Validates files
    ├── Manages state
    ↓
resumeService.batchAnalyzeResumes()
    ├── Sequential processing
    ├── Error handling
    ↓
API Endpoint (/api/analyze)
    ├── File parsing
    ├── AI analysis
    ↓
rankingService
    ├── Sort candidates
    ├── Calculate stats
    ↓
Results Display
    ├── Summary stats
    ├── Candidate table
    ├── Detailed profiles
```

## TypeScript Interfaces

### Candidate Profile
```typescript
interface ScreeningResult {
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

## Scalability Considerations

### Services Layer
- **resumeService**: Handles all file-to-result conversion
- **rankingService**: Sorting, filtering, and statistics
- Easily testable and replaceable

### Custom Hooks
- **useBatchAnalysis**: Encapsulates complex batch state logic
- Reusable in multiple components
- Separates business logic from UI

### Utilities
- **fileUtils**: File validation, formatting
- **formatters**: Display formatting (colors, text, icons)
- Pure functions, no side effects

### Type Safety
- Comprehensive TypeScript interfaces
- No `any` types
- Type-safe error handling
- IDE autocomplete support

## API Integration

### Groq LLaMA 3.3
- Model: `llama-3.3-70b-versatile`
- Max tokens: 2048
- Supports JSON parsing
- Rate limit: Sequential processing (500ms delay)

### Environment Variables
```
GROQ_API_KEY=your_key_here
```

## Performance Optimizations

1. **Sequential Processing** - Prevents API rate limiting
2. **Progress Tracking** - Real-time feedback to user
3. **Error Isolation** - One failed resume doesn't stop batch
4. **Lazy Loading** - Expandable detail views
5. **Memoization** - useBatchAnalysis hook caches results

## Future Enhancements

- [ ] Authentication & user accounts
- [ ] Database persistence
- [ ] CSV/PDF export
- [ ] Advanced filtering UI
- [ ] Custom AI prompts per role
- [ ] Resume template suggestions
- [ ] Bulk API usage tracking
- [ ] Integration with ATS systems
- [ ] Email notifications
- [ ] Candidate comparison view

## Testing Strategy

### Unit Tests
- `fileUtils.ts` - File validation
- `formatters.ts` - Formatting functions
- `rankingService.ts` - Sorting and filtering

### Integration Tests
- `resumeService.ts` - File upload and analysis
- `useBatchAnalysis.ts` - State management

### E2E Tests
- Full batch upload workflow
- Error handling scenarios
- Results ranking and display

## Development Guidelines

1. **Services**: Business logic, API calls
2. **Hooks**: State management, side effects
3. **Components**: UI rendering only
4. **Utils**: Pure functions, reusable helpers
5. **Types**: Single source of truth for data shapes

## Deployment

Works on any Next.js 15 hosting:
- Vercel (recommended)
- AWS
- Google Cloud
- Self-hosted

No database required for MVP.
