# دليل النشر - منصة روجلي

## 🚀 النشر على Vercel (موصى به)

### 1. تجهيز قاعدة البيانات على Supabase

1. أنشئ حساب على [Supabase](https://supabase.com)
2. أنشئ مشروع جديد
3. انسخ رابط قاعدة البيانات من Settings > Database > Connection String (URI)
4. استبدل `[YOUR-PASSWORD]` بكلمة المرور الفعلية

### 2. رفع الكود على GitHub

```bash
git init
git add .
git commit -m "Initial commit - Rawjli Platform"
git branch -M main
git remote add origin https://github.com/your-username/rawjli.git
git push -u origin main
```

### 3. النشر على Vercel

1. اذهب إلى [Vercel](https://vercel.com)
2. اضغط "New Project"
3. استورد المشروع من GitHub
4. أضف متغيرات البيئة:
   - `DATABASE_URL`: رابط قاعدة البيانات من Supabase
   - `NEXTAUTH_SECRET`: مفتاح سري (استخدم: `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: رابط موقعك (مثال: `https://rawjli.vercel.app`)

5. اضغط "Deploy"

### 4. إعداد قاعدة البيانات

بعد النشر، شغّل الأوامر التالية محلياً:

```bash
# تأكد من تحديث .env بـ DATABASE_URL من Supabase
npm run db:push
npm run db:seed
```

أو استخدم Prisma Studio:
```bash
npx prisma studio
```

---

## 🔧 النشر على Netlify

### 1. تجهيز المشروع

أضف `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 2. النشر

1. اذهب إلى [Netlify](https://netlify.com)
2. اربط المشروع من GitHub
3. أضف متغيرات البيئة نفسها
4. انشر المشروع

---

## 🐳 النشر باستخدام Docker

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
```

---

## 📝 ملاحظات مهمة

### بعد النشر الأول:

1. **غيّر كلمة مرور الأدمن فوراً**
   - Email: `alumabdo0@gmail.com`
   - Password الافتراضي: `abdo@154122`

2. **تأكد من تشغيل Seed**
   ```bash
   npm run db:seed
   ```

3. **اختبر جميع الوظائف**:
   - تسجيل الدخول
   - إضافة منتج
   - إنشاء طلبية
   - طلب سحب

### الأمان:

- ✅ استخدم HTTPS دائماً في الإنتاج
- ✅ غيّر `NEXTAUTH_SECRET` لمفتاح قوي
- ✅ لا تشارك ملف `.env` أبداً
- ✅ فعّل 2FA على حساب Supabase

### الأداء:

- ✅ فعّل Caching على Vercel
- ✅ استخدم CDN للصور
- ✅ راقب استخدام قاعدة البيانات

---

## 🔍 استكشاف الأخطاء

### خطأ في الاتصال بقاعدة البيانات:
```bash
npx prisma db push
```

### خطأ في NextAuth:
تأكد من `NEXTAUTH_URL` صحيح ويطابق النطاق

### خطأ في Build:
```bash
npm run build
```
افحص الأخطاء وأصلحها

---

## 📞 الدعم

للمساعدة، راجع:
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Vercel Docs](https://vercel.com/docs)
