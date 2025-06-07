-- ===================================
-- إدخال بيانات تجريبية شاملة للاختبار
-- Top Marketing Services Platform
-- ===================================

-- 1. إدخال المديرين
INSERT INTO admins (email, username, password_hash, full_name, role, permissions) VALUES
('admin@topmarketing.com', 'admin', '$2a$10$example_hash_here', 'المدير العام', 'admin', ARRAY['all']),
('manager@topmarketing.com', 'manager1', '$2a$10$example_hash_here', 'مدير الخدمات', 'manager', ARRAY['services', 'orders', 'customers']);

-- 2. إدخال خدمات تجريبية
INSERT INTO services (name_ar, name_en, description_ar, description_en, price, duration_text, features, category, category_name, is_active, is_featured) VALUES
('تصميم شعار احترافي', 'Professional Logo Design', 'تصميم شعار احترافي يعكس هوية علامتك التجارية بأعلى جودة ممكنة', 'Professional logo design that reflects your brand identity with highest quality', 500.00, '2-3 أيام', ARRAY['تصميم احترافي', '3 مراجعات مجانية', 'ملفات عالية الجودة', 'حقوق ملكية كاملة'], 'design', 'التصميم', true, true),

('إدارة حسابات التواصل الاجتماعي', 'Social Media Management', 'إدارة شاملة لحساباتك على منصات التواصل الاجتماعي مع محتوى إبداعي يومي', 'Comprehensive management of your social media accounts with daily creative content', 1200.00, '30 يوم', ARRAY['إدارة يومية', 'محتوى إبداعي', 'تقارير شهرية', 'رد على التعليقات'], 'marketing', 'التسويق', true, true),

('مونتاج فيديو احترافي', 'Professional Video Editing', 'مونتاج فيديو احترافي بأعلى جودة مع مؤثرات بصرية وصوتية مميزة', 'Professional video editing with highest quality and special visual and audio effects', 800.00, '5-7 أيام', ARRAY['مونتاج احترافي', 'مؤثرات بصرية', 'موسيقى مجانية', 'تصدير عالي الجودة'], 'video-editing', 'مونتاج الفيديو', true, false),

('تصميم موقع إلكتروني', 'Website Design', 'تصميم موقع إلكتروني متجاوب وحديث يناسب جميع الأجهزة', 'Responsive and modern website design suitable for all devices', 2500.00, '10-14 يوم', ARRAY['تصميم متجاوب', 'لوحة تحكم', 'تحسين محركات البحث', 'استضافة مجانية لسنة'], 'web-development', 'تطوير المواقع', true, true),

('كتابة محتوى تسويقي', 'Marketing Content Writing', 'كتابة محتوى تسويقي جذاب ومؤثر لجميع منصات التواصل الاجتماعي', 'Attractive and effective marketing content writing for all social media platforms', 300.00, '1-2 يوم', ARRAY['محتوى حصري', 'مناسب للجمهور المستهدف', 'تحسين SEO', 'مراجعة مجانية'], 'content-writing', 'كتابة المحتوى', true, false),

('حملة إعلانية ممولة', 'Paid Advertising Campaign', 'إنشاء وإدارة حملات إعلانية ممولة على فيسبوك وإنستغرام وجوجل', 'Create and manage paid advertising campaigns on Facebook, Instagram and Google', 1500.00, '30 يوم', ARRAY['استهداف دقيق', 'تحليل النتائج', 'تحسين مستمر', 'تقارير أسبوعية'], 'advertising', 'الإعلانات', true, true);

-- 3. إدخال عملاء تجريبيين
INSERT INTO customers (email, username, full_name, phone, whatsapp_number, preferred_payment_method) VALUES
('customer1@example.com', 'customer1', 'أحمد محمد علي', '01234567890', '01234567890', 'vodafone_cash'),
('customer2@example.com', 'customer2', 'فاطمة أحمد حسن', '01098765432', '01098765432', 'instapay'),
('customer3@example.com', 'customer3', 'محمد عبدالله سالم', '01156789012', '01156789012', 'fawry'),
('customer4@example.com', 'customer4', 'سارة أحمد محمد', '01187654321', '01187654321', 'vodafone_cash'),
('customer5@example.com', 'customer5', 'خالد محمود علي', '01123456789', '01123456789', 'instapay');

