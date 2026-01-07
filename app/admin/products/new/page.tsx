'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Package, DollarSign, Tag, Save, Upload, Image as ImageIcon, X } from 'lucide-react'

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [categories, setCategories] = useState([])
  const [images, setImages] = useState<File[]>([])
  const [formData, setFormData] = useState({
    productName: '',
    basePrice: '',
    categoryId: '',
    description: '',
    marketingTitle: '',
    marketingDescription: '',
    quantity: '',
    weight: '',
    dimensions: ''
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data?.data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(prev => [...prev, ...files].slice(0, 5)) // Max 5 images
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const formDataToSend = new FormData()
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value)
      })

      // Add images
      images.forEach((image, index) => {
        formDataToSend.append(`image${index}`, image)
      })

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        setMessage('✅ تم إضافة المنتج بنجاح!')
        setFormData({
          productName: '',
          basePrice: '',
          categoryId: '',
          description: '',
          marketingTitle: '',
          marketingDescription: '',
          quantity: '',
          weight: '',
          dimensions: ''
        })
        setImages([])
        setTimeout(() => {
          router.push('/admin/products')
        }, 2000)
      } else {
        const error = await response.json()
        setMessage('❌ ' + (error.error || 'فشل في إضافة المنتج'))
      }
    } catch (error) {
      setMessage('❌ حدث خطأ ما')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">إضافة منتج جديد</h1>
          <p className="text-gray-600 mt-2">أدخل معلومات المنتج الجديد بالكامل</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.includes('✅') 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Package className="h-6 w-6 ml-2 text-blue-600" />
              المعلومات الأساسية
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المنتج *
                </label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل اسم المنتج"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السعر الأساسي (دج) *
                </label>
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الفئة *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">اختر الفئة</option>
                  {categories.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الكمية في المخزون
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوصف *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
                placeholder="أدخل وصف المنتج..."
                required
              />
            </div>
          </div>

          {/* Marketing Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Tag className="h-6 w-6 ml-2 text-purple-600" />
              معلومات تسويقية
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان التسويقي
                </label>
                <input
                  type="text"
                  value={formData.marketingTitle}
                  onChange={(e) => setFormData({...formData, marketingTitle: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="أدخل عنواناً تسويقياً جذاباً"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف التسويقي
                </label>
                <textarea
                  value={formData.marketingDescription}
                  onChange={(e) => setFormData({...formData, marketingDescription: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-32 resize-none"
                  placeholder="أدخل وصفاً تسويقياً مفصلاً"
                />
              </div>
            </div>
          </div>

          {/* Physical Attributes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Package className="h-6 w-6 ml-2 text-green-600" />
              المواصفات الفيزيائية
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوزن (كجم)
                </label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الأبعاد (طول × عرض × ارتفاع)
                </label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="مثال: 20×15×5 سم"
                />
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <ImageIcon className="h-6 w-6 ml-2 text-indigo-600" />
              صور المنتج
            </h2>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>اختر الصور</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="mr-2">أو اسحبها هنا</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF حتى 10MB لكل صورة - الحد الأقصى 5 صور</p>
                </div>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
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
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 ml-2" />
                  حفظ المنتج
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
