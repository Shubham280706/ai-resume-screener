'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signUp } from '@/lib/auth/actions'

const colors = {
  bg: '#050507',
  surface: '#0d0d10',
  line: 'rgba(255,255,255,0.07)',
  text: '#fafafa',
  muted: '#52525b',
  dim: '#3f3f46',
  accent: '#007AFF',
  red: '#f87171',
}

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validateForm = () => {
    if (!formData.full_name.trim()) {
      setError('Full name is required')
      return false
    }
    if (!formData.company_name.trim()) {
      setError('Company name is required')
      return false
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email')
      return false
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      const result = await signUp(formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
      // No error = redirect happening = do nothing
    } catch (err: any) {
      // This catch should never fire now but just in case:
      setError('Something went wrong. Try again.')
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ backgroundColor: colors.bg }}
    >
      {/* Background layers */}
      <div className="absolute inset-0 -z-10">
        {/* Spotlight beam */}
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
        className="w-full max-w-[480px] relative group"
        style={{
          perspective: '1000px',
        }}
      >
        <div
          className="relative p-8 rounded-xl border"
          style={{
            backgroundColor: colors.surface,
            borderColor: 'rgba(255,255,255,0.07)',
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
                boxShadow: `0 0 0 3px rgba(0,122,255,0.15)`,
              }}
            />
            <span
              className="font-bold text-3xl"
              style={{ color: colors.text }}
            >
              NexHire
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-3xl font-bold text-center mb-3"
            style={{ color: colors.text }}
          >
            Create your account
          </h1>
          <p
            className="text-center text-sm mb-8"
            style={{ color: colors.muted }}
          >
            Start screening smarter. Free 14-day trial.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="relative group/input">
              <input
                type="text"
                placeholder="Full name"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="w-full h-12 px-4 rounded-lg border text-sm font-medium placeholder-opacity-50 transition-all focus:outline-none"
                style={{
                  backgroundColor: '#0d0d10',
                  borderColor: 'rgba(255,255,255,0.07)',
                  color: colors.text,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,122,255,0.3)'
                  e.currentTarget.style.backgroundColor = 'rgba(0,122,255,0.03)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                  e.currentTarget.style.backgroundColor = '#0d0d10'
                }}
              />
            </div>

            {/* Company Name */}
            <div className="relative group/input">
              <input
                type="text"
                placeholder="Company name"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
                className="w-full h-12 px-4 rounded-lg border text-sm font-medium placeholder-opacity-50 transition-all focus:outline-none"
                style={{
                  backgroundColor: '#0d0d10',
                  borderColor: 'rgba(255,255,255,0.07)',
                  color: colors.text,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,122,255,0.3)'
                  e.currentTarget.style.backgroundColor = 'rgba(0,122,255,0.03)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                  e.currentTarget.style.backgroundColor = '#0d0d10'
                }}
              />
            </div>

            {/* Email */}
            <div className="relative group/input">
              <input
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full h-12 px-4 rounded-lg border text-sm font-medium placeholder-opacity-50 transition-all focus:outline-none"
                style={{
                  backgroundColor: '#0d0d10',
                  borderColor: 'rgba(255,255,255,0.07)',
                  color: colors.text,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,122,255,0.3)'
                  e.currentTarget.style.backgroundColor = 'rgba(0,122,255,0.03)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                  e.currentTarget.style.backgroundColor = '#0d0d10'
                }}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full h-12 px-4 pr-12 rounded-lg border text-sm font-medium placeholder-opacity-50 transition-all focus:outline-none"
                style={{
                  backgroundColor: '#0d0d10',
                  borderColor: 'rgba(255,255,255,0.07)',
                  color: colors.text,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,122,255,0.3)'
                  e.currentTarget.style.backgroundColor = 'rgba(0,122,255,0.03)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                  e.currentTarget.style.backgroundColor = '#0d0d10'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors"
                style={{ color: colors.muted }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            {/* Error */}
            {error && (
              <p
                className="text-sm font-medium px-3 py-2 rounded-lg bg-red-500 bg-opacity-10"
                style={{ color: colors.red }}
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
                opacity: loading ? 0.8 : 1,
                cursor: 'pointer',
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
              onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.transform = 'scale(0.97) translateY(0)'
              }}
              onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
            >
              {loading ? '⏳ Creating account...' : 'Create account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: colors.line }}
            />
            <span style={{ color: colors.dim }} className="text-xs font-medium">
              OR
            </span>
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: colors.line }}
            />
          </div>

          {/* Links */}
          <div className="text-center">
            <p style={{ color: colors.muted }} className="text-sm">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold transition-colors hover:text-blue-400"
                style={{ color: colors.accent }}
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Footer text */}
          <p style={{ color: colors.dim }} className="text-xs text-center mt-6">
            By signing up you agree to our Terms and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
