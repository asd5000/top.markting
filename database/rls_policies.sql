-- ===================================
-- إعداد سياسات RLS (Row Level Security)
-- Top Marketing Services Platform
-- ===================================

-- تفعيل RLS على الجداول
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ===================================
-- سياسات جدول الخدمات (Services)
-- ===================================

-- السماح للجميع بقراءة الخدمات النشطة
CREATE POLICY "Allow public read active services" ON services
    FOR SELECT USING (is_active = true);

-- السماح للمديرين بجميع العمليات
CREATE POLICY "Allow admins full access to services" ON services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE email = auth.jwt() ->> 'email' 
            AND is_active = true
        )
    );

-- ===================================
-- سياسات جدول العملاء (Customers)
-- ===================================

-- السماح للعملاء بقراءة وتعديل بياناتهم فقط
CREATE POLICY "Allow customers to read own data" ON customers
    FOR SELECT USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Allow customers to update own data" ON customers
    FOR UPDATE USING (email = auth.jwt() ->> 'email');

-- السماح للمديرين بجميع العمليات
CREATE POLICY "Allow admins full access to customers" ON customers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE email = auth.jwt() ->> 'email' 
            AND is_active = true
        )
    );

-- السماح بإنشاء حسابات جديدة
CREATE POLICY "Allow customer registration" ON customers
    FOR INSERT WITH CHECK (true);

-- ===================================
-- سياسات جدول المديرين (Admins)
-- ===================================

-- السماح للمديرين بقراءة بيانات المديرين الآخرين
CREATE POLICY "Allow admins to read admin data" ON admins
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE email = auth.jwt() ->> 'email' 
            AND is_active = true
        )
    );

-- السماح للمدير العام فقط بإدارة المديرين
CREATE POLICY "Allow super admin to manage admins" ON admins
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE email = auth.jwt() ->> 'email' 
            AND role = 'admin' 
            AND is_active = true
        )
    );

-- ===================================
-- سياسات جدول الطلبات (Orders)
-- ===================================

-- السماح للعملاء بقراءة طلباتهم فقط
CREATE POLICY "Allow customers to read own orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM customers 
            WHERE customers.id = orders.customer_id 
            AND customers.email = auth.jwt() ->> 'email'
        )
    );

-- السماح للعملاء بإنشاء طلبات جديدة
CREATE POLICY "Allow customers to create orders" ON orders
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM customers 
            WHERE customers.id = orders.customer_id 
            AND customers.email = auth.jwt() ->> 'email'
        )
    );

-- السماح للمديرين بجميع العمليات
CREATE POLICY "Allow admins full access to orders" ON orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE email = auth.jwt() ->> 'email' 
            AND is_active = true
        )
    );

-- ===================================
-- سياسات جدول الاشتراكات (Subscriptions)
-- ===================================

-- السماح للعملاء بقراءة اشتراكاتهم فقط
CREATE POLICY "Allow customers to read own subscriptions" ON subscriptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM customers 
            WHERE customers.id = subscriptions.customer_id 
            AND customers.email = auth.jwt() ->> 'email'
        )
    );

-- السماح للمديرين بجميع العمليات
CREATE POLICY "Allow admins full access to subscriptions" ON subscriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE email = auth.jwt() ->> 'email' 
            AND is_active = true
        )
    );

-- ===================================
-- سياسات جدول العقارات (Real Estate)
-- ===================================

-- السماح للجميع بقراءة العقارات المنشورة
CREATE POLICY "Allow public read published listings" ON real_estate_listings
    FOR SELECT USING (is_published = true);

-- السماح للعملاء بإدارة عقاراتهم فقط
CREATE POLICY "Allow customers to manage own listings" ON real_estate_listings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM customers 
            WHERE customers.id = real_estate_listings.customer_id 
            AND customers.email = auth.jwt() ->> 'email'
        )
    );

-- السماح للمديرين بجميع العمليات
CREATE POLICY "Allow admins full access to listings" ON real_estate_listings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE email = auth.jwt() ->> 'email' 
            AND is_active = true
        )
    );

-- ===================================
-- سياسات جدول الإعدادات (Settings)
-- ===================================

-- السماح للجميع بقراءة الإعدادات العامة
CREATE POLICY "Allow public read public settings" ON settings
    FOR SELECT USING (is_public = true);

-- السماح للمديرين بجميع العمليات
CREATE POLICY "Allow admins full access to settings" ON settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE email = auth.jwt() ->> 'email' 
            AND is_active = true
        )
    );

-- ===================================
-- سياسات مؤقتة للتطوير (يمكن إزالتها لاحقاً)
-- ===================================

-- السماح للمستخدمين المجهولين بالوصول للقراءة (للتطوير فقط)
CREATE POLICY "Allow anonymous read for development" ON services
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read settings for development" ON settings
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read listings for development" ON real_estate_listings
    FOR SELECT USING (true);
