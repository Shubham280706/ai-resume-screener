'use client'

const colors = {
  surface: '#0d1425',
  line: 'rgba(255,255,255,.07)',
  lineDarker: 'rgba(255,255,255,.12)',
  text: '#e7ecf7',
  muted: '#8b94ad',
  green: '#34d399',
  amber: '#f59e0b',
  red: '#f87171',
  indigo: '#6366f1',
  lightIndigo: '#a5b4fc',
}

interface MetricCardProps {
  label: string
  value: string | number
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  isLoading?: boolean
}

export default function MetricCard({
  label,
  value,
  change,
  changeType,
  isLoading = false,
}: MetricCardProps) {
  const changeBgColor = {
    positive: 'rgba(52, 211, 153, 0.12)',
    negative: 'rgba(248, 113, 113, 0.12)',
    neutral: 'rgba(255,255,255,0.05)',
  }

  const changeTextColor = {
    positive: colors.green,
    negative: colors.red,
    neutral: colors.muted,
  }

  if (isLoading) {
    return (
      <div
        className="animate-pulse"
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.line}`,
          borderRadius: '14px',
          padding: '20px 24px',
        }}
      >
        <div
          className="h-3 w-20 rounded mb-4"
          style={{ backgroundColor: 'rgba(255,255,255,.08)' }}
        />
        <div
          className="h-9 w-24 rounded mb-4"
          style={{ backgroundColor: 'rgba(255,255,255,.08)' }}
        />
        <div
          className="h-5 w-full rounded"
          style={{ backgroundColor: 'rgba(255,255,255,.05)' }}
        />
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.line}`,
        borderRadius: '14px',
        padding: '20px 24px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = colors.lineDarker
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.borderColor = colors.line
        el.style.transform = 'translateY(0)'
      }}
    >
      {/* Top row: label + change badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <p style={{ fontSize: '13px', color: colors.muted }}>
          {label}
        </p>
        <span
          style={{
            backgroundColor: changeBgColor[changeType],
            color: changeTextColor[changeType],
            borderRadius: '6px',
            padding: '2px 7px',
            fontSize: '12px',
            fontWeight: 500,
          }}
        >
          {change}
        </span>
      </div>

      {/* Value */}
      <h3
        style={{
          fontSize: '36px',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: colors.text,
          margin: '8px 0',
        }}
      >
        {value}
      </h3>
    </div>
  )
}
