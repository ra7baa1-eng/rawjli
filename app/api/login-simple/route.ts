import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Simple login without database - for testing
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبة' }, { status: 400 })
    }

    // Check for admin credentials
    if (email === 'alumabdo0@gmail.com' && password === 'abdo@154122') {
      return NextResponse.json({
        message: 'تم تسجيل الدخول بنجاح',
        user: {
          id: 'admin-001',
          email: 'alumabdo0@gmail.com',
          firstName: 'Admin',
          lastName: 'روجلي',
          role: 'ADMIN',
          isActive: true
        }
      })
    }

    // For any other email, just check if password is provided
    if (password.length >= 6) {
      return NextResponse.json({
        message: 'تم تسجيل الدخول بنجاح',
        user: {
          id: 'user-' + Date.now(),
          email,
          firstName: 'مستخدم',
          lastName: 'روجلي',
          role: 'MARKETER',
          isActive: true
        }
      })
    }

    return NextResponse.json({ error: 'كلمة المرور غير صحيحة' }, { status: 401 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'فشل في تسجيل الدخول' }, { status: 500 })
  }
}
