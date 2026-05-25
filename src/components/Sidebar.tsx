'use client'

import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth/actions'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const colors = {
  bg: '#050507',
  surface: '#0d0d10',
  border: 'rgba(255,255,255,0.07)',
  text: '#fafafa',
  muted: '#71717a',
  dim: '#3f3f46',
  accent: '#007AFF',
  red: '#f87171',
}

const navigationItems = [
  {
    label: 'WORKSPACE',
    items: [
      { name: 'Dashboard', href: '/dashboard', badge: null },
      { name: 'Jobs', href: '/jobs', badge: '12' },
      { name: 'Candidates', href: '/candidates', badge: '248' },
      { name: 'Analytics', href: '/analytics', badge: null },
    ],
  },
  {
    label: 'SETTINGS',
    items: [
      { name: 'Settings', href: '/settings', badge: null },
    ],
  },
]

const iconComponents = {
  Dashboard: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="3" width="7" height="9" rx="1.5"/>
      <rect x="14" y="3" width="7" height="5" rx="1.5"/>
      <rect x="14" y="12" width="7" height="9" rx="1.5"/>
      <rect x="3" y="16" width="7" height="5" rx="1.5"/>
    </svg>
  ),
  Jobs: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="7" width="18" height="14" rx="2"/>
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      <line x1="3" y1="13" x2="21" y2="13"/>
    </svg>
  ),
  Candidates: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
  Analytics: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
      <line x1="3" y1="20" x2="21" y2="20"/>
    </svg>
  ),
  Settings: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
      }
    }
    fetchUser()
  }, [])

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const handleSignOut = async () => {
    const result = await signOut()
    if (result?.success) {
      router.push('/login')
    }
  }

  const userInitial = userEmail.charAt(0).toUpperCase()

  return (
    <div
      className="fixed left-0 top-0 h-screen flex flex-col z-20"
      style={{
        width: '240px',
        backgroundColor: 'rgba(5,5,7,0.9)',
        backdropFilter: 'blur(16px)',
        borderRight: `1px solid ${colors.border}`,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px',
          borderBottom: `1px solid ${colors.border}`,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: colors.accent,
          }}
        />
        <span
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: colors.text,
            letterSpacing: '-0.02em',
          }}
        >
          nexhire
        </span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto" style={{ paddingTop: '0' }}>
        {navigationItems.map((section) => (
          <div key={section.label}>
            <p
              style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: colors.dim,
                padding: '0 20px',
                margin: '16px 0 6px 0',
              }}
            >
              {section.label}
            </p>

            <div>
              {section.items.map((item) => {
                const active = isActive(item.href)
                return (
                  <div
                    key={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 20px',
                      fontSize: '14px',
                      fontWeight: 400,
                      borderRadius: 0,
                      cursor: 'pointer',
                      position: 'relative',
                      color: active ? colors.text : colors.muted,
                      backgroundColor: active ? 'rgba(0,122,255,0.08)' : 'transparent',
                      transition: 'all 150ms cubic-bezier(0.23,1,0.32,1)',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = colors.muted
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = colors.muted
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }
                    }}
                    onClick={() => router.push(item.href)}
                  >
                    {active && (
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '2px',
                          height: '16px',
                          background: colors.accent,
                          borderRadius: '0 2px 2px 0',
                        }}
                      />
                    )}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: active ? colors.accent : 'currentColor',
                      }}
                    >
                      {iconComponents[item.name as keyof typeof iconComponents]}
                    </div>
                    <span style={{ flex: 1 }}>{item.name}</span>
                    {item.badge && (
                      <span
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: colors.muted,
                          borderRadius: '6px',
                          padding: '1px 7px',
                          fontSize: '11px',
                          fontWeight: 500,
                          marginLeft: 'auto',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            {section.label === 'WORKSPACE' && (
              <div
                style={{
                  height: '1px',
                  backgroundColor: colors.border,
                  margin: '12px 0',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* User section */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 20px',
          borderTop: `1px solid ${colors.border}`,
          backgroundColor: 'rgba(5,5,7,0.9)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#18181b',
            border: `1px solid rgba(255,255,255,0.1)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 600,
            color: colors.muted,
            flexShrink: 0,
          }}
        >
          {userInitial}
        </div>
        <span
          style={{
            fontSize: '12px',
            color: colors.muted,
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '140px',
          }}
        >
          {userEmail}
        </span>
        <button
          onClick={handleSignOut}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.dim,
            transition: 'color 150ms ease-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.red
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.dim
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
