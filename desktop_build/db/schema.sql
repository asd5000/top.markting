-- Top Marketing Desktop Database Schema (SQLite)
-- نظام إدارة التسويق المتكامل - قاعدة بيانات سطح المكتب

-- جدول المستخدمين (الزوار والعملاء)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    auth_id TEXT,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT,
    password_hash TEXT,
    role TEXT DEFAULT 'visitor',
    is_active INTEGER DEFAULT 1,
    email_verified INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
);

-- جدول المديرين
CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    permissions TEXT,
    is_active INTEGER DEFAULT 1,
    last_login DATETIME,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
);

-- جدول الخدمات الأساسية
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL,
    name_en TEXT,
    description TEXT,
    short_description TEXT,
    icon TEXT,
    image_url TEXT,
    icon_url TEXT,
    custom_color TEXT DEFAULT '#3B82F6',
    category TEXT,
    is_featured INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active',
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
);

-- جدول الخدمات الفرعية
CREATE TABLE IF NOT EXISTS sub_services (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    service_id TEXT,
    name TEXT NOT NULL,
    name_en TEXT,
    description TEXT,
    price REAL NOT NULL,
    image_url TEXT,
    icon_url TEXT,
    delivery_time TEXT,
    duration_days INTEGER DEFAULT 7,
    features TEXT,
    is_active INTEGER DEFAULT 1,
    status TEXT DEFAULT 'active',
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
);

-- جدول الباقات
CREATE TABLE IF NOT EXISTS packages (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL,
    name_en TEXT,
    description TEXT,
    package_description TEXT,
    package_type TEXT DEFAULT 'social_media',
    price REAL NOT NULL,
    monthly_price REAL,
    duration_months INTEGER DEFAULT 1,
    features TEXT NOT NULL,
    
    -- تفاصيل التصميم
    max_designs INTEGER DEFAULT 0,
    designs_count INTEGER DEFAULT 0,
    design_price REAL DEFAULT 0,
    
    -- تفاصيل الفيديو
    includes_videos INTEGER DEFAULT 0,
    max_videos INTEGER DEFAULT 0,
    videos_count INTEGER DEFAULT 0,
    video_types TEXT,
    
    -- تفاصيل الإعلانات
    includes_ads INTEGER DEFAULT 0,
    ads_count INTEGER DEFAULT 0,
    ad_price REAL DEFAULT 0,
    ad_duration_days INTEGER DEFAULT 7,
    
    -- خدمات إضافية
    max_posts INTEGER DEFAULT 0,
    includes_management INTEGER DEFAULT 0,
    includes_page_management INTEGER DEFAULT 0,
    includes_auto_replies INTEGER DEFAULT 0,
    includes_whatsapp_campaigns INTEGER DEFAULT 0,
    includes_google_campaigns INTEGER DEFAULT 0,
    includes_analytics INTEGER DEFAULT 0,
    
    -- إحصائيات
    subscribers_count INTEGER DEFAULT 0,
    completed_designs INTEGER DEFAULT 0,
    completed_videos INTEGER DEFAULT 0,
    
    is_active INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
);

-- جدول الطلبات
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT NOT NULL,
    customer_whatsapp TEXT,
    customer_address TEXT,
    notes TEXT,
    payment_method TEXT NOT NULL,
    receipt_url TEXT,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'pending',
    items TEXT,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
);

-- جدول عناصر الطلبات
CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    order_id TEXT,
    sub_service_id TEXT,
    service_name TEXT NOT NULL,
    sub_service_name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT (datetime('now'))
);

-- جدول الاشتراكات
CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT,
    package_id TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'active',
    payment_method TEXT,
    receipt_url TEXT,
    total_amount REAL NOT NULL,
    used_designs INTEGER DEFAULT 0,
    used_videos INTEGER DEFAULT 0,
    used_posts INTEGER DEFAULT 0,
    auto_renew INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
);

-- جدول اشتراكات الصفحات
CREATE TABLE IF NOT EXISTS page_subscriptions (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    package_id TEXT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'pending',
    start_date DATE,
    end_date DATE,
    total_amount REAL,
    notes TEXT,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
);

-- جدول طرق الدفع
CREATE TABLE IF NOT EXISTS payment_methods (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    icon TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
);

-- جدول الإيصالات
CREATE TABLE IF NOT EXISTS receipts (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT,
    subscription_id TEXT,
    order_id TEXT,
    receipt_url TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    reviewed_by TEXT,
    reviewed_at DATETIME,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
);

-- جدول معرض الأعمال
CREATE TABLE IF NOT EXISTS portfolio (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    type TEXT NOT NULL,
    image_url TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    drive_url TEXT,
    is_featured INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    tags TEXT,
    client_name TEXT,
    project_date DATE,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
);

-- جدول العقارات
CREATE TABLE IF NOT EXISTS real_estate (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    customer_id TEXT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_whatsapp TEXT,
    
    -- تفاصيل العقار
    property_type TEXT NOT NULL,
    operation_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    
    -- الموقع
    governorate TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT,
    street TEXT,
    landmarks TEXT,
    
    -- المواصفات
    area REAL,
    rooms INTEGER,
    bathrooms INTEGER,
    floor_number INTEGER,
    total_floors INTEGER,
    age_years INTEGER,
    finishing TEXT,
    
    -- السعر
    price REAL NOT NULL,
    price_negotiable INTEGER DEFAULT 0,
    payment_method TEXT,
    
    -- الحالة والمتابعة
    status TEXT DEFAULT 'pending',
    sale_status TEXT DEFAULT 'new',
    priority TEXT DEFAULT 'normal',
    follow_up_status TEXT DEFAULT 'pending',
    last_contact_date DATETIME,
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
    images TEXT DEFAULT '[]',
    video_url TEXT,
    
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
);

