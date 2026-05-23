'use client'

const colors = {
  green: '#34d399',
  amber: '#f59e0b',
  red: '#f87171',
  indigo: '#6366f1',
}

interface ScoreBarProps {
  score: number
  color?: 'green' | 'amber' | 'red' | 'indigo'
  animated?: boolean
}

export default function ScoreBar({
  score,
  color = 'green',
  animated = true,
}: ScoreBarProps) {
  const colorMap = {
    green: colors.green,
    amber: colors.amber,
    red: colors.red,
    indigo: colors.indigo,
  }

  const barColor = colorMap[color]

  return (
    <div className="flex items-center gap-3">
      <div
        className="h-1.5 rounded-full flex-1 overflow-hidden"
        style={{
          backgroundColor: 'rgba(255,255,255,.06)',
        }}
      >
        <div
          className={animated ? 'score-bar-animate' : ''}
          style={{
            width: `${score}%`,
            height: '100%',
            backgroundColor: barColor,
            transition: animated
              ? 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s'
              : 'none',
          }}
        />
      </div>
      <span
        className="text-sm font-semibold min-w-fit"
        style={{ color: '#e7ecf7' }}
      >
        {score}%
      </span>

      <style>{`
        @keyframes scoreBarExpand {
          from {
            width: 0;
          }
        }
        .score-bar-animate {
          animation: scoreBarExpand 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s forwards;
        }
      `}</style>
    </div>
  )
}
