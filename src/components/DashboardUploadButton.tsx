'use client'

import { useState } from 'react'
import JobPickerModal from './JobPickerModal'
import ResumeUploader from './ResumeUploader'

interface Job {
  id: string
  title: string
  description?: string
  department?: string
  candidate_count?: number
}

const colors = {
  accent: '#007AFF',
}

export default function DashboardUploadButton({ jobs }: { jobs: Job[] }) {
  const [showJobPicker, setShowJobPicker] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showUploader, setShowUploader] = useState(false)

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job)
    setShowJobPicker(false)
    setShowUploader(true)
  }

  const handleUploaderClose = () => {
    setShowUploader(false)
    setSelectedJob(null)
  }

  return (
    <>
      <button
        onClick={() => setShowJobPicker(true)}
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
          transition: 'all 200ms cubic-bezier(0.23,1,0.32,1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.9'
          e.currentTarget.style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Upload resumes
      </button>

      {showJobPicker && (
        <JobPickerModal
          jobs={jobs}
          onSelect={handleJobSelect}
          onClose={() => setShowJobPicker(false)}
        />
      )}

      {showUploader && selectedJob && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 40,
          }}
          onClick={handleUploaderClose}
        >
          <div
            style={{
              backgroundColor: '#0d0d10',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px',
              padding: '28px',
              width: '90vw',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#fafafa',
                    margin: 0,
                  }}
                >
                  Upload resumes for {selectedJob.title}
                </h2>
              </div>
              <button
                onClick={handleUploaderClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#3f3f46',
                  padding: '4px',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#f87171'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#3f3f46'
                }}
              >
                ✕
              </button>
            </div>

            <ResumeUploader
              jobId={selectedJob.id}
              jobTitle={selectedJob.title}
              jobDescription={selectedJob.description || ''}
              onComplete={handleUploaderClose}
            />
          </div>
        </div>
      )}
    </>
  )
}
