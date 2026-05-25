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
}

async function fetchCandidates() {
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
    return { candidates: [], jobs: [] }
  }

  const { data: candidates } = await supabase
    .from('candidates')
    .select('*')
    .eq('org_id', profile.org_id)
    .order('score', { ascending: false })

  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title')
    .eq('org_id', profile.org_id)

  return { candidates: candidates || [], jobs: jobs || [] }
}

export default async function CandidatesPage() {
  const data = await fetchCandidates()

  if (!data || !data.candidates || data.candidates.length === 0) {
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
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: colors.text, marginBottom: '8px' }}>
            No candidates yet
          </h2>
          <p style={{ fontSize: '13px', color: colors.muted }}>
            Upload resumes to start screening candidates
          </p>
        </div>
      </div>
    )
  }

  const { candidates, jobs } = data
  const jobMap = Object.fromEntries(jobs.map(j => [j.id, j.title]))

  return (
    <div style={{ padding: '40px 40px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: colors.text, marginBottom: '24px' }}>
        All Candidates
      </h1>

      <div
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.dim, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Candidate
              </th>
              <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.dim, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Applied For
              </th>
              <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.dim, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Score
              </th>
              <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.dim, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Seniority
              </th>
              <th style={{ padding: '14px 18px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: colors.dim, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, idx) => (
              <tr
                key={candidate.id}
                style={{
                  borderBottom: idx < candidates.length - 1 ? `1px solid ${colors.border}` : 'none',
                  backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                }}
              >
                <td style={{ padding: '14px 18px' }}>
                  <Link
                    href={`/candidates/${candidate.id}`}
                    style={{
                      color: colors.text,
                      textDecoration: 'none',
                      fontWeight: 500,
                      fontSize: '13px',
                    }}
                  >
                    {candidate.full_name || 'Unknown'}
                  </Link>
                </td>
                <td style={{ padding: '14px 18px', fontSize: '13px', color: colors.muted }}>
                  {candidate.job_id ? (
                    <Link
                      href={`/jobs/${candidate.job_id}`}
                      style={{
                        color: colors.accent,
                        textDecoration: 'none',
                        fontSize: '13px',
                      }}
                    >
                      {jobMap[candidate.job_id] || 'Unknown Job'}
                    </Link>
                  ) : (
                    <span style={{ color: colors.dim }}>—</span>
                  )}
                </td>
                <td style={{ padding: '14px 18px', fontSize: '13px', fontWeight: 600, color: colors.text }}>
                  {candidate.score || 0}%
                </td>
                <td style={{ padding: '14px 18px', fontSize: '13px', color: colors.muted }}>
                  {candidate.seniority || 'Mid'}
                </td>
                <td style={{ padding: '14px 18px', fontSize: '12px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      backgroundColor:
                        candidate.status === 'shortlisted'
                          ? 'rgba(16,185,129,0.1)'
                          : candidate.status === 'rejected'
                          ? 'rgba(248,113,113,0.1)'
                          : 'rgba(255,255,255,0.08)',
                      color:
                        candidate.status === 'shortlisted'
                          ? '#10b981'
                          : candidate.status === 'rejected'
                          ? '#f87171'
                          : colors.muted,
                      fontWeight: 500,
                    }}
                  >
                    {candidate.status || 'New'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
