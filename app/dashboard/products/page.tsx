'use client'

import { useEffect, useState } from 'react'

export default function MarketerProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.filter((p: any) => p.isActive))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('تم النسخ!')
  }

  if (loading) {
    return <div className="text-center text-2xl mt-10">جاري التحميل...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">المنتجات المتاحة</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="card">
            {product.images && product.images.length > 0 && (
              <div className="mb-4 bg-gray-100 h-48 flex items-center justify-center rounded">
                <span className="text-gray-400">صورة المنتج</span>
              </div>
            )}
            
            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
            
            <div className="mb-4">
              <p className="text-lg font-semibold text-blue-600">
                {product.priceAfterDiscount || product.basePrice} دج
              </p>
              {product.priceAfterDiscount && (
                <p className="text-sm text-gray-500 line-through">
                  {product.basePrice} دج
                </p>
              )}
            </div>

            <div className="space-y-2">
              <button
                onClick={() => copyText(product.marketingTitle)}
                className="btn btn-secondary w-full text-base"
              >
                نسخ العنوان
              </button>
              <button
                onClick={() => copyText(product.marketingDescription)}
                className="btn btn-secondary w-full text-base"
              >
                نسخ الوصف
              </button>
            </div>

            {product.options && product.options.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="font-semibold mb-2">الخيارات المتاحة:</p>
                {product.options.map((option: any) => (
                  <div key={option.id} className="mb-2">
                    <span className="font-semibold">{option.name}: </span>
                    <span className="text-sm">
                      {option.values.map((v: any) => v.value).join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
