const bcrypt = require('bcryptjs');

// بيانات ادمن جديدة
const newAdminData = {
  email: 'admin@rojli.com',
  password: 'admin123456',
  role: 'ADMIN',
  firstName: 'Admin',
  lastName: 'Rawjli',
  isActive: true
};

async function createNewAdmin() {
  try {
    const hashedPassword = await bcrypt.hash(newAdminData.password, 10);
    
    console.log('=== بيانات الأدمن الجديدة ===');
    console.log('البريد:', newAdminData.email);
    console.log('كلمة المرور:', newAdminData.password);
    console.log('كلمة المرور المشفرة:', hashedPassword);
    console.log('الدور:', newAdminData.role);
    console.log('========================');
    
    console.log('\nSQL Query:');
    console.log(`INSERT INTO "User" (email, password, role, "firstName", "lastName", "isActive", "createdAt", "updatedAt") VALUES ('${newAdminData.email}', '${hashedPassword}', '${newAdminData.role}', '${newAdminData.firstName}', '${newAdminData.lastName}', true, NOW(), NOW());`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createNewAdmin();
