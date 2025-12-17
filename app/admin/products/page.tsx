'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const deleteProduct = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return

    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    setProducts(products.filter((p) => p.id !== id))
  }

  if (loading) {
    return <div className="text-center text-2xl mt-10">جاري التحميل...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">المنتجات</h1>
        <Link href="/admin/products/new" className="btn btn-primary">
          إضافة منتج جديد
        </Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>الفئة</th>
              <th>السعر</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="font-semibold">{product.name}</td>
                <td>{product.category?.name || '-'}</td>
                <td>{product.priceAfterDiscount || product.basePrice} دج</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded ${
                      product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </td>
                <td>
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-blue-600 hover:underline ml-4"
                  >
                    تعديل
                  </Link>
                  <button
                    onClick={() => deleteProduct(product.id)}
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
