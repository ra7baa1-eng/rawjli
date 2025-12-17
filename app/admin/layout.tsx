import AdminNav from '@/components/AdminNav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <AdminNav />
      <main className="container mx-auto p-6">{children}</main>
    </div>
  )
}
