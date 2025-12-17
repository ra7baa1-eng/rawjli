'use client'

import { useEffect, useState } from 'react'

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = () => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    setShowForm(false)
    setFormData({ name: '', description: '' })
    loadCategories()
  }

  const deleteCategory = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفئة؟')) return

    await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    loadCategories()
  }

  if (loading) {
    return <div className="text-center text-2xl mt-10">جاري التحميل...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">الفئات</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'إلغاء' : 'إضافة فئة جديدة'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-2xl font-bold mb-4">فئة جديدة</h2>
          <form onSubmit={createCategory} className="space-y-4">
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
            <button type="submit" className="btn btn-primary">
              إنشاء الفئة
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
              <th>عدد المنتجات</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="font-semibold">{category.name}</td>
                <td>{category.description || '-'}</td>
                <td>{category._count?.products || 0}</td>
                <td>
                  <button
                    onClick={() => deleteCategory(category.id)}
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
