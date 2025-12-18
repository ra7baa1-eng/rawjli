import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Simple registration without database - for testing
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      baridiMobNumber, 
      ccpNumber, 
      phoneForCredit
    } = body

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'البريد الإلكتروني، كلمة المرور، والاسم مطلوبة' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // For now, just return success (we'll save to localStorage in frontend)
    return NextResponse.json({ 
      message: 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.',
      user: {
        id: 'temp-' + Date.now(),
        email,
        firstName,
        lastName,
        phone,
        role: 'MARKETER',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'فشل في إنشاء الحساب' }, { status: 500 })
  }
}