-- جدول العقارات (نسخة مبسطة)
CREATE TABLE IF NOT EXISTS properties (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_whatsapp TEXT,
    customer_email TEXT,
    property_type TEXT NOT NULL,
    listing_type TEXT NOT NULL,
    price REAL,
    area REAL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    floor_number INTEGER,
    total_floors INTEGER,
    governorate TEXT,
    city TEXT,
    district TEXT,
    address TEXT,
    has_garden INTEGER DEFAULT 0,
    has_parking INTEGER DEFAULT 0,
    has_elevator INTEGER DEFAULT 0,
    has_balcony INTEGER DEFAULT 0,
    is_furnished INTEGER DEFAULT 0,
    has_security INTEGER DEFAULT 0,
    description TEXT,
    images TEXT,
    status TEXT DEFAULT 'pending',
    sale_status TEXT DEFAULT 'new',
    internal_notes TEXT,
    follow_up_status TEXT DEFAULT 'pending',
    last_contact_date DATETIME,
    contact_count INTEGER DEFAULT 0,
    trust_rating INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
);

-- جدول الخدمات الرئيسية (للتوافق مع النظام القديم)
CREATE TABLE IF NOT EXISTS main_services (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL,
    name_en TEXT,
    description TEXT,
    icon TEXT,
    category TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
);

-- جدول إعدادات النظام
CREATE TABLE IF NOT EXISTS system_settings (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type TEXT DEFAULT 'text',
    description TEXT,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
);

-- جدول الروابط الإضافية
CREATE TABLE IF NOT EXISTS additional_links (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
);

-- إنشاء الفهارس للأداء
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_sub_services_service_id ON sub_services(service_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_package_id ON subscriptions(package_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_status ON real_estate(status);
CREATE INDEX IF NOT EXISTS idx_real_estate_operation_type ON real_estate(operation_type);
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON portfolio(is_featured);

-- البيانات الأولية
-- إدراج مدير أساسي
INSERT OR IGNORE INTO admins (id, username, email, name, password_hash, role, is_active) VALUES
('admin-001', 'asdasheref', 'asdasheref@gmail.com', 'أشرف الشريف', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin', 1);

-- إدراج طرق الدفع الأساسية
INSERT OR IGNORE INTO payment_methods (id, name, account_number, icon, description, sort_order, is_active) VALUES
('pay-001', 'فودافون كاش', '01068275557', 'phone', 'الدفع عبر فودافون كاش', 1, 1),
('pay-002', 'فوري باي', 'fori_pay_account', 'credit-card', 'الدفع عبر فوري باي', 2, 1),
('pay-003', 'إنستاباي', 'instapay_account', 'smartphone', 'الدفع عبر إنستاباي', 3, 1),
('pay-004', 'واتساب (دولي)', '+201068275557', 'message-circle', 'للمدفوعات الدولية عبر واتساب', 4, 1);

-- إدراج خدمات أساسية
INSERT OR IGNORE INTO services (id, name, name_en, description, short_description, icon, custom_color, category, is_featured, is_active, sort_order) VALUES
('srv-001', 'تصميم', 'Design', 'خدمات التصميم الجرافيكي والهوية البصرية', 'تصميم احترافي لجميع احتياجاتك', 'palette', '#FF6B6B', 'design', 1, 1, 1),
('srv-002', 'تسويق', 'Marketing', 'خدمات التسويق الرقمي والحملات الإعلانية', 'تسويق فعال لنمو أعمالك', 'megaphone', '#4ECDC4', 'marketing', 1, 1, 2),
('srv-003', 'سحب الداتا', 'Data Extraction', 'خدمات استخراج وتحليل البيانات', 'استخراج البيانات بدقة عالية', 'database', '#45B7D1', 'data', 0, 1, 3),
('srv-004', 'المواقع', 'Websites', 'تطوير وتصميم المواقع الإلكترونية', 'مواقع احترافية وسريعة', 'globe', '#96CEB4', 'web', 1, 1, 4),
('srv-005', 'المونتاج', 'Video Editing', 'خدمات مونتاج وتحرير الفيديو', 'مونتاج احترافي لفيديوهاتك', 'video', '#FFEAA7', 'video', 0, 1, 5);

-- إدراج إعدادات النظام الأساسية
INSERT OR IGNORE INTO system_settings (id, setting_key, setting_value, setting_type, description) VALUES
('set-001', 'site_name', 'Top Marketing Desktop', 'text', 'اسم البرنامج'),
('set-002', 'site_description', 'نظام إدارة التسويق المتكامل - إصدار سطح المكتب', 'text', 'وصف البرنامج'),
('set-003', 'contact_email', 'asdasheref@gmail.com', 'email', 'البريد الإلكتروني للتواصل'),
('set-004', 'contact_phone', '+201068275557', 'text', 'رقم الهاتف للتواصل'),
('set-005', 'whatsapp_number', '+201068275557', 'text', 'رقم الواتساب'),
('set-006', 'database_version', '1.0.0', 'text', 'إصدار قاعدة البيانات'),
('set-007', 'app_version', '1.0.0', 'text', 'إصدار التطبيق'),
('set-008', 'max_file_size', '10', 'number', 'الحد الأقصى لحجم الملف (MB)');
