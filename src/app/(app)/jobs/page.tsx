import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

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

  return (
    <div style={{ padding: '40px 40px' }}>
      {/* Header with New Job button — ALWAYS visible */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: colors.text,
              letterSpacing: '-0.03em',
              margin: 0,
            }}
          >
            Jobs
          </h1>
          <p
            style={{
              fontSize: '13px',
              color: colors.dim,
              marginTop: '4px',
            }}
          >
            {jobs?.length || 0} active job{jobs?.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* This button ALWAYS shows */}
        <Link href="/jobs/new" className="new-job-btn">
          <button
            style={{
              background: `linear-gradient(135deg, ${colors.accent}, #0ea5e9)`,
              color: 'white',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New job
          </button>
        </Link>
      </div>

      <style>{`
        .new-job-btn button {
          transition: opacity 200ms ease, transform 200ms ease;
        }
        .new-job-btn:hover button {
          opacity: 0.9;
          transform: translateY(-1px);
        }

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

      {/* Conditional content below */}
      {!jobs || jobs.length === 0 ? (
        // Empty state WITHOUT the create button (button is in header above)
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            textAlign: 'center',
            gap: '12px',
          }}
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.dim}
            strokeWidth="1.25"
          >
            <rect x="3" y="7" width="18" height="14" rx="2" />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="3" y1="13" x2="21" y2="13" />
          </svg>
          <p
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: colors.text,
              margin: 0,
            }}
          >
            No jobs yet
          </p>
          <p
            style={{
              fontSize: '13px',
              color: colors.muted,
              margin: 0,
            }}
          >
            Create your first job to start screening candidates
          </p>
        </div>
      ) : (
        // Jobs list
        <div style={{ display: 'grid', gap: '12px' }}>
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="job-card"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'center',
                  padding: '16px 20px',
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: colors.text,
                      margin: 0,
                    }}
                  >
                    {job.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '12px',
                      color: colors.muted,
                      margin: '4px 0 0 0',
                    }}
                  >
                    {counts[job.id] || 0} candidates
                  </p>
                </div>
                <div style={{ fontSize: '18px', color: colors.muted }}>→</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
