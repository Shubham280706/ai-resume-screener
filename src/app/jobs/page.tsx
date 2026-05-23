import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const colors = {
  text: '#e7ecf7',
  muted: '#8b94ad',
  dim: '#5b637a',
  indigo: '#6366f1',
  surface: '#0d1425',
  line: 'rgba(255,255,255,.07)',
}

async function fetchJobs() {
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
    return []
  }

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('org_id', profile.org_id)
    .order('created_at', { ascending: false })

  return jobs || []
}

async function getCandidateCounts(jobs: any[]) {
  if (!jobs.length) return {}

  const supabase = await createClient()
  const counts: { [key: string]: number } = {}

  for (const job of jobs) {
    const { count } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .eq('job_id', job.id)

    counts[job.id] = count || 0
  }

  return counts
}

export default async function JobsPage() {
  const jobs = await fetchJobs()
  const counts = await getCandidateCounts(jobs || [])

  if (!jobs || jobs.length === 0) {
    return (
      <div
        style={{
          marginLeft: '256px',
          padding: '36px 40px',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', color: colors.dim }}>
            📋
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: colors.text, marginBottom: '8px' }}>
            No jobs yet
          </h2>
          <p style={{ fontSize: '14px', color: colors.muted }}>
            Create your first job to start screening candidates
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginLeft: '256px', padding: '36px 40px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 600, color: colors.text, marginBottom: '24px' }}>
        Jobs
      </h1>

      <style>{`
        .job-card {
          transition: all 0.2s ease;
        }
        .job-card:hover {
          background-color: rgba(255,255,255,0.03) !important;
          transform: translateX(4px);
        }
      `}</style>

      <div style={{ display: 'grid', gap: '12px' }}>
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className="job-card"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'center',
              padding: '16px 24px',
              backgroundColor: colors.surface,
              border: `1px solid ${colors.line}`,
              borderRadius: '12px',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: colors.text, margin: 0 }}>
                {job.title}
              </h3>
              <p style={{ fontSize: '13px', color: colors.muted, margin: '4px 0 0 0' }}>
                {counts[job.id] || 0} applicants
              </p>
            </div>
            <div style={{ fontSize: '18px' }}>→</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
