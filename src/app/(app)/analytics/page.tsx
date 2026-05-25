import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

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

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

async function fetchAnalyticsData() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('org_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.org_id) return null

    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .eq('org_id', profile.org_id)
      .order('created_at', { ascending: false })

    const { data: candidates, error: candidatesError } = await supabase
      .from('candidates')
      .select('*')
      .eq('org_id', profile.org_id)
      .order('created_at', { ascending: false })

    if (jobsError || candidatesError) {
      console.error('Analytics fetch error:', jobsError || candidatesError)
      return null
    }

    return { jobs: jobs || [], candidates: candidates || [], orgId: profile.org_id }
  } catch (error) {
    console.error('Analytics page error:', error)
    return null
  }
}

export default async function AnalyticsPage() {
  const data = await fetchAnalyticsData()

  if (!data) {
    return (
      <div
        style={{
          padding: '40px',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.dim}
            strokeWidth="1.25"
            style={{ margin: '0 auto 16px' }}
          >
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
            <line x1="3" y1="20" x2="21" y2="20" />
          </svg>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: colors.text, marginBottom: '8px' }}>
            No data yet
          </h2>
          <p style={{ fontSize: '13px', color: colors.muted, marginBottom: '24px' }}>
            Create a job and upload resumes to see your analytics.
          </p>
          <Link
            href="/jobs/new"
            style={{
              display: 'inline-block',
              padding: '10px 18px',
              backgroundColor: colors.accent,
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            Create first job →
          </Link>
        </div>
      </div>
    )
  }

  const { jobs: rawJobs, candidates: rawCandidates } = data
  const jobs = rawJobs ?? []
  const candidates = rawCandidates ?? []

  // Calculate metrics
  const totalJobs = jobs.length
  const totalCandidates = candidates.length
  const avgScore = candidates.length
    ? Math.round(candidates.reduce((sum, c) => sum + (c.score || 0), 0) / candidates.length)
    : 0
  const strongMatches = candidates.filter(c => c.score >= 80).length
  const shortlisted = candidates.filter(c => c.status === 'shortlisted').length
  const rejected = candidates.filter(c => c.status === 'rejected' || c.status === 'below bar').length
  const conversionRate = totalCandidates ? Math.round((shortlisted / totalCandidates) * 100) : 0

  // Score distribution
  const scoreDistribution = {
    excellent: candidates.filter(c => c.score >= 80).length,
    good: candidates.filter(c => c.score >= 60 && c.score < 80).length,
    poor: candidates.filter(c => c.score < 60).length,
  }
  const totalScored = scoreDistribution.excellent + scoreDistribution.good + scoreDistribution.poor

  // Jobs with stats
  const jobsWithStats = jobs.map(job => ({
    ...job,
    candidateCount: candidates.filter(c => c.job_id === job.id).length,
    avgScore: (() => {
      const jobCandidates = candidates.filter(c => c.job_id === job.id)
      return jobCandidates.length
        ? Math.round(jobCandidates.reduce((s, c) => s + (c.score || 0), 0) / jobCandidates.length)
        : 0
    })(),
  })).sort((a, b) => b.candidateCount - a.candidateCount)

  // Top candidates
  const topCandidates = [...candidates]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 10)

  // Recent activity
  const recentActivity = [...candidates]
    .slice(0, 15)

  const noData = totalJobs === 0 && totalCandidates === 0

  if (noData) {
    return (
      <div
        style={{
          padding: '40px',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.dim}
            strokeWidth="1.25"
            style={{ margin: '0 auto 16px' }}
          >
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
            <line x1="3" y1="20" x2="21" y2="20" />
          </svg>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: colors.text, marginBottom: '8px' }}>
            No data yet
          </h2>
          <p style={{ fontSize: '13px', color: colors.muted, marginBottom: '24px' }}>
            Create a job and upload resumes to see your analytics.
          </p>
          <Link
            href="/jobs/new"
            style={{
              display: 'inline-block',
              padding: '10px 18px',
              backgroundColor: colors.accent,
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            Create first job →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px' }}>
      {/* Header */}
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: colors.text, margin: 0, marginBottom: '4px' }}>
        Analytics
      </h1>
      <p style={{ fontSize: '13px', color: colors.dim, margin: 0, marginBottom: '28px' }}>
        Overview of your hiring pipeline
      </p>

      {/* ROW 1 — Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px',
          marginBottom: '24px',
        }}
      >
        {/* Total Jobs */}
        <div
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <p style={{ fontSize: '11px', color: colors.dim, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, marginBottom: '8px', fontWeight: 600 }}>
            Total Jobs
          </p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: colors.text, margin: 0 }}>
            {totalJobs}
          </p>
        </div>

        {/* Total Candidates */}
        <div
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <p style={{ fontSize: '11px', color: colors.dim, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, marginBottom: '8px', fontWeight: 600 }}>
            Total Candidates
          </p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: colors.text, margin: 0 }}>
            {totalCandidates}
          </p>
        </div>

        {/* Avg Match Score */}
        <div
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <p style={{ fontSize: '11px', color: colors.dim, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, marginBottom: '8px', fontWeight: 600 }}>
            Avg Match Score
          </p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: avgScore > 70 ? colors.green : avgScore > 50 ? colors.amber : colors.red, margin: 0 }}>
            {avgScore}%
          </p>
          <p style={{ fontSize: '11px', color: colors.dim, margin: 0, marginTop: '4px' }}>
            across all jobs
          </p>
        </div>

        {/* Shortlist Rate */}
        <div
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <p style={{ fontSize: '11px', color: colors.dim, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, marginBottom: '8px', fontWeight: 600 }}>
            Shortlist Rate
          </p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: colors.text, margin: 0 }}>
            {conversionRate}%
          </p>
          <p style={{ fontSize: '11px', color: colors.dim, margin: 0, marginTop: '4px' }}>
            {shortlisted} shortlisted
          </p>
        </div>
      </div>

      {/* ROW 2 — Score Distribution + Jobs Performance */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '60% 1fr',
          gap: '14px',
          marginBottom: '24px',
        }}
      >
        {/* Score Distribution */}
        <div
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: colors.text, margin: 0, marginBottom: '4px' }}>
            Score Distribution
          </h3>
          <p style={{ fontSize: '12px', color: colors.dim, margin: 0, marginBottom: '20px' }}>
            How candidates score across all jobs
          </p>

          {/* Strong Match */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', color: colors.green, fontWeight: 500 }}>Strong Match</span>
              <span style={{ fontSize: '13px', color: colors.text, fontWeight: 600 }}>
                {scoreDistribution.excellent}
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '10px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderRadius: '5px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${totalScored > 0 ? (scoreDistribution.excellent / totalScored) * 100 : 0}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${colors.green}, #34d399)`,
                  borderRadius: '5px',
                  transition: 'width 800ms cubic-bezier(0.23,1,0.32,1)',
                }}
              />
            </div>
            <span style={{ fontSize: '11px', color: colors.dim, float: 'right', marginTop: '4px' }}>
              {totalScored > 0 ? Math.round((scoreDistribution.excellent / totalScored) * 100) : 0}%
            </span>
          </div>

          {/* Good Fit */}
          <div style={{ marginBottom: '16px', clear: 'both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', color: colors.amber, fontWeight: 500 }}>Good Fit</span>
              <span style={{ fontSize: '13px', color: colors.text, fontWeight: 600 }}>
                {scoreDistribution.good}
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '10px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderRadius: '5px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${totalScored > 0 ? (scoreDistribution.good / totalScored) * 100 : 0}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${colors.amber}, #fcd34d)`,
                  borderRadius: '5px',
                  transition: 'width 800ms cubic-bezier(0.23,1,0.32,1)',
                }}
              />
            </div>
            <span style={{ fontSize: '11px', color: colors.dim, float: 'right', marginTop: '4px' }}>
              {totalScored > 0 ? Math.round((scoreDistribution.good / totalScored) * 100) : 0}%
            </span>
          </div>

          {/* Below Bar */}
          <div style={{ marginBottom: '16px', clear: 'both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', color: colors.red, fontWeight: 500 }}>Below Bar</span>
              <span style={{ fontSize: '13px', color: colors.text, fontWeight: 600 }}>
                {scoreDistribution.poor}
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '10px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderRadius: '5px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${totalScored > 0 ? (scoreDistribution.poor / totalScored) * 100 : 0}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${colors.red}, #fca5a5)`,
                  borderRadius: '5px',
                  transition: 'width 800ms cubic-bezier(0.23,1,0.32,1)',
                }}
              />
            </div>
            <span style={{ fontSize: '11px', color: colors.dim, float: 'right', marginTop: '4px' }}>
              {totalScored > 0 ? Math.round((scoreDistribution.poor / totalScored) * 100) : 0}%
            </span>
          </div>

          {/* Summary pills */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '24px', clear: 'both' }}>
            <span style={{ fontSize: '12px', color: colors.text, padding: '4px 10px', backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: '6px' }}>
              {scoreDistribution.excellent} Strong
            </span>
            <span style={{ fontSize: '12px', color: colors.text, padding: '4px 10px', backgroundColor: 'rgba(245,158,11,0.1)', borderRadius: '6px' }}>
              {scoreDistribution.good} Good
            </span>
            <span style={{ fontSize: '12px', color: colors.text, padding: '4px 10px', backgroundColor: 'rgba(248,113,113,0.1)', borderRadius: '6px' }}>
              {scoreDistribution.poor} Below
            </span>
          </div>
        </div>

        {/* Jobs Performance */}
        <div
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: colors.text, margin: 0, marginBottom: '4px' }}>
            Jobs by Volume
          </h3>
          <p style={{ fontSize: '12px', color: colors.dim, margin: 0, marginBottom: '16px' }}>
            Most active jobs
          </p>

          {jobsWithStats.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ fontSize: '12px', color: colors.dim }}>No jobs yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {jobsWithStats.slice(0, 5).map((job) => (
                <div
                  key={job.id}
                  style={{
                    paddingBottom: '12px',
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: colors.text }}>
                      {job.title}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: 'rgba(0,122,255,0.1)',
                        color: colors.accent,
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {job.candidateCount}
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '3px',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${job.avgScore}%`,
                        height: '100%',
                        background: job.avgScore > 70 ? colors.green : job.avgScore > 50 ? colors.amber : colors.red,
                        borderRadius: '2px',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '10px', color: colors.dim }}>
                    {job.avgScore}% avg
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ROW 3 — Top Candidates + Recent Activity */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '14px',
        }}
      >
        {/* Top Candidates */}
        <div
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: colors.text, margin: 0, marginBottom: '4px' }}>
            Top Candidates
          </h3>
          <p style={{ fontSize: '12px', color: colors.dim, margin: 0, marginBottom: '16px' }}>
            Highest scoring across all jobs
          </p>

          {topCandidates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ fontSize: '12px', color: colors.dim }}>No candidates yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {topCandidates.map((candidate, idx) => (
                <Link
                  key={candidate.id}
                  href={`/candidates/${candidate.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    textDecoration: 'none',
                    transition: 'all 150ms ease',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, #6366f1, #a855f7)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'white',
                      flexShrink: 0,
                    }}
                  >
                    {candidate.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '12px', fontWeight: 500, color: colors.text, margin: 0 }}>
                      {candidate.full_name}
                    </p>
                    <p style={{ fontSize: '11px', color: colors.dim, margin: 0 }}>
                      Score: {candidate.score || 0}%
                    </p>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: colors.green }}>
                    {candidate.score || 0}%
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: colors.text, margin: 0, marginBottom: '4px' }}>
            Recent Activity
          </h3>
          <p style={{ fontSize: '12px', color: colors.dim, margin: 0, marginBottom: '16px' }}>
            Latest candidate submissions
          </p>

          {recentActivity.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ fontSize: '12px', color: colors.dim }}>No activity yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentActivity.map((candidate) => {
                const job = jobs.find(j => j.id === candidate.job_id)
                return (
                  <div
                    key={candidate.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      paddingBottom: '12px',
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, #0891b2, #22d3ee)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 600,
                        color: 'white',
                        flexShrink: 0,
                      }}
                    >
                      {candidate.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '12px', color: colors.text, margin: 0 }}>
                        <span style={{ fontWeight: 500 }}>{candidate.full_name}</span> applied for{' '}
                        <span style={{ fontWeight: 500 }}>{job?.title || 'Unknown Job'}</span>
                      </p>
                      <p style={{ fontSize: '11px', color: colors.dim, margin: 0 }}>
                        {timeAgo(candidate.created_at || '')}
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: candidate.score >= 80 ? colors.green : candidate.score >= 60 ? colors.amber : colors.red,
                        padding: '2px 8px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderRadius: '4px',
                      }}
                    >
                      {candidate.score || 0}%
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* All Candidates Table */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: colors.text, margin: 0, marginBottom: '16px' }}>
          All Candidates
        </h3>

        <div
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: colors.dim, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Candidate
                </th>
                <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: colors.dim, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Applied For
                </th>
                <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: colors.dim, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Score
                </th>
                <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: colors.dim, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Seniority
                </th>
                <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: colors.dim, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate, idx) => {
                const job = jobs.find(j => j.id === candidate.job_id)
                return (
                  <tr
                    key={candidate.id}
                    style={{
                      borderBottom: idx < candidates.length - 1 ? `1px solid ${colors.border}` : 'none',
                    }}
                  >
                    <td style={{ padding: '12px 18px' }}>
                      <Link
                        href={`/candidates/${candidate.id}`}
                        style={{
                          color: colors.text,
                          textDecoration: 'none',
                          fontSize: '13px',
                          fontWeight: 500,
                        }}
                      >
                        {candidate.full_name || 'Unknown'}
                      </Link>
                    </td>
                    <td style={{ padding: '12px 18px', fontSize: '13px' }}>
                      {candidate.job_id ? (
                        <Link
                          href={`/jobs/${candidate.job_id}`}
                          style={{
                            color: colors.accent,
                            textDecoration: 'none',
                          }}
                        >
                          {job?.title || 'Unknown Job'}
                        </Link>
                      ) : (
                        <span style={{ color: colors.dim }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 18px', fontSize: '13px', fontWeight: 600, color: colors.text }}>
                      {candidate.score || 0}%
                    </td>
                    <td style={{ padding: '12px 18px', fontSize: '13px', color: colors.muted }}>
                      {candidate.seniority || 'Mid'}
                    </td>
                    <td style={{ padding: '12px 18px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 500,
                          backgroundColor:
                            candidate.status === 'shortlisted'
                              ? 'rgba(16,185,129,0.1)'
                              : candidate.status === 'rejected'
                              ? 'rgba(248,113,113,0.1)'
                              : 'rgba(255,255,255,0.08)',
                          color:
                            candidate.status === 'shortlisted'
                              ? colors.green
                              : candidate.status === 'rejected'
                              ? colors.red
                              : colors.muted,
                        }}
                      >
                        {candidate.status || 'New'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
