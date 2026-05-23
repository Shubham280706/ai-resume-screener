'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ResumeUploader from '@/components/ResumeUploader';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  description: string;
  location?: string;
  seniority_level: string;
  min_experience: number;
  max_experience: number;
  required_skills: string[];
  preferred_skills: string[];
  status: string;
  created_at: string;
  candidates: any[];
}

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        if (!response.ok) {
          if (response.status === 404) throw new Error('Job not found');
          throw new Error('Failed to fetch job');
        }
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading job');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchJob();
  }, [jobId]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 text-red-800 p-6 rounded-lg text-center">
            <p className="text-lg font-semibold mb-4">{error || 'Job not found'}</p>
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
        <Link href="/jobs" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-4">{job.title}</h1>

              <div className="space-y-3 text-sm">
                {job.location && (
                  <div>
                    <p className="text-slate-600">📍 Location</p>
                    <p className="font-semibold text-slate-900">{job.location}</p>
                  </div>
                )}

                <div>
                  <p className="text-slate-600">Level</p>
                  <p className="font-semibold text-slate-900">{job.seniority_level}</p>
                </div>

                <div>
                  <p className="text-slate-600">Experience</p>
                  <p className="font-semibold text-slate-900">
                    {job.min_experience}-{job.max_experience} years
                  </p>
                </div>

                <div>
                  <p className="text-slate-600">Status</p>
                  <p className="font-semibold text-slate-900">{job.status}</p>
                </div>

                {job.required_skills.length > 0 && (
                  <div>
                    <p className="text-slate-600 mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {job.required_skills.map((skill) => (
                        <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {job.preferred_skills.length > 0 && (
                  <div>
                    <p className="text-slate-600 mb-2">Preferred Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {job.preferred_skills.map((skill) => (
                        <span key={skill} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <p className="text-slate-600">Candidates</p>
                  <p className="text-2xl font-bold text-blue-600">{job.candidates.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Upload Resumes</h2>
              <ResumeUploader jobId={jobId} />
            </div>

            {/* Candidates List */}
            {job.candidates.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Candidates</h2>
                <div className="space-y-4">
                  {job.candidates.map((candidate) => (
                    <Link key={candidate.id} href={`/candidates/${candidate.id}`}>
                      <div className="border border-slate-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-slate-900">{candidate.candidate_name}</h3>
                            <p className="text-sm text-slate-600">{candidate.email}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${candidate.scoring?.total_score >= 80 ? 'text-green-600' : candidate.scoring?.total_score >= 60 ? 'text-blue-600' : 'text-yellow-600'}`}>
                              {candidate.scoring?.total_score || 0}/100
                            </div>
                            <p className="text-xs text-slate-500">{candidate.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
