'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Register() {
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
      const res = await fetch('/api/users', {
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
          role: 'MARKETER',
        }),
      })

      const data = await res.json()

      if (res.ok) {
        alert('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.')
        router.push('/login')
      } else {
        setError(data.error || 'فشل في إنشاء الحساب')
      }
    } catch (error) {
      setError('حدث خطأ ما. يرجى المحاولة مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
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
              راولي
            </h1>
          </div>
        </div>

        {/* Registration Card */}
        <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-8 border border-pink-500/30 shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">
            إنشاء حساب مسوق جديد
          </h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-xl mb-6 text-center animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label className="text-pink-300 font-semibold block">الاسم</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-xl text-white placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="أدخل اسمك"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="text-pink-300 font-semibold block">اللقب</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-xl text-white placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="أدخل لقبك"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-pink-300 font-semibold block">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-xl text-white placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="example@email.com"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-pink-300 font-semibold block">رقم الهاتف</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-xl text-white placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="05xxxxxxxx"
                  required
                />
              </div>

              {/* Baridi Mob */}
              <div className="space-y-2">
                <label className="text-pink-300 font-semibold block">رقم باريدي موب</label>
                <input
                  type="text"
                  value={formData.baridiMobNumber}
                  onChange={(e) => setFormData({ ...formData, baridiMobNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-xl text-white placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="رقم حساب باريدي موب"
                />
              </div>

              {/* CCP */}
              <div className="space-y-2">
                <label className="text-pink-300 font-semibold block">رقم الحساب البريدي (CCP)</label>
                <input
                  type="text"
                  value={formData.ccpNumber}
                  onChange={(e) => setFormData({ ...formData, ccpNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-xl text-white placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="رقم CCP"
                />
              </div>

              {/* Phone for Credit */}
              <div className="space-y-2">
                <label className="text-pink-300 font-semibold block">رقم الهاتف للشحن</label>
                <input
                  type="tel"
                  value={formData.phoneForCredit}
                  onChange={(e) => setFormData({ ...formData, phoneForCredit: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-xl text-white placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="رقم الهاتف لشحن الرصيد"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-pink-300 font-semibold block">كلمة المرور</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-xl text-white placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="أدخل كلمة المرور"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-pink-300 font-semibold block">تأكيد كلمة المرور</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-xl text-white placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="أعد إدخال كلمة المرور"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                  جاري إنشاء الحساب...
                </div>
              ) : (
                'إنشاء حساب جديد'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-8">
            <p className="text-pink-300">
              لديك حساب بالفعل؟{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold underline transition-colors duration-300">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-pink-300 text-sm">
          <p>تم التطوير من طرف ڨروب المتمكنين</p>
        </div>
      </div>
    </div>
  )
}
