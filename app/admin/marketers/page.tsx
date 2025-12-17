'use client'

import { useEffect, useState } from 'react'

export default function AdminMarketers() {
  const [marketers, setMarketers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  })

  useEffect(() => {
    loadMarketers()
  }, [])

  const loadMarketers = () => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        setMarketers(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const createMarketer = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      setShowForm(false)
      setFormData({ email: '', password: '', firstName: '', lastName: '', phone: '' })
      loadMarketers()
    } else {
      alert('فشل في إنشاء المسوق')
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    })

    loadMarketers()
  }

  if (loading) {
    return <div className="text-center text-2xl mt-10">جاري التحميل...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">المسوقين</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'إلغاء' : 'إضافة مسوق جديد'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-2xl font-bold mb-4">مسوق جديد</h2>
          <form onSubmit={createMarketer} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-semibold mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-semibold mb-2">كلمة المرور</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-semibold mb-2">الاسم</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold mb-2">اللقب</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold mb-2">رقم الهاتف</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              إنشاء المسوق
            </button>
          </form>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>البريد الإلكتروني</th>
              <th>الاسم</th>
              <th>الهاتف</th>
              <th>الرصيد</th>
              <th>القابل للسحب</th>
              <th>الطلبيات</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {marketers.map((marketer) => (
              <tr key={marketer.id}>
                <td className="font-semibold">{marketer.email}</td>
                <td>
                  {marketer.firstName} {marketer.lastName}
                </td>
                <td>{marketer.phone || '-'}</td>
                <td>{marketer.balance.toLocaleString()} دج</td>
                <td>{marketer.withdrawableBalance.toLocaleString()} دج</td>
                <td>{marketer._count?.orders || 0}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded ${
                      marketer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {marketer.isActive ? 'نشط' : 'معطل'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => toggleActive(marketer.id, marketer.isActive)}
                    className="text-blue-600 hover:underline"
                  >
                    {marketer.isActive ? 'تعطيل' : 'تفعيل'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
