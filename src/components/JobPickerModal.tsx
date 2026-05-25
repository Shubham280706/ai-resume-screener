'use client'

import { useState } from 'react'
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

interface Job {
  id: string
  title: string
  department?: string
  candidate_count?: number
}

interface JobPickerModalProps {
  jobs: Job[]
  onSelect: (job: Job) => void
  onClose: () => void
}

export default function JobPickerModal({
  jobs,
  onSelect,
  onClose,
}: JobPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: '16px',
          padding: '28px',
          width: '480px',
          maxWidth: '90vw',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '15%',
            right: '15%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(0,122,255,0.5), transparent)',
          }}
        />

        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: colors.text,
              margin: 0,
            }}
          >
            Choose a job to upload resumes for
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              color: colors.dim,
              padding: '4px',
              transition: 'color 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#f87171'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.dim
            }}
          >
            ✕
          </button>
        </div>

        {/* Search input */}
        {jobs.length > 3 && (
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
              backgroundColor: 'rgba(255,255,255,0.04)',
              color: colors.text,
              fontSize: '13px',
              marginBottom: '16px',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0,122,255,0.4)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,122,255,0.08)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = colors.border
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        )}

        {/* Job list */}
        {filteredJobs.length === 0 && jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: colors.text,
                marginBottom: '8px',
              }}
            >
              No jobs created yet
            </p>
            <p style={{ fontSize: '13px', color: colors.muted, marginBottom: '16px' }}>
              Create a job first before uploading resumes
            </p>
            <Link
              href="/jobs/new"
              style={{
                display: 'inline-block',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'white',
                background: `linear-gradient(135deg, ${colors.accent}, #0ea5e9)`,
                textDecoration: 'none',
              }}
            >
              Create job →
            </Link>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ fontSize: '13px', color: colors.muted }}>
              No jobs match your search
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflow: 'auto' }}>
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => onSelect(job)}
                style={{
                  background: 'transparent',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '10px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0,122,255,0.05)'
                  e.currentTarget.style.borderColor = 'rgba(0,122,255,0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor = colors.border
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: colors.text,
                      marginBottom: '3px',
                    }}
                  >
                    {job.title}
                  </div>
                  <div style={{ fontSize: '12px', color: colors.dim }}>
                    {job.department || 'Engineering'} · {job.candidate_count || 0} candidates
                  </div>
                </div>
                <div
                  style={{
                    color: colors.dim,
                    fontSize: '16px',
                    transition: 'all 150ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = colors.accent
                    e.currentTarget.style.transform = 'translateX(2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.dim
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  →
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {jobs.length > 0 && (
          <div
            style={{
              textAlign: 'center',
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            <Link
              href="/jobs/new"
              style={{
                fontSize: '13px',
                color: colors.muted,
                textDecoration: 'none',
                transition: 'color 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.text
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.muted
              }}
            >
              or create a new job →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
