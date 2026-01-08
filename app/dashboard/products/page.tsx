'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Filter, Copy, Share2, Download, Package, Tag, DollarSign, Star, TrendingUp, Eye, Heart, ShoppingCart, Sparkles, Zap, Shield } from 'lucide-react'

export default function MarketerProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        console.log('Products data:', data)
        console.log('Number of products:', data.length)
        
        if (data.error) {
          console.error('API Error:', data.error)
          setProducts([])
        } else {
          setProducts(data.filter((p: any) => p.isActive))
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching products:', error)
        setProducts([])
        setLoading(false)
      })
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
    const matchesCategory = !selectedCategory || product.category?.id === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <p className="mt-6 text-purple-200 text-lg font-medium animate-pulse">جاري تحميل المنتجات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-2xl">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              المنتجات
            </h1>
          </div>
          <p className="text-purple-200 text-lg">اكتشف أفضل المنتجات للتسويق</p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ابحث عن منتج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div className="relative">
                <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none pr-12 pl-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 cursor-pointer"
                >
                  <option value="">جميع الفئات</option>
                  {categories.map((category: any) => (
                    <option key={category.id} value={category.id} className="bg-gray-800">
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6">
                <Package className="w-10 h-10 text-purple-300" />
              </div>
              <h3 className="text-2xl font-semibold text-purple-200 mb-2">لا توجد منتجات</h3>
              <p className="text-purple-300">لم يتم العثور على منتجات تطابق بحثك</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/dashboard/products/${product.id}`}
                  className="group"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-purple-500/25 hover:border-purple-400/50">
                    {/* Product Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded-full shadow-lg">
                        {product.category?.name}
                      </span>
                    </div>

                    {/* Hover Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10`}>
                      <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            copyText(product.marketingTitle || product.name, 'title', product.id)
                          }}
                          className="flex-1 bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-white/30 transition-colors duration-200"
                        >
                          {copiedId === `${product.id}-title` ? (
                            <div className="flex items-center justify-center">
                              <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                            </div>
                          ) : (
                            <Copy className="w-4 h-4 mx-auto" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            shareProduct(product)
                          }}
                          className="flex-1 bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-white/30 transition-colors duration-200"
                        >
                          <Share2 className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    </div>

                    {/* Product Image */}
                    <div className="relative h-56 overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%2310b981'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='12'%3Eلا توجد صورة%3C/text%3E%3C/svg%3E`;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                          <Package className="w-16 h-16 text-purple-300/50" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-200 transition-colors duration-300">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-purple-400" />
                          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            {product.priceAfterDiscount || product.basePrice} دج
                          </span>
                        </div>
                        {product.commission && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-lg">
                            <TrendingUp className="w-3 h-3 text-green-400" />
                            <span className="text-xs text-green-400 font-semibold">{product.commission}%</span>
                          </div>
                        )}
                      </div>

                      {/* Marketing Content Preview */}
                      <div className="space-y-2">
                        <p className="text-purple-200 text-sm line-clamp-2">
                          {product.marketingTitle}
                        </p>
                        <p className="text-purple-300 text-xs line-clamp-2">
                          {product.marketingDescription}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            copyText(product.marketingTitle || product.name, 'title', product.id)
                          }}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                            copiedId === `${product.id}-title`
                              ? 'bg-green-500 text-white'
                              : 'bg-white/10 text-purple-200 hover:bg-white/20'
                          }`}
                        >
                          {copiedId === `${product.id}-title` ? (
                            <>
                              <div className="w-4 h-4 bg-white rounded-full"></div>
                              <span>تم النسخ</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>نسخ</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            shareProduct(product)
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-purple-200 rounded-xl hover:bg-white/20 transition-all duration-200"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>مشاركة</span>
                        </button>
                      </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
