'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
}

interface ProductOption {
  id: string;
  name: string;
  values: { id: string; value: string }[];
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    marketingDescription: '',
    price: '',
    cost: '',
    categoryId: '',
    image: '',
    stock: '',
    selectedOptions: [] as string[]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      
      // جلب الفئات
      const categoriesRes = await fetch('/api/categories');
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        // التأكد من وجود data في الاستجابة
        setCategories(categoriesData?.data || categoriesData || []);
      }

      // جلب الخيارات
      const optionsRes = await fetch('/api/product-options');
      if (optionsRes.ok) {
        const optionsData = await optionsRes.json();
        // التأكد من وجود data في الاستجابة
        setProductOptions(optionsData?.data || optionsData || []);
      }
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error);
      alert('حدث خطأ في جلب البيانات. يرجى إعادة المحاولة.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.categoryId) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          marketingDescription: formData.marketingDescription,
          price: parseFloat(formData.price),
          cost: formData.cost ? parseFloat(formData.cost) : 0,
          categoryId: formData.categoryId,
          image: formData.image,
          stock: formData.stock ? parseInt(formData.stock) : 0,
          optionIds: formData.selectedOptions
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في إضافة المنتج');
      }

      const result = await response.json();
      alert('تم إضافة المنتج بنجاح!');
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error('خطأ في إضافة المنتج:', error);
      alert(error instanceof Error ? error.message : 'حدث خطأ أثناء إضافة المنتج');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionToggle = (optionId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedOptions: prev.selectedOptions.includes(optionId)
        ? prev.selectedOptions.filter(id => id !== optionId)
        : [...prev.selectedOptions, optionId]
    }));
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">إضافة منتج جديد</h1>
        <p className="text-gray-600 mt-2">أضف منتجاً جديداً إلى المتجر</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* اسم المنتج */}
        <div>
          <label className="block text-sm font-medium mb-2">
            اسم المنتج <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل اسم المنتج"
            required
          />
        </div>

        {/* الوصف */}
        <div>
          <label className="block text-sm font-medium mb-2">الوصف</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل وصف المنتج"
          />
        </div>

        {/* الوصف التسويقي */}
        <div>
          <label className="block text-sm font-medium mb-2">الوصف التسويقي</label>
          <textarea
            value={formData.marketingDescription}
            onChange={(e) => setFormData({ ...formData, marketingDescription: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل الوصف التسويقي للمنتج"
          />
        </div>

        {/* السعر والتكلفة */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              السعر (دج) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">التكلفة (دج)</label>
            <input
              type="number"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* الفئة */}
        <div>
          <label className="block text-sm font-medium mb-2">
            الفئة <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">اختر الفئة</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* رابط الصورة */}
        <div>
          <label className="block text-sm font-medium mb-2">رابط الصورة</label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
          {formData.image && (
            <div className="mt-3">
              <img
                src={formData.image}
                alt="معاينة"
                className="h-32 w-32 object-cover rounded-lg border"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.png';
                }}
              />
            </div>
          )}
        </div>

        {/* المخزون */}
        <div>
          <label className="block text-sm font-medium mb-2">الكمية في المخزون</label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
            min="0"
          />
        </div>

        {/* الخيارات */}
        {productOptions.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-3">خيارات المنتج (اختياري)</label>
            <div className="space-y-3">
              {productOptions.map((option) => (
                <div key={option.id} className="border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`option-${option.id}`}
                      checked={formData.selectedOptions.includes(option.id)}
                      onChange={() => handleOptionToggle(option.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor={`option-${option.id}`} className="mr-2 font-medium">
                      {option.name}
                    </label>
                  </div>
                  {option.values.length > 0 && (
                    <div className="mr-6 text-sm text-gray-600">
                      القيم: {option.values.map(v => v.value).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* الأزرار */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'جاري الإضافة...' : 'إضافة المنتج'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
