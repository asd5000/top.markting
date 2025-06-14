-- Top Marketing Database Schema
-- نظام إدارة التسويق المتكامل - هيكل قاعدة البيانات

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- جدول المستخدمين (الزوار والعملاء)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID,
    email VARCHAR NOT NULL UNIQUE,
    name VARCHAR NOT NULL,
    phone VARCHAR,
    password_hash VARCHAR,
    role VARCHAR DEFAULT 'visitor',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول المديرين
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR NOT NULL UNIQUE,
    email VARCHAR NOT NULL UNIQUE,
    name VARCHAR NOT NULL,
    password_hash VARCHAR NOT NULL,
    role VARCHAR NOT NULL CHECK (role IN ('super_admin', 'marketing_manager', 'support', 'content_manager', 'real_estate_manager', 'packages_manager')),
    permissions JSONB,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول الخدمات الأساسية
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    name_en VARCHAR,
    description TEXT,
    short_description TEXT,
    icon VARCHAR,
    image_url TEXT,
    icon_url TEXT,
    custom_color VARCHAR DEFAULT '#3B82F6',
    category VARCHAR,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    status VARCHAR DEFAULT 'active',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول الخدمات الفرعية
CREATE TABLE sub_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    name_en VARCHAR,
    description TEXT,
    price NUMERIC NOT NULL,
    image_url TEXT,
    icon_url TEXT,
    delivery_time VARCHAR,
    duration_days INTEGER DEFAULT 7,
    features JSONB,
    is_active BOOLEAN DEFAULT true,
    status VARCHAR DEFAULT 'active',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول الباقات
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    name_en VARCHAR,
    description TEXT,
    package_description TEXT,
    package_type VARCHAR DEFAULT 'social_media',
    price NUMERIC NOT NULL,
    monthly_price NUMERIC,
    duration_months INTEGER DEFAULT 1,
    features JSONB NOT NULL,
    
    -- تفاصيل التصميم
    max_designs INTEGER DEFAULT 0,
    designs_count INTEGER DEFAULT 0,
    design_price NUMERIC DEFAULT 0,
    
    -- تفاصيل الفيديو
    includes_videos BOOLEAN DEFAULT false,
    max_videos INTEGER DEFAULT 0,
    videos_count INTEGER DEFAULT 0,
    video_types TEXT[],
    
    -- تفاصيل الإعلانات
    includes_ads BOOLEAN DEFAULT false,
    ads_count INTEGER DEFAULT 0,
    ad_price NUMERIC DEFAULT 0,
    ad_duration_days INTEGER DEFAULT 7,
    
    -- خدمات إضافية
    max_posts INTEGER DEFAULT 0,
    includes_management BOOLEAN DEFAULT false,
    includes_page_management BOOLEAN DEFAULT false,
    includes_auto_replies BOOLEAN DEFAULT false,
    includes_whatsapp_campaigns BOOLEAN DEFAULT false,
    includes_google_campaigns BOOLEAN DEFAULT false,
    includes_analytics BOOLEAN DEFAULT false,
    
    -- إحصائيات
    subscribers_count INTEGER DEFAULT 0,
    completed_designs INTEGER DEFAULT 0,
    completed_videos INTEGER DEFAULT 0,
    
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول الطلبات
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    customer_name VARCHAR NOT NULL,
    customer_email VARCHAR,
    customer_phone VARCHAR NOT NULL,
    customer_whatsapp VARCHAR,
    customer_address TEXT,
    notes TEXT,
    payment_method VARCHAR NOT NULL,
    receipt_url TEXT,
    total_amount NUMERIC NOT NULL,
    status VARCHAR DEFAULT 'pending',
    payment_status VARCHAR DEFAULT 'pending',
    items JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول عناصر الطلبات
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    sub_service_id UUID REFERENCES sub_services(id),
    service_name VARCHAR NOT NULL,
    sub_service_name VARCHAR NOT NULL,
    price NUMERIC NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- جدول الاشتراكات
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    package_id UUID REFERENCES packages(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR DEFAULT 'active',
    payment_method VARCHAR,
    receipt_url TEXT,
    total_amount NUMERIC NOT NULL,
    used_designs INTEGER DEFAULT 0,
    used_videos INTEGER DEFAULT 0,
    used_posts INTEGER DEFAULT 0,
    auto_renew BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول اشتراكات الصفحات
CREATE TABLE page_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID REFERENCES packages(id),
    customer_name VARCHAR NOT NULL,
    customer_email VARCHAR NOT NULL,
    customer_phone VARCHAR,
    status VARCHAR DEFAULT 'pending',
    payment_status VARCHAR DEFAULT 'pending',
    start_date DATE,
    end_date DATE,
    total_amount NUMERIC,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول طرق الدفع
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    account_number VARCHAR NOT NULL,
    icon VARCHAR,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول الإيصالات
CREATE TABLE receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    subscription_id UUID REFERENCES subscriptions(id),
    order_id UUID REFERENCES orders(id),
    receipt_url TEXT NOT NULL,
    payment_method VARCHAR NOT NULL,
    amount NUMERIC NOT NULL,
    status VARCHAR DEFAULT 'pending',
    notes TEXT,
    reviewed_by UUID REFERENCES admins(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول معرض الأعمال
CREATE TABLE portfolio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    description TEXT,
    category VARCHAR NOT NULL,
    type VARCHAR NOT NULL CHECK (type IN ('image', 'video')),
    image_url TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    drive_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    tags TEXT[],
    client_name VARCHAR,
    project_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول العقارات
CREATE TABLE real_estate (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES users(id),
    customer_name VARCHAR NOT NULL,
    customer_email VARCHAR NOT NULL,
    customer_phone VARCHAR NOT NULL,
    customer_whatsapp VARCHAR,
    
    -- تفاصيل العقار
    property_type VARCHAR NOT NULL,
    operation_type VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    
    -- الموقع
    governorate VARCHAR NOT NULL,
    city VARCHAR NOT NULL,
    district VARCHAR,
    street VARCHAR,
    landmarks TEXT,
    
    -- المواصفات
    area NUMERIC,
    rooms INTEGER,
    bathrooms INTEGER,
    floor_number INTEGER,
    total_floors INTEGER,
    age_years INTEGER,
    finishing VARCHAR,
    
    -- السعر
    price NUMERIC NOT NULL,
    price_negotiable BOOLEAN DEFAULT false,
    payment_method VARCHAR,
    
    -- الحالة والمتابعة
    status VARCHAR DEFAULT 'pending',
    sale_status VARCHAR DEFAULT 'new',
    priority VARCHAR DEFAULT 'normal',
    follow_up_status VARCHAR DEFAULT 'pending',
    last_contact_date TIMESTAMPTZ,
    contact_count INTEGER DEFAULT 0,
    trust_rating INTEGER DEFAULT 0,
    
    -- ملاحظات
    admin_notes TEXT,
    internal_notes TEXT,
    rejection_reason TEXT,
    
    -- إحصائيات
    views_count INTEGER DEFAULT 0,
    inquiries_count INTEGER DEFAULT 0,
    
    -- الوسائط
    images JSONB DEFAULT '[]',
    video_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول العقارات (نسخة مبسطة)
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    customer_name VARCHAR NOT NULL,
    customer_phone VARCHAR NOT NULL,
    customer_whatsapp VARCHAR,
    customer_email VARCHAR,
    property_type VARCHAR NOT NULL,
    listing_type VARCHAR NOT NULL,
    price NUMERIC,
    area NUMERIC,
    bedrooms INTEGER,
    bathrooms INTEGER,
    floor_number INTEGER,
    total_floors INTEGER,
    governorate VARCHAR,
    city VARCHAR,
    district VARCHAR,
    address TEXT,
    has_garden BOOLEAN DEFAULT false,
    has_parking BOOLEAN DEFAULT false,
    has_elevator BOOLEAN DEFAULT false,
    has_balcony BOOLEAN DEFAULT false,
    is_furnished BOOLEAN DEFAULT false,
    has_security BOOLEAN DEFAULT false,
    description TEXT,
    images JSONB,
    status VARCHAR DEFAULT 'pending',
    sale_status VARCHAR DEFAULT 'new',
    internal_notes TEXT,
    follow_up_status VARCHAR DEFAULT 'pending',
    last_contact_date TIMESTAMPTZ,
    contact_count INTEGER DEFAULT 0,
    trust_rating INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول الخدمات الرئيسية (للتوافق مع النظام القديم)
CREATE TABLE main_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    name_en VARCHAR,
    description TEXT,
    icon VARCHAR,
    category VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول إعدادات النظام
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type VARCHAR DEFAULT 'text',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- جدول الروابط الإضافية
CREATE TABLE additional_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    url TEXT NOT NULL,
    icon VARCHAR,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- إنشاء الفهارس للأداء
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_admins_username ON admins(username);
CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_sub_services_service_id ON sub_services(service_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_package_id ON subscriptions(package_id);
CREATE INDEX idx_real_estate_status ON real_estate(status);
CREATE INDEX idx_real_estate_operation_type ON real_estate(operation_type);
CREATE INDEX idx_portfolio_category ON portfolio(category);
CREATE INDEX idx_portfolio_featured ON portfolio(is_featured);

-- إنشاء المشغلات لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- تطبيق المشغل على الجداول المطلوبة
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sub_services_updated_at BEFORE UPDATE ON sub_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_page_subscriptions_updated_at BEFORE UPDATE ON page_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_receipts_updated_at BEFORE UPDATE ON receipts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolio_updated_at BEFORE UPDATE ON portfolio FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_real_estate_updated_at BEFORE UPDATE ON real_estate FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_main_services_updated_at BEFORE UPDATE ON main_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_additional_links_updated_at BEFORE UPDATE ON additional_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
