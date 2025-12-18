'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock stats for now since API might not work
    const mockStats = {
      totalOrders: 156,
      deliveredOrders: 142,
      totalMarketers: 89,
      pendingWithdrawals: 12,
      totalRevenue: 2450000
    }
    setStats(mockStats)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 mb-2">
            لوحة تحكم روجلي
          </h1>
          <p className="text-gray-300">منصة التجارة الإلكترونية الجزائرية الاحترافية</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/30 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">إجمالي الطلبيات</h3>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                  {stats?.totalOrders || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/30 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">الطلبيات المكتملة</h3>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">
                  {stats?.deliveredOrders || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/30 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">عدد المسوقين</h3>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                  {stats?.totalMarketers || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/30 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">السحوبات المعلقة</h3>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                  {stats?.pendingWithdrawals || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/30 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">إجمالي الإيرادات</h3>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
              {stats?.totalRevenue?.toLocaleString() || 0} دج
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/30 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">إجراءات سريعة</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/admin/products/new"
                className="px-4 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold rounded-lg hover:from-pink-600 hover:to-blue-600 transition-all duration-300 text-center"
              >
                إضافة منتج
              </Link>
              <Link
                href="/admin/marketers"
                className="px-4 py-3 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-colors text-center"
              >
                المسوقين
              </Link>
              <Link
                href="/admin/orders"
                className="px-4 py-3 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors text-center"
              >
                الطلبات
              </Link>
              <Link
                href="/admin/withdrawals"
                className="px-4 py-3 bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors text-center"
              >
                السحوبات
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/30 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-white">الطلبات الأخيرة</h3>
            <Link
              href="/admin/orders"
              className="text-pink-400 hover:text-pink-300 transition-colors"
            >
              عرض الكل
            </Link>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-400">لا توجد طلبات حديثة</p>
          </div>
        </div>
      </div>
    </div>
  )
}
        <p className="text-5xl font-bold text-green-600">
          {stats?.totalRevenue?.toLocaleString() || 0} دج
        </p>
      </div>
    </div>
  )
}
