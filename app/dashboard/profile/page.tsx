'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function MarketerProfile() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    baridiMobNumber: '',
    ccpNumber: '',
    phoneForCredit: '',
    password: '',
  })

  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await fetch('/api/auth/session')
        const sessionData = await response.json()
        
        if (!sessionData || sessionData.error) {
          router.push('/login')
          return
        }
        
        setSession(sessionData)
        
        if (sessionData?.user?.id) {
          fetch(`/api/users/${sessionData.user.id}`)
            .then((res) => {
              if (!res.ok) throw new Error('Failed to fetch user')
              return res.json()
            })
            .then((data) => {
              setFormData({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                phone: data.phone || '',
                baridiMobNumber: data.baridiMobNumber || '',
                ccpNumber: data.ccpNumber || '',
                phoneForCredit: data.phoneForCredit || '',
                password: '',
              })
              setLoading(false)
            })
            .catch((error) => {
              console.error('Error fetching user:', error)
              setLoading(false)
            })
        }
      } catch (error) {
        console.error('Error getting session:', error)
        router.push('/login')
      }
    }
    
    getSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const updateData: any = { ...formData }
    if (!updateData.password) {
      delete updateData.password
    }

    const res = await fetch(`/api/users/${session?.user?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })

    if (res.ok) {
      alert('تم تحديث الملف الشخصي بنجاح!')
      setFormData({ ...formData, password: '' })
    } else {
      alert('فشل في تحديث الملف الشخصي')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="mr-4 text-xl">جاري التحميل...</span>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">غير مصرح بالوصول</h2>
          <p className="mb-4">يجب تسجيل الدخول للوصول إلى هذه الصفحة</p>
          <button
            onClick={() => router.push('/login')}
            className="btn btn-primary"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">الملف الشخصي</h1>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-semibold mb-2">الاسم</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">اللقب</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">رقم الهاتف</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">رقم باريدي موب</label>
              <input
                type="text"
                value={formData.baridiMobNumber}
                onChange={(e) => setFormData({ ...formData, baridiMobNumber: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">رقم الحساب البريدي (CCP)</label>
              <input
                type="text"
                value={formData.ccpNumber}
                onChange={(e) => setFormData({ ...formData, ccpNumber: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">رقم الهاتف للشحن الرصيد</label>
              <input
                type="tel"
                value={formData.phoneForCredit}
                onChange={(e) => setFormData({ ...formData, phoneForCredit: e.target.value })}
                className="input"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-lg font-semibold mb-2">كلمة المرور الجديدة (اتركها فارغة إذا لم ترد تغييرها)</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input"
                placeholder="ادخل كلمة مرور جديدة"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            حفظ التغييرات
          </button>
        </form>
      </div>
    </div>
  )
}
