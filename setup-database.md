# إعداد قاعدة البيانات وحساب الادمن

## المشكلة
لا يمكن تسجيل الدخول لأن قاعدة البيانات غير متصلة وحساب الادمن غير موجود.

## الحل

### 1. تشغيل PostgreSQL
```bash
# في Windows
# قم بتشغيل PostgreSQL service
net start postgresql-x64-14

# أو استخدم pgAdmin
```

### 2. إنشاء قاعدة البيانات
```sql
CREATE DATABASE rawjli;
```

### 3. تشغيل الـ Migration
```bash
npx prisma db push
```

### 4. إنشاء حساب الادمن
استخدم هذا SQL Query مباشرة في قاعدة البيانات:

```sql
INSERT INTO "User" (email, password, role, "firstName", "lastName", "isActive", "createdAt", "updatedAt") 
VALUES ('alumabdo0@gmail.com', '$2a$10$.MyMvCNy8UDHenldPdzbVuNr44ui.D7eBv0Ml3lUc08NCMLj2g37C', 'ADMIN', 'Admin', 'Rawjli', true, NOW(), NOW());
```

### 5. تشغيل التطبيق
```bash
npm run dev
```

## بيانات الادمن
- البريد: alumabdo0@gmail.com
- كلمة المرور: abdo@154122

## ملاحظات
- تأكد من أن PostgreSQL يعمل على localhost:5432
- تأكد من وجود قاعدة بيانات rawjli
- إذا لم ينجح، يمكنك استخدام Supabase بدلاً من PostgreSQL محلي
