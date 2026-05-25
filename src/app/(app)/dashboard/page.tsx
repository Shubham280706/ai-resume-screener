import { createClient } from '@/lib/supabase/server'
import MetricCard from '@/components/MetricCard'
import Link from 'next/link'
import DashboardUploadButton from '@/components/DashboardUploadButton'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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
    return { hasJobs: false, jobs: [] }
  }

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('org_id', profile.org_id)
    .order('created_at', { ascending: false })

  const { data: candidates } = await supabase
    .from('candidates')
    .select('*')
    .eq('org_id', profile.org_id)
    .order('score', { ascending: false })

  const safeJobs = jobs ?? []
  const safeCandidates = candidates ?? []

  const totalCandidates = safeCandidates.length
  const strongMatches = safeCandidates.filter((c) => c.score >= 80).length
  const avgScore =
    totalCandidates > 0
      ? Math.round(
          safeCandidates.reduce((sum, c) => sum + (c.score || 0), 0) / totalCandidates
        )
      : 0
  const shortlisted = safeCandidates.filter(
    (c) => c.status === 'shortlisted'
  ).length

  return {
    hasJobs: safeJobs.length > 0,
    jobs: safeJobs,
    candidates: safeCandidates,
    metrics: {
      totalCandidates,
      strongMatches,
      avgScore,
      shortlisted,
    },
  }
}

export default async function DashboardPage() {
  const data = await fetchDashboardData()

  if (!data?.hasJobs) {
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

  const { jobs, candidates, metrics } = data as any

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
            Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: colors.dim, marginTop: '4px' }}>
            {jobs.length} active job{jobs.length !== 1 ? 's' : ''} · {metrics.totalCandidates} total candidates
          </p>
        </div>

        <DashboardUploadButton jobs={jobs} />
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
          label="Total Candidates"
          value={metrics.totalCandidates}
          change={`+${Math.floor(metrics.totalCandidates * 0.1) || 0}`}
          changeType="positive"
        />
        <MetricCard
          label="Strong Match"
          value={metrics.strongMatches}
          change={`+${Math.floor(metrics.strongMatches * 0.2) || 0}`}
          changeType="positive"
        />
        <MetricCard
          label="Avg Score"
          value={`${metrics.avgScore}%`}
          change={`+${Math.floor(metrics.avgScore * 0.05) || 0}%`}
          changeType="positive"
        />
        <MetricCard
          label="Shortlisted"
          value={metrics.shortlisted}
          change={metrics.shortlisted > 5 ? '-2' : '+1'}
          changeType={metrics.shortlisted > 5 ? 'negative' : 'positive'}
        />
      </div>

      {/* Candidates Table */}
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
                Job
              </th>
              <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: colors.dim, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Match Score
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
            {candidates.map((c: any, idx: number) => {
              const job = jobs.find((j: any) => j.id === c.job_id)
              return (
                <tr key={c.id} style={{ borderBottom: idx < candidates.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                  <td style={{ padding: '14px 18px' }}>
                    <Link
                      href={`/candidates/${c.id}`}
                      style={{
                        color: colors.text,
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: 500,
                      }}
                    >
                      {c.full_name || 'Unknown'}
                    </Link>
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '12px' }}>
                    {c.job_id ? (
                      <Link
                        href={`/jobs/${c.job_id}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          background: 'rgba(0,122,255,0.06)',
                          border: '1px solid rgba(0,122,255,0.12)',
                          color: colors.accent,
                          borderRadius: '6px',
                          padding: '3px 10px',
                          fontSize: '12px',
                          maxWidth: '160px',
                          whiteSpace: 'nowrap' as const,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          textDecoration: 'none',
                          cursor: 'pointer',
                        }}
                        title={job?.title}
                      >
                        {job?.title || 'Unknown Job'}
                      </Link>
                    ) : (
                      <span style={{ color: colors.dim }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* Bar track */}
                      <div
                        style={{
                          flex: 1,
                          height: '5px',
                          background: 'rgba(255,255,255,0.06)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                          minWidth: '80px',
                          maxWidth: '140px',
                        }}
                      >
                        {/* Bar fill */}
                        <div
                          style={{
                            height: '100%',
                            borderRadius: '3px',
                            background:
                              (c.score || 0) >= 80
                                ? '#10b981'
                                : (c.score || 0) >= 60
                                ? '#f59e0b'
                                : '#f87171',
                            '--score-width': `${c.score || 0}%`,
                            animation: `barGrow 800ms cubic-bezier(0.23,1,0.32,1) ${idx * 60}ms forwards`,
                            width: '0%',
                          } as React.CSSProperties}
                        />
                      </div>

                      {/* Score number */}
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          fontFamily: 'monospace',
                          minWidth: '34px',
                          color:
                            (c.score || 0) >= 80
                              ? '#10b981'
                              : (c.score || 0) >= 60
                              ? '#f59e0b'
                              : '#f87171',
                        }}
                      >
                        {c.score || 0}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '13px', color: colors.muted }}>
                    {c.seniority || 'Mid'}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 500,
                        backgroundColor:
                          c.status === 'shortlisted'
                            ? 'rgba(16,185,129,0.1)'
                            : c.status === 'rejected'
                            ? 'rgba(248,113,113,0.1)'
                            : 'rgba(255,255,255,0.08)',
                        color:
                          c.status === 'shortlisted'
                            ? colors.green
                            : c.status === 'rejected'
                            ? colors.red
                            : colors.muted,
                      }}
                    >
                      {c.status || 'New'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
