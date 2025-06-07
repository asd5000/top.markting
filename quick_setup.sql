-- ===================================
-- إعداد سريع لقاعدة البيانات
-- ===================================

-- إنشاء جدول الخدمات
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    description_ar TEXT,
    description_en TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'EGP',
    duration_text VARCHAR(100),
    features TEXT[],
    category VARCHAR(100),
    category_name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء جدول العملاء
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    whatsapp_number VARCHAR(20),
    preferred_payment_method VARCHAR(50),
    total_spent DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- إنشاء جدول المديرين
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'manager',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- منح الصلاحيات
GRANT ALL ON services TO anon, authenticated;
GRANT ALL ON customers TO anon, authenticated;
GRANT ALL ON admins TO anon, authenticated;

-- إدخال خدمات تجريبية
INSERT INTO services (name_ar, name_en, description_ar, description_en, price, duration_text, features, category, category_name, is_active, is_featured) VALUES
('تصميم شعار احترافي', 'Professional Logo Design', 'تصميم شعار احترافي يعكس هوية علامتك التجارية بأعلى جودة ممكنة', 'Professional logo design that reflects your brand identity with highest quality', 500.00, '2-3 أيام', ARRAY['تصميم احترافي', '3 مراجعات مجانية', 'ملفات عالية الجودة'], 'design', 'التصميم', true, true),

('إدارة حسابات التواصل الاجتماعي', 'Social Media Management', 'إدارة شاملة لحساباتك على منصات التواصل الاجتماعي مع محتوى إبداعي يومي', 'Comprehensive management of your social media accounts with daily creative content', 1200.00, '30 يوم', ARRAY['إدارة يومية', 'محتوى إبداعي', 'تقارير شهرية'], 'marketing', 'التسويق', true, true),

('مونتاج فيديو احترافي', 'Professional Video Editing', 'مونتاج فيديو احترافي بأعلى جودة مع مؤثرات بصرية وصوتية مميزة', 'Professional video editing with highest quality and special effects', 800.00, '5-7 أيام', ARRAY['مونتاج احترافي', 'مؤثرات بصرية', 'موسيقى مجانية'], 'video-editing', 'مونتاج الفيديو', true, false),

('تصميم موقع إلكتروني', 'Website Design', 'تصميم موقع إلكتروني متجاوب وحديث يناسب جميع الأجهزة', 'Responsive and modern website design suitable for all devices', 2500.00, '10-14 يوم', ARRAY['تصميم متجاوب', 'لوحة تحكم', 'تحسين محركات البحث'], 'web-development', 'تطوير المواقع', true, true),

('كتابة محتوى تسويقي', 'Marketing Content Writing', 'كتابة محتوى تسويقي جذاب ومؤثر لجميع منصات التواصل الاجتماعي', 'Attractive and effective marketing content writing for all social media platforms', 300.00, '1-2 يوم', ARRAY['محتوى حصري', 'مناسب للجمهور المستهدف', 'تحسين SEO'], 'content-writing', 'كتابة المحتوى', true, false);

-- إدخال مدير تجريبي
INSERT INTO admins (email, username, password_hash, full_name, role) VALUES
('admin@topmarketing.com', 'admin', '$2a$10$example_hash_here', 'المدير العام', 'admin');

-- إدخال عميل تجريبي
INSERT INTO customers (email, username, full_name, phone, whatsapp_number, preferred_payment_method) VALUES
('customer@example.com', 'customer1', 'أحمد محمد علي', '01234567890', '01234567890', 'vodafone_cash');

-- اختبار البيانات
SELECT 'services' as table_name, COUNT(*) as count FROM services
UNION ALL
SELECT 'admins' as table_name, COUNT(*) as count FROM admins
UNION ALL
SELECT 'customers' as table_name, COUNT(*) as count FROM customers;
