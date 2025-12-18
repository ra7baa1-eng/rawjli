'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

 return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-500 rounded-full opacity-20 blur-xl animate-ping"></div>
        <div className="absolute top-1/4 right-1/4 w-36 h-36 bg-yellow-500 rounded-full opacity-20 blur-xl animate-bounce"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Main Content */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo and Title */}
          <div className="mb-12">
            <div className="inline-block">
              <img src="/003.gif" alt="Rawjli Animation" className="w-64 h-64 mx-auto animate-pulse" />
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-purple-500 mt-6 animate-pulse">
                راولي
              </h1>
            </div>
            <p className="text-2xl text-pink-300 mt-4 animate-pulse">
              منصة التجارة الإلكترونية الجزائرية الاحترافية
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Login Card */}
            <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-8 border border-pink-500/30 shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-pink-500/50">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 mb-4">
                  تسجيل الدخول
                </h3>
                <p className="text-pink-300 mb-6">
                  سجل دخولك للوصول إلى حسابك
                </p>
                <Link 
                  href="/login"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-blue-600 transform transition-all duration-300 hover:scale-110"
                >
                  دخول الآن
                </Link>
              </div>
            </div>

            {/* Register Card */}
            <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-8 border border-blue-500/30 shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-blue-500/50">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
                  حساب جديد
                </h3>
                <p className="text-blue-300 mb-6">
                  انضم إلينا كمسوق جديد
                </p>
                <Link 
                  href="/register"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-600 transform transition-all duration-300 hover:scale-110"
                >
                  إنشاء حساب
                </Link>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-pink-500/20 transform hover:scale-105 transition-all duration-300">
              <div className="text-pink-400 text-4xl mb-4">🚀</div>
              <h4 className="text-xl font-bold text-pink-300 mb-2">سريع وآمن</h4>
              <p className="text-pink-200">منصة متطورة بأحدث التقنيات</p>
            </div>
            <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20 transform hover:scale-105 transition-all duration-300">
              <div className="text-blue-400 text-4xl mb-4">💎</div>
              <h4 className="text-xl font-bold text-blue-300 mb-2">مميزات احترافية</h4>
              <p className="text-blue-200">أدوات متكاملة للمسوقين</p>
            </div>
            <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 transform hover:scale-105 transition-all duration-300">
              <div className="text-purple-400 text-4xl mb-4">🎯</div>
              <h4 className="text-xl font-bold text-purple-300 mb-2">دعم فوري</h4>
              <p className="text-purple-200">فريق دعم متخصص جاهز للمساعدة</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 text-center py-6">
          <p className="text-pink-300 text-lg animate-pulse">
            تم التطوير من طرف ڨروب المتمكنين
          </p>
        </div>
      </div>
    </div>
  )
}
