'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/lib/auth/actions'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const colors = {
  sidebar: '#0a0e1a',
  line: 'rgba(255,255,255,.07)',
  text: '#e7ecf7',
  muted: '#8b94ad',
  dim: '#5b637a',
  indigo: '#6366f1',
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
      className="w-64 fixed left-0 top-0 h-screen flex flex-col z-20"
      style={{
        backgroundColor: colors.sidebar,
        borderRight: `1px solid ${colors.line}`,
      }}
    >
      {/* Logo */}
      <div
        className="px-6 py-6 border-b"
        style={{ borderBottomColor: colors.line }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: colors.indigo,
              boxShadow: `0 0 0 3px rgba(99, 102, 241, 0.2), 0 0 12px ${colors.indigo}`,
            }}
          />
          <span
            style={{
              fontSize: '17px',
              fontWeight: 600,
              color: colors.text,
            }}
          >
            TalentLens
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6">
        {navigationItems.map((section) => (
          <div key={section.label}>
            <p
              className="uppercase"
              style={{
                fontSize: '11px',
                letterSpacing: '0.15em',
                color: colors.dim,
                fontFamily: 'ui-monospace, monospace',
                marginBottom: '8px',
                paddingLeft: '12px',
                paddingRight: '12px',
              }}
            >
              {section.label}
            </p>

            <div>
              {section.items.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="transition-all"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      height: '44px',
                      padding: '0 12px',
                      marginLeft: '12px',
                      marginRight: '12px',
                      marginBottom: '0',
                      borderRadius: '10px',
                      fontSize: '14.5px',
                      fontWeight: active ? 500 : 400,
                      color: active ? colors.text : colors.muted,
                      backgroundColor: active
                        ? 'rgba(99, 102, 241, 0.12)'
                        : 'transparent',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
                        e.currentTarget.style.color = colors.text
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = colors.muted
                      }
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: active ? colors.indigo : 'currentColor',
                      }}
                    >
                      {iconComponents[item.name as keyof typeof iconComponents]}
                    </div>
                    <span style={{ flex: 1 }}>{item.name}</span>
                    {item.badge && (
                      <span
                        style={{
                          backgroundColor: '#1a1f35',
                          color: colors.muted,
                          borderRadius: '6px',
                          padding: '2px 8px',
                          fontSize: '12px',
                          fontWeight: 500,
                          marginLeft: 'auto',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>

            {section.label === 'WORKSPACE' && (
              <div
                style={{
                  height: '1px',
                  backgroundColor: colors.line,
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
          padding: '12px',
          borderTop: `1px solid ${colors.line}`,
        }}
      >
        <button
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '8px 12px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            const textSpan = e.currentTarget.querySelector('span')
            if (textSpan) {
              textSpan.style.color = colors.red
            }
          }}
          onMouseLeave={(e) => {
            const textSpan = e.currentTarget.querySelector('span')
            if (textSpan) {
              textSpan.style.color = colors.dim
            }
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#1a1f35',
              border: `1px solid rgba(255,255,255,0.1)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 600,
              color: colors.text,
              flexShrink: 0,
            }}
          >
            {userInitial}
          </div>
          <span
            style={{
              fontSize: '13px',
              color: colors.dim,
              flex: 1,
              textAlign: 'left',
              transition: 'color 0.15s ease',
            }}
          >
            Sign out
          </span>
        </button>
      </div>
    </div>
  )
}
