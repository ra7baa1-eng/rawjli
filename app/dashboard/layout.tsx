import MarketerNav from '@/components/MarketerNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <MarketerNav />
      <main className="container mx-auto p-6">{children}</main>
    </div>
  )
}
