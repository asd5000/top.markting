-- إنشاء جداول قاعدة البيانات لنظام Top Marketing

-- جدول الخدمات الأساسية
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الخدمات الفرعية
CREATE TABLE IF NOT EXISTS sub_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول العملاء
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'مصر',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول المديرين
CREATE TABLE IF NOT EXISTS managers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('super_admin', 'marketing', 'support', 'content')) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الطلبات
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) CHECK (status IN ('pending', 'paid', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  payment_receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول عناصر الطلبات
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  sub_service_id UUID REFERENCES sub_services(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الباقات (لإدارة الصفحات)
CREATE TABLE IF NOT EXISTS packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_months INTEGER NOT NULL DEFAULT 1,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول اشتراكات إدارة الصفحات
CREATE TABLE IF NOT EXISTS page_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  status VARCHAR(20) CHECK (status IN ('active', 'expired', 'cancelled')) DEFAULT 'active',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول العقارات المحدث
CREATE TABLE IF NOT EXISTS real_estate_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,

  -- بيانات أساسية
  client_type VARCHAR(10) CHECK (client_type IN ('seller', 'buyer')) NOT NULL,
  property_type VARCHAR(20) CHECK (property_type IN ('apartment', 'villa', 'land', 'shop', 'house', 'office')) NOT NULL,
  operation_type VARCHAR(10) CHECK (operation_type IN ('sale', 'rent')) NOT NULL,

  -- تفاصيل العقار
  area DECIMAL(8,2),
  bedrooms INTEGER,
  bathrooms INTEGER,
  floors INTEGER,
  finishing_type VARCHAR(20) CHECK (finishing_type IN ('super_lux', 'lux', 'normal', 'brick')),
  property_age INTEGER,
  has_elevator BOOLEAN DEFAULT false,
  has_garage BOOLEAN DEFAULT false,
  view_direction VARCHAR(10) CHECK (view_direction IN ('north', 'south', 'east', 'west')),

  -- تفاصيل مالية
  price DECIMAL(12,2) NOT NULL,
  is_negotiable BOOLEAN DEFAULT true,
  payment_method VARCHAR(20) CHECK (payment_method IN ('cash', 'installments', 'mortgage')),

  -- الموقع
  governorate VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100),
  street VARCHAR(255),
  nearest_landmark VARCHAR(255),

  -- بيانات التواصل
  contact_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  whatsapp VARCHAR(20),
  email VARCHAR(255),

  -- تفاصيل إضافية
  description TEXT,
  special_features TEXT,
  notes TEXT,

  -- الملفات
  images JSONB DEFAULT '[]',
  video_url TEXT,
  documents JSONB DEFAULT '[]',

  -- حالة الإدراج
  status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected', 'sold', 'rented')) DEFAULT 'pending',
  is_featured BOOLEAN DEFAULT false,
  admin_notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول الإيصالات
CREATE TABLE IF NOT EXISTS receipts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  reviewed_by UUID REFERENCES managers(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء الفهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_sub_services_service_id ON sub_services(service_id);
CREATE INDEX IF NOT EXISTS idx_orders_client_id ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_page_subscriptions_client_id ON page_subscriptions(client_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_listings_client_id ON real_estate_listings(client_id);
CREATE INDEX IF NOT EXISTS idx_receipts_order_id ON receipts(order_id);

-- إنشاء trigger لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- تطبيق trigger على الجداول المطلوبة
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sub_services_updated_at BEFORE UPDATE ON sub_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_managers_updated_at BEFORE UPDATE ON managers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_page_subscriptions_updated_at BEFORE UPDATE ON page_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_real_estate_listings_updated_at BEFORE UPDATE ON real_estate_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
