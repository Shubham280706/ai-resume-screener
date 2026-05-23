'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/lib/auth/actions'
import { useRouter } from 'next/navigation'

const colors = {
  sidebar: '#0a0e1a',
  line: 'rgba(255,255,255,.07)',
  text: '#e7ecf7',
  muted: '#8b94ad',
  dim: '#5b637a',
  indigo: '#6366f1',
}

const navigationItems = [
  {
    label: 'WORKSPACE',
    items: [
      { name: 'Dashboard', icon: '📊', href: '/dashboard', badge: null },
      { name: 'Jobs', icon: '💼', href: '/jobs', badge: '12' },
      { name: 'Candidates', icon: '👤', href: '/candidates', badge: '248' },
      { name: 'Analytics', icon: '📈', href: '/analytics', badge: null },
    ],
  },
  {
    label: 'SETTINGS',
    items: [
      { name: 'Settings', icon: '⚙️', href: '/settings', badge: null },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const handleSignOut = async () => {
    const result = await signOut()
    if (result?.success) {
      router.push('/login')
    }
  }

  return (
    <div
      className="w-64 fixed left-0 top-0 h-screen flex flex-col border-r"
      style={{
        backgroundColor: colors.sidebar,
        borderRightColor: colors.line,
      }}
    >
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderBottomColor: colors.line }}>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: colors.indigo,
              boxShadow: `0 0 12px ${colors.indigo}`,
            }}
          />
          <span
            className="font-semibold text-sm"
            style={{ color: colors.text }}
          >
            TalentLens
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        {navigationItems.map((section) => (
          <div key={section.label} className="mb-8">
            <p
              className="text-xs uppercase font-mono tracking-widest mb-3"
              style={{ color: colors.dim, letterSpacing: '0.15em' }}
            >
              {section.label}
            </p>

            <div className="space-y-2">
              {section.items.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 h-11 px-3 rounded-[10px] transition-all text-sm font-medium"
                    style={{
                      backgroundColor: active
                        ? 'rgba(99, 102, 241, 0.15)'
                        : 'transparent',
                      color: active ? colors.text : colors.muted,
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,.04)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }
                    }}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span
                        className="text-xs px-2 py-1 rounded-md"
                        style={{
                          backgroundColor: '#1a1f35',
                          color: colors.muted,
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
                className="my-4 h-px"
                style={{ backgroundColor: colors.line }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Sign out button */}
      <div className="p-3 border-t" style={{ borderTopColor: colors.line }}>
        <button
          onClick={handleSignOut}
          className="w-full text-sm font-medium px-3 py-2 rounded-lg transition-colors text-left"
          style={{
            color: colors.muted,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,.04)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
