'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Upload, X, Copy, Package, Tag, DollarSign, Box, FileText, ArrowLeft, FolderOpen, Image as ImageIcon } from 'lucide-react'

export default function NewProduct() {
  const router = useRouter()
  const session = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
  })
  const [categories, setCategories] = useState([])

  useEffect(() => {
    // Fetch categories from API
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data)
      })
      .catch(() => {
        // Fallback to mock categories
        setCategories([
          { id: '1', name: 'إلكترونيات' },
          { id: '2', name: 'ملابس' },
          { id: '3', name: 'أثاث' },
          { id: '4', name: 'مستحضرات تجميل' },
          { id: '5', name: 'أطعمة' },
          { id: '6', name: 'رياضة' }
        ])
      })
  }, [])

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
    if (!session.data) {
      setError('يجب تسجيل الدخول لإضافة منتج')
      return
    }

    // Validate marketing description length
    if (formData.description && formData.description.length > 10000) {
      setError('الوصف التسويقي طويل جداً. الحد الأقصى هو 10000 حرف.')
      return
    }

    if (!formData.name || !formData.price || !formData.stock) {
      setError('الرجاء ملء الحقول المطلوبة')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const productFormData = new FormData()
      productFormData.append('name', formData.name)
      productFormData.append('title', formData.title)
      productFormData.append('description', formData.description)
      productFormData.append('price', formData.price)
      productFormData.append('stock', formData.stock)
      productFormData.append('categoryId', formData.categoryId)

      uploadedImages.forEach((image) => {
        productFormData.append(`images`, image)
      })

      const res = await fetch('/api/products', {
        method: 'POST',
        body: productFormData,
      })

      if (res.ok) {
        setSuccess('تم إضافة المنتج بنجاح!')
        setFormData({
          name: '',
          title: '',
          description: '',
          price: '',
          stock: '',
          categoryId: '',
        })
        setUploadedImages([])
        
        setTimeout(() => {
          router.push('/admin/products')
        }, 2000)
      } else {
        const errorData = await res.json()
        setError(errorData.error || 'فشل في إضافة المنتج')
      }
    } catch (error) {
      console.error('Frontend error:', error)
      setError('حدث خطأ أثناء إضافة المنتج')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin')}
              className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              إضافة منتج جديد
            </h1>
          </div>
          <button
            onClick={() => router.push('/admin/products')}
            className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-300"
          >
            العودة للمنتجات
          </button>
        </div>

        {/* Messages */}
        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg mb-6 animate-pulse">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 animate-pulse">
            {error}
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-gray-500/30 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Product Name Section */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">اسم المنتج</h2>
              </div>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="أدخل اسم المنتج..."
              />
            </div>

            {/* Marketing Title Section */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">العنوان التسويقي</h2>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(formData.title, 'العنوان التسويقي')}
                  className="px-4 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all duration-300 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  نسخ
                </button>
              </div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="أدخل عنواناً تسويقياً جذاباً..."
              />
            </div>

            {/* Category Section */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">الفئة</h2>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/admin/categories')}
                  className="px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-all duration-300 flex items-center gap-2"
                >
                  <FolderOpen className="w-4 h-4" />
                  إدارة الفئات
                </button>
              </div>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                <option value="" className="bg-gray-800">اختر الفئة</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id} className="bg-gray-800">
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price and Stock Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">السعر (دج)</h2>
                </div>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="0.00"
                />
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Box className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">الكمية</h2>
                </div>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">الوصف التسويقي</h2>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(formData.description, 'الوصف التسويقي')}
                  className="px-4 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all duration-300 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  نسخ الوصف
                </button>
              </div>
              <div className="relative">
                <textarea
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  placeholder="أدخل وصفاً تسويقياً مفصلاً..."
                />
                <div className="absolute bottom-2 left-2 text-xs text-gray-400">
                  {formData.description.length}/10000 حرف
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Upload className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">صور المنتج</h2>
              </div>
              
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-gray-500/30 hover:border-gray-500/50'
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
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex flex-col items-center gap-3"
                >
                  <ImageIcon className="w-12 h-12 text-blue-400" />
                  <span className="text-white font-medium">اختر الصور أو اسحبها هنا</span>
                  <span className="text-gray-400 text-sm">PNG, JPG, GIF حتى 10MB لكل صورة</span>
                  <span className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    اختيار الصور
                  </span>
                </label>
              </div>

              {/* Uploaded Images Preview */}
              {uploadedImages.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-white font-medium mb-4">الصور المرفوعة ({uploadedImages.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border border-gray-500/30">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <p className="text-xs text-gray-400 mt-2 truncate">{image.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? 'جاري الإضافة...' : 'إضافة المنتج'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/products')}
                className="px-8 py-4 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-all duration-300 text-lg"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
