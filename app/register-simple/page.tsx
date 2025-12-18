'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterSimple() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    baridiMobNumber: '',
    ccpNumber: '',
    phoneForCredit: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('كلمة المرور غير متطابقة')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/register-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          baridiMobNumber: formData.baridiMobNumber,
          ccpNumber: formData.ccpNumber,
          phoneForCredit: formData.phoneForCredit,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        alert('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.')
        router.push('/login-simple')
      } else {
        setError(data.error || 'فشل في إنشاء الحساب')
      }
    } catch (error) {
      setError('حدث خطأ ما. الرجاء المحاولة مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-500 rounded-full opacity-20 blur-xl animate-ping"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <img src="/004.gif" alt="Rawjli Logo" className="w-32 h-32 mx-auto animate-bounce" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 mt-4">
              روجلي
            </h1>
          </div>
        </div>

        {/* Registration Card */}
        <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-8 border border-pink-500/30 shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
            إنشاء حساب مسوق جديد
          </h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-pink-300 text-sm mb-2">الاسم الأول</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-pink-300 text-sm mb-2">الاسم الأخير</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-pink-300 text-sm mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-pink-300 text-sm mb-2">رقم الهاتف</label>
              <input
                type="tel"
                className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-pink-300 text-sm mb-2">رقم باريد موب</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  value={formData.baridiMobNumber}
                  onChange={(e) => setFormData({ ...formData, baridiMobNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-pink-300 text-sm mb-2">رقم CCP</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  value={formData.ccpNumber}
                  onChange={(e) => setFormData({ ...formData, ccpNumber: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-pink-300 text-sm mb-2">رقم الهاتف للشحن</label>
              <input
                type="tel"
                className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                value={formData.phoneForCredit}
                onChange={(e) => setFormData({ ...formData, phoneForCredit: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-pink-300 text-sm mb-2">كلمة المرور</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-pink-300 text-sm mb-2">تأكيد كلمة المرور</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold rounded-lg hover:from-pink-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-300">
              لديك حساب بالفعل؟{' '}
              <Link href="/login-simple" className="text-pink-400 hover:text-pink-300">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
