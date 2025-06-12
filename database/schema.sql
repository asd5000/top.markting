-- 🗄️ قاعدة بيانات Top Marketing - النظام الإداري المتكامل

-- 👥 جدول المدراء والمستخدمين
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('super_admin', 'marketing_manager', 'support', 'content_manager', 'customer')),
    is_active BOOLEAN DEFAULT true,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🎯 جدول الخدمات الرئيسية
CREATE TABLE IF NOT EXISTS main_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    description TEXT,
    icon VARCHAR(100),
    category VARCHAR(50) NOT NULL CHECK (category IN ('design', 'marketing', 'video', 'data', 'web')),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🛠️ جدول الخدمات الفرعية
CREATE TABLE IF NOT EXISTS sub_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    main_service_id UUID REFERENCES main_services(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    duration_days INTEGER DEFAULT 7,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    features JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🛒 جدول الطلبات
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES users(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'payment_uploaded', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    payment_receipt_url TEXT,
    notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 📝 جدول عناصر الطلبات
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    sub_service_id UUID REFERENCES sub_services(id),
    service_name VARCHAR(255) NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 📦 جدول الباقات الشهرية (إدارة الصفحات)
CREATE TABLE IF NOT EXISTS packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100) NOT NULL DEFAULT 'social_media', -- design, social_media, marketing, comprehensive
    price DECIMAL(10,2) NOT NULL,
    duration_months INTEGER DEFAULT 1,

    -- تفاصيل الباقة
    designs_count INTEGER DEFAULT 0,
    videos_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    has_auto_reply BOOLEAN DEFAULT false,
    ads_count INTEGER DEFAULT 0,

    -- إعدادات إضافية
    features JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    subscribers_count INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🔄 جدول الاشتراكات
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    package_id UUID REFERENCES packages(id),
    customer_id UUID REFERENCES users(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'pending')),
    payment_receipt_url TEXT,
    auto_renew BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🏢 جدول العقارات
CREATE TABLE IF NOT EXISTS real_estate (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES users(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_whatsapp VARCHAR(20),
    
    -- بيانات العقار
    property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('apartment', 'villa', 'land', 'shop', 'house', 'office')),
    operation_type VARCHAR(50) NOT NULL CHECK (operation_type IN ('sale', 'rent')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- الموقع
    governorate VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    street VARCHAR(255),
    landmarks TEXT,
    
    -- التفاصيل
    area DECIMAL(10,2),
    rooms INTEGER,
    bathrooms INTEGER,
    floor_number INTEGER,
    total_floors INTEGER,
    age_years INTEGER,
    finishing VARCHAR(50) CHECK (finishing IN ('finished', 'semi_finished', 'unfinished', 'luxury')),
    
    -- السعر
    price DECIMAL(15,2) NOT NULL,
    price_negotiable BOOLEAN DEFAULT false,
    payment_method VARCHAR(50) CHECK (payment_method IN ('cash', 'installments', 'both')),
    
    -- الحالة الإدارية
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'featured')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
    admin_notes TEXT,
    rejection_reason TEXT,
    
    -- إحصائيات
    views_count INTEGER DEFAULT 0,
    inquiries_count INTEGER DEFAULT 0,
    
    -- الصور
    images JSONB DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 💳 جدول الإيصالات والمدفوعات
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id),
    subscription_id UUID REFERENCES subscriptions(id),
    customer_name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    receipt_url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🎨 جدول سابقة الأعمال
CREATE TABLE IF NOT EXISTS portfolio (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    service_ids JSONB DEFAULT '[]',
    images JSONB DEFAULT '[]',
    client_name VARCHAR(255),
    completion_date DATE,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🔧 جدول إعدادات النظام
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'text' CHECK (setting_type IN ('text', 'number', 'boolean', 'json')),
    description TEXT,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 📊 جدول سجل الأنشطة
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- service, package, order, user, etc.
    entity_id UUID,
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🔔 جدول الإشعارات
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 📈 جدول إحصائيات النظام
CREATE TABLE IF NOT EXISTS system_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stat_date DATE NOT NULL,
    total_users INTEGER DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    total_properties INTEGER DEFAULT 0,
    active_subscriptions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🛒 جدول الطلبات
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20) NOT NULL,
    customer_whatsapp VARCHAR(20),
    customer_address TEXT,
    notes TEXT,
    payment_method VARCHAR(50) NOT NULL,
    receipt_url TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🛒 جدول عناصر الطلبات
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id),
    sub_service_id UUID REFERENCES sub_services(id),
    service_name VARCHAR(255) NOT NULL,
    sub_service_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 📝 إدراج البيانات الأولية للخدمات الرئيسية
INSERT INTO main_services (name, name_en, description, icon, category, sort_order) VALUES
('تصميم', 'Design', 'خدمات التصميم الجرافيكي والهوية البصرية', '🎨', 'design', 1),
('تسويق', 'Marketing', 'خدمات التسويق الرقمي والإعلانات', '📢', 'marketing', 2),
('مونتاج', 'Video Editing', 'خدمات المونتاج والرسوم المتحركة', '🎬', 'video', 3),
('سحب البيانات', 'Data Extraction', 'خدمات استخراج وتحليل البيانات', '📊', 'data', 4),
('مواقع الويب', 'Web Development', 'خدمات تطوير المواقع والتطبيقات', '🌐', 'web', 5);

-- 📦 إدراج الباقات الأولية
INSERT INTO packages (name, description, price, duration_months, features) VALUES
('باقة عادية', 'مثالية للشركات الصغيرة والمشاريع الناشئة', 500, 1, '["إدارة صفحة واحدة", "5 منشورات أسبوعياً", "رد على التعليقات", "تقرير شهري"]'),
('باقة متوسطة', 'الأكثر شعبية للشركات المتوسطة', 800, 1, '["إدارة 3 صفحات", "10 منشورات أسبوعياً", "رد على التعليقات", "تقارير أسبوعية", "حملة إعلانية"]'),
('باقة احترافية', 'للشركات الكبيرة والعلامات التجارية المتقدمة', 1200, 1, '["إدارة 5 صفحات", "15 منشور أسبوعياً", "تقارير يومية", "3 حملات إعلانية", "استشارة مجانية"]');

-- 🔧 إدراج الإعدادات الأولية
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'Top Marketing', 'text', 'اسم الموقع'),
('site_description', 'شركة التسويق الرقمي الرائدة', 'text', 'وصف الموقع'),
('primary_color', '#dc2626', 'text', 'اللون الأساسي للموقع'),
('secondary_color', '#1f2937', 'text', 'اللون الثانوي للموقع'),
('phone_number', '01068275557', 'text', 'رقم الهاتف'),
('whatsapp_number', '01068275557', 'text', 'رقم الواتساب'),
('email', 'info@topmarketing.com', 'text', 'البريد الإلكتروني'),
('facebook_url', '', 'text', 'رابط فيسبوك'),
('instagram_url', '', 'text', 'رابط إنستاجرام'),
('twitter_url', '', 'text', 'رابط تويتر'),
('youtube_url', '', 'text', 'رابط يوتيوب'),
('vodafone_cash', '01068275557', 'text', 'رقم فودافون كاش'),
('instapay', '01068275557', 'text', 'رقم إنستاباي'),
('fori_pay', '01068275557', 'text', 'رقم فوري باي'),
('announcement_text', '', 'text', 'نص الإعلان'),
('announcement_active', 'false', 'boolean', 'تفعيل الإعلان'),
('logo_url', '', 'text', 'رابط شعار الموقع'),
('favicon_url', '', 'text', 'رابط أيقونة الموقع');
