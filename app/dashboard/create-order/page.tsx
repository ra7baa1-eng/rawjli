'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ShoppingCart, User, Phone, MapPin, Package, Truck, DollarSign, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

function CreateOrderForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<any[]>([])
  const [wilayas, setWilayas] = useState<any[]>([])
  const [communes, setCommunes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

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
    const productId = searchParams?.get('productId')
    if (productId) {
      setFormData(prev => ({ ...prev, productId }))
    }
  }, [searchParams])

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
      if (product && product.commission) {
        const price = product.priceAfterDiscount || product.basePrice
        const commissionAmount = (price * product.commission) / 100
        setFormData(prev => ({ ...prev, commission: commissionAmount.toFixed(2) }))
      }
    }
  }, [formData.productId, products])

  const calculateTotal = () => {
    if (!selectedProduct) return 0
    const price = selectedProduct.priceAfterDiscount || selectedProduct.basePrice
    return price
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccess(false)

    const product = products.find((p) => p.id === formData.productId)
    if (!product) {
      setSubmitting(false)
      return
    }

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

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard/orders')
        }, 2000)
      } else {
        const error = await res.json()
        alert(error.error || 'فشل في إنشاء الطلبية')
      }
    } catch (error) {
      alert('حدث خطأ أثناء إنشاء الطلبية')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center">
        <div className="text-white text-2xl">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/products"
            className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة للمنتجات
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
            إنشاء طلبية جديدة
          </h1>
          <p className="text-emerald-200 text-lg">املأ بيانات العميل والمنتج لإنشاء طلبية جديدة</p>
        </div>

        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-300 px-6 py-4 rounded-lg mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-semibold">تم إنشاء الطلبية بنجاح! جاري التوجيه...</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-emerald-500/30 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Info */}
                <div className="bg-white/5 rounded-xl p-4 border border-emerald-500/20">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-400" />
                    معلومات العميل
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-emerald-200 font-medium mb-2">الاسم</label>
                      <input
                        type="text"
                        value={formData.customerFirstName}
                        onChange={(e) =>
                          setFormData({ ...formData, customerFirstName: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-emerald-500/30 rounded-lg text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                        placeholder="اسم العميل"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-emerald-200 font-medium mb-2">اللقب</label>
                      <input
                        type="text"
                        value={formData.customerLastName}
                        onChange={(e) =>
                          setFormData({ ...formData, customerLastName: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-emerald-500/30 rounded-lg text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                        placeholder="لقب العميل"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-emerald-200 font-medium mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        رقم الهاتف
                      </label>
                      <input
                        type="tel"
                        value={formData.customerPhone}
                        onChange={(e) =>
                          setFormData({ ...formData, customerPhone: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-emerald-500/30 rounded-lg text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                        placeholder="0551234567"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Product Selection */}
                <div className="bg-white/5 rounded-xl p-4 border border-emerald-500/20">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-emerald-400" />
                    اختيار المنتج
                  </h3>
                  <div>
                    <label className="block text-emerald-200 font-medium mb-2">المنتج</label>
                    <select
                      value={formData.productId}
                      onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                      required
                    >
                      <option value="" className="bg-gray-800">اختر المنتج</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id} className="bg-gray-800">
                          {product.name} - {product.priceAfterDiscount || product.basePrice} دج
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedProduct && (
                    <div className="mt-4 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      {selectedProduct.images && selectedProduct.images.length > 0 && (
                        <img
                          src={selectedProduct.images[0].startsWith('http') ? selectedProduct.images[0] : `/uploads/products/${selectedProduct.images[0]}`}
                          alt={selectedProduct.name}
                          className="w-24 h-24 object-cover rounded-lg mb-3"
                        />
                      )}
                      <p className="text-white font-semibold">{selectedProduct.name}</p>
                      <p className="text-emerald-300">
                        السعر: {selectedProduct.priceAfterDiscount || selectedProduct.basePrice} دج
                      </p>
                    </div>
                  )}

                  {selectedProduct?.options?.map((option: any) => (
                    <div key={option.id} className="mt-4">
                      <label className="block text-emerald-200 font-medium mb-2">{option.name}</label>
                      <select
                        value={selectedVariants[option.name] || ''}
                        onChange={(e) =>
                          setSelectedVariants({
                            ...selectedVariants,
                            [option.name]: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                        required
                      >
                        <option value="" className="bg-gray-800">اختر {option.name}</option>
                        {option.values.map((val: any) => (
                          <option key={val.id} value={val.value} className="bg-gray-800">
                            {val.value}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {/* Delivery Info */}
                <div className="bg-white/5 rounded-xl p-4 border border-emerald-500/20">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                    معلومات التوصيل
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-emerald-200 font-medium mb-2">الولاية</label>
                      <select
                        value={formData.wilayaCode}
                        onChange={(e) =>
                          setFormData({ ...formData, wilayaCode: e.target.value, communeId: '' })
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                        required
                      >
                        <option value="" className="bg-gray-800">اختر الولاية</option>
                        {wilayas.map((wilaya) => (
                          <option key={wilaya.code} value={wilaya.code} className="bg-gray-800">
                            {wilaya.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-emerald-200 font-medium mb-2">البلدية</label>
                      <select
                        value={formData.communeId}
                        onChange={(e) => setFormData({ ...formData, communeId: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 disabled:opacity-50"
                        required
                        disabled={!formData.wilayaCode}
                      >
                        <option value="" className="bg-gray-800">اختر البلدية</option>
                        {communes.map((commune) => (
                          <option key={commune.id} value={commune.id} className="bg-gray-800">
                            {commune.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-emerald-200 font-medium mb-2 flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        طريقة التوصيل
                      </label>
                      <select
                        value={formData.deliveryMethod}
                        onChange={(e) =>
                          setFormData({ ...formData, deliveryMethod: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                        required
                      >
                        <option value="HOME" className="bg-gray-800">منزل</option>
                        <option value="OFFICE" className="bg-gray-800">مكتب</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Commission */}
                <div className="bg-white/5 rounded-xl p-4 border border-emerald-500/20">
                  <label className="block text-emerald-200 font-medium mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    العمولة (دج)
                  </label>
                  <input
                    type="number"
                    value={formData.commission}
                    onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-emerald-500/30 rounded-lg text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                    placeholder="0.00"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || success}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>جاري الإنشاء...</>
                  ) : success ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      تم الإنشاء!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      إنشاء الطلبية
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-emerald-500/30 shadow-2xl sticky top-6">
              <h3 className="text-xl font-bold text-white mb-4">ملخص الطلبية</h3>
              {selectedProduct ? (
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-gray-300 text-sm mb-1">المنتج</p>
                    <p className="text-white font-semibold">{selectedProduct.name}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-gray-300 text-sm mb-1">السعر</p>
                    <p className="text-emerald-400 font-bold text-xl">
                      {calculateTotal().toLocaleString()} دج
                    </p>
                  </div>
                  {formData.commission && (
                    <div className="p-4 bg-white/5 rounded-lg">
                      <p className="text-gray-300 text-sm mb-1">العمولة</p>
                      <p className="text-cyan-400 font-bold">
                        {parseFloat(formData.commission).toLocaleString()} دج
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">اختر منتجاً لعرض الملخص</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CreateOrder() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center">
        <div className="text-white text-2xl">جاري التحميل...</div>
      </div>
    }>
      <CreateOrderForm />
    </Suspense>
  )
}
