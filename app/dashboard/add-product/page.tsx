'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function MarketerAddProduct() {
  const router = useRouter()
  const session = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [formData, setFormData] = useState({
    productName: '',
    categoryId: '',
    price: '',
    quantity: '',
    productDescription: '',
    commission: ''
  })
  const [categories, setCategories] = useState([
    { id: '1', name: 'إلكترونيات' },
    { id: '2', name: 'ملابس' },
    { id: '3', name: 'أثاث' },
    { id: '4', name: 'مستحضرات تجميل' },
    { id: '5', name: 'أطعمة' },
    { id: '6', name: 'رياضة' }
  ])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedImages(prev => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    alert(`تم نسخ ${type} بنجاح!`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!formData.productName || !formData.price || !formData.quantity) {
      setError('الرجاء ملء الحقول المطلوبة')
      setLoading(false)
      return
    }

    try {
      const productFormData = new FormData()
      productFormData.append('productName', formData.productName)
      productFormData.append('categoryId', formData.categoryId)
      productFormData.append('price', formData.price)
      productFormData.append('quantity', formData.quantity)
      productFormData.append('productDescription', formData.productDescription)
      productFormData.append('commission', formData.commission)
      productFormData.append('marketerId', session?.data?.user?.id || '')

      uploadedImages.forEach((image) => {
        productFormData.append(`images`, image)
      })

      const res = await fetch('/api/marketer/products', {
        method: 'POST',
        body: productFormData,
      })

      if (res.ok) {
        setSuccess('تم إضافة المنتج بنجاح!')
        setFormData({
          productName: '',
          categoryId: '',
          price: '',
          quantity: '',
          productDescription: '',
          commission: ''
        })
        setUploadedImages([])
        
        setTimeout(() => {
          router.push('/dashboard/products')
        }, 2000)
      } else {
        setError('فشل في إضافة المنتج')
      }
    } catch (error) {
      setError('حدث خطأ أثناء إضافة المنتج')
    } finally {
      setLoading(false)
    }
  }

  if (!session || session.status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl">جاري التحميل...</div>
      </div>
    )
  }

  if (!session.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl">يجب تسجيل الدخول أولاً</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
            إضافة منتج جديد
          </h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-all duration-300"
          >
            العودة
          </button>
        </div>

        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-8 border border-pink-500/30 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-pink-300 text-sm">اسم المنتج *</label>
                <button
                  type="button"
                  onClick={() => copyToClipboard(formData.productName, 'اسم المنتج')}
                  className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                >
                  نسخ العنوان
                </button>
              </div>
              <input
                type="text"
                required
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                placeholder="أدخل اسم المنتج"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-pink-300 text-sm">الفئة *</label>
                <button
                  type="button"
                  onClick={() => alert('إدارة الفئات قيد التطوير')}
                  className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-colors text-sm"
                >
                  إدارة الفئات
                </button>
              </div>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-lg text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
              >
                <option value="">اختر الفئة</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-pink-300 text-sm mb-2">السعر (دج) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-pink-300 text-sm mb-2">الكمية *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-pink-300 text-sm mb-2">عمولتك (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.commission}
                onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                placeholder="10.0"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-pink-300 text-sm">وصف المنتج</label>
                <button
                  type="button"
                  onClick={() => copyToClipboard(formData.productDescription, 'وصف المنتج')}
                  className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                >
                  نسخ الوصف
                </button>
              </div>
              <textarea
                rows={4}
                value={formData.productDescription}
                onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                placeholder="أدخل وصفاً مفصلاً للمنتج..."
              />
            </div>

            <div>
              <label className="block text-pink-300 text-sm mb-2">صور المنتج</label>
              <div className="border-2 border-dashed border-pink-500/30 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-block px-4 py-2 bg-pink-500/20 text-pink-300 border border-pink-500/30 rounded-lg hover:bg-pink-500/30 transition-colors"
                >
                  اختيار صور
                </label>
                <p className="text-gray-400 text-sm mt-2">أو اسحب وأفلت الصور هنا</p>
                <p className="text-gray-500 text-xs mt-1">PNG, JPG, GIF حتى 10MB</p>
              </div>

              {uploadedImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-pink-300 text-sm mb-2">الصور المرفوعة ({uploadedImages.length})</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-pink-500/30"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                        <p className="text-xs text-gray-400 mt-1 truncate">{image.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold rounded-lg hover:from-pink-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'جاري الإضافة...' : 'إضافة المنتج'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-all duration-300"
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
