# دليل تطوير تطبيقات الموبايل
## Guide for Android/iOS Mobile App Development

### نظرة عامة
هذه المنصة تدعم تطبيقات Android و iOS من خلال:
1. **PWA (Progressive Web App)** - يمكن تثبيتها كتطبيق على الموبايل
2. **REST API** - للاستخدام في تطبيقات Android/iOS الأصلية

---

## 1. PWA (Progressive Web App)

### المميزات
- ✅ يعمل على Android و iOS
- ✅ يمكن تثبيته كتطبيق
- ✅ يعمل بدون إنترنت (Offline)
- ✅ واجهة سريعة ومتجاوبة

### كيفية التثبيت

#### على Android:
1. افتح الموقع في Chrome
2. اضغط على القائمة (3 نقاط)
3. اختر "إضافة إلى الشاشة الرئيسية"
4. سيظهر التطبيق كتطبيق عادي

#### على iOS:
1. افتح الموقع في Safari
2. اضغط على زر المشاركة
3. اختر "إضافة إلى الشاشة الرئيسية"
4. سيظهر التطبيق كتطبيق عادي

### الملفات المطلوبة
- ✅ `manifest.json` - موجود في `/public/manifest.json`
- ✅ Service Worker - موجود في `/public/sw.js`
- ✅ Icons - يجب إضافة الأيقونات في `/public/`

---

## 2. تطبيقات Android/iOS الأصلية

### استخدام API

جميع الـ API endpoints متاحة للاستخدام في تطبيقات الموبايل. راجع ملف `API-DOCUMENTATION.md` للتفاصيل الكاملة.

### خطوات التطوير

#### Android (Kotlin/Java)

1. **إعداد المشروع**
```kotlin
// build.gradle
dependencies {
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("com.squareup.okhttp3:okhttp:4.11.0")
}
```

2. **إنشاء API Service**
```kotlin
interface RawjliApiService {
    @POST("auth/signin")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>
    
    @GET("products")
    suspend fun getProducts(@Header("Authorization") token: String): Response<List<Product>>
    
    @POST("orders")
    suspend fun createOrder(
        @Header("Authorization") token: String,
        @Body order: OrderRequest
    ): Response<OrderResponse>
}
```

3. **إدارة Token**
```kotlin
class TokenManager(context: Context) {
    private val prefs = context.getSharedPreferences("rawjli_prefs", Context.MODE_PRIVATE)
    
    fun saveToken(token: String) {
        prefs.edit().putString("token", token).apply()
    }
    
    fun getToken(): String? {
        return prefs.getString("token", null)
    }
}
```

#### iOS (Swift)

1. **إعداد المشروع**
```swift
// Package.swift or Podfile
dependencies: [
    .package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.8.0")
]
```

2. **إنشاء API Service**
```swift
class RawjliAPI {
    static let shared = RawjliAPI()
    private let baseURL = "https://your-domain.com/api"
    
    func login(email: String, password: String) async throws -> AuthResponse {
        let url = URL(string: "\(baseURL)/auth/signin")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(LoginRequest(email: email, password: password))
        
        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode(AuthResponse.self, from: data)
    }
    
    func getProducts(token: String) async throws -> [Product] {
        let url = URL(string: "\(baseURL)/products")!
        var request = URLRequest(url: url)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode([Product].self, from: data)
    }
}
```

3. **إدارة Token**
```swift
class TokenManager {
    static let shared = TokenManager()
    private let keychain = Keychain(service: "com.rawjli.app")
    
    func saveToken(_ token: String) {
        try? keychain.set(token, key: "auth_token")
    }
    
    func getToken() -> String? {
        return try? keychain.get("auth_token")
    }
}
```

---

## 3. الميزات المطلوبة

### للمسوقين:
- ✅ عرض المنتجات المتاحة
- ✅ إنشاء طلبيات جديدة
- ✅ متابعة الطلبيات
- ✅ طلب سحب الأرباح
- ✅ عرض الإحصائيات

### للإدارة:
- ✅ إدارة المنتجات
- ✅ إدارة الطلبيات
- ✅ إدارة المسوقين
- ✅ إدارة السحوبات

---

## 4. الأمان

### Best Practices:
1. **تخزين Token بشكل آمن**
   - Android: استخدام `EncryptedSharedPreferences`
   - iOS: استخدام `Keychain`

2. **HTTPS فقط**
   - تأكد من استخدام HTTPS في الإنتاج

3. **Token Refresh**
   - إعادة المصادقة عند انتهاء صلاحية Token

4. **Input Validation**
   - التحقق من جميع المدخلات قبل الإرسال

---

## 5. التصميم

### Design Guidelines:
- استخدام نفس الألوان من الموقع:
  - Primary: `#10b981` (Emerald)
  - Secondary: `#06b6d4` (Cyan)
  - Background: `#0a1929` (Dark)

- دعم RTL (Right-to-Left) للعربية
- تصميم متجاوب لجميع أحجام الشاشات

---

## 6. الاختبار

### Test Endpoints:
استخدم الـ API endpoints للاختبار:
```bash
# Test Login
curl -X POST https://your-domain.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test Get Products
curl -X GET https://your-domain.com/api/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 7. النشر

### Android:
1. إنشاء APK/AAB
2. رفع على Google Play Store
3. أو توزيع مباشر (Direct Distribution)

### iOS:
1. إنشاء IPA
2. رفع على App Store
3. أو TestFlight للتوزيع الداخلي

---

## 8. الدعم

للمساعدة والدعم:
- راجع `API-DOCUMENTATION.md` للتفاصيل الكاملة
- راجع الكود المصدري للمنصة
- تواصل مع فريق التطوير

---

## ملاحظات مهمة

1. **Base URL**: يجب تحديث Base URL في التطبيق قبل النشر
2. **Icons**: يجب إضافة أيقونات التطبيق (192x192 و 512x512)
3. **Push Notifications**: يمكن إضافة إشعارات الدفع لاحقاً
4. **Offline Support**: يمكن إضافة دعم العمل بدون إنترنت باستخدام Local Storage

