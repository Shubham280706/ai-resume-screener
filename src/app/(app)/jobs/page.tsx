import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const colors = {
  bg: '#050507',
  surface: '#0d0d10',
  border: 'rgba(255,255,255,0.07)',
  text: '#fafafa',
  muted: '#71717a',
  dim: '#3f3f46',
  accent: '#007AFF',
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
          padding: '40px 40px',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '16px' }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={colors.dim} strokeWidth="1.25" strokeLinecap="round" style={{ margin: '0 auto' }}>
              <rect x="3" y="7" width="18" height="14" rx="2" />
              <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="3" y1="13" x2="21" y2="13" />
            </svg>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: colors.text, marginBottom: '8px' }}>
            No jobs yet
          </h2>
          <p style={{ fontSize: '13px', color: colors.muted, marginBottom: '24px' }}>
            Create your first job to start screening candidates
          </p>
          <Link
            href="/jobs/new"
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
            + Create first job
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px 40px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: colors.text, marginBottom: '24px' }}>
        Jobs
      </h1>

      <style>{`
        .job-card {
          transition: all 200ms cubic-bezier(0.23,1,0.32,1);
        }
        .job-card:hover {
          border-color: rgba(0,122,255,0.25);
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.4);
        }
        .job-card:active {
          transform: scale(0.99);
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
              padding: '16px 20px',
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: colors.text, margin: 0 }}>
                {job.title}
              </h3>
              <p style={{ fontSize: '12px', color: colors.muted, margin: '4px 0 0 0' }}>
                {counts[job.id] || 0} candidates
              </p>
            </div>
            <div style={{ fontSize: '18px', color: colors.muted }}>→</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
