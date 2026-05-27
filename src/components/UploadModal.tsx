'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ResumeUploader from './ResumeUploader'

const colors = {
  text: '#e7ecf7',
  muted: '#8b94ad',
  dim: '#5b637a',
  indigo: '#6366f1',
}

interface UploadModalProps {
  isOpen: boolean
  jobId: string
  jobTitle: string
  jobDescription: string
  onClose: () => void
}

export default function UploadModal({
  isOpen,
  jobId,
  jobTitle,
  jobDescription,
  onClose,
}: UploadModalProps) {
  const router = useRouter()
  const [uploadComplete, setUploadComplete] = useState(false)

  const handleComplete = () => {
    setUploadComplete(true)
  }

  const handleViewCandidates = () => {
    router.refresh()
    onClose()
    setUploadComplete(false)
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#0d1425',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '32px',
          width: '560px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'none',
            border: 'none',
            color: colors.dim,
            fontSize: '24px',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.text
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.dim
          }}
        >
          ✕
        </button>

        {/* Title */}
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: colors.text,
            margin: '0 0 8px 0',
          }}
        >
          Upload Resumes
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '14px',
            color: colors.muted,
            margin: '0 0 24px 0',
          }}
        >
          for {jobTitle}
        </p>

        {/* Upload content */}
        {!uploadComplete ? (
          <ResumeUploader
            jobId={jobId}
            jobTitle={jobTitle}
            jobDescription={jobDescription}
            onComplete={handleComplete}
          />
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 0',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                marginBottom: '16px',
              }}
            >
              ✓
            </div>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: colors.text,
                marginBottom: '8px',
              }}
            >
              Resumes Analyzed
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: colors.muted,
                marginBottom: '24px',
              }}
            >
              Your resumes have been analyzed and added to the candidate pool.
            </p>
            <button
              onClick={handleViewCandidates}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                color: 'white',
                background: colors.indigo,
                border: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.8'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1'
              }}
            >
              View Candidates
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
