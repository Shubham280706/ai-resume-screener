'use client';

import { useState, useRef } from 'react';
import { SemanticAnalysisResult } from '@/types';
import DetailedResult from './DetailedResult';

interface BatchResult {
  fileName: string;
  result: SemanticAnalysisResult;
  status: 'pending' | 'analyzing' | 'complete' | 'error';
  error?: string;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-emerald-100 text-emerald-800';
  if (score >= 40) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const getRecommendationBadge = (rec: string) => {
  const colors: Record<string, string> = {
    STRONG_YES: 'bg-green-100 text-green-800 border-green-300',
    YES: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    MAYBE: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    NO: 'bg-red-100 text-red-800 border-red-300',
  };
  return colors[rec] || colors.MAYBE;
};

interface ResumeUploaderProps {
  jobId?: string;
}

export default function ResumeUploader({ jobId }: ResumeUploaderProps) {
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const validFiles = files.filter((file) => {
      return validTypes.includes(file.type) || file.name.endsWith('.docx');
    });

    if (validFiles.length !== files.length) {
      setError(
        `${files.length - validFiles.length} file(s) skipped - only PDF and DOCX are supported`
      );
    }

    setResumeFiles((prev) => [...prev, ...validFiles]);
    setError('');
  };

  const removeFile = (index: number) => {
    setResumeFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (resumeFiles.length === 0 || !jobDescription.trim()) {
      setError('Please upload at least one resume and enter a job description');
      return;
    }

    setLoading(true);
    setError('');

    const initial: BatchResult[] = resumeFiles.map((file) => ({
      fileName: file.name,
      result: {} as SemanticAnalysisResult,
      status: 'pending',
    }));
    setBatchResults(initial);

    try {
      const results: BatchResult[] = [];

      // Process each file sequentially
      for (let i = 0; i < resumeFiles.length; i++) {
        const file = resumeFiles[i];

        // Update status to analyzing
        setBatchResults((prev) => [
          ...prev.slice(0, i),
          { ...prev[i], status: 'analyzing' },
          ...prev.slice(i + 1),
        ]);

        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('jobDescription', jobDescription);
          if (jobId) {
            formData.append('jobId', jobId);
          }

          const response = await fetch('/api/analyze', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to analyze resume');
          }

          const data = await response.json();

          results.push({
            fileName: file.name,
            result: data,
            status: 'complete',
          });

          setBatchResults((prev) => [
            ...prev.slice(0, i),
            { ...prev[i], result: data, status: 'complete' },
            ...prev.slice(i + 1),
          ]);
        } catch (err) {
          const errorMsg =
            err instanceof Error ? err.message : 'Analysis failed';

          results.push({
            fileName: file.name,
            result: {} as SemanticAnalysisResult,
            status: 'error',
            error: errorMsg,
          });

          setBatchResults((prev) => [
            ...prev.slice(0, i),
            { ...prev[i], status: 'error', error: errorMsg },
            ...prev.slice(i + 1),
          ]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResumeFiles([]);
    setJobDescription('');
    setBatchResults([]);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (batchResults.length > 0 && !loading) {
    return <BatchResultsDisplay results={batchResults} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            AI Resume Screener
          </h1>
          <p className="text-lg text-slate-600">
            Analyze multiple resumes at once and get independent scores for each candidate
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Resume Upload Section */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-900">
              Upload Resumes
            </label>
            <p className="text-sm text-slate-500 mb-3">
              Supported formats: PDF, DOCX (Select multiple files)
            </p>
            <div
              className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                multiple
                className="hidden"
              />
              <div className="space-y-2">
                <svg
                  className="mx-auto h-12 w-12 text-slate-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v28a4 4 0 004 4h24a4 4 0 004-4V20m-14-12v14m0 0l-4-4m4 4l4-4"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-sm font-medium text-slate-900">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-slate-500">
                  PDF or DOCX files (up to 5MB each)
                </p>
              </div>
            </div>

            {/* Selected Files List */}
            {resumeFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-slate-900">
                  Selected Files ({resumeFiles.length})
                </p>
                <div className="space-y-2">
                  {resumeFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200"
                    >
                      <span className="text-sm text-slate-700">{file.name}</span>
                      <button
                        onClick={() => removeFile(idx)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Job Description Section */}
          <div className="space-y-3">
            <label
              htmlFor="jobDesc"
              className="block text-sm font-semibold text-slate-900"
            >
              Job Description
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Include job title, required skills, experience level, responsibilities, and qualifications
            </p>
            <textarea
              id="jobDesc"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder={`Example:

Senior Frontend Engineer - React/Next.js
Location: San Francisco, CA

Required Skills:
- 4+ years of React/Next.js experience
- TypeScript proficiency
- REST API integration
- Responsive CSS/Tailwind

Responsibilities:
- Build scalable web applications
- Lead technical initiatives
- Mentor junior developers
- Conduct code reviews

Education:
- Bachelor's in Computer Science or equivalent experience
- AWS or cloud platform knowledge preferred`}
              className="w-full h-48 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm text-slate-900 placeholder:text-slate-400"
            />
            <div className="text-xs text-slate-500 bg-blue-50 p-3 rounded border border-blue-100">
              <p className="font-medium text-blue-900 mb-1">💡 Tips for best results:</p>
              <ul className="space-y-1 text-blue-800">
                <li>• Include specific technologies and tools required</li>
                <li>• List years of experience needed</li>
                <li>• Add soft skills and responsibilities</li>
                <li>• Specify nice-to-have qualifications</li>
              </ul>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAnalyze}
              disabled={loading || resumeFiles.length === 0 || !jobDescription.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 px-4 rounded-lg transition disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing {resumeFiles.length} resume(s)...
                </span>
              ) : (
                `Analyze ${resumeFiles.length} Resume${resumeFiles.length !== 1 ? 's' : ''}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BatchResultsDisplay({
  results,
  onReset,
}: {
  results: BatchResult[];
  onReset: () => void;
}) {
  const completedResults = results.filter((r) => r.status === 'complete');
  const errorResults = results.filter((r) => r.status === 'error');

  // Sort by total score descending
  const sortedResults = [...completedResults].sort(
    (a, b) => (b.result.scoring.total_score || 0) - (a.result.scoring.total_score || 0)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Analysis Results
          </h1>
          <p className="text-slate-600">
            {completedResults.length} candidate(s) analyzed
            {errorResults.length > 0 && `, ${errorResults.length} failed`}
          </p>
        </div>

        {/* Summary Stats */}
        {completedResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-slate-600 text-sm mb-2">Top Match</p>
              <p className="text-3xl font-bold text-green-600">
                {Math.max(...completedResults.map((r) => r.result.scoring.total_score))}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {sortedResults[0].result.candidate_name}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-slate-600 text-sm mb-2">Average Score</p>
              <p className="text-3xl font-bold text-blue-600">
                {(
                  completedResults.reduce(
                    (sum, r) => sum + r.result.scoring.total_score,
                    0
                  ) / completedResults.length
                ).toFixed(0)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-slate-600 text-sm mb-2">Strong Candidates</p>
              <p className="text-3xl font-bold text-emerald-600">
                {completedResults.filter((r) => r.result.scoring.total_score >= 80)
                  .length}
              </p>
            </div>
          </div>
        )}

        {/* Results Table */}
        {completedResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">
                      Recommendation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">
                      Unmatched Skills
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900">
                      Fit Summary
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sortedResults.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900">
                          {item.result.candidate_name}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {item.fileName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-lg font-bold ${getScoreColor(item.result.scoring.total_score)}`}
                        >
                          {item.result.scoring.total_score}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getRecommendationBadge(item.result.recommendation)}`}
                        >
                          {item.result.recommendation.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {item.result.semantic_match.unmatched_required_skills.slice(0, 2).map((skill, i) => (
                            <span
                              key={i}
                              className="inline-block bg-red-50 text-red-700 px-2 py-1 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                          {item.result.semantic_match.unmatched_required_skills.length > 2 && (
                            <span className="inline-block bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                              +{item.result.semantic_match.unmatched_required_skills.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {item.result.analysis.overall_fit_summary}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detailed Results */}
        {completedResults.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Detailed Analysis
            </h2>
            {sortedResults.map((item, idx) => (
              <DetailedResult key={idx} item={item} />
            ))}
          </div>
        )}

        {/* Error Results */}
        {errorResults.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-4">
              Failed to Analyze ({errorResults.length})
            </h3>
            <div className="space-y-3">
              {errorResults.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <div>
                    <p className="text-sm font-medium text-red-900">
                      {item.fileName}
                    </p>
                    <p className="text-xs text-red-700 mt-1">{item.error}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={onReset}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition"
          >
            Analyze More Resumes
          </button>
        </div>
      </div>
    </div>
  );
}
