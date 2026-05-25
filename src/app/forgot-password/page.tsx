'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const colors = {
  bg: '#050507',
  surface: '#0d0d10',
  line: 'rgba(255,255,255,0.07)',
  text: '#fafafa',
  muted: '#52525b',
  dim: '#3f3f46',
  accent: '#007AFF',
  green: '#10b981',
  red: '#f87171',
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.includes('@')) {
      setError('Please enter a valid email')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      )

      if (resetError) {
        setError(resetError.message || 'Failed to send reset link')
        setLoading(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleResendEmail = () => {
    setSuccess(false)
    setEmail('')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ backgroundColor: colors.bg }}
    >
      {/* Background spotlight */}
      <div className="absolute inset-0 -z-10">
        <div
          style={{
            position: 'fixed',
            top: '-100px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '700px',
            height: '500px',
            background: 'conic-gradient(from 180deg at 50% 0%, transparent 50deg, rgba(0,122,255,0.1) 120deg, transparent 175deg)',
            filter: 'blur(1px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      </div>

      {/* Card */}
      <div
        className="w-full max-w-[440px] relative"
        style={{
          perspective: '1000px',
        }}
      >
        <div
          className="relative p-10 rounded-2xl border"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.line,
          }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: colors.accent,
              }}
            />
            <span
              className="font-bold text-3xl"
              style={{ color: colors.text }}
            >
              nexhire
            </span>
          </div>

          {!success ? (
            <>
              {/* Back link */}
              <Link
                href="/login"
                className="text-sm mb-8 inline-block transition-colors"
                style={{
                  color: colors.muted,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#d4d4d8'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.muted
                }}
              >
                ← Back to sign in
              </Link>

              {/* Headline */}
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: colors.text }}
              >
                Reset your password
              </h1>
              <p
                className="text-sm mb-8"
                style={{ color: colors.muted }}
              >
                Enter your work email and we'll send you a reset link.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#a1a1aa',
                      marginBottom: '6px',
                    }}
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg border text-sm transition-all focus:outline-none"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      borderColor: 'rgba(255,255,255,0.08)',
                      color: colors.text,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0,122,255,0.4)'
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,122,255,0.08)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                </div>

                {/* Error */}
                {error && (
                  <p
                    className="text-sm font-medium px-3 py-2 rounded-lg"
                    style={{
                      color: colors.red,
                      backgroundColor: 'rgba(248,113,113,0.1)',
                    }}
                  >
                    {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-lg font-semibold transition-all mt-6"
                  style={{
                    background: colors.accent,
                    color: 'white',
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                    if (!loading) {
                      e.currentTarget.style.background = '#0071e3'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,122,255,0.35)'
                    }
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.background = colors.accent
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {loading ? 'Sending...' : 'Send reset link →'}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success state */}
              <div className="text-center">
                {/* Checkmark */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16,185,129,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={colors.green}
                    strokeWidth="2.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <h2
                  className="text-xl font-bold mb-2"
                  style={{ color: colors.text }}
                >
                  Check your email
                </h2>
                <p
                  className="text-sm mb-6"
                  style={{ color: colors.muted }}
                >
                  We sent a reset link to <strong>{email}</strong>. Check your inbox and spam folder.
                </p>

                {/* Resend button */}
                <button
                  onClick={handleResendEmail}
                  className="text-sm font-semibold transition-colors"
                  style={{
                    color: colors.accent,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#0071e3'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.accent
                  }}
                >
                  Didn't receive it? Send again
                </button>
              </div>
            </>
          )}

          {/* Footer text */}
          <p style={{ color: colors.dim }} className="text-xs text-center mt-8">
            By resetting your password you agree to our Terms and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
