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
  skills_matched?: string[]
  skills_missing?: string[]
  key_strengths?: string[]
  gaps_and_concerns?: string[]
  interview_focus_areas?: string[]
  recommendation?: string
  recommendation_message?: string
  resume_text?: string
  current_role?: string
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
  const [expandedResume, setExpandedResume] = useState(false)

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

      if (candidateData.job_id) {
        const { data: jobData } = await supabase
          .from('jobs')
          .select('id, title')
          .eq('id', candidateData.job_id)
          .single()

        setJob(jobData as Job)
      }

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
      <div style={{ padding: '36px 40px', minHeight: '100vh' }}>
        <div style={{ color: colors.muted }}>Loading...</div>
      </div>
    )
  }

  if (!candidate) {
    return (
      <div style={{ padding: '36px 40px', minHeight: '100vh' }}>
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

  const getRecommendationUI = () => {
    if (candidate.score >= 85) {
      return {
        title: 'Strong Hire',
        text: 'This candidate meets most requirements and shows strong alignment with the role. Recommended for interview.',
        bgColor: 'rgba(52,211,153,0.06)',
        borderColor: 'rgba(52,211,153,0.15)',
        textColor: colors.green,
        iconBg: colors.green,
        icon: '✓',
      }
    } else if (candidate.score >= 70) {
      return {
        title: 'Consider',
        text: 'Good candidate with some gaps. Worth a screening call to assess fit on missing areas.',
        bgColor: 'rgba(245,158,11,0.06)',
        borderColor: 'rgba(245,158,11,0.15)',
        textColor: colors.amber,
        iconBg: colors.amber,
        icon: '→',
      }
    } else if (candidate.score >= 50) {
      return {
        title: 'Needs Review',
        text: 'Moderate fit. Missing key skills but may have transferable experience. Review carefully.',
        bgColor: 'rgba(245,158,11,0.06)',
        borderColor: 'rgba(245,158,11,0.15)',
        textColor: colors.amber,
        iconBg: colors.amber,
        icon: '!',
      }
    } else {
      return {
        title: 'Not Recommended',
        text: 'Significant gaps between resume and job requirements. Consider only if pipeline is thin.',
        bgColor: 'rgba(248,113,113,0.06)',
        borderColor: 'rgba(248,113,113,0.15)',
        textColor: colors.red,
        iconBg: colors.red,
        icon: '✕',
      }
    }
  }

  const recommendation = getRecommendationUI()

  return (
    <div style={{ padding: '36px 40px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '28px',
        }}
      >
        <div>
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
            ← {job ? job.title : 'Back to candidates'}
          </Link>

          <h1
            style={{
              fontSize: '28px',
              fontWeight: 600,
              color: colors.text,
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            {candidate.full_name}
          </h1>

          <p
            style={{
              fontSize: '14px',
              color: colors.dim,
              marginTop: '4px',
              margin: '4px 0 0 0',
            }}
          >
            {candidate.current_role || 'Professional'} •{' '}
            {candidate.location || 'Location unknown'} •{' '}
            {candidate.years_experience || 0} years exp
          </p>
        </div>

        {/* Score Circle */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              border: `3px solid ${scoreColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 700,
              color: scoreColor,
            }}
          >
            {candidate.score}
          </div>
          <p
            style={{
              fontSize: '11px',
              color: colors.dim,
              margin: '8px 0 0 0',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            match
          </p>
        </div>
      </div>

      {/* Two column layout - 58% left, 42% right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '58% 42%',
          gap: '24px',
        }}
      >
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Card 1 — AI Summary */}
          <div
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.line}`,
              borderRadius: '14px',
              padding: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#a855f7',
                  boxShadow: '0 0 12px rgba(168,85,247,0.4)',
                }}
              />
              <h3
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: colors.dim,
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                AI Summary
              </h3>
            </div>
            <p
              style={{
                fontSize: '15px',
                lineHeight: '1.7',
                color: colors.muted,
                margin: 0,
                fontWeight: 300,
              }}
            >
              {candidate.ai_summary || 'No AI summary available'}
            </p>
          </div>

          {/* Card 2 — Skills Analysis */}
          <div
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.line}`,
              borderRadius: '14px',
              padding: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#a855f7',
                  boxShadow: '0 0 12px rgba(168,85,247,0.4)',
                }}
              />
              <h3
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: colors.dim,
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Skills Analysis
              </h3>
            </div>

            {/* Matched Skills */}
            <div>
              <p
                style={{
                  fontSize: '11px',
                  color: colors.green,
                  margin: '0 0 12px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 600,
                }}
              >
                ✓ Matched
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {candidate.skills_matched && candidate.skills_matched.length > 0 ? (
                  candidate.skills_matched.map((skill, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: 'rgba(52,211,153,0.1)',
                        border: '1px solid rgba(52,211,153,0.2)',
                        color: colors.green,
                        borderRadius: '8px',
                        padding: '4px 12px',
                        fontSize: '13px',
                        fontWeight: 500,
                      }}
                    >
                      {skill}
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '13px', color: colors.muted, margin: 0 }}>
                    No skills matched
                  </p>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div style={{ marginTop: '20px' }}>
              <p
                style={{
                  fontSize: '11px',
                  color: colors.red,
                  margin: '0 0 12px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 600,
                }}
              >
                ✗ Missing
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {candidate.skills_missing && candidate.skills_missing.length > 0 ? (
                  candidate.skills_missing.map((skill, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: 'rgba(248,113,113,0.1)',
                        border: '1px solid rgba(248,113,113,0.2)',
                        color: colors.red,
                        borderRadius: '8px',
                        padding: '4px 12px',
                        fontSize: '13px',
                        fontWeight: 500,
                      }}
                    >
                      {skill}
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '13px', color: colors.muted, margin: 0 }}>
                    No missing skills identified
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Card 3 — AI Recommendation */}
          <div
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.line}`,
              borderRadius: '14px',
              padding: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#a855f7',
                  boxShadow: '0 0 12px rgba(168,85,247,0.4)',
                }}
              />
              <h3
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: colors.dim,
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                AI Recommendation
              </h3>
            </div>

            <div
              style={{
                backgroundColor: recommendation.bgColor,
                border: `1px solid ${recommendation.borderColor}`,
                borderRadius: '10px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: recommendation.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  {recommendation.icon}
                </div>
                <h4
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: recommendation.textColor,
                    margin: 0,
                  }}
                >
                  {recommendation.title}
                </h4>
              </div>
              <p
                style={{
                  fontSize: '13px',
                  color: colors.muted,
                  margin: 0,
                  lineHeight: '1.6',
                }}
              >
                {recommendation.text}
              </p>
            </div>
          </div>

          {/* Card 4 — Interview Questions */}
          <div
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.line}`,
              borderRadius: '14px',
              padding: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#a855f7',
                  boxShadow: '0 0 12px rgba(168,85,247,0.4)',
                }}
              />
              <h3
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: colors.dim,
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Suggested Interview Questions
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {candidate.interview_focus_areas && candidate.interview_focus_areas.length > 0
                ? candidate.interview_focus_areas.slice(0, 3).map((question, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 0',
                        borderBottom:
                          idx < (candidate.interview_focus_areas?.length ?? 0) - 1
                            ? `1px solid ${colors.line}`
                            : 'none',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '14px',
                          color: colors.muted,
                          margin: 0,
                          lineHeight: '1.6',
                        }}
                      >
                        <strong>{idx + 1}.</strong> {question}
                      </p>
                    </div>
                  ))
                : (candidate.skills_missing ?? []).slice(0, 3).map((skill, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 0',
                        borderBottom:
                          idx < Math.min(3, (candidate.skills_missing?.length ?? 0) - 1)
                            ? `1px solid ${colors.line}`
                            : 'none',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '14px',
                          color: colors.muted,
                          margin: 0,
                          lineHeight: '1.6',
                        }}
                      >
                        <strong>{idx + 1}.</strong> Can you walk us through your experience with{' '}
                        <em>{skill}</em>? We noticed it wasn't prominent in your resume.
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Card 1 — Match Score Breakdown */}
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
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                border: `4px solid ${scoreColor}`,
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
                {candidate.score}
              </span>
            </div>
            <p
              style={{
                fontSize: '12px',
                color: colors.dim,
                margin: '0 0 20px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Match Score
            </p>

            {/* Score bars */}
            <div style={{ textAlign: 'left' }}>
              {[
                { label: 'Skills Match', value: Math.min(100, ((candidate.skills_matched?.length ?? 0) / Math.max(1, ((candidate.skills_matched?.length ?? 0) + (candidate.skills_missing?.length ?? 0)))) * 100) },
                { label: 'Experience', value: Math.min(100, ((candidate.years_experience ?? 0) / 10) * 100) },
                { label: 'Overall', value: candidate.score },
              ].map((item, idx) => (
                <div key={idx} style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '6px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        color: colors.muted,
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: colors.text,
                      }}
                    >
                      {Math.round(item.value)}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: '6px',
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${item.value}%`,
                        backgroundColor:
                          item.value >= 80
                            ? colors.green
                            : item.value >= 60
                              ? colors.amber
                              : colors.red,
                        transition: 'width 0.8s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2 — Actions */}
          <div
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.line}`,
              borderRadius: '14px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
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
                cursor: updating || candidate.status === 'shortlisted' ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!updating && candidate.status !== 'shortlisted') {
                  e.currentTarget.style.backgroundColor = 'rgba(52, 211, 153, 0.18)'
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
                background: `linear-gradient(135deg, ${colors.indigo} 0%, ${colors.lightIndigo} 100%)`,
                border: 'none',
                color: 'white',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: updating ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: `0 0 20px rgba(99, 102, 241, 0.3)`,
                opacity: updating ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!updating) {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(99, 102, 241, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.3)'
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
                border: `1px solid rgba(248, 113, 113, 0.2)`,
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

          {/* Card 3 — Candidate Info */}
          <div
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.line}`,
              borderRadius: '14px',
              padding: '24px',
            }}
          >
            <h3
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: colors.dim,
                margin: '0 0 16px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Profile
            </h3>

            {[
              { label: 'Email', value: candidate.email || '—' },
              { label: 'Location', value: candidate.location || '—' },
              { label: 'Experience', value: `${candidate.years_experience ?? 0} years` },
              { label: 'Seniority', value: candidate.seniority || 'Mid' },
              {
                label: 'Applied',
                value: new Date(candidate.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }),
              },
              { label: 'Job', value: job?.title || '—' },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom:
                    idx < 5 ? `1px solid ${colors.line}` : 'none',
                }}
              >
                <span style={{ fontSize: '13px', color: colors.dim }}>
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: colors.text,
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Card 4 — Resume Text */}
          {candidate.resume_text && (
            <div
              style={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.line}`,
                borderRadius: '14px',
                padding: '24px',
              }}
            >
              <div
                onClick={() => setExpandedResume(!expandedResume)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginBottom: expandedResume ? '16px' : 0,
                }}
              >
                <h3
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: colors.dim,
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Resume Text
                </h3>
                <span
                  style={{
                    fontSize: '18px',
                    color: colors.muted,
                    transition: 'transform 0.2s ease',
                    transform: expandedResume ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                >
                  ▼
                </span>
              </div>

              {expandedResume && (
                <div
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    borderRadius: '8px',
                    padding: '16px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    fontSize: '12px',
                    color: colors.muted,
                    lineHeight: '1.6',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {candidate.resume_text}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
