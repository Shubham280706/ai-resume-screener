'use client';

import { useState, useCallback } from 'react';
import { ScreeningResult } from '@/types';
import { batchAnalyzeResumes } from '@/services/resumeService';
import { sortCandidates, getRankingStats } from '@/services/rankingService';

export interface BatchResult {
  fileName: string;
  result?: ScreeningResult;
  status: 'pending' | 'analyzing' | 'complete' | 'error';
  error?: string;
}

export interface UseBatchAnalysisState {
  files: File[];
  jobDescription: string;
  batchResults: BatchResult[];
  isLoading: boolean;
  error: string;
  progress: { current: number; total: number };
}

export function useBatchAnalysis() {
  const [state, setState] = useState<UseBatchAnalysisState>({
    files: [],
    jobDescription: '',
    batchResults: [],
    isLoading: false,
    error: '',
    progress: { current: 0, total: 0 },
  });

  const addFiles = useCallback((newFiles: File[]) => {
    setState((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles],
    }));
  }, []);

  const removeFile = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  }, []);

  const setJobDescription = useCallback((description: string) => {
    setState((prev) => ({
      ...prev,
      jobDescription: description,
    }));
  }, []);

  const analyzeBatch = useCallback(async () => {
    if (state.files.length === 0 || !state.jobDescription.trim()) {
      setState((prev) => ({
        ...prev,
        error:
          'Please upload at least one resume and enter a job description',
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: '',
      batchResults: state.files.map((file) => ({
        fileName: file.name,
        status: 'pending' as const,
      })),
    }));

    try {
      const results = await batchAnalyzeResumes(
        state.files,
        state.jobDescription,
        (current, total) => {
          setState((prev) => ({
            ...prev,
            progress: { current, total },
          }));
        }
      );

      const formattedResults: BatchResult[] = results.map((result, index) => ({
        fileName: state.files[index].name,
        result: result.data,
        status: result.success ? ('complete' as const) : ('error' as const),
        error: result.error,
      }));

      setState((prev) => ({
        ...prev,
        batchResults: formattedResults,
        isLoading: false,
      }));
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'Analysis failed';
      setState((prev) => ({
        ...prev,
        error: errorMsg,
        isLoading: false,
      }));
    }
  }, [state.files, state.jobDescription]);

  const getRankedResults = useCallback(() => {
    const completed = state.batchResults
      .filter((r) => r.status === 'complete' && r.result)
      .map((r) => r.result!);

    return sortCandidates(completed, 'score', 'desc');
  }, [state.batchResults]);

  const getStats = useCallback(() => {
    const completed = state.batchResults
      .filter((r) => r.status === 'complete' && r.result)
      .map((r) => r.result!);

    return getRankingStats(completed);
  }, [state.batchResults]);

  const reset = useCallback(() => {
    setState({
      files: [],
      jobDescription: '',
      batchResults: [],
      isLoading: false,
      error: '',
      progress: { current: 0, total: 0 },
    });
  }, []);

  return {
    ...state,
    addFiles,
    removeFile,
    setJobDescription,
    analyzeBatch,
    getRankedResults,
    getStats,
    reset,
  };
}
