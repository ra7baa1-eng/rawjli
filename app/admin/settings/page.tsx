'use client'

import { useEffect, useState } from 'react'
import { Settings, Bell, Shield, Database, Palette, Globe, Save, Upload, DollarSign } from 'lucide-react'

export default function AdminSettings() {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    siteName: 'روجلي',
    siteDescription: 'منصة التسويق بالعمولة',
    contactEmail: 'contact@rojli.com',
    supportPhone: '+213 555 123 456',
    commissionRate: 10,
    minWithdrawal: 1000,
    enableNotifications: true,
    enableRegistration: true,
    maintenanceMode: false
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      // Mock data - replace with actual API call
      setSettings({
        siteName: 'روجلي',
        siteDescription: 'منصة التسويق بالعمولة',
        contactEmail: 'contact@rojli.com',
        supportPhone: '+213 555 123 456',
        commissionRate: 10,
        minWithdrawal: 1000,
        enableNotifications: true,
        enableRegistration: true,
        maintenanceMode: false
      })
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const saveSettings = async () => {
    setLoading(true)
    try {
      // Mock save - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('تم حفظ الإعدادات بنجاح!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('فشل في حفظ الإعدادات')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="h-8 w-8 ml-3 text-blue-600" />
            إعدادات النظام
          </h1>
          <p className="text-gray-600 mt-2">إدارة إعدادات المنصة العامة</p>
        </div>

        <div className="space-y-8">
          {/* General Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Globe className="h-6 w-6 ml-2 text-blue-600" />
              الإعدادات العامة
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الموقع
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني للتواصل
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  هاتف الدعم
                </label>
                <input
                  type="tel"
                  value={settings.supportPhone}
                  onChange={(e) => handleInputChange('supportPhone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الموقع
                </label>
                <input
                  type="text"
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Commission Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <DollarSign className="h-6 w-6 ml-2 text-green-600" />
              إعدادات العمولات
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نسبة العمولة الافتراضية (%)
                </label>
                <input
                  type="number"
                  value={settings.commissionRate}
                  onChange={(e) => handleInputChange('commissionRate', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحد الأدنى للسحب (دج)
                </label>
                <input
                  type="number"
                  value={settings.minWithdrawal}
                  onChange={(e) => handleInputChange('minWithdrawal', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Shield className="h-6 w-6 ml-2 text-purple-600" />
              إعدادات النظام
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-gray-400 ml-3" />
                  <div>
                    <p className="font-medium text-gray-900">تفعيل الإشعارات</p>
                    <p className="text-sm text-gray-500">إرسال إشعارات للمستخدمين</p>
                  </div>
                </div>
                <button
                  onClick={() => handleInputChange('enableNotifications', !settings.enableNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.enableNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.enableNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <Upload className="h-5 w-5 text-gray-400 ml-3" />
                  <div>
                    <p className="font-medium text-gray-900">تفعيل التسجيل</p>
                    <p className="text-sm text-gray-500">السماح للمستخدمين الجدد بالتسجيل</p>
                  </div>
                </div>
                <button
                  onClick={() => handleInputChange('enableRegistration', !settings.enableRegistration)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.enableRegistration ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.enableRegistration ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <Database className="h-5 w-5 text-gray-400 ml-3" />
                  <div>
                    <p className="font-medium text-gray-900">وضع الصيانة</p>
                    <p className="text-sm text-gray-500">إيقاف الموقع مؤقتاً للصيانة</p>
                  </div>
                </div>
                <button
                  onClick={() => handleInputChange('maintenanceMode', !settings.maintenanceMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center pt-6">
            <button
              onClick={saveSettings}
              disabled={loading}
              className="flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 ml-2" />
                  حفظ الإعدادات
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
