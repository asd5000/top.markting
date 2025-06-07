-- ===================================
-- سياسات RLS للإطلاق الرسمي
-- Top Marketing Services Platform
-- ===================================

-- حذف السياسات المؤقتة للتطوير
DROP POLICY IF EXISTS "Allow anonymous read for development" ON services;
DROP POLICY IF EXISTS "Allow anonymous read settings for development" ON settings;
DROP POLICY IF EXISTS "Allow anonymous read listings for development" ON real_estate_listings;

-- ===================================
-- سياسات الإنتاج المحسنة
-- ===================================

-- 1. سياسات جدول الخدمات (Services)
DROP POLICY IF EXISTS "Allow public read active services" ON services;
CREATE POLICY "Public can view active services" ON services
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Allow admins full access to services" ON services;
CREATE POLICY "Admins can manage all services" ON services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            AND is_active = true
            AND 'all' = ANY(permissions)
        )
    );

-- 2. سياسات جدول العملاء (Customers)
DROP POLICY IF EXISTS "Allow customers to read own data" ON customers;
CREATE POLICY "Customers can view own profile" ON customers
    FOR SELECT USING (
        email = current_setting('request.jwt.claims', true)::json->>'email'
    );

DROP POLICY IF EXISTS "Allow customers to update own data" ON customers;
CREATE POLICY "Customers can update own profile" ON customers
    FOR UPDATE USING (
        email = current_setting('request.jwt.claims', true)::json->>'email'
    );

DROP POLICY IF EXISTS "Allow customer registration" ON customers;
CREATE POLICY "Allow new customer registration" ON customers
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admins full access to customers" ON customers;
CREATE POLICY "Admins can manage customers" ON customers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            AND is_active = true
            AND ('all' = ANY(permissions) OR 'customers' = ANY(permissions))
        )
    );

-- 3. سياسات جدول المديرين (Admins)
DROP POLICY IF EXISTS "Allow admins to read admin data" ON admins;
CREATE POLICY "Admins can view other admins" ON admins
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            AND is_active = true
            AND ('all' = ANY(permissions) OR 'admins' = ANY(permissions))
        )
    );

DROP POLICY IF EXISTS "Allow super admin to manage admins" ON admins;
CREATE POLICY "Super admin can manage admins" ON admins
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            AND role = 'admin'
            AND is_active = true
            AND 'all' = ANY(permissions)
        )
    );

-- 4. سياسات جدول الطلبات (Orders)
DROP POLICY IF EXISTS "Allow customers to read own orders" ON orders;
CREATE POLICY "Customers can view own orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM customers 
            WHERE customers.id = orders.customer_id 
            AND customers.email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

DROP POLICY IF EXISTS "Allow customers to create orders" ON orders;
CREATE POLICY "Customers can create orders" ON orders
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM customers 
            WHERE customers.id = orders.customer_id 
            AND customers.email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

DROP POLICY IF EXISTS "Allow admins full access to orders" ON orders;
CREATE POLICY "Admins can manage orders" ON orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            AND is_active = true
            AND ('all' = ANY(permissions) OR 'orders' = ANY(permissions))
        )
    );

-- 5. سياسات جدول العقارات (Real Estate)
DROP POLICY IF EXISTS "Allow public read published listings" ON real_estate_listings;
CREATE POLICY "Public can view published properties" ON real_estate_listings
    FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Allow customers to manage own listings" ON real_estate_listings;
CREATE POLICY "Customers can manage own properties" ON real_estate_listings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM customers 
            WHERE customers.id = real_estate_listings.customer_id 
            AND customers.email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

DROP POLICY IF EXISTS "Allow admins full access to listings" ON real_estate_listings;
CREATE POLICY "Admins can manage all properties" ON real_estate_listings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            AND is_active = true
            AND ('all' = ANY(permissions) OR 'real_estate' = ANY(permissions))
        )
    );

-- 6. سياسات جدول الإعدادات (Settings)
DROP POLICY IF EXISTS "Allow public read public settings" ON settings;
CREATE POLICY "Public can view public settings" ON settings
    FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Allow admins full access to settings" ON settings;
CREATE POLICY "Admins can manage settings" ON settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            AND is_active = true
            AND ('all' = ANY(permissions) OR 'settings' = ANY(permissions))
        )
    );

-- 7. سياسات جدول الاشتراكات (Subscriptions)
CREATE POLICY "Customers can view own subscriptions" ON subscriptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM customers 
            WHERE customers.id = subscriptions.customer_id 
            AND customers.email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

CREATE POLICY "Admins can manage subscriptions" ON subscriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            AND is_active = true
            AND ('all' = ANY(permissions) OR 'subscriptions' = ANY(permissions))
        )
    );

-- 8. سياسات جدول الإشعارات (Notifications)
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (
        user_email = current_setting('request.jwt.claims', true)::json->>'email'
    );

CREATE POLICY "Admins can manage all notifications" ON notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            AND is_active = true
            AND ('all' = ANY(permissions) OR 'notifications' = ANY(permissions))
        )
    );

-- تأكيد تطبيق السياسات
SELECT 'تم تطبيق سياسات الأمان للإطلاق الرسمي بنجاح!' as status;
