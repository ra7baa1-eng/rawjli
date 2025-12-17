# إعداد المشروع على GitHub

## المشكلة
المستودع المحدد غير موجود أو الرابط غير صحيح.

## الحل

### 1. إنشاء مستودع جديد على GitHub
1. اذهب إلى https://github.com
2. انقر على "+" واختر "New repository"
3. أدخل اسم: `rawjli`
4. اختر Public
5. انقر "Create repository"

### 2. ربط المشروع بالمستودع
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/rawjli.git
git push -u origin main
```

### 3. أو استخدم GitHub Desktop
1. افتح GitHub Desktop
2. File > Add Local Repository
3. اختر مجلد rawjli
4. Publish repository
5. أدخل اسم: rawjli
6. اختر Public
7. انشر

## ملاحظات
- تأكد من الرابط الصحيح للمستودع
- استخدم اسم المستخدم الصحيح في GitHub
- تأكد من صلاحيات النشر
