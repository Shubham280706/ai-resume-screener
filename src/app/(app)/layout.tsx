import Sidebar from '@/components/Sidebar'

const colors = {
  bg: '#050810',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="flex min-h-screen relative"
      style={{ backgroundColor: colors.bg }}
    >
      {/* Ambient background glow - fixed behind everything */}
      <div
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            width: '600px',
            height: '600px',
            background: `radial-gradient(circle, rgba(79, 70, 229, 0.12), transparent 70%)`,
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 relative z-10">{children}</main>
    </div>
  )
}
