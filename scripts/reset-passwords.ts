import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function resetAllPasswords() {
  try {
    console.log('🔄 جاري إعادة تعيين جميع كلمات المرور...\n')

    // Get all users
    const users = await prisma.user.findMany()

    if (users.length === 0) {
      console.log('⚠️  لا توجد حسابات في قاعدة البيانات')
      return
    }

    // Default password for all users
    const defaultPassword = '123456'
    const hashedPassword = await bcrypt.hash(defaultPassword, 10)

    // Update all users
    for (const user of users) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword
        }
      })
      console.log(`✅ تم تحديث كلمة مرور: ${user.email}`)
    }

    console.log(`\n✅ تم تحديث ${users.length} حساب`)
    console.log('\n📧 كلمة المرور الافتراضية لجميع الحسابات: 123456')
    console.log('⚠️  مهم: غيّر كلمات المرور بعد تسجيل الدخول!')
  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetAllPasswords()

