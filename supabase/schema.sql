-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'manager')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    total_spent DECIMAL(10,2) DEFAULT 0,
    whatsapp_number VARCHAR(20),
    preferred_payment_method VARCHAR(50)
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    duration VARCHAR(100) NOT NULL,
    features TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    category VARCHAR(100) NOT NULL,
    category_name VARCHAR(255) NOT NULL,
    is_form BOOLEAN DEFAULT false,
    form_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'active', 'completed', 'cancelled')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    payment_method VARCHAR(50),
    payment_receipt_url TEXT,
    requirements TEXT,
    notes TEXT,
    admin_notes TEXT,
    form_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create real_estate_properties table
CREATE TABLE IF NOT EXISTS real_estate_properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    operation_type VARCHAR(10) NOT NULL CHECK (operation_type IN ('seller', 'buyer')),
    property_type VARCHAR(20) NOT NULL CHECK (property_type IN ('house', 'apartment', 'land', 'shop', 'villa')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    area INTEGER NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    price_type VARCHAR(20) DEFAULT 'total' CHECK (price_type IN ('total', 'per_meter', 'negotiable')),
    location JSONB NOT NULL,
    details JSONB NOT NULL,
    features TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    financial JSONB,
    images TEXT[] DEFAULT '{}',
    contact_info JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'sold', 'rented', 'cancelled')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    featured BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    inquiries INTEGER DEFAULT 0,
    admin_notes TEXT,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_real_estate_operation_type ON real_estate_properties(operation_type);
CREATE INDEX IF NOT EXISTS idx_real_estate_property_type ON real_estate_properties(property_type);
CREATE INDEX IF NOT EXISTS idx_real_estate_status ON real_estate_properties(status);
CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON admin_settings(key);

-- Create function to increment property views
CREATE OR REPLACE FUNCTION increment_property_views(property_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE real_estate_properties 
    SET views = views + 1, updated_at = NOW()
    WHERE id = property_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to update user total spent
CREATE OR REPLACE FUNCTION update_user_total_spent()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_status = 'paid' AND OLD.payment_status != 'paid' THEN
        UPDATE users 
        SET total_spent = total_spent + NEW.total_amount,
            updated_at = NOW()
        WHERE id = NEW.customer_id;
    ELSIF OLD.payment_status = 'paid' AND NEW.payment_status != 'paid' THEN
        UPDATE users 
        SET total_spent = total_spent - OLD.total_amount,
            updated_at = NOW()
        WHERE id = NEW.customer_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating user total spent
CREATE TRIGGER trigger_update_user_total_spent
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_user_total_spent();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_real_estate_updated_at
    BEFORE UPDATE ON real_estate_properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_admin_settings_updated_at
    BEFORE UPDATE ON admin_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user
INSERT INTO users (id, email, name, role, is_active) 
VALUES (
    'admin-user-id',
    'admin@topmarketing.com',
    'مدير النظام',
    'admin',
    true
) ON CONFLICT (email) DO NOTHING;

-- Insert default services
INSERT INTO services (id, name, description, price, duration, features, category, category_name, is_form, form_type) VALUES
-- Design Services
('logo-design', 'تصميم لوجو', 'تصميم لوجو احترافي ومميز لعلامتك التجارية', 500, '2-3 أيام', ARRAY['3 مفاهيم مختلفة', 'مراجعات مجانية', 'ملفات عالية الجودة', 'حقوق ملكية كاملة'], 'design', 'التصميم', false, null),
('social-media-design', 'تصميم سوشيال ميديا', 'تصاميم جذابة لمنصات التواصل الاجتماعي', 200, '1-2 يوم', ARRAY['تصاميم متنوعة', 'مقاسات مختلفة', 'جودة عالية', 'تسليم سريع'], 'design', 'التصميم', false, null),
('banner-design', 'تصميم بانر', 'تصميم بانرات إعلانية احترافية', 300, '1-2 يوم', ARRAY['تصميم جذاب', 'مقاسات مختلفة', 'جودة عالية'], 'design', 'التصميم', false, null),

-- Real Estate Services
('sell-property', 'بيع عقار', 'خدمة عرض عقارك للبيع مع تسويق شامل', 0, 'حسب الطلب', ARRAY['عرض العقار على المنصة', 'تسويق مجاني', 'متابعة العملاء المهتمين'], 'real-estate-marketing', 'التسويق العقاري', true, 'sell-property'),
('buy-property', 'شراء عقار', 'خدمة البحث عن العقار المناسب لك', 0, 'حسب الطلب', ARRAY['بحث مخصص حسب المتطلبات', 'عرض العقارات المناسبة', 'ترتيب المعاينات'], 'real-estate-marketing', 'التسويق العقاري', true, 'buy-property'),
('property-photography', 'تصوير العقارات', 'تصوير احترافي للعقارات بجودة عالية', 500, '1-2 يوم', ARRAY['تصوير داخلي وخارجي', 'صور بدقة 4K', 'تعديل احترافي'], 'real-estate-marketing', 'التسويق العقاري', false, null)

ON CONFLICT (id) DO NOTHING;

-- Insert default admin settings
INSERT INTO admin_settings (key, value, description) VALUES
('site_name', '"توب ماركتنج"', 'اسم الموقع'),
('contact_phone', '"+201068275557"', 'رقم الهاتف الرئيسي'),
('contact_email', '"info@topmarketing.com"', 'البريد الإلكتروني الرئيسي'),
('whatsapp_number', '"+201068275557"', 'رقم واتساب'),
('payment_methods', '{"vodafone_cash": {"name": "فودافون كاش", "number": "01068275557", "active": true}, "instapay": {"name": "إنستا باي", "active": true}, "fawry": {"name": "فوري", "active": true}}', 'طرق الدفع المتاحة')
ON CONFLICT (key) DO NOTHING;
