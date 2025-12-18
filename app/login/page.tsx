'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      } else {
        const response = await fetch('/api/auth/session')
        const session = await response.json()
        
        if (session?.user?.role === 'ADMIN') {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-500 rounded-full opacity-20 blur-xl animate-ping"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block">
            <img src="/004.gif" alt="Rawjli Logo" className="w-32 h-32 mx-auto animate-bounce" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 mt-4">
              راولي
            </h1>
          </div>
        </div>
        <p className="mt-2 text-center text-lg text-purple-300">
          منصة التجارة الإلكترونية الجزائرية
        </p>
        
        <div className="card glow-effect">
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-pink-300 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-xl text-white placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="البريد الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-pink-300 mb-2">
                  كلمة المرور
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-pink-500/30 rounded-xl text-white placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-center text-sm bg-red-900/20 p-3 rounded-lg border border-red-500/30">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full text-lg py-3"
              >
                {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
              </button>
            </div>
          </form>
        {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-pink-300">
              ليس لديك حساب؟{' '}
              <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold underline transition-colors duration-300">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
