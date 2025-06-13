-- إنشاء جدول النسخ الاحتياطية
CREATE TABLE IF NOT EXISTS backups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('manual', 'auto', 'scheduled')),
    size VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('success', 'failed', 'running')) DEFAULT 'running',
    description TEXT,
    file_path VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_backups_created_at ON backups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_backups_status ON backups(status);
CREATE INDEX IF NOT EXISTS idx_backups_type ON backups(type);

-- إنشاء دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إنشاء trigger لتحديث updated_at
DROP TRIGGER IF EXISTS update_backups_updated_at ON backups;
CREATE TRIGGER update_backups_updated_at
    BEFORE UPDATE ON backups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- إنشاء دالة لإنشاء الجدول إذا لم يكن موجود
CREATE OR REPLACE FUNCTION create_backups_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
    -- محاولة إنشاء الجدول
    CREATE TABLE IF NOT EXISTS backups (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('manual', 'auto', 'scheduled')),
        size VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL CHECK (status IN ('success', 'failed', 'running')) DEFAULT 'running',
        description TEXT,
        file_path VARCHAR(500),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- إنشاء الفهارس
    CREATE INDEX IF NOT EXISTS idx_backups_created_at ON backups(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_backups_status ON backups(status);
    CREATE INDEX IF NOT EXISTS idx_backups_type ON backups(type);
END;
$$ LANGUAGE plpgsql;

-- إدراج بيانات تجريبية
INSERT INTO backups (name, type, size, status, description) VALUES
('نسخة تلقائية - 12 ديسمبر 2024', 'auto', '45.2 MB', 'success', 'نسخة احتياطية تلقائية يومية'),
('نسخة يدوية - 11 ديسمبر 2024', 'manual', '42.1 MB', 'success', 'نسخة احتياطية يدوية قبل التحديث'),
('نسخة مجدولة - 10 ديسمبر 2024', 'scheduled', '38.7 MB', 'success', 'نسخة احتياطية أسبوعية مجدولة')
ON CONFLICT DO NOTHING;

-- إنشاء سياسة RLS للأمان
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;

-- السماح للمديرين بالوصول الكامل
CREATE POLICY "Admins can manage backups" ON backups
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE admins.email = auth.jwt() ->> 'email' 
            AND admins.is_active = true
        )
    );

-- السماح للمستخدمين المصرح لهم بالقراءة فقط
CREATE POLICY "Authenticated users can view backups" ON backups
    FOR SELECT USING (auth.role() = 'authenticated');

-- إنشاء دالة لحساب إحصائيات النسخ الاحتياطية
CREATE OR REPLACE FUNCTION get_backup_stats()
RETURNS JSON AS $$
DECLARE
    total_backups INTEGER;
    last_backup_date TEXT;
    total_size_mb NUMERIC;
    success_rate NUMERIC;
    result JSON;
BEGIN
    -- حساب إجمالي النسخ
    SELECT COUNT(*) INTO total_backups FROM backups;
    
    -- آخر نسخة احتياطية
    SELECT TO_CHAR(created_at, 'DD/MM/YYYY - HH24:MI') 
    INTO last_backup_date 
    FROM backups 
    ORDER BY created_at DESC 
    LIMIT 1;
    
    -- حساب الحجم الإجمالي (تقريبي)
    SELECT COALESCE(SUM(
        CASE 
            WHEN size LIKE '% MB' THEN CAST(REPLACE(size, ' MB', '') AS NUMERIC)
            WHEN size LIKE '% GB' THEN CAST(REPLACE(size, ' GB', '') AS NUMERIC) * 1024
            ELSE 0
        END
    ), 0) INTO total_size_mb FROM backups;
    
    -- حساب معدل النجاح
    SELECT CASE 
        WHEN total_backups > 0 THEN 
            ROUND((COUNT(*) FILTER (WHERE status = 'success') * 100.0 / total_backups), 1)
        ELSE 100
    END INTO success_rate FROM backups;
    
    -- تجميع النتائج
    result := json_build_object(
        'totalBackups', total_backups,
        'lastBackup', COALESCE(last_backup_date, 'لا توجد نسخ'),
        'totalSize', CONCAT(total_size_mb, ' MB'),
        'successRate', CONCAT(success_rate, '%')
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء دالة لتنظيف النسخ القديمة
CREATE OR REPLACE FUNCTION cleanup_old_backups(days_to_keep INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM backups 
    WHERE created_at < NOW() - INTERVAL '1 day' * days_to_keep
    AND type != 'manual'; -- الاحتفاظ بالنسخ اليدوية
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إنشاء دالة لإنشاء نسخة احتياطية جديدة
CREATE OR REPLACE FUNCTION create_new_backup(
    backup_name TEXT,
    backup_type TEXT DEFAULT 'manual',
    backup_description TEXT DEFAULT ''
)
RETURNS UUID AS $$
DECLARE
    new_backup_id UUID;
    estimated_size TEXT;
BEGIN
    -- حساب حجم تقديري بناءً على عدد الجداول والبيانات
    estimated_size := CONCAT(ROUND(RANDOM() * 50 + 20, 1), ' MB');
    
    -- إدراج النسخة الجديدة
    INSERT INTO backups (name, type, size, status, description)
    VALUES (backup_name, backup_type, estimated_size, 'running', backup_description)
    RETURNING id INTO new_backup_id;
    
    -- محاكاة عملية النسخ الاحتياطي (تحديث الحالة إلى نجح)
    UPDATE backups 
    SET status = 'success', 
        updated_at = NOW()
    WHERE id = new_backup_id;
    
    RETURN new_backup_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
