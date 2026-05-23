'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  description: string;
  location?: string;
  seniority_level: string;
  status: string;
  created_at: string;
  _count: { candidates: number };
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Job Openings</h1>
          <Link href="/jobs/new" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            + New Job
          </Link>
        </div>

        {error && <div className="bg-red-50 text-red-800 p-4 rounded mb-6">{error}</div>}

        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-slate-600">
            <p className="mb-4">No jobs created yet</p>
            <Link href="/jobs/new" className="text-blue-600 hover:underline">
              Create your first job
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
                      <p className="text-slate-600 mt-1 line-clamp-2">{job.description}</p>
                      <div className="flex gap-4 mt-3 text-sm text-slate-500">
                        {job.location && <span>📍 {job.location}</span>}
                        <span>Level: {job.seniority_level}</span>
                        <span>Status: {job.status}</span>
                      </div>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {job._count.candidates} candidates
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
