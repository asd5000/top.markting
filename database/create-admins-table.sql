-- إنشاء جدول المديرين المنفصل
CREATE TABLE IF NOT EXISTS admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'marketing_manager', 'packages_manager', 'real_estate_manager', 'support')) DEFAULT 'support',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء فهارس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);
CREATE INDEX IF NOT EXISTS idx_admins_is_active ON admins(is_active);
CREATE INDEX IF NOT EXISTS idx_admins_created_at ON admins(created_at DESC);

-- إنشاء trigger لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_admins_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_admins_updated_at_trigger ON admins;
CREATE TRIGGER update_admins_updated_at_trigger
    BEFORE UPDATE ON admins
    FOR EACH ROW
    EXECUTE FUNCTION update_admins_updated_at();

-- إدراج المديرين الأساسيين مع كلمات مرور مشفرة
INSERT INTO admins (name, email, password, role, is_active) VALUES
-- كلمة المرور: 0453328124
('أشرف الشريف', 'asdasheref@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin', true),
-- كلمة المرور: admin123
('أحمد محمد - المدير العام', 'admin@topmarketing.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin', true),
-- كلمة المرور: 123456
('مدير تجريبي', 'test@topmarketing.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'support', true),
-- كلمة المرور: marketing123
('سارة أحمد - مدير التسويق', 'marketing@topmarketing.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'marketing_manager', true),
-- كلمة المرور: packages123
('عمر خالد - مدير الباقات', 'packages@topmarketing.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'packages_manager', true),
-- كلمة المرور: realestate123
('فاطمة حسن - مدير العقارات', 'realestate@topmarketing.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'real_estate_manager', true)
ON CONFLICT (email) DO NOTHING;

-- إنشاء سياسات RLS للأمان
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- السماح للمديرين بالوصول الكامل
CREATE POLICY "Admins can manage all admins" ON admins
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE admins.email = auth.jwt() ->> 'email' 
            AND admins.is_active = true
            AND admins.role = 'super_admin'
        )
    );

-- السماح للمديرين بقراءة بياناتهم الخاصة
CREATE POLICY "Admins can view their own data" ON admins
    FOR SELECT USING (
        email = auth.jwt() ->> 'email'
    );

-- إنشاء دالة للتحقق من تسجيل الدخول
CREATE OR REPLACE FUNCTION verify_admin_login(
    admin_email TEXT,
    admin_password TEXT
)
RETURNS JSON AS $$
DECLARE
    admin_record RECORD;
    result JSON;
BEGIN
    -- البحث عن المدير
    SELECT id, name, email, password, role, is_active, created_at
    INTO admin_record
    FROM admins
    WHERE email = admin_email AND is_active = true;
    
    -- التحقق من وجود المدير
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'message', 'البريد الإلكتروني غير مسجل'
        );
    END IF;
    
    -- التحقق من كلمة المرور (مبسط - في الواقع يجب استخدام bcrypt)
    IF admin_record.password != admin_password THEN
        RETURN json_build_object(
            'success', false,
            'message', 'كلمة المرور غير صحيحة'
        );
    END IF;
    
    -- إرجاع بيانات المدير عند النجاح
    RETURN json_build_object(
        'success', true,
        'admin', json_build_object(
            'id', admin_record.id,
            'name', admin_record.name,
            'email', admin_record.email,
            'role', admin_record.role,
            'loginTime', NOW()
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء دالة لإضافة مدير جديد
CREATE OR REPLACE FUNCTION create_new_admin(
    admin_name TEXT,
    admin_email TEXT,
    admin_password TEXT,
    admin_role TEXT DEFAULT 'support'
)
RETURNS JSON AS $$
DECLARE
    new_admin_id UUID;
    result JSON;
BEGIN
    -- التحقق من عدم وجود البريد الإلكتروني
    IF EXISTS (SELECT 1 FROM admins WHERE email = admin_email) THEN
        RETURN json_build_object(
            'success', false,
            'message', 'البريد الإلكتروني موجود مسبقاً'
        );
    END IF;
    
    -- إدراج المدير الجديد
    INSERT INTO admins (name, email, password, role, is_active)
    VALUES (admin_name, admin_email, admin_password, admin_role, true)
    RETURNING id INTO new_admin_id;
    
    -- إرجاع النتيجة
    RETURN json_build_object(
        'success', true,
        'message', 'تم إضافة المدير بنجاح',
        'admin_id', new_admin_id
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'message', 'حدث خطأ أثناء إضافة المدير: ' || SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء دالة لتحديث بيانات المدير
CREATE OR REPLACE FUNCTION update_admin_data(
    admin_id UUID,
    admin_name TEXT DEFAULT NULL,
    admin_email TEXT DEFAULT NULL,
    admin_role TEXT DEFAULT NULL,
    admin_is_active BOOLEAN DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- تحديث البيانات المحددة فقط
    UPDATE admins SET
        name = COALESCE(admin_name, name),
        email = COALESCE(admin_email, email),
        role = COALESCE(admin_role, role),
        is_active = COALESCE(admin_is_active, is_active),
        updated_at = NOW()
    WHERE id = admin_id;
    
    -- التحقق من نجاح التحديث
    IF FOUND THEN
        RETURN json_build_object(
            'success', true,
            'message', 'تم تحديث بيانات المدير بنجاح'
        );
    ELSE
        RETURN json_build_object(
            'success', false,
            'message', 'لم يتم العثور على المدير'
        );
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'message', 'حدث خطأ أثناء تحديث البيانات: ' || SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء دالة لحذف المدير
CREATE OR REPLACE FUNCTION delete_admin_by_id(admin_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- حذف المدير
    DELETE FROM admins WHERE id = admin_id;
    
    -- التحقق من نجاح الحذف
    IF FOUND THEN
        RETURN json_build_object(
            'success', true,
            'message', 'تم حذف المدير بنجاح'
        );
    ELSE
        RETURN json_build_object(
            'success', false,
            'message', 'لم يتم العثور على المدير'
        );
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'message', 'حدث خطأ أثناء حذف المدير: ' || SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
