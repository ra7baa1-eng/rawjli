'use client'

import { useEffect, useState } from 'react'

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/withdrawals')
      .then((res) => res.json())
      .then((data) => {
        setWithdrawals(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/withdrawals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    setWithdrawals(
      withdrawals.map((w) => (w.id === id ? { ...w, status } : w))
    )
  }

  const getMethodText = (method: string) => {
    switch (method) {
      case 'BARIDI_MOB':
        return 'بريدي موب'
      case 'CCP':
        return 'CCP'
      case 'PHONE_CREDIT':
        return 'شحن هاتف'
      default:
        return method
    }
  }

  if (loading) {
    return <div className="text-center text-2xl mt-10">جاري التحميل...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">طلبات السحب</h1>

      <div className="card overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>المسوق</th>
              <th>المبلغ</th>
              <th>الطريقة</th>
              <th>رقم الحساب</th>
              <th>التاريخ</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((withdrawal) => (
              <tr key={withdrawal.id}>
                <td className="font-semibold">{withdrawal.marketer?.email}</td>
                <td>{withdrawal.amount.toLocaleString()} دج</td>
                <td>{getMethodText(withdrawal.method)}</td>
                <td className="font-mono">{withdrawal.accountNumber}</td>
                <td>{new Date(withdrawal.createdAt).toLocaleDateString('ar-DZ')}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded ${
                      withdrawal.status === 'PAID'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {withdrawal.status === 'PAID' ? 'تم الدفع' : 'قيد المعالجة'}
                  </span>
                </td>
                <td>
                  {withdrawal.status === 'PENDING' && (
                    <button
                      onClick={() => updateStatus(withdrawal.id, 'PAID')}
                      className="btn btn-success text-base px-4 py-2"
                    >
                      تأكيد الدفع
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
