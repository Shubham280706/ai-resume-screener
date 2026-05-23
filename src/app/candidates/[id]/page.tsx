'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const colors = {
  text: '#e7ecf7',
  muted: '#8b94ad',
  dim: '#5b637a',
  indigo: '#6366f1',
  lightIndigo: '#818cf8',
  green: '#34d399',
  amber: '#f59e0b',
  red: '#f87171',
  surface: '#0d1425',
  line: 'rgba(255,255,255,.07)',
}

interface Candidate {
  id: string
  full_name: string
  email?: string
  phone?: string
  location?: string
  years_experience?: number
  score: number
  status: string
  seniority: string
  job_id: string
  created_at: string
  ai_summary?: string
}

interface Job {
  id: string
  title: string
}

export default function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [params_, setParams_] = useState<{ id: string } | null>(null)
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    params.then(setParams_)
  }, [params])

  useEffect(() => {
    if (!params_) return

    const fetchCandidate = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single()

      if (!profile?.org_id) {
        router.push('/candidates')
        return
      }

      const { data: candidateData } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', params_.id)
        .single()

      if (!candidateData) {
        router.push('/candidates')
        return
      }

      setCandidate(candidateData as Candidate)

      const { data: jobData } = await supabase
        .from('jobs')
        .select('id, title')
        .eq('id', candidateData.job_id)
        .single()

      setJob(jobData as Job)
      setLoading(false)
    }

    fetchCandidate()
  }, [params_, router])

  const updateStatus = async (newStatus: string) => {
    if (!candidate) return

    setUpdating(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('candidates')
      .update({ status: newStatus })
      .eq('id', candidate.id)

    if (!error) {
      setCandidate({ ...candidate, status: newStatus })
    }

    setUpdating(false)
  }

  if (loading) {
    return (
      <div style={{ marginLeft: '256px', padding: '36px 40px', minHeight: '100vh' }}>
        <div
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.line}`,
            borderRadius: '14px',
            padding: '24px',
            animate: 'pulse',
          }}
        >
          Loading...
        </div>
      </div>
    )
  }

  if (!candidate) {
    return (
      <div style={{ marginLeft: '256px', padding: '36px 40px', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: colors.text }}>Candidate not found</h2>
          <Link href="/candidates" style={{ color: colors.indigo }}>
            Back to candidates
          </Link>
        </div>
      </div>
    )
  }

  const scoreColor =
    candidate.score >= 80 ? colors.green : candidate.score >= 60 ? colors.amber : colors.red

  return (
    <div style={{ marginLeft: '256px', padding: '36px 40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <Link
          href={job ? `/jobs/${job.id}` : '/candidates'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            color: colors.muted,
            textDecoration: 'none',
            marginBottom: '12px',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.text
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.muted
          }}
        >
          ← {job ? job.title : 'Candidates'}
        </Link>

        <h1 style={{ fontSize: '26px', fontWeight: 600, color: colors.text, margin: 0 }}>
          {candidate.full_name}
        </h1>
      </div>

      {/* Two column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* AI Summary */}
          <div
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.line}`,
              borderRadius: '14px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#a78bfa',
                }}
              />
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: colors.text, margin: 0 }}>
                AI Summary
              </h3>
            </div>
            <p style={{ fontSize: '13px', lineHeight: '1.6', color: colors.muted, margin: 0 }}>
              {candidate.ai_summary || 'No summary available yet.'}
            </p>
          </div>

          {/* Experience */}
          <div
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.line}`,
              borderRadius: '14px',
              padding: '24px',
            }}
          >
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: colors.text, marginTop: 0 }}>
              Experience
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: colors.muted }}>Years of experience:</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: colors.text }}>
                {candidate.years_experience || 0} years
              </span>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Match Score */}
          <div
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.line}`,
              borderRadius: '14px',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: `3px solid ${scoreColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <span
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: scoreColor,
                }}
              >
                {candidate.score}%
              </span>
            </div>
            <p style={{ fontSize: '12px', color: colors.muted, margin: '0 0 12px 0' }}>
              Match score
            </p>
            {job && (
              <p style={{ fontSize: '13px', color: colors.text, margin: '12px 0' }}>
                Applied for: <strong>{job.title}</strong>
              </p>
            )}
            <div
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: `1px solid rgba(255,255,255,.1)`,
                borderRadius: '8px',
                padding: '3px 10px',
                fontSize: '12px',
                color: colors.text,
              }}
            >
              {candidate.seniority || 'Mid'}
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.line}`,
              borderRadius: '14px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <button
              onClick={() => updateStatus('shortlisted')}
              disabled={updating || candidate.status === 'shortlisted'}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor:
                  candidate.status === 'shortlisted'
                    ? 'rgba(52, 211, 153, 0.2)'
                    : 'rgba(52, 211, 153, 0.1)',
                border: `1px solid rgba(52, 211, 153, 0.25)`,
                color: colors.green,
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: updating ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!updating && candidate.status !== 'shortlisted') {
                  e.currentTarget.style.backgroundColor = 'rgba(52, 211, 153, 0.2)'
                }
              }}
            >
              ✓ Shortlist
            </button>

            <button
              onClick={() => updateStatus('interview')}
              disabled={updating}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: colors.indigo,
                border: 'none',
                color: 'white',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: updating ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: updating ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!updating) {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(99, 102, 241, 0.3)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Schedule Interview
            </button>

            <button
              onClick={() => updateStatus('rejected')}
              disabled={updating}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'rgba(248, 113, 113, 0.06)',
                border: '1px solid rgba(248, 113, 113, 0.2)',
                color: colors.red,
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: updating ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!updating) {
                  e.currentTarget.style.backgroundColor = 'rgba(248, 113, 113, 0.12)'
                }
              }}
            >
              Reject
            </button>
          </div>

          {/* Info Card */}
          <div
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.line}`,
              borderRadius: '14px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {candidate.email && (
              <div>
                <p style={{ fontSize: '12px', color: colors.muted, margin: 0 }}>Email</p>
                <p style={{ fontSize: '13px', color: colors.text, margin: '4px 0 0 0' }}>
                  {candidate.email}
                </p>
              </div>
            )}
            {candidate.phone && (
              <div>
                <p style={{ fontSize: '12px', color: colors.muted, margin: 0 }}>Phone</p>
                <p style={{ fontSize: '13px', color: colors.text, margin: '4px 0 0 0' }}>
                  {candidate.phone}
                </p>
              </div>
            )}
            {candidate.location && (
              <div>
                <p style={{ fontSize: '12px', color: colors.muted, margin: 0 }}>Location</p>
                <p style={{ fontSize: '13px', color: colors.text, margin: '4px 0 0 0' }}>
                  {candidate.location}
                </p>
              </div>
            )}
            <div>
              <p style={{ fontSize: '12px', color: colors.muted, margin: 0 }}>Uploaded</p>
              <p style={{ fontSize: '13px', color: colors.text, margin: '4px 0 0 0' }}>
                {new Date(candidate.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
