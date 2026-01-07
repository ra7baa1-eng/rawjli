'use client'

import { useEffect, useState } from 'react'
import { FileText, TrendingUp, Users, Package, DollarSign, Calendar, Download } from 'lucide-react'

export default function AdminReports() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    monthlyGrowth: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Mock data for now - replace with actual API calls
      setStats({
        totalOrders: 1247,
        totalRevenue: 2847500,
        totalUsers: 892,
        totalProducts: 156,
        monthlyGrowth: 12.5
      })
      setLoading(false)
    } catch (error) {
      console.error('Error fetching stats:', error)
      setLoading(false)
    }
  }

  const generateReport = async (type: string) => {
    try {
      // Mock report generation
      alert(`جاري إنشاء تقرير ${type}...`)
    } catch (error) {
      console.error('Error generating report:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="h-8 w-8 ml-3 text-blue-600" />
            التقارير والإحصائيات
          </h1>
          <p className="text-gray-600 mt-2">عرض وتحليل بيانات النظام</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">إجمالي المنتجات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()} دج</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">النمو الشهري</p>
                <p className="text-2xl font-bold text-gray-900">{stats.monthlyGrowth}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Reports */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="h-6 w-6 ml-2 text-blue-600" />
              التقارير المتاحة
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 ml-3" />
                  <div>
                    <p className="font-medium text-gray-900">تقرير المبيعات الشهري</p>
                    <p className="text-sm text-gray-500">ملخص المبيعات للشهر الحالي</p>
                  </div>
                </div>
                <button
                  onClick={() => generateReport('sales')}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4 ml-1" />
                  تحميل
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 ml-3" />
                  <div>
                    <p className="font-medium text-gray-900">تقرير المستخدمين</p>
                    <p className="text-sm text-gray-500">إحصائيات المستخدمين الجدد والنشطين</p>
                  </div>
                </div>
                <button
                  onClick={() => generateReport('users')}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4 ml-1" />
                  تحميل
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-gray-400 ml-3" />
                  <div>
                    <p className="font-medium text-gray-900">تقرير المنتجات</p>
                    <p className="text-sm text-gray-500">المنتجات الأكثر مبيعاً والأقل</p>
                  </div>
                </div>
                <button
                  onClick={() => generateReport('products')}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4 ml-1" />
                  تحميل
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400 ml-3" />
                  <div>
                    <p className="font-medium text-gray-900">تقرير الإيرادات</p>
                    <p className="text-sm text-gray-500">تحليل مفصل للإيرادات</p>
                  </div>
                </div>
                <button
                  onClick={() => generateReport('revenue')}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4 ml-1" />
                  تحميل
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 ml-2 text-green-600" />
              النشاط الحديث
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full ml-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">طلب جديد #1247</p>
                    <p className="text-xs text-gray-500">منذ 5 دقائق</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">2,500 دج</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-blue-500 rounded-full ml-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">مستخدم جديد</p>
                    <p className="text-xs text-gray-500">منذ 15 دقيقة</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">أحمد محمد</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-purple-500 rounded-full ml-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">منتج جديد</p>
                    <p className="text-xs text-gray-500">منذ 30 دقيقة</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">هاتف Samsung</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full ml-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">طلب سحب</p>
                    <p className="text-xs text-gray-500">منذ ساعة</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">5,000 دج</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
