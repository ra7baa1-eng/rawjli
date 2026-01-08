'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Download, Copy, CheckCircle2, Share2, ShoppingCart, Package, Tag, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetch(`/api/products/${params.id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Product not found')
          }
          return res.json()
        })
        .then((data) => {
          console.log('Product data:', data) // Debug log
          setProduct(data)
          setLoading(false)
        })
        .catch((error) => {
          console.error('Error fetching product:', error)
          setLoading(false)
        })
    }
  }, [params.id])

  const copyText = async (text: string, type: string) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(type)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      alert('فشل في النسخ')
    }
  }

  const downloadImage = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `product-${product?.id || 'product'}-${index + 1}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      alert('فشل في تحميل الصورة')
    }
  }

  const shareProduct = async () => {
    const shareText = `${product?.marketingTitle || product?.name}\n\n${product?.marketingDescription || ''}\n\nالسعر: ${product?.priceAfterDiscount || product?.basePrice} دج`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.marketingTitle || product?.name,
          text: shareText,
        })
      } catch (err) {
        copyText(shareText, 'share')
      }
    } else {
      copyText(shareText, 'share')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center">
        <div className="text-white text-2xl">جاري التحميل...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-20 h-20 text-emerald-400 mx-auto mb-4" />
          <p className="text-white text-xl">المنتج غير موجود</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
          >
            العودة
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-emerald-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة للمنتجات
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="bg-black/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl">
              <div className="relative h-96 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', product.images[0])
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%2310b981'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='12'%3Eلا توجد صورة%3C/text%3E%3C/svg%3E`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-24 h-24 text-emerald-400/50" />
                  </div>
                )}
                {product.category && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-emerald-500/80 backdrop-blur-sm text-white text-sm rounded-full flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {product.category.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Image Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {product.images.map((image: string, index: number) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-emerald-500/30"
                    />
                    <button
                      onClick={() => downloadImage(image, index)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
                    >
                      <Download className="w-6 h-6 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Details */}
            <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-emerald-500/30 shadow-2xl">
              <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>

              {/* Debug Info */}
              <div className="mb-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <p className="text-xs text-yellow-300">Debug Info:</p>
                <p className="text-xs text-gray-300">Base Price: {product.basePrice}</p>
                <p className="text-xs text-gray-300">Price After Discount: {product.priceAfterDiscount}</p>
                <p className="text-xs text-gray-300">Images: {JSON.stringify(product.images)}</p>
                <p className="text-xs text-gray-300">Marketing Title: {product.marketingTitle}</p>
                <p className="text-xs text-gray-300">Marketing Description: {product.marketingDescription?.substring(0, 50)}...</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-emerald-400" />
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    {product.priceAfterDiscount || product.basePrice || 0} دج
                  </span>
                </div>
                {product.priceAfterDiscount && (
                  <p className="text-sm text-gray-400 line-through mt-1">
                    {product.basePrice} دج
                  </p>
                )}
                {product.commission && (
                  <p className="text-sm text-emerald-300 mt-1">
                    عمولة: {product.commission}%
                  </p>
                )}
              </div>

              {/* Marketing Title */}
              {product.marketingTitle && (
                <div className="mb-4 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-emerald-200 font-medium">العنوان التسويقي:</p>
                    <button
                      onClick={() => copyText(product.marketingTitle, 'title')}
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-all duration-300 ${
                        copiedId === 'title'
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20'
                      }`}
                    >
                      {copiedId === 'title' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          تم النسخ!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          نسخ
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-white text-sm">{product.marketingTitle}</p>
                </div>
              )}

              {/* Marketing Description */}
              {product.marketingDescription && (
                <div className="mb-4 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-emerald-200 font-medium">الوصف التسويقي:</p>
                    <button
                      onClick={() => copyText(product.marketingDescription, 'desc')}
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-all duration-300 ${
                        copiedId === 'desc'
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20'
                      }`}
                    >
                      {copiedId === 'desc' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          تم النسخ!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          نسخ
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-white text-sm whitespace-pre-wrap">{product.marketingDescription}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Link
                  href={`/dashboard/create-order?productId=${product.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/50"
                >
                  <ShoppingCart className="w-5 h-5" />
                  إنشاء طلبية
                </Link>

                <button
                  onClick={shareProduct}
                  className="px-4 py-3 bg-white/10 text-white border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-all duration-300"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Options */}
            {product.options && product.options.length > 0 && (
              <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-emerald-500/30 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">الخيارات المتاحة:</h3>
                {product.options.map((option: any) => (
                  <div key={option.id} className="mb-3">
                    <span className="text-emerald-300 font-medium">{option.name}: </span>
                    <span className="text-gray-300">
                      {option.values.map((v: any) => v.value).join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
