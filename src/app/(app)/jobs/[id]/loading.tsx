const colors = {
  bg: '#050507',
  surface: '#0d0d10',
  border: 'rgba(255,255,255,0.07)',
}

export default function JobDetailLoading() {
  return (
    <div style={{ padding: '40px 40px' }}>
      {/* Header skeleton */}
      <div style={{ marginBottom: '28px' }}>
        <div className="skeleton" style={{ width: '100px', height: '20px', marginBottom: '12px', borderRadius: '4px' }} />
        <div className="skeleton" style={{ width: '250px', height: '28px', marginBottom: '8px', borderRadius: '4px' }} />
        <div className="skeleton" style={{ width: '300px', height: '14px', borderRadius: '4px' }} />
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

      {/* Table skeleton */}
      <div
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              {[...Array(5)].map((_, i) => (
                <th key={i} style={{ padding: '14px 18px', textAlign: 'left' }}>
                  <div className="skeleton" style={{ width: '80px', height: '12px', borderRadius: '4px' }} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, idx) => (
              <tr key={idx} style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td style={{ padding: '14px 18px' }}>
                  <div className="skeleton" style={{ width: '120px', height: '14px', borderRadius: '4px' }} />
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <div className="skeleton" style={{ width: '100px', height: '14px', borderRadius: '4px' }} />
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <div className="skeleton" style={{ width: '150px', height: '14px', borderRadius: '4px' }} />
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <div className="skeleton" style={{ width: '80px', height: '14px', borderRadius: '4px' }} />
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <div className="skeleton" style={{ width: '60px', height: '14px', borderRadius: '4px' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
