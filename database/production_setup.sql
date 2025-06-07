-- ===================================
-- إعداد الموقع للإطلاق الرسمي
-- Top Marketing Services Platform
-- ===================================

-- 1. حذف جميع البيانات التجريبية
DELETE FROM orders;
DELETE FROM subscriptions;
DELETE FROM real_estate_listings;
DELETE FROM customers;
DELETE FROM services;
DELETE FROM admins;
DELETE FROM notifications;

-- 2. إنشاء حساب المدير الرئيسي
INSERT INTO admins (email, username, password_hash, full_name, role, permissions, is_active) VALUES
('alsheref.antaka@gmail.com', 'admin', '$2a$12$LQv3c1yqBwlVHpPjreuBUOgOtd.M0jKSulHciIpZXavHfLESMa4PW', 'المدير العام - أشرف أنتاكا', 'admin', ARRAY['all'], true);

-- 3. تحديث إعدادات النظام للإطلاق الرسمي
UPDATE settings SET value = '"alsheref.antaka@gmail.com"' WHERE key = 'contact_email';
UPDATE settings SET value = '"01068275557"' WHERE key = 'contact_phone';
UPDATE settings SET value = '"01068275557"' WHERE key = 'whatsapp_number';
UPDATE settings SET value = '"01068275557"' WHERE key = 'payment_phone';
UPDATE settings SET value = '"توب ماركتنج - خدمات التسويق الرقمي"' WHERE key = 'site_name';
UPDATE settings SET value = '"شركة توب ماركتنج المتخصصة في تقديم خدمات التسويق الرقمي والتصميم والبرمجة"' WHERE key = 'about_text';

-- 4. إضافة إعدادات إضافية للإطلاق
INSERT INTO settings (key, value, description, category, is_public) VALUES
('site_status', '"live"', 'حالة الموقع', 'general', false),
('maintenance_mode', 'false', 'وضع الصيانة', 'general', false),
('allow_registration', 'true', 'السماح بالتسجيل', 'auth', false),
('max_file_size', '5242880', 'الحد الأقصى لحجم الملف (5MB)', 'upload', false),
('allowed_file_types', '["image/jpeg", "image/png", "image/gif", "application/pdf"]', 'أنواع الملفات المسموحة', 'upload', false),
('order_auto_approve', 'false', 'الموافقة التلقائية على الطلبات', 'orders', false),
('email_notifications', 'true', 'إشعارات البريد الإلكتروني', 'notifications', false),
('sms_notifications', 'false', 'إشعارات الرسائل النصية', 'notifications', false),
('backup_frequency', '"daily"', 'تكرار النسخ الاحتياطي', 'system', false),
('analytics_enabled', 'true', 'تفعيل التحليلات', 'system', false)
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = CURRENT_TIMESTAMP;

-- 5. تحديث روابط التواصل الاجتماعي
UPDATE settings SET value = '"https://facebook.com/topmarketing.eg"' WHERE key = 'facebook_url';
UPDATE settings SET value = '"https://instagram.com/topmarketing.eg"' WHERE key = 'instagram_url';
UPDATE settings SET value = '"https://youtube.com/@topmarketing"' WHERE key = 'youtube_url';
UPDATE settings SET value = '"https://wa.me/201068275557"' WHERE key = 'whatsapp_url';

-- 6. إضافة روابط إضافية
INSERT INTO settings (key, value, description, category, is_public) VALUES
('telegram_url', '"https://t.me/topmarketing"', 'رابط تليجرام', 'social', true),
('tiktok_url', '"https://tiktok.com/@topmarketing"', 'رابط تيك توك', 'social', true),
('linkedin_url', '"https://linkedin.com/company/topmarketing"', 'رابط لينكد إن', 'social', true),
('snapchat_url', '"https://snapchat.com/add/topmarketing"', 'رابط سناب شات', 'social', true)
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = CURRENT_TIMESTAMP;

-- 7. إعدادات الأمان والحماية
INSERT INTO settings (key, value, description, category, is_public) VALUES
('session_timeout', '3600', 'انتهاء صلاحية الجلسة (ثانية)', 'security', false),
('max_login_attempts', '5', 'الحد الأقصى لمحاولات تسجيل الدخول', 'security', false),
('password_min_length', '8', 'الحد الأدنى لطول كلمة المرور', 'security', false),
('require_email_verification', 'true', 'تطلب تأكيد البريد الإلكتروني', 'security', false),
('enable_2fa', 'false', 'تفعيل المصادقة الثنائية', 'security', false),
('ip_whitelist', '[]', 'قائمة IP المسموحة للإدارة', 'security', false)
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = CURRENT_TIMESTAMP;

-- 8. إعدادات الدفع والفواتير
INSERT INTO settings (key, value, description, category, is_public) VALUES
('tax_rate', '0.14', 'معدل الضريبة المضافة', 'billing', false),
('invoice_prefix', '"INV"', 'بادئة رقم الفاتورة', 'billing', false),
('invoice_counter', '1000', 'عداد الفواتير', 'billing', false),
('payment_terms', '"الدفع خلال 7 أيام من تاريخ الفاتورة"', 'شروط الدفع', 'billing', true),
('refund_policy', '"يمكن استرداد المبلغ خلال 14 يوم من تاريخ الشراء"', 'سياسة الاسترداد', 'billing', true)
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = CURRENT_TIMESTAMP;

-- 9. تحديث timestamps
UPDATE settings SET updated_at = CURRENT_TIMESTAMP;
UPDATE admins SET updated_at = CURRENT_TIMESTAMP;

-- 10. إعادة تعيين العدادات
ALTER SEQUENCE IF EXISTS orders_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS customers_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS services_id_seq RESTART WITH 1;

-- تأكيد نجاح العملية
SELECT 'تم تجهيز الموقع للإطلاق الرسمي بنجاح!' as status;
