-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'customer',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    total_spent DECIMAL(10,2) DEFAULT 0,
    last_order_date TIMESTAMP WITH TIME ZONE,
    preferred_payment_method VARCHAR(50),
    whatsapp_number VARCHAR(20),
    company VARCHAR(255),
    notes TEXT
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration VARCHAR(100),
    features JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    service_id VARCHAR(255) NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    quantity INTEGER DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(100),
    requirements TEXT,
    form_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    package_id VARCHAR(100) NOT NULL,
    package_name VARCHAR(255) NOT NULL,
    package_type VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(100),
    start_date DATE,
    end_date DATE,
    requirements TEXT,
    usage JSONB,
    limits JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create real_estate_clients table
CREATE TABLE IF NOT EXISTS real_estate_clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    type VARCHAR(50) NOT NULL, -- 'buyer' or 'seller'
    property JSONB,
    requirements JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    permissions JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_clients_type ON real_estate_clients(type);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policies for customers
CREATE POLICY "Customers can view own data" ON customers
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Customers can update own data" ON customers
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Create policies for orders
CREATE POLICY "Customers can view own orders" ON orders
    FOR SELECT USING (auth.uid()::text = customer_id::text);

CREATE POLICY "Customers can create orders" ON orders
    FOR INSERT WITH CHECK (auth.uid()::text = customer_id::text);

-- Create policies for subscriptions
CREATE POLICY "Customers can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid()::text = customer_id::text);

-- Admin policies (full access for authenticated admins)
CREATE POLICY "Admins have full access to customers" ON customers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE email = auth.jwt() ->> 'email' 
            AND is_active = true
        )
    );

CREATE POLICY "Admins have full access to orders" ON orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE email = auth.jwt() ->> 'email' 
            AND is_active = true
        )
    );

CREATE POLICY "Admins have full access to subscriptions" ON subscriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE email = auth.jwt() ->> 'email' 
            AND is_active = true
        )
    );

CREATE POLICY "Admins have full access to real estate clients" ON real_estate_clients
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE email = auth.jwt() ->> 'email' 
            AND is_active = true
        )
    );

-- Services are publicly readable
CREATE POLICY "Services are publicly readable" ON services
    FOR SELECT USING (is_active = true);

-- Admins can manage services
CREATE POLICY "Admins can manage services" ON services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE email = auth.jwt() ->> 'email' 
            AND is_active = true
        )
    );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_real_estate_clients_updated_at BEFORE UPDATE ON real_estate_clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
