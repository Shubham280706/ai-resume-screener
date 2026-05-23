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
      className="flex min-h-screen"
      style={{ backgroundColor: colors.bg }}
    >
      {/* Ambient background glow */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, rgba(79, 70, 229, 0.12) 0%, transparent 60%)`,
          filter: 'blur(120px)',
        }}
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1">{children}</main>
    </div>
  )
}
