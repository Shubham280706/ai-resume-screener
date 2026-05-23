'use client'

import { useState } from 'react'
import UploadModal from './UploadModal'

const colors = {
  indigo: '#6366f1',
  lightIndigo: '#818cf8',
}

interface JobDetailUploadProps {
  jobId: string
  jobTitle: string
  jobDescription: string
}

export default function JobDetailUpload({
  jobId,
  jobTitle,
  jobDescription,
}: JobDetailUploadProps) {
  const [showModal, setShowModal] = useState(false)

  const handleClick = () => {
    console.log('Upload button clicked!')
    console.log('jobId:', jobId)
    console.log('jobTitle:', jobTitle)
    setShowModal(true)
    console.log('Modal should now be visible')
  }

  return (
    <>
      <button
        onClick={handleClick}
        style={{
          padding: '10px 18px',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: 500,
          color: 'white',
          background: `linear-gradient(135deg, ${colors.indigo} 0%, ${colors.lightIndigo} 100%)`,
          border: 'none',
          boxShadow: `0 0 20px rgba(99, 102, 241, 0.35)`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s ease',
        }}
        className="upload-btn"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Upload resumes
      </button>

      <UploadModal
        isOpen={showModal}
        jobId={jobId}
        jobTitle={jobTitle}
        jobDescription={jobDescription}
        onClose={() => setShowModal(false)}
      />

      <style>{`
        .upload-btn:hover {
          box-shadow: 0 0 30px rgba(99, 102, 241, 0.55) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </>
  )
}
