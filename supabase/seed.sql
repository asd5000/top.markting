-- Insert default admin user
INSERT INTO admins (email, name, role, permissions, is_active) VALUES
('admin@topmarketing.com', 'مدير النظام', 'super_admin', 
 '{"customers": true, "orders": true, "services": true, "subscriptions": true, "real_estate": true, "admins": true}', 
 true);

-- Insert sample services
INSERT INTO services (name, description, category, price, duration, features, is_active) VALUES
('تصميم لوجو احترافي', 'تصميم لوجو احترافي مع 3 مفاهيم مختلفة وتعديلات مجانية', 'design', 500.00, '3-5 أيام', 
 '["3 مفاهيم تصميم", "تعديلات مجانية", "ملفات عالية الجودة", "حقوق ملكية كاملة"]', true),

('إدارة حسابات التواصل الاجتماعي', 'إدارة شاملة لحسابات التواصل الاجتماعي مع محتوى يومي', 'marketing', 1500.00, 'شهرياً', 
 '["محتوى يومي", "تصميمات حصرية", "تفاعل مع المتابعين", "تقارير شهرية"]', true),

('تطوير موقع إلكتروني', 'تطوير موقع إلكتروني متجاوب مع لوحة تحكم', 'web-development', 3000.00, '2-3 أسابيع', 
 '["تصميم متجاوب", "لوحة تحكم", "SEO محسن", "استضافة مجانية لسنة"]', true),

('استخراج بيانات العملاء', 'استخراج وتحليل بيانات العملاء المحتملين', 'data-extraction', 800.00, '1-2 أيام', 
 '["بيانات دقيقة", "تحليل شامل", "تصدير Excel", "تحديث دوري"]', true),

('زيادة متابعين حقيقيين', 'زيادة المتابعين الحقيقيين على منصات التواصل الاجتماعي', 'followers', 300.00, '1-2 أسابيع', 
 '["متابعين حقيقيين", "نمو طبيعي", "ضمان عدم النقصان", "تقارير يومية"]', true),

('مونتاج فيديو احترافي', 'مونتاج وتحرير فيديوهات احترافية للتسويق', 'video-editing', 600.00, '3-5 أيام', 
 '["مونتاج احترافي", "مؤثرات بصرية", "موسيقى مجانية", "تعديلات مجانية"]', true),

('التسويق العقاري', 'خدمات تسويق عقاري شاملة للبيع والشراء', 'real-estate', 1000.00, 'حسب المشروع', 
 '["تسويق شامل", "شبكة واسعة", "متابعة مستمرة", "عمولة تنافسية"]', true);

-- Insert sample customers
INSERT INTO customers (email, name, phone, role, total_spent, whatsapp_number, company) VALUES
('ahmed.hassan@email.com', 'أحمد حسن', '+201234567890', 'customer', 2500.00, '+201234567890', 'شركة الأمل للتجارة'),
('fatima.ali@email.com', 'فاطمة علي', '+201098765432', 'customer', 1800.00, '+201098765432', 'مؤسسة النور'),
('mohamed.salem@email.com', 'محمد سالم', '+201555666777', 'customer', 3200.00, '+201555666777', 'شركة المستقبل'),
('sara.ahmed@email.com', 'سارة أحمد', '+201444555666', 'customer', 950.00, '+201444555666', 'متجر الأناقة'),
('omar.mahmoud@email.com', 'عمر محمود', '+201333444555', 'customer', 1600.00, '+201333444555', 'مطعم الذوق الرفيع');

