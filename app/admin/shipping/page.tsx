'use client'

import { useEffect, useState } from 'react'

export default function AdminShipping() {
  const [shippingPrices, setShippingPrices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/shipping')
      .then((res) => res.json())
      .then((data) => {
        setShippingPrices(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const updatePrice = async (wilayaCode: string, price: number) => {
    await fetch('/api/shipping', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wilayaCode, price }),
    })
  }

  if (loading) {
    return <div className="text-center text-2xl mt-10">جاري التحميل...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">أسعار التوصيل</h1>

      <div className="card overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>الولاية</th>
              <th>السعر (دج)</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {shippingPrices.map((sp) => (
              <tr key={sp.id}>
                <td className="font-semibold">{sp.wilaya?.name}</td>
                <td>
                  <input
                    type="number"
                    defaultValue={sp.price}
                    className="input w-32"
                    id={`price-${sp.wilayaCode}`}
                  />
                </td>
                <td>
                  <button
                    onClick={() => {
                      const input = document.getElementById(
                        `price-${sp.wilayaCode}`
                      ) as HTMLInputElement
                      updatePrice(sp.wilayaCode, parseFloat(input.value))
                      alert('تم تحديث السعر')
                    }}
                    className="btn btn-primary text-base px-4 py-2"
                  >
                    حفظ
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
