# 🚀 دليل الإطلاق الرسمي - Top Marketing

## 📋 الخطوات المطلوبة للإطلاق

### 🔗 رابط Supabase SQL Editor
```
https://supabase.com/dashboard/project/xanzptntwwmpulqutoiv/sql/new
```

---

## 1️⃣ تنظيف البيانات وإنشاء المدير الرئيسي

**انسخ والصق هذا الكود في SQL Editor:**

```sql
-- حذف جميع البيانات التجريبية
DELETE FROM orders;
DELETE FROM subscriptions;
DELETE FROM real_estate_listings;
DELETE FROM customers;
DELETE FROM services;
DELETE FROM admins;
DELETE FROM notifications;

-- إنشاء حساب المدير الرئيسي
INSERT INTO admins (email, username, password_hash, full_name, role, permissions, is_active) VALUES
('alsheref.antaka@gmail.com', 'admin', '$2a$12$LQv3c1yqBwlVHpPjreuBUOgOtd.M0jKSulHciIpZXavHfLESMa4PW', 'المدير العام - أشرف أنتاكا', 'admin', ARRAY['all'], true);

SELECT 'تم حذف البيانات التجريبية وإنشاء حساب المدير بنجاح!' as status;
```

**اضغط "Run" ثم أخبرني بالنتيجة**

---

## 2️⃣ تحديث إعدادات النظام

**انسخ والصق هذا الكود:**

```sql
-- تحديث إعدادات النظام للإطلاق الرسمي
UPDATE settings SET value = '"alsheref.antaka@gmail.com"' WHERE key = 'contact_email';
UPDATE settings SET value = '"01068275557"' WHERE key = 'contact_phone';
UPDATE settings SET value = '"01068275557"' WHERE key = 'whatsapp_number';
UPDATE settings SET value = '"01068275557"' WHERE key = 'payment_phone';
UPDATE settings SET value = '"توب ماركتنج - خدمات التسويق الرقمي"' WHERE key = 'site_name';
UPDATE settings SET value = '"شركة توب ماركتنج المتخصصة في تقديم خدمات التسويق الرقمي والتصميم والبرمجة"' WHERE key = 'about_text';

-- تحديث روابط التواصل الاجتماعي
UPDATE settings SET value = '"https://facebook.com/topmarketing.eg"' WHERE key = 'facebook_url';
UPDATE settings SET value = '"https://instagram.com/topmarketing.eg"' WHERE key = 'instagram_url';
UPDATE settings SET value = '"https://youtube.com/@topmarketing"' WHERE key = 'youtube_url';
UPDATE settings SET value = '"https://wa.me/201068275557"' WHERE key = 'whatsapp_url';

SELECT 'تم تحديث إعدادات النظام بنجاح!' as status;
```

**اضغط "Run" ثم أخبرني بالنتيجة**

---

## 3️⃣ إضافة إعدادات الأمان والحماية

**انسخ والصق هذا الكود:**

```sql
-- إضافة إعدادات إضافية للإطلاق
INSERT INTO settings (key, value, description, category, is_public) VALUES
('site_status', '"live"', 'حالة الموقع', 'general', false),
('maintenance_mode', 'false', 'وضع الصيانة', 'general', false),
('allow_registration', 'true', 'السماح بالتسجيل', 'auth', false),
('max_file_size', '5242880', 'الحد الأقصى لحجم الملف (5MB)', 'upload', false),
('session_timeout', '3600', 'انتهاء صلاحية الجلسة (ثانية)', 'security', false),
('max_login_attempts', '5', 'الحد الأقصى لمحاولات تسجيل الدخول', 'security', false),
('password_min_length', '8', 'الحد الأدنى لطول كلمة المرور', 'security', false),
('tax_rate', '0.14', 'معدل الضريبة المضافة', 'billing', false),
('invoice_prefix', '"INV"', 'بادئة رقم الفاتورة', 'billing', false),
('payment_terms', '"الدفع خلال 7 أيام من تاريخ الفاتورة"', 'شروط الدفع', 'billing', true)
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = CURRENT_TIMESTAMP;

SELECT 'تم إضافة إعدادات الأمان والحماية بنجاح!' as status;
```

**اضغط "Run" ثم أخبرني بالنتيجة**

---

## 4️⃣ تطبيق سياسات الأمان (RLS)

**انسخ والصق هذا الكود:**

```sql
-- حذف السياسات المؤقتة للتطوير
DROP POLICY IF EXISTS "Allow anonymous read for development" ON services;
DROP POLICY IF EXISTS "Allow anonymous read settings for development" ON settings;
DROP POLICY IF EXISTS "Allow anonymous read listings for development" ON real_estate_listings;

-- تطبيق سياسات الإنتاج المحسنة
DROP POLICY IF EXISTS "Allow public read active services" ON services;
CREATE POLICY "Public can view active services" ON services
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Allow public read public settings" ON settings;
CREATE POLICY "Public can view public settings" ON settings
    FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Allow public read published listings" ON real_estate_listings;
CREATE POLICY "Public can view published properties" ON real_estate_listings
    FOR SELECT USING (is_published = true);

SELECT 'تم تطبيق سياسات الأمان للإنتاج بنجاح!' as status;
```

**اضغط "Run" ثم أخبرني بالنتيجة**

---

## 📊 بيانات تسجيل الدخول للمدير

- **البريد الإلكتروني:** `alsheref.antaka@gmail.com`
- **كلمة المرور:** `0453328124Aa`
- **الصلاحيات:** مدير عام (جميع الصلاحيات)

---

## 🧪 صفحات الاختبار بعد الإطلاق

- **اختبار النظام:** `https://top-markting.vercel.app/system-status`
- **اختبار قاعدة البيانات:** `https://top-markting.vercel.app/api/test-db`
- **متجر الخدمات:** `https://top-markting.vercel.app/services-shop`
- **لوحة التحكم:** `https://top-markting.vercel.app/admin/dashboard`

---

## ✅ قائمة التحقق

- [ ] تنفيذ الخطوة 1 (حذف البيانات وإنشاء المدير)
- [ ] تنفيذ الخطوة 2 (تحديث الإعدادات)
- [ ] تنفيذ الخطوة 3 (إعدادات الأمان)
- [ ] تنفيذ الخطوة 4 (سياسات RLS)
- [ ] اختبار تسجيل الدخول للمدير
- [ ] اختبار صفحات الموقع
- [ ] تأكيد عمل Real-time

**بعد تنفيذ جميع الخطوات، الموقع سيكون جاهز للإطلاق الرسمي! 🚀**
