'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  totalJobs: number;
  totalCandidates: number;
  strongMatches: number;
  averageScore: number;
  pendingReview: number;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            AI Resume Screener
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Intelligently analyze and screen resumes at scale
          </p>
          <Link href="/jobs" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">
            Manage Jobs
          </Link>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-blue-600">{stats.totalJobs}</div>
              <p className="text-slate-600 mt-2">Active Jobs</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-green-600">{stats.totalCandidates}</div>
              <p className="text-slate-600 mt-2">Total Candidates</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-emerald-600">{stats.strongMatches}</div>
              <p className="text-slate-600 mt-2">Strong Matches</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/jobs/new" className="block p-6 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
              <h3 className="font-semibold text-slate-900 mb-2">📋 Create New Job</h3>
              <p className="text-slate-600 text-sm">Add a new job opening to screen candidates</p>
            </Link>
            <Link href="/jobs" className="block p-6 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition">
              <h3 className="font-semibold text-slate-900 mb-2">👥 View All Jobs</h3>
              <p className="text-slate-600 text-sm">Browse and manage all job openings</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
