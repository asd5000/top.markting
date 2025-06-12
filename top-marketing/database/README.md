# إعداد قاعدة البيانات - Top Marketing

## 📋 خطوات الإعداد

### 1. إنشاء مشروع Supabase جديد
1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. أنشئ مشروع جديد
3. انتظر حتى يكتمل الإعداد

### 2. تشغيل ملفات SQL

#### أ. إنشاء الجداول (schema.sql)
1. اذهب إلى SQL Editor في Supabase Dashboard
2. انسخ محتوى ملف `schema.sql`
3. شغل الاستعلام
4. تأكد من إنشاء جميع الجداول بنجاح

#### ب. إدراج البيانات الأولية (seed.sql)
1. انسخ محتوى ملف `seed.sql`
2. شغل الاستعلام
3. تأكد من إدراج البيانات الأولية

#### ج. تفعيل سياسات الأمان (rls.sql)
1. انسخ محتوى ملف `rls.sql`
2. شغل الاستعلام
3. تأكد من تفعيل RLS على جميع الجداول

### 3. إعداد المصادقة

#### تفعيل مقدمي الخدمة
1. اذهب إلى Authentication > Providers
2. فعل Email provider
3. اختياري: فعل Google, GitHub, إلخ

#### إعداد URL Redirects
1. اذهب إلى Authentication > URL Configuration
2. أضف:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 4. الحصول على مفاتيح API

1. اذهب إلى Settings > API
2. انسخ:
   - Project URL
   - anon public key
   - service_role key (للاستخدام في الخادم فقط)

### 5. إعداد Storage (اختياري)

#### إنشاء Buckets
```sql
-- إنشاء bucket للصور
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- إنشاء bucket للإيصالات
INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', false);

-- إنشاء bucket للعقارات
INSERT INTO storage.buckets (id, name, public) VALUES ('real-estate', 'real-estate', true);
```

#### سياسات Storage
```sql
-- سياسة رفع الصور للعملاء
CREATE POLICY "Users can upload images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- سياسة عرض الصور العامة
CREATE POLICY "Public images are viewable" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- سياسة رفع الإيصالات
CREATE POLICY "Users can upload receipts" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'receipts' AND auth.role() = 'authenticated');

-- سياسة عرض الإيصالات للمالك فقط
CREATE POLICY "Users can view own receipts" ON storage.objects
FOR SELECT USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## 🔍 التحقق من الإعداد

### فحص الجداول
```sql
-- عرض جميع الجداول
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- فحص عدد السجلات في كل جدول
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public';
```

### فحص RLS
```sql
-- التحقق من تفعيل RLS
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- عرض السياسات
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

### فحص البيانات الأولية
```sql
-- فحص الخدمات
SELECT id, name, is_active FROM services;

-- فحص الخدمات الفرعية
SELECT s.name as service, ss.name as sub_service, ss.price 
FROM services s 
JOIN sub_services ss ON s.id = ss.service_id 
ORDER BY s.name, ss.name;

-- فحص الباقات
SELECT name, price, duration_months FROM packages;

-- فحص المديرين
SELECT full_name, email, role, is_active FROM managers;
```

## 🛠️ استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. خطأ في إنشاء الجداول
```sql
-- حذف جدول وإعادة إنشاؤه
DROP TABLE IF EXISTS table_name CASCADE;
-- ثم أعد تشغيل schema.sql
```

#### 2. مشاكل في RLS
```sql
-- تعطيل RLS مؤقتاً للاختبار
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;

-- إعادة تفعيل RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

#### 3. مشاكل في البيانات الأولية
```sql
-- حذف البيانات وإعادة إدراجها
TRUNCATE TABLE table_name RESTART IDENTITY CASCADE;
-- ثم أعد تشغيل seed.sql
```

#### 4. مشاكل في الصلاحيات
```sql
-- منح صلاحيات للمستخدم المصادق عليه
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
```

## 📊 مراقبة الأداء

### استعلامات مفيدة للمراقبة
```sql
-- حجم قاعدة البيانات
SELECT pg_size_pretty(pg_database_size(current_database()));

-- حجم كل جدول
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- الاستعلامات البطيئة
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

## 🔄 النسخ الاحتياطية

### إنشاء نسخة احتياطية
```bash
# باستخدام pg_dump
pg_dump -h your-host -U postgres -d your-database > backup.sql

# أو باستخدام Supabase CLI
supabase db dump -f backup.sql
```

### استرجاع النسخة الاحتياطية
```bash
# باستخدام psql
psql -h your-host -U postgres -d your-database < backup.sql

# أو باستخدام Supabase CLI
supabase db reset --db-url "your-connection-string"
```

## 📞 الدعم

إذا واجهت أي مشاكل في إعداد قاعدة البيانات:
1. راجع [وثائق Supabase](https://supabase.com/docs)
2. تحقق من [مجتمع Supabase](https://github.com/supabase/supabase/discussions)
3. اتصل بفريق الدعم الفني

---

**ملاحظة**: تأكد من الاحتفاظ بنسخة احتياطية من قاعدة البيانات قبل إجراء أي تغييرات كبيرة.
