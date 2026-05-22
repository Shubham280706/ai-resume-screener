import { SemanticAnalysisResult } from '@/types';

interface BatchResult {
  fileName: string;
  result: SemanticAnalysisResult;
  status: 'pending' | 'analyzing' | 'complete' | 'error';
  error?: string;
}

export default function DetailedResult({ item }: { item: BatchResult }) {
  const { result } = item;
  const { scoring, semantic_match, analysis, job_requirement } = result;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
      {/* Data Extraction Preview */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
        <details className="cursor-pointer">
          <summary className="font-bold text-slate-900 text-sm hover:text-blue-600">
            📄 Extracted Resume Data
          </summary>
          <div className="mt-4 space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-1">Years of Experience</p>
                <p className="text-slate-900 font-mono">{result.years_of_experience}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-1">Detected Seniority</p>
                <p className="text-slate-900 font-mono">{result.seniority_level}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Extracted Skills</p>
              <div className="flex flex-wrap gap-2">
                {result.semantic_match.matched_skills.map((skill, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Bonus/Inferred Skills</p>
              <div className="flex flex-wrap gap-2">
                {result.semantic_match.bonus_skills.length > 0 ? (
                  result.semantic_match.bonus_skills.map((skill, i) => (
                    <span key={i} className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 text-xs">None detected</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Raw Extraction Reasoning</p>
              <div className="bg-white p-3 rounded border border-slate-200 text-xs text-slate-700 space-y-1">
                {result.semantic_match.reasoning && result.semantic_match.reasoning.length > 0 ? (
                  result.semantic_match.reasoning.map((reason, i) => (
                    <p key={i}>• {reason}</p>
                  ))
                ) : (
                  <p className="text-slate-500">No detailed reasoning available</p>
                )}
              </div>
            </div>
          </div>
        </details>
      </div>

      {/* Candidate Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              {result.candidate_name}
            </h3>
            <p className="text-slate-600 text-sm mt-1">{result.email}</p>
            <p className="text-slate-500 text-xs mt-1">{item.fileName}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {scoring.total_score}/100
            </div>
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${
              result.recommendation === 'STRONG_YES' ? 'bg-green-100 text-green-800 border-green-300' :
              result.recommendation === 'YES' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
              result.recommendation === 'MAYBE' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
              'bg-red-100 text-red-800 border-red-300'
            }`}>
              {result.recommendation.replace(/_/g, ' ')}
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <p className="text-sm text-blue-700 font-medium">Skills Score</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">{scoring.skills_score}/100</p>
          <p className="text-xs text-blue-600 mt-1">40% weight</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
          <p className="text-sm text-purple-700 font-medium">Experience Score</p>
          <p className="text-3xl font-bold text-purple-900 mt-2">{scoring.experience_score}/100</p>
          <p className="text-xs text-purple-600 mt-1">30% weight</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
          <p className="text-sm text-amber-700 font-medium">Seniority Score</p>
          <p className="text-3xl font-bold text-amber-900 mt-2">{scoring.seniority_score}/100</p>
          <p className="text-xs text-amber-600 mt-1">20% weight</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg">
          <p className="text-sm text-emerald-700 font-medium">Education Score</p>
          <p className="text-3xl font-bold text-emerald-900 mt-2">{scoring.education_score}/100</p>
          <p className="text-xs text-emerald-600 mt-1">10% weight</p>
        </div>
      </div>

      {/* Job Requirement */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-slate-900">Job Requirement Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-lg">
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Position</p>
            <p className="text-slate-900">{job_requirement.role_title}</p>
            <p className="text-xs text-slate-600 mt-1">Category: {job_requirement.role_category}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Seniority Level</p>
            <p className="text-slate-900">{job_requirement.seniority_level}</p>
            <p className="text-xs text-slate-600 mt-1">
              {job_requirement.minimum_experience_years}-{job_requirement.maximum_experience_years} years
            </p>
          </div>
        </div>

        {/* Required Skills */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-3">Required Skills</p>
          <div className="flex flex-wrap gap-2">
            {job_requirement.required_skills.map((skill, i) => (
              <span key={i} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Preferred Skills */}
        {job_requirement.preferred_skills.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-3">Preferred Skills</p>
            <div className="flex flex-wrap gap-2">
              {job_requirement.preferred_skills.map((skill, i) => (
                <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Semantic Match Analysis */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-slate-900">Semantic Matching</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-xs text-green-700 font-medium">Overall Match</p>
            <p className="text-2xl font-bold text-green-900 mt-2">{semantic_match.overall_match}%</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 font-medium">Skill Match</p>
            <p className="text-2xl font-bold text-blue-900 mt-2">{semantic_match.skill_match}%</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-700 font-medium">Experience Match</p>
            <p className="text-2xl font-bold text-purple-900 mt-2">{semantic_match.experience_match}%</p>
          </div>
        </div>

        {/* Matched Skills */}
        {semantic_match.matched_skills.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">✓ Matched Skills</p>
            <div className="flex flex-wrap gap-2">
              {semantic_match.matched_skills.map((skill, i) => (
                <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Unmatched Required Skills */}
        {semantic_match.unmatched_required_skills.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">✗ Missing Required Skills</p>
            <div className="flex flex-wrap gap-2">
              {semantic_match.unmatched_required_skills.map((skill, i) => (
                <span key={i} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs">
                  ✗ {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bonus Skills */}
        {semantic_match.bonus_skills.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">⭐ Bonus Skills</p>
            <div className="flex flex-wrap gap-2">
              {semantic_match.bonus_skills.map((skill, i) => (
                <span key={i} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs">
                  ⭐ {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Analysis */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-slate-900">AI Analysis</h4>

        {analysis.key_strengths.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-green-700 mb-2">💪 Key Strengths</p>
            <ul className="space-y-2">
              {analysis.key_strengths.map((strength, i) => (
                <li key={i} className="text-sm text-slate-700 flex gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {analysis.gaps_and_concerns.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-red-700 mb-2">⚠️ Gaps & Concerns</p>
            <ul className="space-y-2">
              {analysis.gaps_and_concerns.map((gap, i) => (
                <li key={i} className="text-sm text-slate-700 flex gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {analysis.interview_focus_areas.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-blue-700 mb-2">🎯 Interview Focus Areas</p>
            <ul className="space-y-2">
              {analysis.interview_focus_areas.map((area, i) => (
                <li key={i} className="text-sm text-slate-700 flex gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="text-sm font-semibold text-slate-900 mb-2">📋 Overall Assessment</p>
          <p className="text-sm text-slate-700">{analysis.overall_fit_summary}</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm font-semibold text-blue-900 mb-2">🤖 AI Recommendation</p>
          <p className="text-sm text-blue-800">{result.recommendation_message}</p>
        </div>
      </div>
    </div>
  );
}
