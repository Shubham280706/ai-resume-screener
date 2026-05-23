'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const colors = {
  surface: '#0d1425',
  line: 'rgba(255,255,255,.07)',
  lineDarker: 'rgba(255,255,255,.04)',
  text: '#e7ecf7',
  muted: '#8b94ad',
  dim: '#5b637a',
  green: '#34d399',
  amber: '#f59e0b',
  red: '#f87171',
}

interface Candidate {
  id: string
  full_name: string
  location?: string
  experience?: string
  score: number
  seniority: 'Junior' | 'Mid' | 'Senior'
  status: 'Shortlisted' | 'Interview' | 'Reviewing' | 'New' | 'Below bar'
}

interface CandidateTableProps {
  candidates: Candidate[]
  isLoading?: boolean
}

function getAvatarGradient(index: number): string {
  const gradients = [
    '135deg, #6366f1, #a855f7',
    '135deg, #0891b2, #22d3ee',
    '135deg, #db2777, #f472b6',
    '135deg, #16a34a, #4ade80',
    '135deg, #ea580c, #fb923c',
  ]
  return gradients[index % gradients.length]
}

function getStatusStyle(status: string) {
  const styles: { [key: string]: { bg: string; border: string; text: string } } = {
    Shortlisted: {
      bg: 'rgba(52, 211, 153, 0.1)',
      border: 'rgba(52, 211, 153, 0.25)',
      text: colors.green,
    },
    Interview: {
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.25)',
      text: colors.amber,
    },
    Reviewing: {
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.25)',
      text: colors.amber,
    },
    New: {
      bg: 'rgba(255,255,255,0.05)',
      border: 'rgba(255,255,255,0.1)',
      text: colors.muted,
    },
    'Below bar': {
      bg: 'rgba(248, 113, 113, 0.1)',
      border: 'rgba(248, 113, 113, 0.25)',
      text: colors.red,
    },
  }
  return styles[status] || styles.New
}

function getScoreColor(score: number): string {
  if (score >= 80) return colors.green
  if (score >= 60) return colors.amber
  return colors.red
}

export default function CandidateTable({
  candidates,
  isLoading = false,
}: CandidateTableProps) {
  const [animatedRows, setAnimatedRows] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!isLoading && candidates.length > 0) {
      const timer = setTimeout(() => {
        const allRows = new Set(Array.from({ length: candidates.length }, (_, i) => i))
        setAnimatedRows(allRows)
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isLoading, candidates.length])

  if (isLoading) {
    return (
      <div
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.line}`,
          borderRadius: '14px',
          overflow: 'hidden',
        }}
      >
        <div
          className="animate-pulse"
          style={{
            display: 'grid',
            gridTemplateColumns: '2.5fr 2fr 1fr 1.2fr 40px',
            gap: '16px',
            padding: '12px 24px',
            borderBottom: `1px solid ${colors.line}`,
          }}
        >
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-3 rounded"
              style={{ backgroundColor: 'rgba(255,255,255,.08)' }}
            />
          ))}
        </div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse"
            style={{
              padding: '14px 24px',
              borderBottom: `1px solid ${colors.line}`,
            }}
          >
            <div
              className="h-5 rounded"
              style={{ backgroundColor: 'rgba(255,255,255,.05)' }}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.line}`,
        borderRadius: '14px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2.5fr 2fr 1fr 1.2fr 40px',
          gap: '16px',
          padding: '12px 24px',
          borderBottom: `1px solid ${colors.line}`,
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: '11px',
            fontFamily: 'ui-monospace, monospace',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: colors.dim,
          }}
        >
          Candidate
        </div>
        <div
          style={{
            fontSize: '11px',
            fontFamily: 'ui-monospace, monospace',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: colors.dim,
          }}
        >
          Match Score
        </div>
        <div
          style={{
            fontSize: '11px',
            fontFamily: 'ui-monospace, monospace',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: colors.dim,
          }}
        >
          Seniority
        </div>
        <div
          style={{
            fontSize: '11px',
            fontFamily: 'ui-monospace, monospace',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: colors.dim,
          }}
        >
          Status
        </div>
        <div />
      </div>

      {/* Rows */}
      {candidates.map((candidate, index) => {
        const initials = candidate.full_name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
        const statusStyle = getStatusStyle(candidate.status)
        const scoreColor = getScoreColor(candidate.score)
        const isLastRow = index === candidates.length - 1

        return (
          <Link
            key={candidate.id || index}
            href={`/candidates/${candidate.id}`}
            className="group"
            style={{
              display: 'grid',
              gridTemplateColumns: '2.5fr 2fr 1fr 1.2fr 40px',
              gap: '16px',
              padding: '14px 24px',
              borderBottom: isLastRow ? 'none' : `1px solid ${colors.lineDarker}`,
              alignItems: 'center',
              transition: 'all 0.15s ease',
              backgroundColor: 'transparent',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            {/* Candidate */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: `linear-gradient(${getAvatarGradient(index)})`,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: colors.text, margin: 0 }}>
                  {candidate.full_name}
                </p>
                <p style={{ fontSize: '12px', color: colors.dim, margin: '2px 0 0 0' }}>
                  {candidate.location || 'Location'} • {candidate.experience || '0y'} exp
                </p>
              </div>
            </div>

            {/* Score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  height: '6px',
                  backgroundColor: 'rgba(255,255,255,.06)',
                  borderRadius: '3px',
                  width: '160px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: animatedRows.has(index) ? `${candidate.score}%` : '0%',
                    backgroundColor: scoreColor,
                    borderRadius: '3px',
                    transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                  onTransitionEnd={() => {
                    if (!animatedRows.has(index)) {
                      setAnimatedRows(new Set([...animatedRows, index]))
                    }
                  }}
                />
              </div>
              <span style={{ fontSize: '15px', fontWeight: 600, color: colors.text, minWidth: '36px' }}>
                {candidate.score}%
              </span>
            </div>

            {/* Seniority */}
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,.05)',
                border: `1px solid rgba(255,255,255,.1)`,
                borderRadius: '8px',
                padding: '3px 10px',
                fontSize: '12px',
                color: colors.text,
                width: 'fit-content',
              }}
            >
              {candidate.seniority}
            </div>

            {/* Status */}
            <div
              style={{
                backgroundColor: statusStyle.bg,
                border: `1px solid ${statusStyle.border}`,
                borderRadius: '8px',
                padding: '3px 10px',
                fontSize: '12px',
                color: statusStyle.text,
                width: 'fit-content',
              }}
            >
              {candidate.status}
            </div>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '18px',
                color: colors.dim,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.text
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.dim
              }}
            >
              ⋯
            </div>
          </Link>
        )
      })}

      <style>{`
        a[href*="/candidates/"] {
          transition: background-color 0.15s ease;
        }
        a[href*="/candidates/"]:hover {
          background-color: rgba(255,255,255,0.02) !important;
        }
      `}</style>
    </div>
  )
}
