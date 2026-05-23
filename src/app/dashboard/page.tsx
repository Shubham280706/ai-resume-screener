import { createClient } from '@/lib/supabase/server'
import MetricCard from '@/components/MetricCard'
import CandidateTable from '@/components/CandidateTable'
import Link from 'next/link'

const colors = {
  text: '#e7ecf7',
  muted: '#8b94ad',
  dim: '#5b637a',
  indigo: '#6366f1',
  lightIndigo: '#818cf8',
  green: '#34d399',
  amber: '#f59e0b',
  red: '#f87171',
}

async function fetchDashboardData() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get user's organization
  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()

  if (!profile?.org_id) {
    return { hasJob: false }
  }

  // Get most recent job for this organization
  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select('*')
    .eq('org_id', profile.org_id)
    .order('created_at', { ascending: false })
    .limit(1)

  if (!jobs || jobs.length === 0) {
    return { hasJob: false }
  }

  const job = jobs[0]

  // Get candidates for this job
  const { data: candidates, error: candidatesError } = await supabase
    .from('candidates')
    .select('*')
    .eq('job_id', job.id)
    .order('score', { ascending: false })
    .limit(10)

  // Calculate metrics
  const totalApplied = candidates?.length || 0
  const strongMatch = candidates?.filter((c) => c.score >= 80).length || 0
  const avgScore =
    candidates && candidates.length > 0
      ? Math.round(
          candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length
        )
      : 0
  const shortlisted = candidates?.filter(
    (c) => c.status === 'shortlisted'
  ).length || 0

  return {
    hasJob: true,
    job,
    candidates: candidates || [],
    metrics: {
      totalApplied,
      strongMatch,
      avgScore,
      shortlisted,
    },
  }
}

export default async function DashboardPage() {
  const data = await fetchDashboardData()

  if (!data || !data.hasJob) {
    return (
      <div className="ml-64 p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: colors.text }}
          >
            No jobs created yet
          </h2>
          <p className="mb-8" style={{ color: colors.muted }}>
            Create your first job to start screening candidates
          </p>
          <Link
            href="/jobs/new"
            className="px-6 py-3 rounded-lg font-medium inline-block"
            style={{
              background: `linear-gradient(135deg, ${colors.indigo}, ${colors.lightIndigo})`,
              color: 'white',
            }}
          >
            Create first job →
          </Link>
        </div>
      </div>
    )
  }

  const { job, candidates, metrics } = data

  return (
    <div className="ml-64 p-8">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            className="text-4xl font-semibold mb-1"
            style={{
              color: colors.text,
              letterSpacing: '-0.02em',
            }}
          >
            {job.title || 'Senior Frontend Engineer'}
          </h1>
          <p style={{ color: colors.dim }} className="text-sm">
            {metrics.totalApplied} applicants • Updated 2h ago
          </p>
        </div>

        <button
          className="px-5 py-3 rounded-xl font-medium text-sm flex items-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${colors.indigo}, ${colors.lightIndigo})`,
            color: 'white',
            boxShadow: `0 0 20px rgba(99, 102, 241, 0.4)`,
          }}
        >
          📤 Upload resumes
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Total Applied"
          value={metrics.totalApplied}
          change={`+${Math.floor(metrics.totalApplied * 0.1) || 0}`}
          changeType="positive"
          sparklineData="0,16 15,14 30,15 45,11 60,12 75,8 90,9 105,5 120,6"
          sparklineColor={colors.indigo}
        />
        <MetricCard
          label="Strong Match"
          value={metrics.strongMatch}
          change={`+${Math.floor(metrics.strongMatch * 0.2) || 0}`}
          changeType="positive"
          sparklineData="0,18 15,17 30,15 45,14 60,11 75,9 90,7 105,6 120,4"
          sparklineColor={colors.green}
        />
        <MetricCard
          label="Avg Score"
          value={`${metrics.avgScore}%`}
          change={`+${Math.floor(metrics.avgScore * 0.05) || 0}%`}
          changeType="positive"
          sparklineData="0,14 15,13 30,12 45,13 60,10 75,11 90,8 105,9 120,7"
          sparklineColor={colors.lightIndigo}
        />
        <MetricCard
          label="Shortlisted"
          value={metrics.shortlisted}
          change={metrics.shortlisted > 5 ? '-2' : '+1'}
          changeType={metrics.shortlisted > 5 ? 'negative' : 'positive'}
          sparklineData="0,10 15,11 30,9 45,12 60,10 75,13 90,11 105,14 120,12"
          sparklineColor={colors.amber}
        />
      </div>

      {/* Candidates Table */}
      <CandidateTable
        candidates={candidates.map((c) => ({
          id: c.id,
          full_name: c.full_name || 'Unknown',
          location: c.location,
          experience: c.years_experience
            ? `${c.years_experience}y`
            : undefined,
          score: c.score || 0,
          seniority: c.seniority || 'Mid',
          status: c.status || 'New',
        }))}
      />
    </div>
  )
}
