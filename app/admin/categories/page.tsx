'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      } else {
        setError('فشل في جلب الفئات')
      }
    } catch (error) {
      setError('حدث خطأ أثناء جلب الفئات')
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setShowForm(false)
        setFormData({ name: '', description: '' })
        loadCategories()
      } else {
        alert('فشل في إنشاء الفئة')
      }
    } catch (error) {
      alert('حدث خطأ أثناء إنشاء الفئة')
    }
  }

  const deleteCategory = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفئة؟')) return

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (res.ok) {
        loadCategories()
      } else {
        alert('فشل في حذف الفئة')
      }
    } catch (error) {
      alert('حدث خطأ أثناء حذف الفئة')
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
            إدارة الفئات
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold rounded-lg hover:from-pink-600 hover:to-blue-600 transition-all duration-300 shadow-lg"
          >
            {showForm ? 'إلغاء' : 'إضافة فئة جديدة'}
          </button>
        </div>

        {/* Add Category Form */}
        {showForm && (
          <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-6 mb-8 border border-pink-500/30 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">فئة جديدة</h2>
            <form onSubmit={createCategory} className="space-y-4">
              <div>
                <label className="block text-pink-300 text-sm mb-2">اسم الفئة</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  required
                />
              </div>
              <div>
                <label className="block text-pink-300 text-sm mb-2">الوصف</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold rounded-lg hover:from-pink-600 hover:to-blue-600 transition-all duration-300"
              >
                إنشاء الفئة
              </button>
            </form>
          </div>
        )}

        {/* Categories Table */}
        <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-6 border border-pink-500/30 shadow-2xl">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-300 text-xl">لا توجد فئات حالياً</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold rounded-lg hover:from-pink-600 hover:to-blue-600 transition-all duration-300"
              >
                إضافة أول فئة
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-pink-500/30">
                    <th className="text-right py-4 px-4">اسم الفئة</th>
                    <th className="text-right py-4 px-4">الوصف</th>
                    <th className="text-right py-4 px-4">عدد المنتجات</th>
                    <th className="text-right py-4 px-4">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b border-pink-500/20 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-semibold text-lg">{category.name}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-300">{category.description || '-'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-pink-300 font-bold">{category._count?.products || 0}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => deleteCategory(category.id)}
                            className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                          >
                            حذف
                          </button>
                        </div>
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
