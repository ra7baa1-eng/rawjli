'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Upload, X, Copy, Plus, ArrowRight, Package, Tag, DollarSign, Box, FileText, Image as ImageIcon } from 'lucide-react'

interface Category {
  id: string
  name: string
  _count?: {
    products: number
  }
}

interface FormData {
  productName: string
  categoryId: string
  price: string
  quantity: string
  commission: string
  marketingTitle: string
  marketingDescription: string
  description: string
}

export default function AddProductPage() {
  const router = useRouter()
  const sessionData = useSession()
  const session = sessionData?.data
  const status = sessionData?.status
  const [formData, setFormData] = useState<FormData>({
    productName: '',
    categoryId: '',
    price: '',
    quantity: '',
    commission: '10',
    marketingTitle: '',
    marketingDescription: '',
    description: ''
  })
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [dragActive, setDragActive] = useState(false)

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories...')
        const res = await fetch('/api/categories')
        console.log('Categories response status:', res.status)
        if (res.ok) {
          const data = await res.json()
          console.log('Categories data:', data)
          setCategories(data)
        } else {
          console.error('Failed to fetch categories:', res.status)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }

    // Only fetch if user is authenticated
    if (status === 'authenticated' && session?.user?.id) {
      fetchCategories()
    }
  }, [status, session?.user?.id])

  const handleImageUpload = useCallback((files: FileList | null) => {
    if (!files) return
    const fileArray = Array.from(files).filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
    )
    setUploadedImages(prev => [...prev, ...fileArray])
  }, [])

  const removeImage = useCallback((index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }, [])

  const copyToClipboard = useCallback(async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setSuccess(`تم نسخ ${type} بنجاح!`)
      setTimeout(() => setSuccess(''), 2000)
    } catch (err) {
      setError('فشل في النسخ')
      setTimeout(() => setError(''), 2000)
    }
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleImageUpload(e.dataTransfer.files)
  }, [handleImageUpload])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    console.log('Form data:', formData)
    console.log('Session status:', status)
    console.log('Session user:', session?.user)

    if (!formData.productName || !formData.price || !formData.quantity || !formData.categoryId) {
      setError('الرجاء ملء جميع الحقول المطلوبة (اسم المنتج، الفئة، السعر، والكمية)')
      setLoading(false)
      return
    }

    if (!session?.user?.id) {
      setError('يجب تسجيل الدخول أولاً')
      setLoading(false)
      return
    }

    try {
      const productFormData = new FormData()
      productFormData.append('productName', formData.productName)
      productFormData.append('categoryId', formData.categoryId)
      productFormData.append('price', formData.price)
      productFormData.append('quantity', formData.quantity)
      productFormData.append('commission', formData.commission)
      productFormData.append('marketingTitle', formData.marketingTitle)
      productFormData.append('marketingDescription', formData.marketingDescription)
      productFormData.append('description', formData.description)
      productFormData.append('marketerId', session.user.id)

      uploadedImages.forEach((image, index) => {
        productFormData.append(`image${index}`, image)
      })

      console.log('Submitting to API...')
      const res = await fetch('/api/marketer/products', {
        method: 'POST',
        body: productFormData
      })

      console.log('API response status:', res.status)

      if (res.ok) {
        const data = await res.json()
        console.log('Product created:', data)
        setSuccess('تم إضافة المنتج بنجاح!')
        setFormData({
          productName: '',
          categoryId: '',
          price: '',
          quantity: '',
          commission: '10',
          marketingTitle: '',
          marketingDescription: '',
          description: ''
        })
        setUploadedImages([])
        setTimeout(() => {
          router.push('/dashboard/products')
        }, 2000)
      } else {
        const errorData = await res.json()
        console.error('API error:', errorData)
        setError(errorData.message || 'فشل في إضافة المنتج')
      }
    } catch (error) {
      console.error('Submit error:', error)
      setError('حدث خطأ ما. الرجاء المحاولة مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl">جاري التحميل...</div>
      </div>
    )
  }

  // Show unauthenticated state
  if (status === 'unauthenticated' || !session?.user?.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl">يجب تسجيل الدخول أولاً</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">إضافة منتج جديد</h1>
          <p className="text-white/80">أضف منتجاً جديداً إلى متجرك</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Package className="ml-2 h-5 w-5" />
              المعلومات الأساسية
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 mb-2">اسم المنتج *</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                  placeholder="أدخل اسم المنتج"
                  required
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2">الفئة *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
                  required
                >
                  <option value="">اختر الفئة</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/80 mb-2">السعر *</label>
                <div className="relative">
                  <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-2 pr-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-2">الكمية *</label>
                <div className="relative">
                  <Box className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    className="w-full px-4 py-2 pr-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Marketing Information */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Tag className="ml-2 h-5 w-5" />
              المعلومات التسويقية
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white/80 mb-2">العنوان التسويقي</label>
                <input
                  type="text"
                  value={formData.marketingTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, marketingTitle: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                  placeholder="عنوان جذاب للمنتج"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(formData.marketingTitle || formData.productName, 'العنوان التسويقي')}
                  className="mt-2 px-3 py-1 bg-white/10 hover:bg-white/20 text-white/80 text-sm rounded-lg transition-colors flex items-center"
                >
                  <Copy className="ml-1 h-3 w-3" />
                  نسخ العنوان
                </button>
              </div>

              <div>
                <label className="block text-white/80 mb-2">الوصف التسويقي</label>
                <textarea
                  value={formData.marketingDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, marketingDescription: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 h-24 resize-none"
                  placeholder="وصف جذاب ومختصر للمنتج"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(formData.marketingDescription || formData.description, 'الوصف التسويقي')}
                  className="mt-2 px-3 py-1 bg-white/10 hover:bg-white/20 text-white/80 text-sm rounded-lg transition-colors flex items-center"
                >
                  <Copy className="ml-1 h-3 w-3" />
                  نسخ الوصف
                </button>
              </div>

              <div>
                <label className="block text-white/80 mb-2">الوصف الكامل</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 h-32 resize-none"
                  placeholder="الوصف التفصيلي للمنتج"
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2">عمولة المسوق (%)</label>
                <input
                  type="number"
                  value={formData.commission}
                  onChange={(e) => setFormData(prev => ({ ...prev, commission: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                  placeholder="10"
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <ImageIcon className="ml-2 h-5 w-5" />
              الصور
            </h2>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-white/60 bg-white/5' : 'border-white/40 hover:border-white/60'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-white/60 mx-auto mb-4" />
                <p className="text-white/80 mb-2">اسحب وأفلت الصور هنا أو انقر للاختيار</p>
                <p className="text-white/60 text-sm">PNG, JPG, GIF حتى 10MB للصورة الواحدة</p>
              </label>
            </div>

            {uploadedImages.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة المنتج
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
