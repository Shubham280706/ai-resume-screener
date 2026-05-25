'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

export default function ResetPasswordPage() {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [linkExpired, setLinkExpired] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setSessionReady(true)
        }
      } catch (err) {
        console.error('Session check error:', err)
      }
    }

    const timer = setTimeout(() => {
      checkSession()
    }, 100)

    const expireTimer = setTimeout(() => {
      if (!sessionReady) {
        setLinkExpired(true)
      }
    }, 3000)

    return () => {
      clearTimeout(timer)
      clearTimeout(expireTimer)
    }
  }, [sessionReady])

  const validateForm = () => {
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return false
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setLoading(true)
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        setError(updateError.message || 'Failed to update password')
        setLoading(false)
        return
      }

      router.push('/dashboard')
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
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

          {linkExpired ? (
            <>
              {/* Expired state */}
              <div className="text-center">
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={colors.red}
                  strokeWidth="1.5"
                  style={{ margin: '0 auto 16px' }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>

                <h2
                  className="text-xl font-bold mb-2"
                  style={{ color: colors.text }}
                >
                  This reset link has expired
                </h2>
                <p
                  className="text-sm mb-8"
                  style={{ color: colors.muted }}
                >
                  Reset links are only valid for 24 hours. Request a new one to continue.
                </p>

                <Link
                  href="/forgot-password"
                  className="inline-block h-12 px-6 rounded-lg font-semibold transition-all"
                  style={{
                    background: colors.accent,
                    color: 'white',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#0071e3'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = colors.accent
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  Request new link →
                </Link>
              </div>
            </>
          ) : !sessionReady ? (
            <>
              {/* Loading state */}
              <div className="text-center">
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: `2px solid ${colors.accent}`,
                    borderTopColor: 'transparent',
                    animation: 'spin 0.8s linear infinite',
                    margin: '0 auto 16px',
                  }}
                />
                <p style={{ color: colors.muted }}>Verifying reset link...</p>
              </div>

              <style>{`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </>
          ) : (
            <>
              {/* Headline */}
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: colors.text }}
              >
                Set new password
              </h1>
              <p
                className="text-sm mb-8"
                style={{ color: colors.muted }}
              >
                Choose a strong password for your account.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
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
                    New password (min. 8 characters)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-12 px-4 pr-12 rounded-lg border text-sm transition-all focus:outline-none"
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
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: colors.muted,
                        fontSize: '16px',
                      }}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
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
                    Confirm new password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-12 px-4 pr-12 rounded-lg border text-sm transition-all focus:outline-none"
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
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: colors.muted,
                        fontSize: '16px',
                      }}
                    >
                      {showConfirm ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
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
                  {loading ? 'Updating...' : 'Update password →'}
                </button>
              </form>

              <p style={{ color: colors.dim }} className="text-xs text-center mt-6">
                <Link
                  href="/login"
                  className="transition-colors"
                  style={{ color: colors.accent }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#0071e3'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = colors.accent
                  }}
                >
                  Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
