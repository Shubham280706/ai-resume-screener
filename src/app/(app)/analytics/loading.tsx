const colors = {
  surface: '#0d0d10',
  border: 'rgba(255,255,255,0.07)',
}

export default function AnalyticsLoading() {
  return (
    <div style={{ padding: '40px 40px' }}>
      {/* Header skeleton */}
      <div style={{ marginBottom: '28px' }}>
        <div className="skeleton" style={{ width: '100px', height: '20px', marginBottom: '12px', borderRadius: '4px' }} />
        <div className="skeleton" style={{ width: '150px', height: '28px', borderRadius: '4px' }} />
      </div>

      {/* Metric cards skeleton */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: '14px',
              padding: '20px 24px',
            }}
          >
            <div className="skeleton" style={{ width: '80px', height: '14px', marginBottom: '12px', borderRadius: '4px' }} />
            <div className="skeleton" style={{ width: '60px', height: '36px', marginBottom: '8px', borderRadius: '4px' }} />
            <div className="skeleton" style={{ width: '100%', height: '14px', borderRadius: '4px' }} />
          </div>
        ))}
      </div>

      {/* Chart cards skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              padding: '24px',
              minHeight: '300px',
            }}
          >
            <div className="skeleton" style={{ width: '40%', height: '18px', marginBottom: '16px', borderRadius: '4px' }} />
            <div className="skeleton" style={{ width: '100%', height: '200px', borderRadius: '8px' }} />
          </div>
        ))}
      </div>
    </div>
  )
}
