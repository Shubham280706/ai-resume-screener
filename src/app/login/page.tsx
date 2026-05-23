'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from '@/lib/auth/actions'

const colors = {
  bg: '#050810',
  surface: '#0d1425',
  line: 'rgba(255,255,255,.07)',
  text: '#e7ecf7',
  muted: '#8b94ad',
  dim: '#5b637a',
  indigo: '#6366f1',
  red: '#f87171',
}

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validateForm = () => {
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email')
      return false
    }
    if (!formData.password) {
      setError('Password is required')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setLoading(true)
    const result = await signIn(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ backgroundColor: colors.bg }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(circle at 50% 40%, rgba(99, 102, 241, 0.15), transparent 60%)`,
        }}
      />

      {/* Card */}
      <div
        className="w-full max-w-[460px] p-10 rounded-[16px] border"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.line,
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor: colors.indigo,
              boxShadow: `0 0 20px ${colors.indigo}`,
            }}
          />
          <span className="font-semibold text-lg" style={{ color: colors.text }}>
            TalentLens
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-2xl font-bold text-center mb-2"
          style={{ color: colors.text }}
        >
          Welcome back
        </h1>
        <p
          className="text-center text-sm mb-8"
          style={{ color: colors.muted }}
        >
          Sign in to your account to continue screening
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <input
            type="email"
            placeholder="you@company.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full h-12 px-4 rounded-[10px] border text-sm"
            style={{
              backgroundColor: 'rgba(255,255,255,.04)',
              borderColor: 'rgba(255,255,255,.10)',
              color: colors.text,
            }}
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full h-12 px-4 pr-12 rounded-[10px] border text-sm"
              style={{
                backgroundColor: 'rgba(255,255,255,.04)',
                borderColor: 'rgba(255,255,255,.10)',
                color: colors.text,
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
              style={{ color: colors.muted }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm" style={{ color: colors.red }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-[10px] font-medium transition-all"
            style={{
              backgroundColor: colors.indigo,
              color: 'white',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? '⏳ Signing in...' : 'Sign in →'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          <p style={{ color: colors.muted }} className="text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium" style={{ color: colors.indigo }}>
              Sign up
            </Link>
          </p>
          <p style={{ color: colors.dim }} className="text-xs">
            <Link href="/forgot-password" style={{ color: colors.indigo }}>
              Forgot password?
            </Link>
          </p>
        </div>

        {/* Divider */}
        <div
          className="my-6 flex items-center gap-3"
          style={{ borderTopColor: colors.line }}
        >
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: colors.line }}
          />
          <span style={{ color: colors.dim }} className="text-xs">
            or
          </span>
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: colors.line }}
          />
        </div>

        {/* Terms */}
        <p style={{ color: colors.dim }} className="text-xs text-center">
          By signing in you agree to our Terms and Privacy Policy
        </p>
      </div>
    </div>
  )
}
