'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import DetailedResult from '@/components/DetailedResult';

interface Candidate {
  id: string;
  candidate_name: string;
  email: string;
  years_of_experience: number;
  seniority_level: string;
  scoring: any;
  semantic_match: any;
  analysis: any;
  job_requirement: any;
  recommendation: string;
  recommendation_message: string;
  job?: { id: string; title: string };
}

export default function CandidateDetailPage() {
  const params = useParams();
  const candidateId = params.id as string;
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await fetch(`/api/candidates/${candidateId}`);
        if (!response.ok) {
          if (response.status === 404) throw new Error('Candidate not found');
          throw new Error('Failed to fetch candidate');
        }
        const data = await response.json();
        setCandidate(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading candidate');
      } finally {
        setLoading(false);
      }
    };

    if (candidateId) fetchCandidate();
  }, [candidateId]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 text-red-800 p-6 rounded-lg text-center">
            <p className="text-lg font-semibold mb-4">{error || 'Candidate not found'}</p>
            <Link href="/jobs" className="text-blue-600 hover:underline">
              Back to jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href={candidate.job ? `/jobs/${candidate.job.id}` : '/jobs'} className="text-blue-600 hover:underline">
            ← Back {candidate.job ? `to ${candidate.job.title}` : 'to jobs'}
          </Link>
        </div>

        <DetailedResult
          item={{
            fileName: candidate.candidate_name,
            status: 'complete',
            result: {
              candidate_name: candidate.candidate_name,
              email: candidate.email,
              years_of_experience: candidate.years_of_experience,
              seniority_level: candidate.seniority_level,
              job_requirement: candidate.job_requirement,
              semantic_match: candidate.semantic_match,
              scoring: candidate.scoring,
              analysis: candidate.analysis,
              recommendation: candidate.recommendation,
              recommendation_message: candidate.recommendation_message,
            }
          }}
        />
      </div>
    </div>
  );
}
