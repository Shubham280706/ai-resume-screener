import ScoreBar from './ScoreBar'

const colors = {
  surface: '#0d1425',
  line: 'rgba(255,255,255,.07)',
  text: '#e7ecf7',
  muted: '#8b94ad',
  dim: '#5b637a',
  green: '#34d399',
  amber: '#f59e0b',
  red: '#f87171',
}

interface Candidate {
  id: string
  full_name: string
  location?: string
  experience?: string
  score: number
  seniority: 'Junior' | 'Mid' | 'Senior'
  status: 'Shortlisted' | 'Interview' | 'Reviewing' | 'New' | 'Below bar'
}

interface CandidateTableProps {
  candidates: Candidate[]
  isLoading?: boolean
}

function getAvatarGradient(initials: string): string {
  const gradients: { [key: string]: string } = {
    PR: '135deg, #6366f1, #a855f7',
    AK: '135deg, #0891b2, #22d3ee',
    MS: '135deg, #db2777, #f472b6',
    DV: '135deg, #16a34a, #4ade80',
    SN: '135deg, #ea580c, #fb923c',
  }
  return gradients[initials] || '135deg, #6366f1, #818cf8'
}

function getStatusStyle(status: string) {
  const styles: { [key: string]: { bg: string; text: string } } = {
    Shortlisted: { bg: 'rgba(52, 211, 153, 0.1)', text: colors.green },
    Interview: { bg: 'rgba(245, 158, 11, 0.1)', text: colors.amber },
    Reviewing: { bg: 'rgba(245, 158, 11, 0.1)', text: colors.amber },
    New: { bg: 'rgba(255,255,255,0.05)', text: colors.muted },
    'Below bar': { bg: 'rgba(248, 113, 113, 0.1)', text: colors.red },
  }
  return styles[status] || styles.New
}

function getScoreColor(score: number): 'green' | 'amber' | 'red' {
  if (score >= 80) return 'green'
  if (score >= 60) return 'amber'
  return 'red'
}

export default function CandidateTable({
  candidates,
  isLoading = false,
}: CandidateTableProps) {
  if (isLoading) {
    return (
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.line,
        }}
      >
        <div
          className="grid grid-cols-5 gap-4 px-6 py-4 border-b animate-pulse"
          style={{ borderBottomColor: colors.line }}
        >
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-4 rounded"
              style={{ backgroundColor: 'rgba(255,255,255,.08)' }}
            />
          ))}
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border-b px-6 py-4" style={{ borderBottomColor: colors.line }}>
            <div
              className="h-6 rounded"
              style={{ backgroundColor: 'rgba(255,255,255,.05)' }}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.line,
      }}
    >
      {/* Header */}
      <div
        className="grid gap-4 px-6 py-4 border-b"
        style={{
          borderBottomColor: colors.line,
          gridTemplateColumns: '2.5fr 2fr 1fr 1.2fr 40px',
        }}
      >
        <div
          className="text-xs uppercase font-mono tracking-widest"
          style={{ color: colors.dim, letterSpacing: '0.12em' }}
        >
          Candidate
        </div>
        <div
          className="text-xs uppercase font-mono tracking-widest"
          style={{ color: colors.dim, letterSpacing: '0.12em' }}
        >
          Match Score
        </div>
        <div
          className="text-xs uppercase font-mono tracking-widest"
          style={{ color: colors.dim, letterSpacing: '0.12em' }}
        >
          Seniority
        </div>
        <div
          className="text-xs uppercase font-mono tracking-widest"
          style={{ color: colors.dim, letterSpacing: '0.12em' }}
        >
          Status
        </div>
        <div />
      </div>

      {/* Rows */}
      {candidates.map((candidate, index) => {
        const initials = candidate.full_name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
        const statusStyle = getStatusStyle(candidate.status)
        const scoreColor = getScoreColor(candidate.score)

        return (
          <div
            key={candidate.id || index}
            className="grid gap-4 px-6 py-4 border-b hover:bg-white hover:bg-opacity-2 transition-colors"
            style={{
              borderBottomColor: colors.line,
              gridTemplateColumns: '2.5fr 2fr 1fr 1.2fr 40px',
              backgroundColor: 'rgba(255,255,255,0.01)',
            }}
          >
            {/* Candidate */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm"
                style={{
                  background: `linear-gradient(${getAvatarGradient(initials)})`,
                  color: 'white',
                }}
              >
                {initials}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: colors.text }}>
                  {candidate.full_name}
                </p>
                <p className="text-xs" style={{ color: colors.dim }}>
                  {candidate.location || 'Location'} • {candidate.experience || '0y'} exp
                </p>
              </div>
            </div>

            {/* Score */}
            <ScoreBar
              score={candidate.score}
              color={scoreColor}
              animated={true}
            />

            {/* Seniority */}
            <div
              className="px-3 py-1 rounded-lg text-sm font-medium w-fit border"
              style={{
                backgroundColor: '#1a1f35',
                borderColor: 'rgba(255,255,255,.1)',
                color: colors.text,
              }}
            >
              {candidate.seniority}
            </div>

            {/* Status */}
            <div
              className="px-3 py-1 rounded-lg text-sm font-medium w-fit border"
              style={{
                backgroundColor: statusStyle.bg,
                borderColor: statusStyle.text + '40',
                color: statusStyle.text,
              }}
            >
              {candidate.status}
            </div>

            {/* Actions */}
            <div
              className="flex items-center justify-center cursor-pointer"
              style={{ color: colors.dim }}
            >
              ⋯
            </div>
          </div>
        )
      })}
    </div>
  )
}
