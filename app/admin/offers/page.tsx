'use client'

import { useEffect, useState } from 'react'

export default function AdminOffers() {
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '', discountPercent: '' })

  useEffect(() => {
    loadOffers()
  }, [])

  const loadOffers = () => {
    fetch('/api/offers')
      .then((res) => res.json())
      .then((data) => {
        setOffers(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const createOffer = async (e: React.FormEvent) => {
    e.preventDefault()

    await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        discountPercent: formData.discountPercent ? parseFloat(formData.discountPercent) : null
      }),
    })

    setShowForm(false)
    setFormData({ name: '', description: '', discountPercent: '' })
    loadOffers()
  }

  const deleteOffer = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العرض؟')) return

    await fetch(`/api/offers/${id}`, { method: 'DELETE' })
    loadOffers()
  }

  if (loading) {
    return <div className="text-center text-2xl mt-10">جاري التحميل...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">العروض</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'إلغاء' : 'إضافة عرض جديد'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-2xl font-bold mb-4">عرض جديد</h2>
          <form onSubmit={createOffer} className="space-y-4">
            <div>
              <label className="block text-lg font-semibold mb-2">الاسم</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2">الوصف</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2">نسبة التخفيض (%)</label>
              <input
                type="number"
                value={formData.discountPercent}
                onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                className="input"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              إنشاء العرض
            </button>
          </form>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>الوصف</th>
              <th>نسبة التخفيض</th>
              <th>عدد المنتجات</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.id}>
                <td className="font-semibold">{offer.name}</td>
                <td>{offer.description || '-'}</td>
                <td>{offer.discountPercent ? `${offer.discountPercent}%` : '-'}</td>
                <td>{offer._count?.products || 0}</td>
                <td>
                  <button
                    onClick={() => deleteOffer(offer.id)}
                    className="text-red-600 hover:underline"
                  >
                    حذف
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
