-- إدراج البيانات الأولية لنظام Top Marketing الإداري

-- إدراج المستخدمين الإداريين
INSERT INTO users (email, name, role, is_active) VALUES
('asdasheref@gmail.com', 'أشرف الشريف', 'super_admin', true),
('marketing@topmarketing.com', 'سارة أحمد', 'marketing_manager', true),
('support@topmarketing.com', 'محمد علي', 'support', true),
('realestate@topmarketing.com', 'فاطمة حسن', 'real_estate_manager', true),
('packages@topmarketing.com', 'عمر خالد', 'packages_manager', true),
('content@topmarketing.com', 'نور الدين', 'content_manager', true)
ON CONFLICT (email) DO NOTHING;

-- إدراج الخدمات الأساسية
INSERT INTO main_services (name, description, icon, category) VALUES
('تصميم', 'خدمات التصميم الجرافيكي والهوية البصرية', '🎨', 'design'),
('تسويق', 'خدمات التسويق الرقمي والإعلانات', '📢', 'marketing'),
('مونتاج', 'خدمات المونتاج والفيديو', '🎬', 'video'),
('سحب البيانات', 'خدمات استخراج وتحليل البيانات', '📊', 'data'),
('مواقع الويب', 'خدمات تطوير المواقع والتطبيقات', '🌐', 'web')
ON CONFLICT (name) DO NOTHING;

-- إدراج الخدمات الفرعية للتصميم
INSERT INTO sub_services (main_service_id, name, description, price)
SELECT ms.id, sub.name, sub.description, sub.price
FROM main_services ms, (VALUES
  ('هوية بصرية', 'تصميم هوية بصرية متكاملة للعلامة التجارية', 2000.00),
  ('لوجو (شعار)', 'تصميم شعار احترافي ومميز', 500.00),
  ('بنر', 'تصميم بنرات إعلانية جذابة ومؤثرة', 200.00),
  ('تصميم ورقي', 'تصميم المطبوعات والكتيبات والبروشورات', 400.00),
  ('تصميم سوشيال ميديا', 'تصميم منشورات وسائل التواصل الاجتماعي', 150.00),
  ('صورة مصغرة لليوتيوب', 'تصميم thumbnails احترافية لمقاطع اليوتيوب', 100.00),
  ('غلاف (فيسبوك / يوتيوب / تويتر)', 'تصميم أغلفة احترافية لجميع المنصات', 300.00)
) AS sub(name, description, price)
WHERE ms.name = 'تصميم';

-- إدراج الخدمات الفرعية للتسويق
INSERT INTO sub_services (main_service_id, name, description, price)
SELECT ms.id, sub.name, sub.description, sub.price
FROM main_services ms, (VALUES
  ('إنشاء متجر Google', 'إنشاء وإعداد متجر احترافي على Google', 400.00),
  ('تسويق منتج', 'حملات تسويقية شاملة للمنتجات', 800.00),
  ('تسويق صفحات', 'إدارة وتسويق صفحات السوشيال ميديا', 600.00),
  ('إنشاء خريطة Google', 'إضافة النشاط التجاري على خرائط Google', 300.00),
  ('خطة تسويقية', 'وضع استراتيجية تسويقية متكاملة', 1500.00),
  ('تسويق عقاري', 'حملات تسويقية متخصصة للعقارات', 1000.00)
) AS sub(name, description, price)
WHERE ms.name = 'تسويق';

-- إدراج الخدمات الفرعية للمونتاج
INSERT INTO sub_services (main_service_id, name, description, price)
SELECT ms.id, sub.name, sub.description, sub.price
FROM main_services ms, (VALUES
  ('فيديو إعلاني', 'إنتاج فيديوهات إعلانية احترافية ومؤثرة', 1200.00),
  ('فيديو تعريفي', 'إنتاج فيديوهات تعريفية للشركات والمنتجات', 1000.00),
  ('موشن جرافيك', 'إنتاج رسوم متحركة وتأثيرات بصرية احترافية', 1500.00),
  ('ريلز (Reels)', 'إنتاج مقاطع ريلز قصيرة وجذابة', 300.00),
  ('إنترو (Intro)', 'إنتاج مقدمات احترافية للفيديوهات والقنوات', 400.00)
) AS sub(name, description, price)
WHERE ms.name = 'مونتاج';

