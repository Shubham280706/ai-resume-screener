const colors = {
  surface: '#0d0d10',
  border: 'rgba(255,255,255,0.07)',
}

export default function SettingsLoading() {
  return (
    <div style={{ padding: '40px 40px' }}>
      {/* Header skeleton */}
      <div style={{ marginBottom: '28px' }}>
        <div className="skeleton" style={{ width: '100px', height: '20px', marginBottom: '12px', borderRadius: '4px' }} />
        <div className="skeleton" style={{ width: '150px', height: '28px', borderRadius: '4px' }} />
      </div>

      {/* Settings cards skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <div className="skeleton" style={{ width: '50%', height: '18px', marginBottom: '12px', borderRadius: '4px' }} />
            <div className="skeleton" style={{ width: '100%', height: '14px', marginBottom: '8px', borderRadius: '4px' }} />
            <div className="skeleton" style={{ width: '100%', height: '14px', marginBottom: '16px', borderRadius: '4px' }} />
            <div className="skeleton" style={{ width: '120px', height: '36px', borderRadius: '6px' }} />
          </div>
        ))}
      </div>
    </div>
  )
}
