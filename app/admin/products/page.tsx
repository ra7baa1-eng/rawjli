'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products')
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        } else {
          setError('فشل في جلب المنتجات')
        }
      } catch (error) {
        setError('حدث خطأ أثناء جلب المنتجات')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const deleteProduct = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id))
      } else {
        alert('فشل في حذف المنتج')
      }
    } catch (error) {
      alert('حدث خطأ أثناء حذف المنتج')
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
            إدارة المنتجات
          </h1>
          <Link
            href="/admin/products/new"
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold rounded-lg hover:from-pink-600 hover:to-blue-600 transition-all duration-300 shadow-lg"
          >
            إضافة منتج جديد
          </Link>
        </div>

        {/* Products Table */}
        <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-6 border border-pink-500/30 shadow-2xl">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-300 text-xl">لا توجد منتجات حالياً</p>
              <Link
                href="/admin/products/new"
                className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold rounded-lg hover:from-pink-600 hover:to-blue-600 transition-all duration-300"
              >
                إضافة أول منتج
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-pink-500/30">
                    <th className="text-right py-4 px-4">اسم المنتج</th>
                    <th className="text-right py-4 px-4">الفئة</th>
                    <th className="text-right py-4 px-4">السعر</th>
                    <th className="text-right py-4 px-4">الحالة</th>
                    <th className="text-right py-4 px-4">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-pink-500/20 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg ml-3 object-cover"
                            />
                          )}
                          <span className="font-semibold">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">{product.category?.name || '-'}</td>
                      <td className="py-4 px-4">
                        <span className="text-pink-300 font-bold">
                          {product.priceAfterDiscount || product.basePrice} دج
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            product.isActive
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {product.isActive ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
                          >
                            تعديل
                          </Link>
                          <button
                            onClick={() => deleteProduct(product.id)}
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
