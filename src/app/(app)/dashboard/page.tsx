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
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '48px',
              marginBottom: '16px',
              color: colors.dim,
            }}
          >
            💼
          </div>
          <h2
            style={{
              fontSize: '22px',
              fontWeight: 600,
              color: colors.text,
              marginBottom: '8px',
            }}
          >
            No jobs created yet
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: colors.muted,
              marginBottom: '24px',
            }}
          >
            Create your first job to start screening candidates
          </p>
          <style>{`
            .empty-state-btn {
              transition: all 0.2s ease;
            }
            .empty-state-btn:hover {
              box-shadow: 0 0 30px rgba(99, 102, 241, 0.55) !important;
              transform: translateY(-1px);
            }
          `}</style>
          <Link
            href="/jobs/new"
            className="empty-state-btn"
            style={{
              display: 'inline-block',
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'white',
              background: `linear-gradient(135deg, ${colors.indigo} 0%, ${colors.lightIndigo} 100%)`,
              boxShadow: `0 0 20px rgba(99, 102, 241, 0.35)`,
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
    <div style={{ padding: '36px 40px' }}>
      <style>{`
        .dashboard-upload-btn {
          transition: all 0.2s ease;
        }
        .dashboard-upload-btn:hover {
          box-shadow: 0 0 30px rgba(99, 102, 241, 0.55) !important;
          transform: translateY(-1px);
        }
      `}</style>
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
              fontSize: '26px',
              fontWeight: 600,
              letterSpacing: '-0.02em',
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

        <button
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 500,
            color: 'white',
            background: `linear-gradient(135deg, ${colors.indigo} 0%, ${colors.lightIndigo} 100%)`,
            border: 'none',
            boxShadow: `0 0 20px rgba(99, 102, 241, 0.35)`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
          }}
          className="dashboard-upload-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload resumes
        </button>
      </div>

      {/* Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
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
          sparklineColor={'#a5b4fc'}
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
