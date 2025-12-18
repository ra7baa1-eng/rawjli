'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function MarketerOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      // Mock orders for now since API might not work
      const mockOrders = [
        {
          id: '1',
          orderNumber: 'ORD-2024-001',
          customerFirstName: 'أحمد',
          customerLastName: 'محمد',
          customerPhone: '0551234567',
          totalAmount: 2500,
          commission: 250,
          status: 'PROCESSING',
          createdAt: '2024-12-18T20:00:00Z',
          wilaya: { name: 'الجزائر العاصمة' }
        },
        {
          id: '2',
          orderNumber: 'ORD-2024-002',
          customerFirstName: 'فاطمة',
          customerLastName: 'بن علي',
          customerPhone: '0779876543',
          totalAmount: 1500,
          commission: 150,
          status: 'SHIPPED',
          createdAt: '2024-12-17T15:30:00Z',
          wilaya: { name: 'وهران' }
        }
      ]
      setOrders(mockOrders)
    } catch (error) {
      setError('فشل في جلب الطلبات')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PROCESSING':
        return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
      case 'SHIPPED':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
      case 'DELIVERED':
        return 'bg-green-500/20 text-green-300 border border-green-500/30'
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-300 border border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PROCESSING':
        return 'قيد المعالجة'
      case 'SHIPPED':
        return 'خرجت للتوصيل'
      case 'DELIVERED':
        return 'تم التوصيل'
      case 'CANCELLED':
        return 'ملغاة'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl">جاري التحميل...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center">
        <div className="text-red-400 text-2xl">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
            طلباتي
          </h1>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-pink-500/20 text-pink-300 border border-pink-500/30 rounded-lg hover:bg-pink-500/30 transition-colors">
              تصدير Excel
            </button>
            <button className="px-4 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors">
              فلترة
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-6 border border-pink-500/30 shadow-2xl">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-300 text-xl mb-4">لا توجد طلبات حالياً</p>
              <p className="text-gray-400">ابدأ بالتسويق للمنتجات لظهور الطلبات هنا</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-pink-500/30">
                    <th className="text-right py-4 px-4">رقم الطلب</th>
                    <th className="text-right py-4 px-4">الزبون</th>
                    <th className="text-right py-4 px-4">الولاية</th>
                    <th className="text-right py-4 px-4">المبلغ</th>
                    <th className="text-right py-4 px-4">العمولة</th>
                    <th className="text-right py-4 px-4">الحالة</th>
                    <th className="text-right py-4 px-4">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-pink-500/20 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-semibold">#{order.orderNumber}</td>
                      <td className="py-4 px-4">
                        <div>
                          <span className="font-medium">{order.customerFirstName} {order.customerLastName}</span>
                          <br />
                          <span className="text-sm text-gray-300">{order.customerPhone}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">{order.wilaya?.name || '-'}</td>
                      <td className="py-4 px-4">
                        <span className="text-pink-300 font-bold">{order.totalAmount.toLocaleString()} دج</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-green-300 font-bold">{order.commission.toLocaleString()} دج</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-300">
                        {new Date(order.createdAt).toLocaleDateString('ar-DZ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
