'use client'

import { useEffect, useState } from 'react'

export default function MarketerWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    method: 'BARIDI_MOB',
    accountNumber: '',
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/withdrawals').then((r) => r.json()),
      fetch('/api/stats').then((r) => r.json()),
    ]).then(([withdrawalsData, statsData]) => {
      setWithdrawals(withdrawalsData)
      setUser(statsData)
      setLoading(false)
    })
  }, [])

  const createWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/withdrawals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        amount: parseFloat(formData.amount),
      }),
    })

    if (res.ok) {
      setShowForm(false)
      setFormData({ amount: '', method: 'BARIDI_MOB', accountNumber: '' })
      window.location.reload()
    } else {
      const error = await res.json()
      alert(error.error || 'فشل في إنشاء طلب السحب')
    }
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
      <h1 className="text-3xl font-bold mb-6">السحوبات</h1>

      <div className="card mb-6">
        <h2 className="text-2xl font-bold mb-4">الرصيد القابل للسحب</h2>
        <p className="text-5xl font-bold text-green-600">
          {user?.withdrawableBalance?.toLocaleString() || 0} دج
        </p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary mt-4"
          disabled={!user?.withdrawableBalance || user.withdrawableBalance <= 0}
        >
          {showForm ? 'إلغاء' : 'طلب سحب جديد'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-2xl font-bold mb-4">طلب سحب جديد</h2>
          <form onSubmit={createWithdrawal} className="space-y-4">
            <div>
              <label className="block text-lg font-semibold mb-2">المبلغ (دج)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="input"
                required
                min="1"
                max={user?.withdrawableBalance || 0}
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">طريقة السحب</label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                className="input"
                required
              >
                <option value="BARIDI_MOB">بريدي موب (20 رقم)</option>
                <option value="CCP">CCP</option>
                <option value="PHONE_CREDIT">شحن هاتف</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">رقم الحساب</label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) =>
                  setFormData({ ...formData, accountNumber: e.target.value })
                }
                className="input"
                required
                placeholder={
                  formData.method === 'BARIDI_MOB'
                    ? '20 رقم'
                    : formData.method === 'CCP'
                    ? 'رقم CCP'
                    : 'رقم الهاتف'
                }
              />
            </div>

            <button type="submit" className="btn btn-primary">
              إرسال الطلب
            </button>
          </form>
        </div>
      )}

      <div className="card overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">سجل السحوبات</h2>
        <table className="table">
          <thead>
            <tr>
              <th>المبلغ</th>
              <th>الطريقة</th>
              <th>رقم الحساب</th>
              <th>التاريخ</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((withdrawal) => (
              <tr key={withdrawal.id}>
                <td className="font-semibold">{withdrawal.amount.toLocaleString()} دج</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
