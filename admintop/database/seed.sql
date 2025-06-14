-- بيانات أولية لنظام Top Marketing
-- Initial Data for Top Marketing System

-- إدراج مدير أساسي
INSERT INTO admins (username, email, name, password_hash, role, is_active) VALUES
('asdasheref', 'asdasheref@gmail.com', 'أشرف الشريف', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin', true);

-- إدراج طرق الدفع الأساسية
INSERT INTO payment_methods (name, account_number, icon, description, sort_order, is_active) VALUES
('فودافون كاش', '01068275557', 'phone', 'الدفع عبر فودافون كاش', 1, true),
('فوري باي', 'fori_pay_account', 'credit-card', 'الدفع عبر فوري باي', 2, true),
('إنستاباي', 'instapay_account', 'smartphone', 'الدفع عبر إنستاباي', 3, true),
('واتساب (دولي)', '+201068275557', 'message-circle', 'للمدفوعات الدولية عبر واتساب', 4, true);

-- إدراج خدمات أساسية
INSERT INTO services (name, name_en, description, short_description, icon, custom_color, category, is_featured, is_active, sort_order) VALUES
('تصميم', 'Design', 'خدمات التصميم الجرافيكي والهوية البصرية', 'تصميم احترافي لجميع احتياجاتك', 'palette', '#FF6B6B', 'design', true, true, 1),
('تسويق', 'Marketing', 'خدمات التسويق الرقمي والحملات الإعلانية', 'تسويق فعال لنمو أعمالك', 'megaphone', '#4ECDC4', 'marketing', true, true, 2),
('سحب الداتا', 'Data Extraction', 'خدمات استخراج وتحليل البيانات', 'استخراج البيانات بدقة عالية', 'database', '#45B7D1', 'data', false, true, 3),
('المواقع', 'Websites', 'تطوير وتصميم المواقع الإلكترونية', 'مواقع احترافية وسريعة', 'globe', '#96CEB4', 'web', true, true, 4),
('المونتاج', 'Video Editing', 'خدمات مونتاج وتحرير الفيديو', 'مونتاج احترافي لفيديوهاتك', 'video', '#FFEAA7', 'video', false, true, 5);

-- إدراج خدمات فرعية للتصميم
INSERT INTO sub_services (service_id, name, name_en, description, price, delivery_time, features, is_active, sort_order) VALUES
((SELECT id FROM services WHERE name = 'تصميم'), 'تصميم لوجو', 'Logo Design', 'تصميم شعار احترافي لعلامتك التجارية', 150.00, '3-5 أيام', '["3 مفاهيم أولية", "مراجعات غير محدودة", "ملفات عالية الجودة", "دليل الاستخدام"]', true, 1),
((SELECT id FROM services WHERE name = 'تصميم'), 'تصميم بوستر', 'Poster Design', 'تصميم بوسترات إعلانية جذابة', 75.00, '1-2 أيام', '["تصميم مخصص", "جودة طباعة عالية", "مراجعة واحدة مجانية"]', true, 2),
((SELECT id FROM services WHERE name = 'تصميم'), 'تصميم بروشور', 'Brochure Design', 'تصميم بروشورات تسويقية احترافية', 200.00, '5-7 أيام', '["تصميم ثنائي الطي", "محتوى تسويقي", "ملفات جاهزة للطباعة"]', true, 3);

-- إدراج خدمات فرعية للتسويق
INSERT INTO sub_services (service_id, name, name_en, description, price, delivery_time, features, is_active, sort_order) VALUES
((SELECT id FROM services WHERE name = 'تسويق'), 'إدارة صفحات السوشيال ميديا', 'Social Media Management', 'إدارة شاملة لصفحات التواصل الاجتماعي', 500.00, 'شهري', '["إدارة يومية", "محتوى إبداعي", "تفاعل مع الجمهور", "تقارير شهرية"]', true, 1),
((SELECT id FROM services WHERE name = 'تسويق'), 'حملة إعلانية', 'Ad Campaign', 'حملات إعلانية مدفوعة على منصات التواصل', 300.00, '7-10 أيام', '["استهداف دقيق", "تصميم الإعلانات", "متابعة يومية", "تقرير النتائج"]', true, 2),
((SELECT id FROM services WHERE name = 'تسويق'), 'تحسين محركات البحث', 'SEO', 'تحسين موقعك لمحركات البحث', 400.00, '2-4 أسابيع', '["تحليل الكلمات المفتاحية", "تحسين المحتوى", "بناء الروابط", "تقارير شهرية"]', true, 3);

-- إدراج باقات أساسية
INSERT INTO packages (name, name_en, description, package_type, price, monthly_price, duration_months, features, max_designs, max_videos, includes_management, includes_analytics, is_active, sort_order) VALUES
('باقة البداية', 'Starter Package', 'باقة مثالية للشركات الناشئة', 'social_media', 299.00, 299.00, 1, '["10 تصاميم شهرياً", "إدارة صفحة واحدة", "تقرير شهري", "دعم فني"]', 10, 0, true, true, true, 1),
('باقة الأعمال', 'Business Package', 'باقة شاملة للشركات المتوسطة', 'social_media', 599.00, 599.00, 1, '["20 تصميم شهرياً", "5 فيديوهات", "إدارة 3 صفحات", "حملة إعلانية", "تقارير تفصيلية"]', 20, 5, true, true, true, 2),
('باقة المؤسسات', 'Enterprise Package', 'باقة متقدمة للمؤسسات الكبيرة', 'social_media', 999.00, 999.00, 1, '["تصاميم غير محدودة", "10 فيديوهات", "إدارة صفحات متعددة", "حملات متقدمة", "مدير حساب مخصص"]', 999, 10, true, true, true, 3);

-- إدراج فئات معرض الأعمال
INSERT INTO portfolio (title, description, category, type, is_featured, likes_count, views_count, tags, client_name, is_active) VALUES
('تصميم هوية بصرية لشركة تقنية', 'تصميم شامل للهوية البصرية شمل اللوجو والألوان والخطوط', 'هوية بصرية', 'image', true, 25, 150, '["هوية بصرية", "لوجو", "تقنية"]', 'شركة التقنية المتقدمة', true),
('حملة إعلانية لمطعم', 'حملة تسويقية شاملة على منصات التواصل الاجتماعي', 'حملة إعلانية', 'image', true, 18, 89, '["تسويق", "مطاعم", "سوشيال ميديا"]', 'مطعم الذواقة', true),
('فيديو ترويجي لمنتج', 'فيديو ترويجي احترافي لإطلاق منتج جديد', 'فيديو إعلاني', 'video', false, 12, 67, '["فيديو", "ترويج", "منتج"]', 'شركة الابتكار', true);

-- إدراج إعدادات النظام الأساسية
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'Top Marketing', 'text', 'اسم الموقع'),
('site_description', 'نظام إدارة التسويق المتكامل', 'text', 'وصف الموقع'),
('contact_email', 'info@topmarketing.com', 'email', 'البريد الإلكتروني للتواصل'),
('contact_phone', '+201068275557', 'text', 'رقم الهاتف للتواصل'),
('whatsapp_number', '+201068275557', 'text', 'رقم الواتساب'),
('facebook_page', 'https://facebook.com/topmarketing', 'url', 'صفحة الفيسبوك'),
('instagram_page', 'https://instagram.com/topmarketing', 'url', 'صفحة الإنستجرام'),
('maintenance_mode', 'false', 'boolean', 'وضع الصيانة'),
('allow_registration', 'true', 'boolean', 'السماح بالتسجيل الجديد'),
('max_file_size', '10', 'number', 'الحد الأقصى لحجم الملف (MB)');

