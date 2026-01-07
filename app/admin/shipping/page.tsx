'use client'

import { useEffect, useState } from 'react'
import { Truck, Edit2, Save, Search } from 'lucide-react'

export default function AdminShipping() {
  const [shippingPrices, setShippingPrices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetch('/api/shipping')
      .then((res) => res.json())
      .then((data) => {
        setShippingPrices(data?.data || data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const updatePrice = async (wilayaCode: string, price: number) => {
    try {
      const response = await fetch('/api/shipping', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wilayaCode, price }),
      })
      
      if (response.ok) {
        setEditingId(null)
        // Refresh data
        fetch('/api/shipping')
          .then((res) => res.json())
          .then((data) => {
            setShippingPrices(data?.data || data || [])
          })
      }
    } catch (error) {
      console.error('Error updating price:', error)
    }
  }

  const filteredPrices = shippingPrices.filter(sp => 
    sp.wilaya?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Truck className="h-8 w-8 ml-3 text-blue-600" />
            أسعار التوصيل
          </h1>
          <p className="text-gray-600 mt-2">إدارة أسعار التوصيل حسب الولايات</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="البحث عن ولاية..."
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الولاية</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">السعر (دج)</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPrices.map((sp) => (
                  <tr key={sp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {sp.wilaya?.name || 'غير محدد'}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === sp.id ? (
                        <input
                          type="number"
                          defaultValue={sp.price}
                          className="w-32 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          id={`price-${sp.wilayaCode}`}
                          step="0.01"
                          min="0"
                        />
                      ) : (
                        <span className="text-gray-900 font-medium">{sp.price} دج</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === sp.id ? (
                        <div className="flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => {
                              const input = document.getElementById(
                                `price-${sp.wilayaCode}`
                              ) as HTMLInputElement
                              updatePrice(sp.wilayaCode, parseFloat(input.value))
                            }}
                            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Save className="h-4 w-4 ml-1" />
                            حفظ
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            إلغاء
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingId(sp.id)}
                          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Edit2 className="h-4 w-4 ml-1" />
                          تعديل
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredPrices.length === 0 && (
            <div className="text-center py-12">
              <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'لم يتم العثور على ولايات مطابقة' : 'لا توجد أسعار توصيل حالياً'}
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">إجمالي الولايات</p>
                <p className="text-2xl font-bold text-gray-900">{shippingPrices.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Save className="h-6 w-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">متوسط السعر</p>
                <p className="text-2xl font-bold text-gray-900">
                  {shippingPrices.length > 0 
                    ? Math.round(shippingPrices.reduce((acc, sp) => acc + sp.price, 0) / shippingPrices.length)
                    : 0} دج
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Edit2 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">آخر تحديث</p>
                <p className="text-2xl font-bold text-gray-900">الآن</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
