'use client'

import { useEffect, useState } from 'react'

export default function MarketerDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="text-center text-2xl mt-10">جاري التحميل...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">لوحة التحكم</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-blue-50">
          <h3 className="text-xl font-semibold mb-2">إجمالي الطلبيات</h3>
          <p className="text-4xl font-bold text-blue-600">{stats?.totalOrders || 0}</p>
        </div>

        <div className="card bg-green-50">
          <h3 className="text-xl font-semibold mb-2">الطلبيات الناجحة</h3>
          <p className="text-4xl font-bold text-green-600">{stats?.deliveredOrders || 0}</p>
        </div>

        <div className="card bg-purple-50">
          <h3 className="text-xl font-semibold mb-2">الرصيد الإجمالي</h3>
          <p className="text-4xl font-bold text-purple-600">
            {stats?.balance?.toLocaleString() || 0} دج
          </p>
        </div>

        <div className="card bg-yellow-50">
          <h3 className="text-xl font-semibold mb-2">القابل للسحب</h3>
          <p className="text-4xl font-bold text-yellow-600">
            {stats?.withdrawableBalance?.toLocaleString() || 0} دج
          </p>
        </div>
      </div>
    </div>
  )
}
