const colors = {
  surface: '#0d0d10',
  border: 'rgba(255,255,255,0.07)',
}

export default function JobsLoading() {
  return (
    <div style={{ padding: '40px 40px' }}>
      {/* Header skeleton */}
      <div style={{ marginBottom: '28px' }}>
        <div className="skeleton" style={{ width: '100px', height: '20px', marginBottom: '12px', borderRadius: '4px' }} />
        <div className="skeleton" style={{ width: '150px', height: '28px', borderRadius: '4px' }} />
      </div>

      {/* Job cards skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              padding: '20px',
              minHeight: '180px',
            }}
          >
            <div className="skeleton" style={{ width: '70%', height: '18px', marginBottom: '12px', borderRadius: '4px' }} />
            <div className="skeleton" style={{ width: '100%', height: '14px', marginBottom: '8px', borderRadius: '4px' }} />
            <div className="skeleton" style={{ width: '100%', height: '14px', marginBottom: '8px', borderRadius: '4px' }} />
            <div className="skeleton" style={{ width: '100%', height: '14px', marginBottom: '16px', borderRadius: '4px' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <div className="skeleton" style={{ flex: 1, height: '14px', borderRadius: '4px' }} />
              <div className="skeleton" style={{ flex: 1, height: '14px', borderRadius: '4px' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
