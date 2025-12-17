'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateOrder() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [wilayas, setWilayas] = useState<any[]>([])
  const [communes, setCommunes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    customerFirstName: '',
    customerLastName: '',
    customerPhone: '',
    wilayaCode: '',
    communeId: '',
    deliveryMethod: 'HOME',
    productId: '',
    commission: '',
  })

  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [selectedVariants, setSelectedVariants] = useState<any>({})

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/wilayas').then((r) => r.json()),
    ]).then(([productsData, wilayasData]) => {
      setProducts(productsData.filter((p: any) => p.isActive))
      setWilayas(wilayasData)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (formData.wilayaCode) {
      fetch(`/api/communes?wilayaCode=${formData.wilayaCode}`)
        .then((r) => r.json())
        .then((data) => setCommunes(data))
    }
  }, [formData.wilayaCode])

  useEffect(() => {
    if (formData.productId) {
      const product = products.find((p) => p.id === formData.productId)
      setSelectedProduct(product)
      setSelectedVariants({})
    }
  }, [formData.productId, products])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const product = products.find((p) => p.id === formData.productId)
    if (!product) return

    const price = product.priceAfterDiscount || product.basePrice

    const orderData = {
      ...formData,
      commission: parseFloat(formData.commission),
      items: [
        {
          productId: formData.productId,
          quantity: 1,
          price,
          selectedVariants,
        },
      ],
    }

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    })

    if (res.ok) {
      alert('تم إنشاء الطلبية بنجاح!')
      router.push('/dashboard/orders')
    } else {
      alert('فشل في إنشاء الطلبية')
    }
  }

  if (loading) {
    return <div className="text-center text-2xl mt-10">جاري التحميل...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">طلبية جديدة</h1>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-semibold mb-2">اسم الزبون</label>
              <input
                type="text"
                value={formData.customerFirstName}
                onChange={(e) =>
                  setFormData({ ...formData, customerFirstName: e.target.value })
                }
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">لقب الزبون</label>
              <input
                type="text"
                value={formData.customerLastName}
                onChange={(e) =>
                  setFormData({ ...formData, customerLastName: e.target.value })
                }
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">رقم الهاتف</label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData({ ...formData, customerPhone: e.target.value })
                }
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">المنتج</label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className="input"
                required
              >
                <option value="">اختر المنتج</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.priceAfterDiscount || product.basePrice} دج
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct?.options?.map((option: any) => (
              <div key={option.id}>
                <label className="block text-lg font-semibold mb-2">{option.name}</label>
                <select
                  value={selectedVariants[option.name] || ''}
                  onChange={(e) =>
                    setSelectedVariants({
                      ...selectedVariants,
                      [option.name]: e.target.value,
                    })
                  }
                  className="input"
                  required
                >
                  <option value="">اختر {option.name}</option>
                  {option.values.map((val: any) => (
                    <option key={val.id} value={val.value}>
                      {val.value}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <div>
              <label className="block text-lg font-semibold mb-2">الولاية</label>
              <select
                value={formData.wilayaCode}
                onChange={(e) =>
                  setFormData({ ...formData, wilayaCode: e.target.value, communeId: '' })
                }
                className="input"
                required
              >
                <option value="">اختر الولاية</option>
                {wilayas.map((wilaya) => (
                  <option key={wilaya.code} value={wilaya.code}>
                    {wilaya.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">البلدية</label>
              <select
                value={formData.communeId}
                onChange={(e) => setFormData({ ...formData, communeId: e.target.value })}
                className="input"
                required
                disabled={!formData.wilayaCode}
              >
                <option value="">اختر البلدية</option>
                {communes.map((commune) => (
                  <option key={commune.id} value={commune.id}>
                    {commune.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">طريقة التوصيل</label>
              <select
                value={formData.deliveryMethod}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryMethod: e.target.value })
                }
                className="input"
                required
              >
                <option value="HOME">منزل</option>
                <option value="OFFICE">مكتب</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">العمولة (دج)</label>
              <input
                type="number"
                value={formData.commission}
                onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                className="input"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            إنشاء الطلبية
          </button>
        </form>
      </div>
    </div>
  )
}