-- إدراج الخدمات الفرعية لسحب البيانات
INSERT INTO sub_services (main_service_id, name, description, price)
SELECT ms.id, sub.name, sub.description, sub.price
FROM main_services ms, (VALUES
  ('داتا مصانع', 'قواعد بيانات المصانع والوحدات الإنتاجية', 900.00),
  ('داتا مصنفة حسب النشاط', 'بيانات مصنفة حسب نوع النشاط التجاري', 800.00),
  ('داتا محافظات', 'قواعد بيانات شاملة لجميع المحافظات', 700.00),
  ('داتا رجال أعمال', 'قواعد بيانات رجال الأعمال والمستثمرين', 1200.00),
  ('داتا منافسين', 'تحليل وبيانات المنافسين في السوق', 1000.00)
) AS sub(name, description, price)
WHERE ms.name = 'سحب البيانات';

-- إدراج الخدمات الفرعية للمواقع
INSERT INTO sub_services (main_service_id, name, description, price)
SELECT ms.id, sub.name, sub.description, sub.price
FROM main_services ms, (VALUES
  ('إنشاء موقع شخصي', 'تطوير موقع شخصي احترافي ومميز', 1800.00),
  ('موقع شركة', 'تطوير موقع شركة متكامل وشامل', 3500.00),
  ('صفحة هبوط', 'تطوير صفحة هبوط احترافية ومحسنة للتحويل', 1200.00),
  ('متجر إلكتروني', 'تطوير متجر إلكتروني متكامل مع نظام دفع', 5000.00),
  ('ربط دومين واستضافة', 'ربط وإعداد الدومين والاستضافة', 500.00),
  ('تصميم واجهة مستخدم (UI/UX)', 'تصميم تجربة مستخدم احترافية', 2000.00)
) AS sub(name, description, price)
WHERE ms.name = 'مواقع الويب';

-- إدراج باقات إدارة الصفحات (السوشيال ميديا)
INSERT INTO packages (name, description, price, duration_months, features, is_active) VALUES
('باقة عادية', 'إدارة أساسية للصفحات', 500.00, 1, '["إدارة صفحة واحدة", "5 منشورات أسبوعياً", "رد على التعليقات", "تقرير شهري"]', true),
('باقة متوسطة', 'إدارة متقدمة للصفحات', 800.00, 1, '["إدارة 3 صفحات", "10 منشورات أسبوعياً", "رد على التعليقات", "تقارير أسبوعية", "حملة إعلانية"]', true),
('باقة احترافية', 'إدارة شاملة للصفحات', 1200.00, 1, '["إدارة 5 صفحات", "15 منشور أسبوعياً", "رد على التعليقات", "تقارير يومية", "3 حملات إعلانية", "استشارة مجانية"]', true)
ON CONFLICT (name) DO NOTHING;

-- إدراج بيانات عقارات تجريبية
INSERT INTO real_estate (client_name, client_phone, client_email, client_type, property_type, title, description, location, city, area, price, rooms, bathrooms, floor, age, has_garden, has_parking, has_elevator, has_balcony, is_furnished, status) VALUES
('محمد أحمد', '01012345678', 'mohamed@example.com', 'seller', 'apartment', 'شقة للبيع في المعادي', 'شقة 3 غرف وصالة في موقع مميز', 'المعادي الجديدة', 'القاهرة', 150, 2500000, 3, 2, 3, 5, false, true, true, true, false, 'active'),
('فاطمة علي', '01098765432', 'fatma@example.com', 'seller', 'villa', 'فيلا للبيع في الشيخ زايد', 'فيلا مستقلة بحديقة كبيرة', 'الشيخ زايد', 'الجيزة', 300, 4500000, 5, 3, 1, 2, true, true, false, true, true, 'active'),
('أحمد حسن', '01123456789', 'ahmed@example.com', 'buyer', 'land', 'أرض للبيع في العبور', 'قطعة أرض سكنية في موقع استراتيجي', 'مدينة العبور', 'القليوبية', 500, 1800000, 0, 0, 0, 0, false, false, false, false, false, 'pending');
