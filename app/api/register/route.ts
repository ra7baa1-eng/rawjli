import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

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
      phoneForCredit,
      role = 'MARKETER'
    } = body

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'البريد الإلكتروني، كلمة المرور، والاسم مطلوبة' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'هذا البريد الإلكتروني مستخدم بالفعل' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        baridiMobNumber,
        ccpNumber,
        phoneForCredit,
        role: 'MARKETER',
        isActive: true
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    })

    return NextResponse.json({ 
      message: 'تم إنشاء الحساب بنجاح',
      user 
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'فشل في إنشاء الحساب' }, { status: 500 })
  }
}
