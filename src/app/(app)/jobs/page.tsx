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
          padding: '36px 40px',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '16px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.dim} strokeWidth="2" style={{ margin: '0 auto' }}>
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 3v4M8 3v4" />
            </svg>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: colors.text, marginBottom: '8px' }}>
            No jobs yet
          </h2>
          <p style={{ fontSize: '14px', color: colors.muted, marginBottom: '24px' }}>
            Create your first job to start screening candidates
          </p>
          <style>{`
            .create-job-btn {
              transition: all 0.2s ease;
            }
            .create-job-btn:hover {
              box-shadow: 0 0 30px rgba(99, 102, 241, 0.55) !important;
              transform: translateY(-1px);
            }
          `}</style>
          <Link
            href="/jobs/new"
            className="create-job-btn"
            style={{
              display: 'inline-block',
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'white',
              background: `linear-gradient(135deg, ${colors.indigo} 0%, #818cf8 100%)`,
              boxShadow: `0 0 20px rgba(99, 102, 241, 0.35)`,
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
    <div style={{ padding: '36px 40px' }}>
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
