'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { signOut } from '@/lib/auth/actions'

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

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{
    email: string
    full_name?: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (authUser) {
        setUser({
          email: authUser.email || '',
          full_name: authUser.user_metadata?.full_name,
        })
      }
      setLoading(false)
    }

    fetchUser()
  }, [])

  const handleSignOut = async () => {
    const result = await signOut()
    if (result?.success) {
      router.push('/login')
    }
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.bg }}
      >
        <p style={{ color: colors.muted }}>Loading...</p>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.bg }}
    >
      {/* Header */}
      <div
        className="border-b px-8 py-4 flex justify-between items-center"
        style={{ borderColor: colors.line }}
      >
        <div>
          <h1 className="text-xl font-semibold" style={{ color: colors.text }}>
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            {user?.full_name && (
              <p className="text-sm font-medium" style={{ color: colors.text }}>
                {user.full_name}
              </p>
            )}
            <p className="text-xs" style={{ color: colors.muted }}>
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded-[10px] font-medium text-sm transition-all"
            style={{
              backgroundColor: 'transparent',
              borderColor: colors.line,
              border: '1px solid',
              color: colors.text,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div
          className="p-6 rounded-[16px] border"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.line,
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
            Welcome to TalentLens
          </h2>
          <p style={{ color: colors.muted }}>
            Dashboard content coming soon. You're signed in as <span className="font-medium">{user?.email}</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
