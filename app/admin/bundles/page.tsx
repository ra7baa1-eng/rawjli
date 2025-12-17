'use client'

import { useEffect, useState } from 'react'

export default function AdminBundles() {
  const [bundles, setBundles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/bundles')
      .then((res) => res.json())
      .then((data) => {
        setBundles(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="text-center text-2xl mt-10">جاري التحميل...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">الباقات</h1>
      </div>

      <div className="card overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>الوصف</th>
              <th>السعر الإجمالي</th>
              <th>العمولة</th>
              <th>عدد المنتجات</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {bundles.map((bundle) => (
              <tr key={bundle.id}>
                <td className="font-semibold">{bundle.name}</td>
                <td>{bundle.description || '-'}</td>
                <td>{bundle.totalPrice.toLocaleString()} دج</td>
                <td>{bundle.commission.toLocaleString()} دج</td>
                <td>{bundle.products?.length || 0}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded ${
                      bundle.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {bundle.isActive ? 'نشط' : 'غير نشط'}
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
