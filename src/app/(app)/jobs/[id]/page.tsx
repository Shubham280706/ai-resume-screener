import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MetricCard from '@/components/MetricCard'
import CandidateTable from '@/components/CandidateTable'
import JobDetailUpload from '@/components/JobDetailUpload'

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

async function fetchJobData(jobId: string) {
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
    return null
  }

  const { data: job } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .eq('org_id', profile.org_id)
    .single()

  if (!job) {
    return null
  }

  const { data: candidates } = await supabase
    .from('candidates')
    .select('*')
    .eq('job_id', jobId)
    .order('score', { ascending: false })

  const totalApplied = candidates?.length || 0
  const strongMatch = candidates?.filter((c) => c.score >= 80).length || 0
  const avgScore =
    candidates && candidates.length > 0
      ? Math.round(candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length)
      : 0
  const shortlisted = candidates?.filter((c) => c.status === 'shortlisted').length || 0

  return {
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

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await fetchJobData(id)

  if (!data) {
    redirect('/jobs')
  }

  const { job, candidates, metrics } = data

  return (
    <div style={{ padding: '40px 40px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <Link
          href="/jobs"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: colors.muted,
            textDecoration: 'none',
            marginBottom: '12px',
            transition: 'color 150ms ease',
          }}
        >
          ← Jobs
        </Link>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '26px',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: colors.text,
                margin: 0,
              }}
            >
              {job.title}
            </h1>
            <p style={{ fontSize: '13px', color: colors.dim, marginTop: '4px' }}>
              {metrics.totalApplied} candidates • {job.status || 'Open'} • Created{' '}
              {new Date(job.created_at).toLocaleDateString()}
            </p>
          </div>

          <JobDetailUpload
            jobId={job.id}
            jobTitle={job.title}
            jobDescription={job.description || ''}
          />
        </div>
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
      {candidates.length > 0 ? (
        <CandidateTable
          candidates={candidates.map((c) => ({
            id: c.id,
            full_name: c.full_name || 'Unknown',
            location: c.location,
            experience: c.years_experience ? `${c.years_experience}y` : undefined,
            score: c.score || 0,
            seniority: c.seniority || 'Mid',
            status: c.status || 'New',
          }))}
        />
      ) : (
        <div
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: '14px',
            padding: '60px 24px',
            textAlign: 'center',
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={colors.dim} strokeWidth="1.25" strokeLinecap="round" style={{ margin: '0 auto' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.text, marginBottom: '8px' }}>
            No resumes uploaded yet
          </h3>
          <p style={{ fontSize: '13px', color: colors.muted }}>
            Upload resumes to start screening candidates
          </p>
        </div>
      )}
    </div>
  )
}
