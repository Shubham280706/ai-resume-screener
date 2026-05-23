const colors = {
  surface: '#0d1425',
  line: 'rgba(255,255,255,.07)',
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
  sparklineData: string
  sparklineColor: string
  isLoading?: boolean
}

export default function MetricCard({
  label,
  value,
  change,
  changeType,
  sparklineData,
  sparklineColor,
  isLoading = false,
}: MetricCardProps) {
  const changeBgColor = {
    positive: 'rgba(52, 211, 153, 0.15)',
    negative: 'rgba(248, 113, 113, 0.15)',
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
        className="p-6 rounded-2xl border animate-pulse"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.line,
        }}
      >
        <div
          className="h-4 w-20 rounded mb-4"
          style={{ backgroundColor: 'rgba(255,255,255,.08)' }}
        />
        <div
          className="h-10 w-24 rounded mb-4"
          style={{ backgroundColor: 'rgba(255,255,255,.08)' }}
        />
        <div
          className="h-6 w-full rounded"
          style={{ backgroundColor: 'rgba(255,255,255,.05)' }}
        />
      </div>
    )
  }

  return (
    <div
      className="p-6 rounded-2xl border"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.line,
      }}
    >
      {/* Top row: label + change badge */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm" style={{ color: colors.muted }}>
          {label}
        </p>
        <span
          className="text-xs px-2 py-1 rounded"
          style={{
            backgroundColor: changeBgColor[changeType],
            color: changeTextColor[changeType],
          }}
        >
          {change}
        </span>
      </div>

      {/* Value */}
      <h3
        className="text-4xl font-semibold mb-4"
        style={{
          color: colors.text,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </h3>

      {/* Sparkline */}
      <svg
        width="100%"
        height="24"
        viewBox="0 0 120 22"
        preserveAspectRatio="none"
        style={{ display: 'block' }}
      >
        <polyline
          points={sparklineData}
          fill="none"
          stroke={sparklineColor}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}
