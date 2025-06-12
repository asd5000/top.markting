-- تفعيل Row Level Security وإعداد السياسات

-- تفعيل RLS على جميع الجداول
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

-- سياسات الخدمات والخدمات الفرعية (قراءة عامة)
CREATE POLICY "Allow public read access to services" ON services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read access to sub_services" ON sub_services
  FOR SELECT USING (is_active = true);

-- سياسات الباقات (قراءة عامة)
CREATE POLICY "Allow public read access to packages" ON packages
  FOR SELECT USING (is_active = true);

-- سياسات العملاء (العميل يرى بياناته فقط)
CREATE POLICY "Clients can view own data" ON clients
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Clients can update own data" ON clients
  FOR UPDATE USING (auth.uid()::text = id::text);

-- سياسات الطلبات (العميل يرى طلباته فقط)
CREATE POLICY "Clients can view own orders" ON orders
  FOR SELECT USING (auth.uid()::text = client_id::text);

CREATE POLICY "Clients can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid()::text = client_id::text);

CREATE POLICY "Clients can update own orders" ON orders
  FOR UPDATE USING (auth.uid()::text = client_id::text);

-- سياسات عناصر الطلبات
CREATE POLICY "Clients can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.client_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Clients can create order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.client_id::text = auth.uid()::text
    )
  );

-- سياسات اشتراكات الصفحات
CREATE POLICY "Clients can view own subscriptions" ON page_subscriptions
  FOR SELECT USING (auth.uid()::text = client_id::text);

CREATE POLICY "Clients can create subscriptions" ON page_subscriptions
  FOR INSERT WITH CHECK (auth.uid()::text = client_id::text);

-- سياسات العقارات
CREATE POLICY "Public can view approved listings" ON real_estate_listings
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Clients can view own listings" ON real_estate_listings
  FOR SELECT USING (auth.uid()::text = client_id::text);

CREATE POLICY "Clients can create listings" ON real_estate_listings
  FOR INSERT WITH CHECK (auth.uid()::text = client_id::text);

CREATE POLICY "Clients can update own listings" ON real_estate_listings
  FOR UPDATE USING (auth.uid()::text = client_id::text);

-- سياسات الإيصالات
CREATE POLICY "Clients can view own receipts" ON receipts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = receipts.order_id 
      AND orders.client_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Clients can create receipts" ON receipts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = receipts.order_id 
      AND orders.client_id::text = auth.uid()::text
    )
  );

-- سياسات المديرين (المديرون يرون كل شيء)
CREATE POLICY "Managers can view all data" ON services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM managers 
      WHERE managers.id::text = auth.uid()::text 
      AND managers.is_active = true
    )
  );

CREATE POLICY "Managers can manage sub_services" ON sub_services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM managers 
      WHERE managers.id::text = auth.uid()::text 
      AND managers.is_active = true
    )
  );

CREATE POLICY "Managers can view all clients" ON clients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM managers 
      WHERE managers.id::text = auth.uid()::text 
      AND managers.is_active = true
    )
  );

CREATE POLICY "Managers can view all orders" ON orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM managers 
      WHERE managers.id::text = auth.uid()::text 
      AND managers.is_active = true
    )
  );

CREATE POLICY "Managers can view all order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM managers 
      WHERE managers.id::text = auth.uid()::text 
      AND managers.is_active = true
    )
  );

CREATE POLICY "Managers can manage packages" ON packages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM managers 
      WHERE managers.id::text = auth.uid()::text 
      AND managers.is_active = true
    )
  );

CREATE POLICY "Managers can view all subscriptions" ON page_subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM managers 
      WHERE managers.id::text = auth.uid()::text 
      AND managers.is_active = true
    )
  );

CREATE POLICY "Managers can manage real estate" ON real_estate_listings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM managers 
      WHERE managers.id::text = auth.uid()::text 
      AND managers.is_active = true
    )
  );

CREATE POLICY "Managers can manage receipts" ON receipts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM managers 
      WHERE managers.id::text = auth.uid()::text 
      AND managers.is_active = true
    )
  );
