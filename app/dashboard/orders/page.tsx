'use client'

import { useEffect, useState } from 'react'

export default function MarketerOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        setOrders(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800'
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800'
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
    return <div className="text-center text-2xl mt-10">جاري التحميل...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">طلبياتي</h1>

      <div className="card overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>رقم الطلب</th>
              <th>الزبون</th>
              <th>الولاية</th>
              <th>المبلغ</th>
              <th>العمولة</th>
              <th>الحالة</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="font-semibold">{order.orderNumber}</td>
                <td>
                  {order.customerFirstName} {order.customerLastName}
                  <br />
                  <span className="text-sm text-gray-600">{order.customerPhone}</span>
                </td>
                <td>{order.wilaya?.name}</td>
                <td>{order.totalAmount.toLocaleString()} دج</td>
                <td className="font-semibold text-green-600">
                  {order.commission.toLocaleString()} دج
                </td>
                <td>
                  <span className={`px-3 py-1 rounded ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString('ar-DZ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
