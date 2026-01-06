# Rawjli API Documentation
## توثيق API للمنصة - للاستخدام في تطبيقات Android/iOS

### Base URL
```
https://your-domain.com/api
```

### Authentication
جميع الطلبات تتطلب مصادقة باستخدام JWT token في header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Authentication (المصادقة)

#### تسجيل الدخول
```
POST /api/auth/signin
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "MARKETER" | "ADMIN",
    "firstName": "أحمد",
    "lastName": "محمد"
  },
  "token": "jwt_token_here"
}
```

---

### 2. Products (المنتجات)

#### جلب جميع المنتجات
```
GET /api/products
```

**Query Parameters:**
- `isActive` (optional): `true` | `false` - فلترة المنتجات النشطة
- `categoryId` (optional): `string` - فلترة حسب الفئة

**Response:**
```json
[
  {
    "id": "product_id",
    "name": "اسم المنتج",
    "marketingTitle": "عنوان تسويقي",
    "marketingDescription": "وصف تسويقي",
    "basePrice": 1000.00,
    "priceAfterDiscount": 800.00,
    "images": ["/uploads/products/image1.jpg"],
    "stock": 50,
    "isActive": true,
    "commission": 10,
    "category": {
      "id": "category_id",
      "name": "الفئة"
    },
    "options": [
      {
        "id": "option_id",
        "name": "الحجم",
        "values": [
          {
            "id": "value_id",
            "value": "كبير"
          }
        ]
      }
    ]
  }
]
```

#### جلب منتج واحد
```
GET /api/products/:id
```

**Response:**
```json
{
  "id": "product_id",
  "name": "اسم المنتج",
  ...
}
```

---

### 3. Orders (الطلبيات)

#### إنشاء طلبية جديدة
```
POST /api/orders
```

**Body:**
```json
{
  "customerFirstName": "أحمد",
  "customerLastName": "محمد",
  "customerPhone": "0551234567",
  "wilayaCode": "16",
  "communeId": "commune_id",
  "deliveryMethod": "HOME" | "OFFICE",
  "items": [
    {
      "productId": "product_id",
      "quantity": 1,
      "price": 1000.00,
      "selectedVariants": {
        "الحجم": "كبير",
        "اللون": "أحمر"
      }
    }
  ],
  "commission": 100.00
}
```

**Response:**
```json
{
  "id": "order_id",
  "orderNumber": "ORD-2024-001",
  "totalAmount": 1000.00,
  "commission": 100.00,
  "status": "PROCESSING"
}
```

#### جلب طلبيات المسوق
```
GET /api/orders
```

**Query Parameters:**
- `limit` (optional): `number` - عدد النتائج
- `status` (optional): `PROCESSING` | `SHIPPED` | `DELIVERED` | `CANCELLED`

**Response:**
```json
[
  {
    "id": "order_id",
    "orderNumber": "ORD-2024-001",
    "customerFirstName": "أحمد",
    "customerLastName": "محمد",
    "customerPhone": "0551234567",
    "totalAmount": 1000.00,
    "commission": 100.00,
    "status": "PROCESSING",
    "wilaya": {
      "name": "الجزائر العاصمة"
    },
    "createdAt": "2024-12-18T20:00:00Z"
  }
]
```

#### جلب طلبية واحدة
```
GET /api/orders/:id
```

---

### 4. User Stats (إحصائيات المستخدم)

#### جلب إحصائيات المسوق
```
GET /api/stats
```

**Response:**
```json
{
  "totalOrders": 50,
  "deliveredOrders": 45,
  "balance": 5000.00,
  "withdrawableBalance": 4500.00,
  "averageCommission": 100.00,
  "totalEarnings": 5000.00
}
```

---

### 5. Withdrawals (السحوبات)

#### طلب سحب
```
POST /api/withdrawals
```

**Body:**
```json
{
  "amount": 1000.00,
  "method": "BARIDI_MOB" | "CCP" | "PHONE_CREDIT",
  "accountNumber": "1234567890"
}
```

**Response:**
```json
{
  "id": "withdrawal_id",
  "amount": 1000.00,
  "status": "PENDING",
  "createdAt": "2024-12-18T20:00:00Z"
}
```

#### جلب طلبات السحب
```
GET /api/withdrawals
```

---

### 6. Wilayas & Communes (الولايات والبلديات)

#### جلب جميع الولايات
```
GET /api/wilayas
```

**Response:**
```json
[
  {
    "code": "16",
    "name": "الجزائر العاصمة"
  }
]
```

#### جلب بلديات ولاية
```
GET /api/communes?wilayaCode=16
```

**Response:**
```json
[
  {
    "id": "commune_id",
    "name": "بلدية الجزائر الوسطى"
  }
]
```

---

### 7. Categories (الفئات)

#### جلب جميع الفئات
```
GET /api/categories
```

**Response:**
```json
[
  {
    "id": "category_id",
    "name": "إلكترونيات",
    "description": "وصف الفئة"
  }
]
```

---

## Error Responses

جميع الأخطاء تعيد نفس التنسيق:

```json
{
  "error": "رسالة الخطأ"
}
```

**Status Codes:**
- `200` - نجاح
- `201` - تم الإنشاء بنجاح
- `400` - خطأ في البيانات
- `401` - غير مصرح
- `404` - غير موجود
- `500` - خطأ في الخادم

---

## Example Usage (أمثلة الاستخدام)

### React Native Example
```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('https://your-domain.com/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  // Store token
  await AsyncStorage.setItem('token', data.token);
  return data;
};

// Get Products
const getProducts = async () => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch('https://your-domain.com/api/products', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await response.json();
};

// Create Order
const createOrder = async (orderData) => {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch('https://your-domain.com/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  return await response.json();
};
```

### Android (Kotlin) Example
```kotlin
// Login
suspend fun login(email: String, password: String): AuthResponse {
    val response = httpClient.post("https://your-domain.com/api/auth/signin") {
        contentType(ContentType.Application.Json)
        body = LoginRequest(email, password)
    }
    return response.body()
}

// Get Products
suspend fun getProducts(): List<Product> {
    val response = httpClient.get("https://your-domain.com/api/products") {
        header("Authorization", "Bearer $token")
    }
    return response.body()
}
```

### iOS (Swift) Example
```swift
// Login
func login(email: String, password: String) async throws -> AuthResponse {
    let url = URL(string: "https://your-domain.com/api/auth/signin")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.httpBody = try JSONEncoder().encode(LoginRequest(email: email, password: password))
    
    let (data, _) = try await URLSession.shared.data(for: request)
    return try JSONDecoder().decode(AuthResponse.self, from: data)
}

// Get Products
func getProducts() async throws -> [Product] {
    let url = URL(string: "https://your-domain.com/api/products")!
    var request = URLRequest(url: url)
    request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    
    let (data, _) = try await URLSession.shared.data(for: request)
    return try JSONDecoder().decode([Product].self, from: data)
}
```

---

## Notes (ملاحظات)

1. جميع التواريخ بصيغة ISO 8601
2. جميع الأسعار بالدينار الجزائري (دج)
3. يجب حفظ token بشكل آمن في التطبيق
4. يجب إعادة المصادقة عند انتهاء صلاحية token
5. جميع الصور متاحة عبر URL كامل: `https://your-domain.com/uploads/products/image.jpg`

