# 🗄️ إعداد قاعدة البيانات - Top Marketing Services

## 📋 **خطوات إنشاء قاعدة البيانات**

### 1️⃣ **الوصول إلى Supabase SQL Editor:**
- اذهب إلى: https://supabase.com/dashboard/project/xanzptntwwmpulqutoiv/sql/new
- أو افتح Supabase Dashboard → SQL Editor → New Query

### 2️⃣ **تنفيذ إنشاء الجداول:**
1. انسخ محتوى ملف `create_tables.sql`
2. الصقه في SQL Editor
3. اضغط على "Run" لتنفيذ الاستعلام

### 3️⃣ **إدخال البيانات التجريبية:**
1. انسخ محتوى ملف `sample_data.sql`
2. الصقه في SQL Editor
3. اضغط على "Run" لتنفيذ الاستعلام

### 4️⃣ **التحقق من إنشاء الجداول:**
```sql
-- فحص الجداول المنشأة
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- فحص عدد السجلات في كل جدول
SELECT 
    'admins' as table_name, COUNT(*) as count FROM admins
UNION ALL
SELECT 
    'customers' as table_name, COUNT(*) as count FROM customers
UNION ALL
SELECT 
    'services' as table_name, COUNT(*) as count FROM services
UNION ALL
SELECT 
    'orders' as table_name, COUNT(*) as count FROM orders
UNION ALL
SELECT 
    'subscriptions' as table_name, COUNT(*) as count FROM subscriptions
UNION ALL
SELECT 
    'real_estate_properties' as table_name, COUNT(*) as count FROM real_estate_properties
UNION ALL
SELECT 
    'admin_settings' as table_name, COUNT(*) as count FROM admin_settings;
```

## 🔧 **الجداول المنشأة:**

### 📊 **الجداول الأساسية:**
- ✅ `admins` - جدول المديرين والمشرفين
- ✅ `customers` - جدول العملاء
- ✅ `services` - جدول الخدمات
- ✅ `orders` - جدول الطلبات
- ✅ `subscriptions` - جدول الاشتراكات
- ✅ `real_estate_properties` - جدول العقارات
- ✅ `admin_settings` - جدول إعدادات النظام

### 🔍 **الفهارس المنشأة:**
- فهارس على البريد الإلكتروني
- فهارس على حالة النشاط
- فهارس على الفئات والأنواع
- فهارس على العلاقات الخارجية

## 🧪 **اختبار الاتصال:**

### من الموقع:
- اذهب إلى: `http://localhost:3000/test-connection`
- اضغط على "اختبار شامل"
- تأكد من ظهور رسائل النجاح

### من Supabase:
```sql
-- اختبار قراءة الخدمات
SELECT * FROM services LIMIT 5;

-- اختبار إدخال خدمة جديدة
INSERT INTO services (name_ar, name_en, price, category) 
VALUES ('خدمة اختبار', 'Test Service', 100.00, 'test');

-- اختبار تحديث خدمة
UPDATE services 
SET price = 150.00 
WHERE name_ar = 'خدمة اختبار';

-- اختبار حذف خدمة
DELETE FROM services 
WHERE name_ar = 'خدمة اختبار';
```

## ⚠️ **ملاحظات مهمة:**

1. **الصلاحيات:** تم تعطيل RLS مؤقتاً للتطوير
2. **البيانات:** البيانات التجريبية للاختبار فقط
3. **كلمات المرور:** يجب تشفيرها بـ bcrypt في الإنتاج
4. **النسخ الاحتياطي:** قم بعمل نسخة احتياطية قبل التعديل

## 🔄 **التحديثات التلقائية:**

تم إنشاء triggers لتحديث `updated_at` تلقائياً عند:
- تحديث أي سجل في أي جدول
- استخدام دالة `update_updated_at_column()`

## 📞 **في حالة المشاكل:**

1. تأكد من متغيرات البيئة في `.env.local`
2. تحقق من صلاحيات المستخدم في Supabase
3. راجع سجل الأخطاء في Console
4. استخدم صفحة `/test-connection` للتشخيص
