-- ===================================
-- إدخال بيانات تجريبية للاختبار
-- Top Marketing Services Platform
-- ===================================

-- 1. إدخال مدير رئيسي
INSERT INTO admins (email, username, password_hash, full_name, role) VALUES
('admin@topmarketing.com', 'admin', '$2a$10$example_hash_here', 'المدير العام', 'admin'),
('manager@topmarketing.com', 'manager1', '$2a$10$example_hash_here', 'مدير الخدمات', 'manager');

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
('customer3@example.com', 'customer3', 'محمد عبدالله سالم', '01156789012', '01156789012', 'fawry');

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
INSERT INTO real_estate_properties (customer_id, property_type, title, description, price, area, location, bedrooms, bathrooms, features, contact_phone, is_published) VALUES
((SELECT id FROM customers WHERE email = 'customer1@example.com'), 
 'apartment', 'شقة للبيع في المعادي', 'شقة مميزة في موقع حيوي بالمعادي، مطلة على النيل', 
 2500000.00, 150.00, 'المعادي، القاهرة', 3, 2, 
 ARRAY['مطلة على النيل', 'موقف سيارات', 'أمن وحراسة', 'قريبة من المترو'], 
 '01234567890', true),

((SELECT id FROM customers WHERE email = 'customer2@example.com'), 
 'house', 'فيلا للبيع في الشيخ زايد', 'فيلا فاخرة في كمبوند راقي بالشيخ زايد', 
 4500000.00, 300.00, 'الشيخ زايد، الجيزة', 4, 3, 
 ARRAY['حديقة خاصة', 'مسبح', 'جراج لسيارتين', 'نادي صحي'], 
 '01098765432', true);

-- 7. إدخال إعدادات النظام
INSERT INTO admin_settings (key, value, description) VALUES
('site_name', '"Top Marketing Services"', 'اسم الموقع'),
('contact_email', '"info@topmarketing.com"', 'البريد الإلكتروني للتواصل'),
('contact_phone', '"01234567890"', 'رقم الهاتف للتواصل'),
('whatsapp_number', '"01234567890"', 'رقم الواتساب للتواصل'),
('payment_methods', '["vodafone_cash", "instapay", "fawry"]', 'طرق الدفع المتاحة'),
('currency', '"EGP"', 'العملة الافتراضية'),
('tax_rate', '0.14', 'معدل الضريبة'),
('admin_permissions_' || (SELECT id FROM admins WHERE role = 'manager' LIMIT 1), '["orders", "customers", "services"]', 'صلاحيات المدير');
