'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteButtonProps {
  id: string
  type: 'job' | 'candidate'
  itemName: string
  onDelete?: () => void
}

export default function DeleteButton({
  id,
  type,
  itemName,
  onDelete,
}: DeleteButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const endpoint =
        type === 'job'
          ? '/api/jobs/delete'
          : '/api/candidates/delete'

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          type === 'job' ? { jobId: id } : { candidateId: id }
        ),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(`Failed to delete ${type}: ${error.error}`)
        setIsDeleting(false)
        return
      }

      // Success
      onDelete?.()
      router.refresh()

      // If deleting a job, navigate to jobs list
      if (type === 'job') {
        router.push('/jobs')
      }
    } catch (error) {
      console.error(`Delete ${type} error:`, error)
      alert(`Failed to delete ${type}`)
      setIsDeleting(false)
    }
  }

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        style={{
          background: 'rgba(248,113,113,0.1)',
          border: '1px solid rgba(248,113,113,0.2)',
          color: '#f87171',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 150ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(248,113,113,0.2)'
          e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(248,113,113,0.1)'
          e.currentTarget.style.borderColor = 'rgba(248,113,113,0.2)'
        }}
      >
        Delete
      </button>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        backgroundColor: 'rgba(248,113,113,0.08)',
        border: '1px solid rgba(248,113,113,0.2)',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
      }}
    >
      <span style={{ color: '#f87171', fontWeight: 600 }}>
        Delete "{itemName.substring(0, 20)}{itemName.length > 20 ? '...' : ''}"?
      </span>
      <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#71717a',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: isDeleting ? 'not-allowed' : 'pointer',
            opacity: isDeleting ? 0.5 : 1,
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          style={{
            background: '#f87171',
            border: 'none',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: isDeleting ? 'not-allowed' : 'pointer',
            opacity: isDeleting ? 0.7 : 1,
          }}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
