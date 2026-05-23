'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const colors = {
  text: '#e7ecf7',
  muted: '#8b94ad',
  dim: '#5b637a',
  indigo: '#6366f1',
  lightIndigo: '#818cf8',
  surface: '#0d1425',
  line: 'rgba(255,255,255,.07)',
}

export default function NewJobPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
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
        alert('No organization found')
        return
      }

      const { data: job, error } = await supabase
        .from('jobs')
        .insert({
          org_id: profile.org_id,
          title: formData.title,
          department: formData.department,
          description: formData.description,
          status: 'Open',
        })
        .select()
        .single()

      if (error) throw error

      router.push(`/jobs/${job.id}`)
    } catch (error) {
      console.error('Error creating job:', error)
      alert('Failed to create job')
      setIsLoading(false)
    }
  }

  return (
    <div style={{ padding: '36px 40px' }}>
      <Link
        href="/jobs"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '14px',
          color: colors.muted,
          textDecoration: 'none',
          marginBottom: '28px',
        }}
      >
        ← Back to Jobs
      </Link>

      <div style={{ maxWidth: '600px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 600, color: colors.text, marginBottom: '8px' }}>
          Create New Job
        </h1>
        <p style={{ fontSize: '14px', color: colors.muted, marginBottom: '32px' }}>
          Add a new job opening to start screening candidates
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: colors.text, marginBottom: '8px' }}>
              Job Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Senior Frontend Engineer"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                color: colors.text,
                backgroundColor: colors.surface,
                border: `1px solid ${colors.line}`,
                borderRadius: '8px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: colors.text, marginBottom: '8px' }}>
              Department
            </label>
            <input
              type="text"
              required
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="e.g., Engineering"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                color: colors.text,
                backgroundColor: colors.surface,
                border: `1px solid ${colors.line}`,
                borderRadius: '8px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: colors.text, marginBottom: '8px' }}>
              Job Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={6}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                color: colors.text,
                backgroundColor: colors.surface,
                border: `1px solid ${colors.line}`,
                borderRadius: '8px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <style>{`
            .submit-btn {
              transition: all 0.2s ease;
            }
            .submit-btn:hover:not(:disabled) {
              box-shadow: 0 0 30px rgba(99, 102, 241, 0.55) !important;
              transform: translateY(-1px);
            }
            .submit-btn:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }
          `}</style>
          <button
            type="submit"
            disabled={isLoading}
            className="submit-btn"
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'white',
              background: `linear-gradient(135deg, ${colors.indigo} 0%, ${colors.lightIndigo} 100%)`,
              border: 'none',
              boxShadow: `0 0 20px rgba(99, 102, 241, 0.35)`,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? 'Creating...' : 'Create Job'}
          </button>
        </form>
      </div>
    </div>
  )
}
