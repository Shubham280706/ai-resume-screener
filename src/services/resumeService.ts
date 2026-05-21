import { extractTextFromFile } from '@/lib/parser';
import { ScreeningResult } from '@/types';

export interface ResumeAnalysisRequest {
  file: File;
  jobDescription: string;
}

export interface ResumeAnalysisResponse {
  success: boolean;
  data?: ScreeningResult;
  error?: string;
}

/**
 * Analyzes a single resume file against a job description
 * Handles file parsing and API communication
 */
export async function analyzeResumeFile(
  request: ResumeAnalysisRequest
): Promise<ResumeAnalysisResponse> {
  try {
    // Validate inputs
    if (!request.file) {
      return {
        success: false,
        error: 'No file provided',
      };
    }

    if (!request.jobDescription?.trim()) {
      return {
        success: false,
        error: 'Job description is required',
      };
    }

    // Parse resume text
    const resumeText = await extractTextFromFile(request.file);

    if (!resumeText || resumeText.length === 0) {
      return {
        success: false,
        error: 'Could not extract text from resume',
      };
    }

    // Send to API for analysis
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('jobDescription', request.jobDescription);

    const response = await fetch('/api/analyze', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          errorData.error || `Server error: ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Batch analyze multiple resumes with sequential processing
 * Prevents API overload by processing one at a time
 */
export async function batchAnalyzeResumes(
  files: File[],
  jobDescription: string,
  onProgress?: (index: number, total: number) => void
): Promise<ResumeAnalysisResponse[]> {
  const results: ResumeAnalysisResponse[] = [];

  for (let i = 0; i < files.length; i++) {
    onProgress?.(i + 1, files.length);

    const response = await analyzeResumeFile({
      file: files[i],
      jobDescription,
    });

    results.push(response);

    // Add small delay between requests to avoid rate limiting
    if (i < files.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return results;
}
