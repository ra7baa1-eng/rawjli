import MarketerNav from '@/components/MarketerNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
      <MarketerNav />
      <main>{children}</main>
    </div>
  )
}
