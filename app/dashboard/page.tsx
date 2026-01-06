'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, CheckCircle2, Wallet, TrendingUp, Package, ArrowRight, DollarSign, Users } from 'lucide-react'

export default function MarketerDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [recentOrders, setRecentOrders] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then((res) => res.json()).catch(() => null),
      fetch('/api/orders?limit=5').then((res) => res.json()).catch(() => [])
    ]).then(([statsData, ordersData]) => {
      setStats(statsData || {
        totalOrders: 0,
        deliveredOrders: 0,
        balance: 0,
        withdrawableBalance: 0
      })
      setRecentOrders(ordersData || [])
      setLoading(false)
    }).catch(() => {
      setStats({
        totalOrders: 0,
        deliveredOrders: 0,
        balance: 0,
        withdrawableBalance: 0
      })
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center">
        <div className="text-white text-2xl">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
            لوحة تحكم المسوق
          </h1>
          <p className="text-emerald-200 text-lg">مرحباً بك في منصة روجلي للتسويق بالعمولة</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-emerald-500/30 shadow-2xl hover:border-emerald-400/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">إجمالي الطلبيات</h3>
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              {stats?.totalOrders || 0}
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-emerald-500/30 shadow-2xl hover:border-emerald-400/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">الطلبيات المكتملة</h3>
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              {stats?.deliveredOrders || 0}
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-emerald-500/30 shadow-2xl hover:border-emerald-400/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">الرصيد الإجمالي</h3>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {stats?.balance?.toLocaleString() || 0} دج
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-emerald-500/30 shadow-2xl hover:border-emerald-400/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">القابل للسحب</h3>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              {stats?.withdrawableBalance?.toLocaleString() || 0} دج
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-emerald-500/30 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Package className="w-6 h-6 text-emerald-400" />
              إجراءات سريعة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/dashboard/products"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-lg hover:from-emerald-500/30 hover:to-cyan-500/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-emerald-400" />
                  <span className="text-white font-semibold">المنتجات</span>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/dashboard/create-order"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-semibold">طلبية جديدة</span>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/dashboard/orders"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-white font-semibold">طلبياتي</span>
                </div>
                <ArrowRight className="w-5 h-5 text-green-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/dashboard/withdrawals"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg hover:from-yellow-500/30 hover:to-orange-500/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-semibold">السحوبات</span>
                </div>
                <ArrowRight className="w-5 h-5 text-yellow-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-emerald-500/30 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              ملخص الأداء
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-300">معدل النجاح</span>
                <span className="text-emerald-400 font-bold">
                  {stats?.totalOrders > 0
                    ? Math.round((stats?.deliveredOrders / stats?.totalOrders) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-300">متوسط العمولة</span>
                <span className="text-cyan-400 font-bold">
                  {stats?.averageCommission || 0} دج
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-300">إجمالي الأرباح</span>
                <span className="text-purple-400 font-bold">
                  {stats?.totalEarnings?.toLocaleString() || 0} دج
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-emerald-500/30 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-emerald-400" />
              الطلبيات الأخيرة
            </h3>
            <Link
              href="/dashboard/orders"
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2"
            >
              عرض الكل
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">لا توجد طلبيات حديثة</p>
              <Link
                href="/dashboard/create-order"
                className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300"
              >
                إنشاء طلبية جديدة
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 bg-white/5 rounded-lg border border-emerald-500/20 hover:border-emerald-500/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">{order.orderNumber}</p>
                      <p className="text-gray-400 text-sm">
                        {order.customerFirstName} {order.customerLastName}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-emerald-400 font-bold">{order.totalAmount} دج</p>
                      <p className="text-gray-400 text-sm">عمولة: {order.commission} دج</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
