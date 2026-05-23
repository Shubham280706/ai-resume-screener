'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/lib/auth/actions'

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

export default function SignUpPage() {
  const router = useRouter()
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
    setError('')

    if (!validateForm()) return

    setLoading(true)
    try {
      const result = await signUp(formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      } else if (result?.success) {
        router.push('/dashboard')
      }
    } catch (error) {
      setError('An error occurred during signup')
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ backgroundColor: colors.bg }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.25) 0%, transparent 50%),
              radial-gradient(circle at 90% 70%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)
            `,
            animation: 'gradientShift 15s ease-in-out infinite',
          }}
        />
        <style>{`
          @keyframes gradientShift {
            0%, 100% { opacity: 0.9; }
            50% { opacity: 1; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            33% { transform: translateY(-30px) translateX(15px); }
            66% { transform: translateY(15px) translateX(-15px); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.1); }
          }
          @keyframes drift {
            0%, 100% { transform: translateX(0px) translateY(0px); }
            25% { transform: translateX(20px) translateY(-20px); }
            50% { transform: translateX(0px) translateY(-40px); }
            75% { transform: translateX(-20px) translateY(-20px); }
          }
        `}</style>

        {/* Primary floating orbs */}
        <div
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: colors.indigo,
            top: '-10%',
            left: '-5%',
            filter: 'blur(100px)',
            opacity: 0.25,
            animation: 'float 25s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full"
          style={{
            background: '#ec4899',
            bottom: '-5%',
            right: '-10%',
            filter: 'blur(100px)',
            opacity: 0.2,
            animation: 'float 30s ease-in-out infinite reverse',
          }}
        />

        {/* Secondary pulsing orbs */}
        <div
          className="absolute w-72 h-72 rounded-full"
          style={{
            background: 'rgba(139, 92, 246, 0.5)',
            top: '30%',
            right: '5%',
            filter: 'blur(80px)',
            opacity: 0.15,
            animation: 'pulse 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-64 h-64 rounded-full"
          style={{
            background: 'rgba(59, 130, 246, 0.4)',
            bottom: '20%',
            left: '10%',
            filter: 'blur(80px)',
            opacity: 0.15,
            animation: 'pulse 10s ease-in-out infinite',
          }}
        />

        {/* Drifting accent orb */}
        <div
          className="absolute w-48 h-48 rounded-full"
          style={{
            background: 'rgba(236, 72, 153, 0.4)',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            filter: 'blur(60px)',
            opacity: 0.2,
            animation: 'drift 20s ease-in-out infinite',
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Card */}
      <div
        className="w-full max-w-[480px] relative group"
        style={{
          perspective: '1000px',
        }}
      >
        {/* Card glow effect */}
        <div
          className="absolute -inset-0.5 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${colors.indigo}, #ec4899, ${colors.indigo})`,
            filter: 'blur(20px)',
          }}
        />

        <div
          className="relative p-8 rounded-2xl border backdrop-blur-xl"
          style={{
            backgroundColor: 'rgba(13, 20, 37, 0.8)',
            borderColor: 'rgba(99, 102, 241, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: colors.indigo,
                boxShadow: `0 0 20px ${colors.indigo}, 0 0 40px ${colors.indigo}`,
              }}
            />
            <span
              className="font-bold text-xl bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent"
            >
              TalentLens
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
                className="w-full h-12 px-4 rounded-xl border text-sm font-medium placeholder-opacity-50 transition-all focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(255,255,255,.04)',
                  borderColor: 'rgba(99, 102, 241, 0.2)',
                  color: colors.text,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.indigo
                  e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.08)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)'
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,.04)'
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
                className="w-full h-12 px-4 rounded-xl border text-sm font-medium placeholder-opacity-50 transition-all focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(255,255,255,.04)',
                  borderColor: 'rgba(99, 102, 241, 0.2)',
                  color: colors.text,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.indigo
                  e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.08)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)'
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,.04)'
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
                className="w-full h-12 px-4 rounded-xl border text-sm font-medium placeholder-opacity-50 transition-all focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(255,255,255,.04)',
                  borderColor: 'rgba(99, 102, 241, 0.2)',
                  color: colors.text,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.indigo
                  e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.08)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)'
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,.04)'
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
                className="w-full h-12 px-4 pr-12 rounded-xl border text-sm font-medium placeholder-opacity-50 transition-all focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'rgba(255,255,255,.04)',
                  borderColor: 'rgba(99, 102, 241, 0.2)',
                  color: colors.text,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.indigo
                  e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.08)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)'
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,.04)'
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
              className="w-full h-12 rounded-xl font-semibold transition-all duration-200 relative overflow-hidden group/btn mt-6"
              style={{
                background: `linear-gradient(135deg, ${colors.indigo}, #818cf8)`,
                color: 'white',
                opacity: loading ? 0.8 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = `0 12px 24px rgba(99, 102, 241, 0.4)`
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.2)'
              }}
            >
              <span className="relative z-10">
                {loading ? '⏳ Creating account...' : 'Create account'}
              </span>
              {!loading && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg group-hover/btn:translate-x-1 transition-transform">
                  →
                </span>
              )}
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
                className="font-semibold transition-colors hover:text-indigo-400"
                style={{ color: colors.indigo }}
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
