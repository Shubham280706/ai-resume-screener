'use client'

import { useState } from 'react'

const colors = {
  text: '#e7ecf7',
  muted: '#8b94ad',
  dim: '#5b637a',
  indigo: '#6366f1',
  green: '#34d399',
  red: '#f87171',
}

interface ResumeUploaderProps {
  jobId: string
  jobDescription: string
  onComplete: () => void
}

interface UploadStatus {
  filename: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  score?: number
  error?: string
}

export default function ResumeUploader({
  jobId,
  jobDescription,
  onComplete,
}: ResumeUploaderProps) {
  const [statuses, setStatuses] = useState<UploadStatus[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files)
    const newStatuses: UploadStatus[] = fileArray.map((file) => ({
      filename: file.name,
      status: 'pending',
    }))
    setStatuses(newStatuses)
    setIsProcessing(true)

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]
      setStatuses((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: 'uploading' } : s))
      )

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('jobDescription', jobDescription)
        formData.append('jobId', jobId)
        formData.append('fileName', file.name)

        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to analyze resume')
        }

        const result = await response.json()
        const score = result.scoring?.total_score || 0

        setStatuses((prev) =>
          prev.map((s, idx) =>
            idx === i ? { ...s, status: 'success', score } : s
          )
        )
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to analyze resume'
        setStatuses((prev) =>
          prev.map((s, idx) =>
            idx === i ? { ...s, status: 'error', error: errorMessage } : s
          )
        )
      }
    }

    setIsProcessing(false)

    // Check if all uploads succeeded
    if (newStatuses.every((s) => s.status === 'success')) {
      setTimeout(() => {
        onComplete()
      }, 1000)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  return (
    <div>
      {statuses.length === 0 ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? 'rgba(99,102,241,0.7)' : 'rgba(99,102,241,0.3)'}`,
            background: isDragging
              ? 'rgba(99,102,241,0.08)'
              : 'rgba(99,102,241,0.04)',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <label style={{ cursor: 'pointer', display: 'block' }}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.indigo}
              strokeWidth="1.5"
              style={{ margin: '0 auto 12px', display: 'block' }}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <div style={{ color: colors.text, fontSize: '15px', fontWeight: 500 }}>
              Drop resumes here or click to browse
            </div>
            <div
              style={{
                color: colors.dim,
                fontSize: '13px',
                marginTop: '8px',
              }}
            >
              PDF, DOC, DOCX • Multiple files supported
            </div>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {statuses.map((status, idx) => (
            <div
              key={idx}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor:
                  status.status === 'success'
                    ? 'rgba(52,211,153,0.08)'
                    : status.status === 'error'
                      ? 'rgba(248,113,113,0.08)'
                      : 'rgba(99,102,241,0.05)',
                border: `1px solid ${
                  status.status === 'success'
                    ? 'rgba(52,211,153,0.2)'
                    : status.status === 'error'
                      ? 'rgba(248,113,113,0.2)'
                      : 'rgba(99,102,241,0.1)'
                }`,
              }}
            >
              {status.status === 'uploading' ? (
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: `2px solid ${colors.indigo}`,
                    borderTopColor: 'transparent',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
              ) : status.status === 'success' ? (
                <div style={{ color: colors.green, fontWeight: 'bold' }}>✓</div>
              ) : (
                <div style={{ color: colors.red, fontWeight: 'bold' }}>✕</div>
              )}

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color:
                      status.status === 'success'
                        ? colors.green
                        : status.status === 'error'
                          ? colors.red
                          : colors.text,
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  {status.status === 'uploading'
                    ? `Analyzing ${status.filename}...`
                    : status.status === 'success'
                      ? `✓ Analyzed successfully - Score: ${status.score}`
                      : status.error}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
