'use client'

import { useEffect, useState } from 'react'
import { Copy, ShoppingCart, Share2, CheckCircle2, Package, DollarSign, Tag } from 'lucide-react'
import Link from 'next/link'

export default function MarketerProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.filter((p: any) => p.isActive))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const copyText = async (text: string, type: string, productId: string) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(`${productId}-${type}`)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      alert('فشل في النسخ')
    }
  }

  const shareProduct = async (product: any) => {
    const shareText = `${product.marketingTitle || product.name}\n\n${product.marketingDescription || ''}\n\nالسعر: ${product.priceAfterDiscount || product.basePrice} دج`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.marketingTitle || product.name,
          text: shareText,
        })
      } catch (err) {
        // User cancelled or error
      }
    } else {
      copyText(shareText, 'share', product.id)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.marketingTitle && product.marketingTitle.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center">
        <div className="text-white text-2xl">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4">
            المنتجات المتاحة للتسويق
          </h1>
          <p className="text-emerald-200 text-lg">اختر المنتجات التي تريد الترويج لها وإنشاء طلبيات للعملاء</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-emerald-500/30 shadow-2xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-emerald-500/30 rounded-lg text-white placeholder-emerald-200 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-emerald-500/30 rounded-lg text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            >
              <option value="">جميع الفئات</option>
              {categories.map((cat: any) => (
                <option key={cat?.id} value={cat?.id} className="bg-gray-800">
                  {cat?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4 text-emerald-300">
            عرض {filteredProducts.length} من {products.length} منتج
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-12 border border-emerald-500/30 shadow-2xl text-center">
            <Package className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <p className="text-emerald-200 text-xl">لا توجد منتجات متاحة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-black/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl hover:border-emerald-400/50 transition-all duration-300 group"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].startsWith('http') ? product.images[0] : `/uploads/products/${product.images[0]}`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-20 h-20 text-emerald-400/50" />
                    </div>
                  )}
                  {product.category && (
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-emerald-500/80 backdrop-blur-sm text-white text-sm rounded-full flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {product.category.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-emerald-400" />
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                        {product.priceAfterDiscount || product.basePrice} دج
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

                  {/* Marketing Content */}
                  {product.marketingTitle && (
                    <div className="mb-4 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      <p className="text-sm text-emerald-200 font-medium mb-1">العنوان التسويقي:</p>
                      <p className="text-white text-sm line-clamp-2">{product.marketingTitle}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-2">
                    <Link
                      href={`/dashboard/create-order?productId=${product.id}`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/50"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      إنشاء طلبية
                    </Link>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => copyText(product.marketingTitle || product.name, 'title', product.id)}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                          copiedId === `${product.id}-title`
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : 'bg-white/10 text-white border border-emerald-500/30 hover:bg-emerald-500/20'
                        }`}
                      >
                        {copiedId === `${product.id}-title` ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        {copiedId === `${product.id}-title` ? 'تم!' : 'نسخ'}
                      </button>

                      <button
                        onClick={() => shareProduct(product)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-white/10 text-white border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-all duration-300 font-medium"
                      >
                        <Share2 className="w-4 h-4" />
                        مشاركة
                      </button>
                    </div>

                    {product.marketingDescription && (
                      <button
                        onClick={() => copyText(product.marketingDescription, 'desc', product.id)}
                        className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                          copiedId === `${product.id}-desc`
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : 'bg-white/10 text-white border border-emerald-500/30 hover:bg-emerald-500/20'
                        }`}
                      >
                        {copiedId === `${product.id}-desc` ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            تم نسخ الوصف!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            نسخ الوصف التسويقي
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Options */}
                  {product.options && product.options.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-emerald-500/20">
                      <p className="text-emerald-300 font-semibold mb-2 text-sm">الخيارات المتاحة:</p>
                      {product.options.map((option: any) => (
                        <div key={option.id} className="mb-2 text-sm">
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
