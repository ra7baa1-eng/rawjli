const bcrypt = require('bcryptjs');

// بيانات الادمن الافتراضية
const adminData = {
  email: 'alumabdo0@gmail.com',
  password: 'abdo@154122',
  role: 'ADMIN',
  firstName: 'Admin',
  lastName: 'Rawjli',
  isActive: true
};

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    
    console.log('=== بيانات الادمن ===');
    console.log('البريد:', adminData.email);
    console.log('كلمة المرور:', adminData.password);
    console.log('كلمة المرور المشفرة:', hashedPassword);
    console.log('الدور:', adminData.role);
    console.log('==================');
    
    // يمكنك استخدام هذه البيانات لإدخالها مباشرة في قاعدة البيانات
    console.log('\nSQL Query:');
    console.log(`INSERT INTO "User" (email, password, role, "firstName", "lastName", "isActive", "createdAt", "updatedAt") VALUES ('${adminData.email}', '${hashedPassword}', '${adminData.role}', '${adminData.firstName}', '${adminData.lastName}', true, NOW(), NOW());`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createAdmin();