-- إدراج روابط إضافية
INSERT INTO additional_links (name, url, icon, sort_order, is_active) VALUES
('سياسة الخصوصية', '/privacy-policy', 'shield', 1, true),
('شروط الاستخدام', '/terms-of-service', 'file-text', 2, true),
('اتصل بنا', '/contact', 'phone', 3, true),
('الأسئلة الشائعة', '/faq', 'help-circle', 4, true);

-- إدراج بيانات تجريبية للعقارات
INSERT INTO real_estate (customer_name, customer_email, customer_phone, property_type, operation_type, title, description, governorate, city, price, area, rooms, bathrooms, status, sale_status) VALUES
('أحمد محمد', 'ahmed@example.com', '01012345678', 'شقة', 'بيع', 'شقة 3 غرف في المعادي', 'شقة مميزة في موقع حيوي بالمعادي، مفروشة بالكامل', 'القاهرة', 'المعادي', 2500000.00, 150.0, 3, 2, 'approved', 'new'),
('فاطمة أحمد', 'fatma@example.com', '01098765432', 'فيلا', 'بيع', 'فيلا فاخرة في الشيخ زايد', 'فيلا مستقلة بحديقة وحمام سباحة', 'الجيزة', 'الشيخ زايد', 8500000.00, 400.0, 5, 4, 'approved', 'new'),
('محمد علي', 'mohamed@example.com', '01156789012', 'محل تجاري', 'إيجار', 'محل تجاري في وسط البلد', 'محل في موقع تجاري ممتاز', 'القاهرة', 'وسط البلد', 15000.00, 50.0, 0, 1, 'pending', 'new');

-- تحديث العدادات
SELECT setval(pg_get_serial_sequence('admins', 'id'), (SELECT MAX(id) FROM admins));
SELECT setval(pg_get_serial_sequence('services', 'id'), (SELECT MAX(id) FROM services));
SELECT setval(pg_get_serial_sequence('sub_services', 'id'), (SELECT MAX(id) FROM sub_services));
SELECT setval(pg_get_serial_sequence('packages', 'id'), (SELECT MAX(id) FROM packages));
SELECT setval(pg_get_serial_sequence('payment_methods', 'id'), (SELECT MAX(id) FROM payment_methods));
SELECT setval(pg_get_serial_sequence('portfolio', 'id'), (SELECT MAX(id) FROM portfolio));
SELECT setval(pg_get_serial_sequence('real_estate', 'id'), (SELECT MAX(id) FROM real_estate));
SELECT setval(pg_get_serial_sequence('system_settings', 'id'), (SELECT MAX(id) FROM system_settings));
SELECT setval(pg_get_serial_sequence('additional_links', 'id'), (SELECT MAX(id) FROM additional_links));
