import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import CandidateTable from '@/components/CandidateTable'

const colors = {
  text: '#e7ecf7',
  muted: '#8b94ad',
  dim: '#5b637a',
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
    return []
  }

  const { data: candidates } = await supabase
    .from('candidates')
    .select('*')
    .eq('org_id', profile.org_id)
    .order('score', { ascending: false })

  return candidates || []
}

export default async function CandidatesPage() {
  const candidates = await fetchCandidates()

  if (!candidates || candidates.length === 0) {
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
          <div style={{ fontSize: '48px', marginBottom: '16px', color: colors.dim }}>
            👥
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, color: colors.text, marginBottom: '8px' }}>
            No candidates yet
          </h2>
          <p style={{ fontSize: '14px', color: colors.muted }}>
            Upload resumes to start screening candidates
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '36px 40px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 600, color: colors.text, marginBottom: '24px' }}>
        Candidates
      </h1>

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
    </div>
  )
}
