import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const email = 'alumabdo0@gmail.com'
    const password = 'abdo@154122'
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email }
    })

    if (existingAdmin) {
      // Update password if exists
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          role: 'ADMIN',
          isActive: true
        }
      })
      console.log('✅ تم تحديث حساب الأدمن بنجاح!')
    } else {
      // Create new admin
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'ADMIN',
          firstName: 'Admin',
          lastName: 'Rawjli',
          isActive: true
        }
      })
      console.log('✅ تم إنشاء حساب الأدمن بنجاح!')
    }

    console.log('\n📧 بيانات تسجيل الدخول:')
    console.log('البريد:', email)
    console.log('كلمة المرور:', password)
    console.log('\n⚠️  مهم: غيّر كلمة المرور بعد أول تسجيل دخول!')
  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()