-- 4. إدخال طلبات تجريبية
INSERT INTO orders (customer_id, service_id, service_name, quantity, price, total_amount, status, payment_status, payment_method, requirements) VALUES
((SELECT id FROM customers WHERE email = 'customer1@example.com'), 
 (SELECT id FROM services WHERE name_ar = 'تصميم شعار احترافي'), 
 'تصميم شعار احترافي', 1, 500.00, 500.00, 'in_progress', 'paid', 'vodafone_cash', 
 'نريد شعار لشركة تقنية متخصصة في تطوير التطبيقات'),

((SELECT id FROM customers WHERE email = 'customer2@example.com'), 
 (SELECT id FROM services WHERE name_ar = 'إدارة حسابات التواصل الاجتماعي'), 
 'إدارة حسابات التواصل الاجتماعي', 1, 1200.00, 1200.00, 'pending', 'pending', 'instapay', 
 'إدارة حسابات فيسبوك وإنستغرام لمطعم');

-- 5. إدخال اشتراكات تجريبية
INSERT INTO subscriptions (customer_id, plan_name, plan_type, services_included, monthly_price, status) VALUES
((SELECT id FROM customers WHERE email = 'customer3@example.com'), 
 'الباقة الاحترافية', 'professional', 
 ARRAY['تصميم شعار', 'إدارة حسابات التواصل', 'مونتاج فيديو'], 
 2500.00, 'active');

-- 6. إدخال عقارات تجريبية
INSERT INTO real_estate_listings (customer_id, property_type, listing_type, title, description, price, area, location, bedrooms, bathrooms, features, contact_phone, is_published) VALUES
((SELECT id FROM customers WHERE email = 'customer1@example.com'),
 'apartment', 'sale', 'شقة للبيع في المعادي', 'شقة مميزة في موقع حيوي بالمعادي، مطلة على النيل',
 2500000.00, 150.00, 'المعادي، القاهرة', 3, 2,
 ARRAY['مطلة على النيل', 'موقف سيارات', 'أمن وحراسة', 'قريبة من المترو'],
 '01234567890', true),

((SELECT id FROM customers WHERE email = 'customer2@example.com'),
 'house', 'sale', 'فيلا للبيع في الشيخ زايد', 'فيلا فاخرة في كمبوند راقي بالشيخ زايد',
 4500000.00, 300.00, 'الشيخ زايد، الجيزة', 4, 3,
 ARRAY['حديقة خاصة', 'مسبح', 'جراج لسيارتين', 'نادي صحي'],
 '01098765432', true),

((SELECT id FROM customers WHERE email = 'customer3@example.com'),
 'apartment', 'rent', 'شقة للإيجار في مدينة نصر', 'شقة مفروشة للإيجار في مدينة نصر',
 8000.00, 120.00, 'مدينة نصر، القاهرة', 2, 1,
 ARRAY['مفروشة بالكامل', 'تكييف مركزي', 'قريبة من الخدمات'],
 '01156789012', true);

-- 7. إدخال إعدادات النظام
INSERT INTO settings (key, value, description, category, is_public) VALUES
('site_name', '"Top Marketing Services"', 'اسم الموقع', 'general', true),
('contact_email', '"info@topmarketing.com"', 'البريد الإلكتروني للتواصل', 'contact', true),
('contact_phone', '"01068275557"', 'رقم الهاتف للتواصل', 'contact', true),
('whatsapp_number', '"01068275557"', 'رقم الواتساب للتواصل', 'contact', true),
('payment_phone', '"01068275557"', 'رقم الدفع اليدوي', 'payment', false),
('payment_methods', '["vodafone_cash", "instapay", "fawry"]', 'طرق الدفع المتاحة', 'payment', true),
('currency', '"EGP"', 'العملة الافتراضية', 'general', true),
('tax_rate', '0.14', 'معدل الضريبة', 'payment', false),
('facebook_url', '"https://facebook.com/topmarketing"', 'رابط فيسبوك', 'social', true),
('instagram_url', '"https://instagram.com/topmarketing"', 'رابط إنستجرام', 'social', true),
('youtube_url', '"https://youtube.com/topmarketing"', 'رابط يوتيوب', 'social', true),
('twitter_url', '"https://twitter.com/topmarketing"', 'رابط تويتر', 'social', true),
('linkedin_url', '"https://linkedin.com/company/topmarketing"', 'رابط لينكد إن', 'social', true),
('business_hours', '"السبت - الخميس: 9:00 ص - 6:00 م"', 'ساعات العمل', 'general', true),
('about_text', '"شركة توب ماركتنج للخدمات الرقمية والتسويقية"', 'نبذة عن الشركة', 'general', true);
