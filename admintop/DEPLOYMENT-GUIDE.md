# 🚀 دليل النشر والاستضافة - Top Marketing

## 🌐 خيارات النشر

### 1. Vercel (موصى به - مجاني)

#### المميزات:
- ✅ نشر تلقائي من GitHub
- ✅ SSL مجاني
- ✅ CDN عالمي
- ✅ دعم Next.js الكامل

#### خطوات النشر:
1. **رفع المشروع إلى GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/top-marketing.git
   git push -u origin main
   ```

2. **ربط Vercel:**
   - اذهب إلى [vercel.com](https://vercel.com)
   - سجل دخول بحساب GitHub
   - اضغط "New Project"
   - اختر المستودع
   - اضغط "Deploy"

3. **إضافة متغيرات البيئة:**
   - اذهب إلى Project Settings → Environment Variables
   - أضف:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     NODE_ENV=production
     ```

### 2. Netlify (بديل مجاني)

#### خطوات النشر:
1. **رفع إلى GitHub** (نفس الخطوات أعلاه)
2. **ربط Netlify:**
   - اذهب إلى [netlify.com](https://netlify.com)
   - "New site from Git"
   - اختر GitHub والمستودع
   - Build command: `npm run build`
   - Publish directory: `.next`

### 3. Railway (للمشاريع الكاملة)

#### المميزات:
- ✅ دعم قواعد البيانات
- ✅ نشر سهل
- ✅ مراقبة الأداء

#### خطوات النشر:
1. اذهب إلى [railway.app](https://railway.app)
2. "Deploy from GitHub repo"
3. اختر المستودع
4. أضف متغيرات البيئة

### 4. DigitalOcean App Platform

#### للمشاريع المتقدمة:
- خادم مخصص
- تحكم كامل
- قواعد بيانات منفصلة

## 🔧 إعداد الإنتاج

### 1. تحسين الأداء:

#### تحسين الصور:
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-supabase-url.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
}
```

#### تفعيل الضغط:
```javascript
// next.config.js
module.exports = {
  compress: true,
  poweredByHeader: false,
}
```

### 2. متغيرات البيئة للإنتاج:

```env
# .env.production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
NODE_ENV=production

# اختياري للمميزات المتقدمة
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. إعداد Supabase للإنتاج:

#### أ. إعدادات الأمان:
```sql
-- تفعيل RLS على جميع الجداول
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
```

#### ب. سياسات الوصول:
```sql
-- سياسة للمستخدمين
CREATE POLICY "Users can view own data" ON users
FOR SELECT USING (auth.uid() = auth_id);

-- سياسة للطلبات
CREATE POLICY "Users can view own orders" ON orders
FOR SELECT USING (auth.uid() = user_id);
```

#### ج. إعداد Storage:
1. أنشئ Buckets:
   - `receipts` (خاص)
   - `portfolio` (عام)
   - `properties` (عام)

2. سياسات Storage:
```sql
-- السماح برفع الإيصالات للمستخدمين المسجلين
CREATE POLICY "Authenticated users can upload receipts" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'receipts' AND auth.role() = 'authenticated');
```

## 🔒 الأمان في الإنتاج

### 1. حماية المفاتيح:
- ❌ لا تضع مفاتيح سرية في الكود
- ✅ استخدم متغيرات البيئة فقط
- ✅ استخدم مفاتيح مختلفة للتطوير والإنتاج

### 2. إعدادات CORS:
```javascript
// في Supabase Dashboard → Settings → API
{
  "allowedOrigins": ["https://your-domain.com"],
  "allowCredentials": true
}
```

### 3. تحديد الصلاحيات:
```sql
-- إنشاء أدوار محددة
CREATE ROLE visitor;
CREATE ROLE admin_user;

-- منح صلاحيات محددة
GRANT SELECT ON services TO visitor;
GRANT ALL ON orders TO admin_user;
```

## 📊 مراقبة الأداء

### 1. Vercel Analytics:
- تفعيل Analytics في لوحة Vercel
- مراقبة سرعة التحميل
- تتبع الأخطاء

### 2. Supabase Monitoring:
- مراقبة استخدام قاعدة البيانات
- تتبع الاستعلامات البطيئة
- مراقبة التخزين

### 3. أدوات إضافية:
- Google Analytics للزوار
- Sentry لتتبع الأخطاء
- LogRocket لتسجيل الجلسات

## 🔄 النسخ الاحتياطي

### 1. قاعدة البيانات:
```bash
# نسخ احتياطي يومي
pg_dump "postgresql://user:pass@host:port/db" > backup_$(date +%Y%m%d).sql
```

### 2. الملفات:
- نسخ احتياطي من Storage buckets
- حفظ إعدادات Supabase
- نسخ من متغيرات البيئة

### 3. الكود:
- استخدم Git tags للإصدارات
- احتفظ بنسخ من الإنتاج
- وثّق التغييرات

## 🚨 استكشاف أخطاء الإنتاج

### مشاكل شائعة:

#### 1. خطأ في البناء:
```bash
# فحص محلي
npm run build
npm run start
```

#### 2. مشاكل قاعدة البيانات:
- تحقق من اتصال Supabase
- راجع سياسات RLS
- تحقق من الصلاحيات

#### 3. مشاكل الملفات:
- تحقق من إعدادات Storage
- راجع سياسات الرفع
- تحقق من أحجام الملفات

### أدوات التشخيص:
```javascript
// إضافة logging للإنتاج
console.log('Environment:', process.env.NODE_ENV);
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
```

## 📈 تحسين الأداء

### 1. تحسين قاعدة البيانات:
```sql
-- إضافة فهارس
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_services_active ON services(is_active);
```

### 2. تحسين الصور:
- استخدم WebP format
- ضغط الصور قبل الرفع
- استخدم CDN

### 3. تحسين الكود:
- Code splitting
- Lazy loading
- Tree shaking

## 🎯 قائمة تحقق النشر

### قبل النشر:
- [ ] اختبار جميع الوحدات
- [ ] فحص الأمان
- [ ] تحسين الأداء
- [ ] إعداد النسخ الاحتياطي

### بعد النشر:
- [ ] اختبار الموقع المباشر
- [ ] تحقق من الأداء
- [ ] مراقبة الأخطاء
- [ ] اختبار جميع الوظائف

### صيانة دورية:
- [ ] تحديث المكتبات
- [ ] مراجعة الأمان
- [ ] تحليل الأداء
- [ ] نسخ احتياطية

---

## 📞 الدعم الفني

للمساعدة في النشر:
- **البريد:** asdasheref@gmail.com
- **واتساب:** +201068275557

**🚀 نشر موفق!**
