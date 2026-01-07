'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Package, DollarSign, Tag, Upload, Plus, ArrowLeft, Save } from 'lucide-react'

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '',
    description: ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/marketer/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: formData.name,
          price: formData.price,
          categoryId: formData.categoryId,
          description: formData.description
        }),
      })

      if (response.ok) {
        setMessage('✅ تم إضافة المنتج بنجاح!')
        setFormData({ name: '', price: '', categoryId: '', description: '' })
        setTimeout(() => {
          router.push('/dashboard/products')
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
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <button
              onClick={() => router.back()}
              className='flex items-center text-gray-600 hover:text-gray-900 transition-colors'
            >
              <ArrowLeft className='h-5 w-5 ml-2' />
              العودة
            </button>
            <h1 className='text-xl font-semibold text-gray-900'>إضافة منتج جديد</h1>
            <div className='w-20'></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
        {/* Message */}
        {message && (
          <div className={'mb-6 p-4 rounded-lg border ' + (message.includes('✅') 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
          )}>
            {message}
          </div>
        )}

        {/* Form Card */}
        <div className='bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden'>
          {/* Card Header */}
          <div className='bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6'>
            <div className='flex items-center'>
              <Package className='h-8 w-8 text-white mr-3' />
              <div>
                <h2 className='text-2xl font-bold text-white'>معلومات المنتج</h2>
                <p className='text-indigo-100 text-sm'>أدخل معلومات المنتج الجديد</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='p-8 space-y-8'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {/* Left Column */}
              <div className='space-y-6'>
                {/* Product Name */}
                <div>
                  <label className='flex items-center text-sm font-semibold text-gray-700 mb-2'>
                    <Package className='h-4 w-4 ml-2 text-indigo-600' />
                    اسم المنتج
                  </label>
                  <input
                    type='text'
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
                    placeholder='أدخل اسم المنتج'
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label className='flex items-center text-sm font-semibold text-gray-700 mb-2'>
                    <DollarSign className='h-4 w-4 ml-2 text-green-600' />
                    السعر (دج)
                  </label>
                  <input
                    type='number'
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all'
                    placeholder='0.00'
                    step='0.01'
                    min='0'
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className='flex items-center text-sm font-semibold text-gray-700 mb-2'>
                    <Tag className='h-4 w-4 ml-2 text-purple-600' />
                    الفئة
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all'
                    required
                  >
                    <option value=''>اختر الفئة</option>
                    {categories.map((category: any) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className='space-y-6'>
                {/* Description */}
                <div>
                  <label className='flex items-center text-sm font-semibold text-gray-700 mb-2'>
                    <Package className='h-4 w-4 ml-2 text-blue-600' />
                    الوصف
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-32 resize-none'
                    placeholder='أدخل وصف المنتج...'
                  />
                </div>

                {/* Stats Card */}
                <div className='bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4'>معلومات سريعة</h3>
                  <div className='space-y-3'>
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-600'>الحالة:</span>
                      <span className='px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium'>نشط</span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-600'>المشاهدات:</span>
                      <span className='font-semibold text-gray-800'>0</span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-600'>المبيعات:</span>
                      <span className='font-semibold text-gray-800'>0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className='flex justify-center pt-6'>
              <button
                type='submit'
                disabled={loading}
                className='flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105'
              >
                {loading ? (
                  <>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2'></div>
                    جاري الإضافة...
                  </>
                ) : (
                  <>
                    <Save className='h-5 w-5 ml-2' />
                    حفظ المنتج
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
