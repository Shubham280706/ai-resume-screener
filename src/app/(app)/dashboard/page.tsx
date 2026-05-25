import { createClient } from '@/lib/supabase/server'
import MetricCard from '@/components/MetricCard'
import CandidateTable from '@/components/CandidateTable'
import Link from 'next/link'
import JobDetailUpload from '@/components/JobDetailUpload'

const colors = {
  bg: '#050507',
  surface: '#0d0d10',
  border: 'rgba(255,255,255,0.07)',
  text: '#fafafa',
  muted: '#71717a',
  dim: '#3f3f46',
  accent: '#007AFF',
  green: '#10b981',
  amber: '#f59e0b',
  red: '#f87171',
}

async function fetchDashboardData() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()

  if (!profile?.org_id) {
    return { hasJob: false }
  }

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('org_id', profile.org_id)
    .order('created_at', { ascending: false })
    .limit(1)

  if (!jobs || jobs.length === 0) {
    return { hasJob: false }
  }

  const job = jobs[0]

  const { data: candidates } = await supabase
    .from('candidates')
    .select('*')
    .eq('job_id', job.id)
    .order('score', { ascending: false })
    .limit(10)

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

  const hasJob = data && 'metrics' in data

  if (!hasJob) {
    return (
      <div
        style={{
          padding: '36px 40px',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <style>{`
          .create-job-btn {
            transition: all 200ms cubic-bezier(0.23,1,0.32,1);
          }
          .create-job-btn:hover {
            background: linear-gradient(135deg, #0071e3, #0284c7) !important;
            transform: translateY(-1px);
            box-shadow: 0 8px 20px rgba(0,122,255,0.3);
          }
        `}</style>

        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '16px' }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={colors.dim} strokeWidth="1.25" strokeLinecap="round" style={{ margin: '0 auto' }}>
              <rect x="3" y="7" width="18" height="14" rx="2" />
              <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="3" y1="13" x2="21" y2="13" />
            </svg>
          </div>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: colors.text,
              marginBottom: '8px',
            }}
          >
            No jobs created yet
          </h2>
          <p
            style={{
              fontSize: '13px',
              color: colors.muted,
              marginBottom: '24px',
            }}
          >
            Create your first job to start screening candidates
          </p>
          <Link
            href="/jobs/new"
            className="create-job-btn"
            style={{
              display: 'inline-block',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'white',
              background: `linear-gradient(135deg, ${colors.accent}, #0ea5e9)`,
              textDecoration: 'none',
            }}
          >
            Create first job →
          </Link>
        </div>
      </div>
    )
  }

  const { job, candidates, metrics } = data as any

  return (
    <div style={{ padding: '40px 40px' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '28px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: colors.text,
              margin: 0,
            }}
          >
            {job.title || 'Senior Frontend Engineer'}
          </h1>
          <p style={{ fontSize: '13px', color: colors.dim, marginTop: '4px' }}>
            {metrics.totalApplied} applicants • Updated 2h ago
          </p>
        </div>

        <JobDetailUpload
          jobId={job.id}
          jobTitle={job.title}
          jobDescription={job.description || ''}
        />
      </div>

      {/* Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        <MetricCard
          label="Total Applied"
          value={metrics.totalApplied}
          change={`+${Math.floor(metrics.totalApplied * 0.1) || 0}`}
          changeType="positive"
          sparklineData="0,16 15,14 30,15 45,11 60,12 75,8 90,9 105,5 120,6"
          sparklineColor={colors.accent}
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
          sparklineColor={'#a78bfa'}
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
        candidates={candidates.map((c: any) => ({
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