-- Insert sample orders
INSERT INTO orders (customer_id, service_id, service_name, quantity, price, total_amount, status, payment_status, payment_method, requirements) VALUES
((SELECT id FROM customers WHERE email = 'ahmed.hassan@email.com'), 'design-logo', 'تصميم لوجو احترافي', 1, 500.00, 500.00, 'completed', 'paid', 'vodafone_cash', 'لوجو لشركة تجارية في مجال الإلكترونيات'),
((SELECT id FROM customers WHERE email = 'fatima.ali@email.com'), 'social-media', 'إدارة حسابات التواصل الاجتماعي', 1, 1500.00, 1500.00, 'in_progress', 'paid', 'fawry', 'إدارة حسابات فيسبوك وإنستجرام لمؤسسة تعليمية'),
((SELECT id FROM customers WHERE email = 'mohamed.salem@email.com'), 'web-development', 'تطوير موقع إلكتروني', 1, 3000.00, 3000.00, 'pending', 'pending', 'bank_transfer', 'موقع شركة مع متجر إلكتروني'),
((SELECT id FROM customers WHERE email = 'sara.ahmed@email.com'), 'followers', 'زيادة متابعين حقيقيين', 1, 300.00, 300.00, 'completed', 'paid', 'instapay', '1000 متابع حقيقي لحساب إنستجرام'),
((SELECT id FROM customers WHERE email = 'omar.mahmoud@email.com'), 'video-editing', 'مونتاج فيديو احترافي', 2, 600.00, 1200.00, 'in_progress', 'paid', 'vodafone_cash', 'فيديوهات ترويجية للمطعم');

-- Insert sample subscriptions
INSERT INTO subscriptions (customer_id, package_id, package_name, package_type, price, status, payment_status, start_date, end_date, limits) VALUES
((SELECT id FROM customers WHERE email = 'ahmed.hassan@email.com'), 'medium', 'الباقة المتوسطة', 'medium', 2500.00, 'active', 'paid', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 month',
 '{"designs": 10, "videos": 3, "data_extraction": 2, "followers": 1000, "web_development": 1}'),
((SELECT id FROM customers WHERE email = 'fatima.ali@email.com'), 'basic', 'الباقة العادية', 'basic', 1500.00, 'active', 'paid', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 month',
 '{"designs": 5, "videos": 1, "data_extraction": 1, "followers": 500}');

-- Insert sample real estate clients
INSERT INTO real_estate_clients (name, phone, email, type, property, requirements, notes) VALUES
('خالد محمد', '+201111222333', 'khaled.mohamed@email.com', 'seller', 
 '{"type": "apartment", "title": "شقة 120 متر في المعادي", "price": 2500000, "location": {"governorate": "القاهرة", "area": "المعادي"}, "details": {"rooms": 3, "bathrooms": 2, "floor": 5}}',
 null, 'شقة في موقع متميز بالمعادي'),

('نورا أحمد', '+201222333444', 'nora.ahmed@email.com', 'buyer',
 null,
 '{"propertyTypes": ["apartment", "villa"], "budget": {"min": 1500000, "max": 3000000}, "preferredLocations": [{"governorate": "الجيزة"}, {"governorate": "القاهرة"}], "notes": "تفضل الأدوار العلوية مع إطلالة"}',
 'عميلة جدية تبحث عن شقة أو فيلا'),

('أحمد سعد', '+201333444555', 'ahmed.saad@email.com', 'seller',
 '{"type": "villa", "title": "فيلا 300 متر في الشيخ زايد", "price": 4500000, "location": {"governorate": "الجيزة", "area": "الشيخ زايد"}, "details": {"rooms": 4, "bathrooms": 3, "garden": true}}',
 null, 'فيلا حديثة في كمبوند راقي'),

('مريم حسن', '+201444555666', 'mariam.hassan@email.com', 'buyer',
 null,
 '{"propertyTypes": ["house"], "budget": {"min": 800000, "max": 1500000}, "preferredLocations": [{"governorate": "القليوبية"}], "notes": "تفضل المنازل الشعبية"}',
 'تبحث عن منزل في القليوبية');

-- Update sequences to avoid conflicts
SELECT setval('customers_id_seq', (SELECT MAX(id) FROM customers));
SELECT setval('services_id_seq', (SELECT MAX(id) FROM services));
SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders));
SELECT setval('subscriptions_id_seq', (SELECT MAX(id) FROM subscriptions));
SELECT setval('real_estate_clients_id_seq', (SELECT MAX(id) FROM real_estate_clients));
SELECT setval('admins_id_seq', (SELECT MAX(id) FROM admins));
