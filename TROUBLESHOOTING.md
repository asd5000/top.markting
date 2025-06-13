# 🔧 دليل حل مشاكل النظام - Troubleshooting Guide

## 📋 المشاكل المحددة والحلول

### 1. ❌ مشكلة "Invalid API key" في لوحة التحكم

**الأعراض:**
- رسالة "Invalid API key" في صفحات الباقات وإعدادات الموقع
- عدم تحميل البيانات من قاعدة البيانات

**الحل:**
```bash
# 1. تحديث متغيرات البيئة في Vercel
# اذهب إلى Vercel Dashboard → Settings → Environment Variables
# أضف/حدث هذه المتغيرات:

NEXT_PUBLIC_SUPABASE_URL=https://xmufnqzvxuowmvugmcpr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZucXp2eHVvd212dWdtY3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MzcxNTAsImV4cCI6MjA2NTExMzE1MH0.WZPhXpGdbBWzBJfPm9z2ZdZhQpmgMbJwPR2fpryHUqw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZucXp2eHVvd212dWdtY3ByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTUzNzE1MCwiZXhwIjoyMDY1MTEzMTUwfQ.EIXL6onxZVB-eYcjgXPr8kjf3cTl3CeHnafUaVeS8Ig
NODE_ENV=production

# 2. أعد نشر المشروع
# في Vercel Dashboard → Deployments → Redeploy
```

### 2. 🖼️ مشكلة رفع الصور في إضافة الخدمات

**الأعراض:**
- رسالة "Invalid Compact JWS" عند رفع الصور
- فشل في رفع الصور في سابقة الأعمال

**الحل:**
```bash
# 1. تحقق من Storage policies في Supabase
# اذهب إلى Supabase Dashboard → Storage → Policies
# تأكد من وجود policy للـ INSERT و SELECT

# 2. تشغيل سكريبت الإصلاح
node fix-storage-issues.js

# 3. إعادة تشغيل التطبيق
npm run build && npm start
```

### 3. 🏠 مشكلة برنامج التسويق العقاري

**الأعراض:**
- عدم القدرة على إضافة عقار من لوحة التحكم
- صفحة فارغة أو أخطاء في التحميل

**الحل:**
```bash
# 1. فحص جدول real_estate
# تأكد من وجود الجدول والأعمدة المطلوبة

# 2. تحديث RLS policies
# في Supabase Dashboard → Authentication → Policies
# تأكد من وجود policies للجدول real_estate
```

### 4. 📄 مشكلة صفحة النسخ الاحتياطي (404)

**الحل:**
- الصفحة موجودة في `/src/app/admin/backup/page.tsx`
- تأكد من أن المكونات المطلوبة موجودة:
  - `BackupSettings.tsx`
  - `BackupReport.tsx`

### 5. 📊 مشكلة إدارة الإيصالات

**الأعراض:**
- رسالة "خطأ في تحميل الإيصالات"
- عدم ظهور البيانات

**الحل:**
```bash
# 1. فحص جدول receipts
# تأكد من وجود البيانات والصلاحيات

# 2. تشغيل سكريبت الفحص الشامل
node fix-all-issues.js
```

## 🛠️ خطوات الإصلاح السريع

### الخطوة 1: فحص شامل للنظام
```bash
# تشغيل سكريبت الفحص الشامل
node fix-all-issues.js
```

### الخطوة 2: تحديث متغيرات البيئة في Vercel
1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروع `top-markting`
3. اذهب إلى Settings → Environment Variables
4. أضف/حدث المتغيرات من ملف `vercel-env-vars.txt`
5. اضغط Save

### الخطوة 3: إعادة النشر
1. في Vercel Dashboard → Deployments
2. اضغط على "Redeploy" للنشر الأخير
3. انتظر انتهاء عملية النشر

### الخطوة 4: مسح Cache المتصفح
1. اضغط Ctrl+Shift+R (أو Cmd+Shift+R على Mac)
2. أو اذهب إلى Developer Tools → Application → Storage → Clear Storage

## 🔍 أدوات التشخيص

### فحص الاتصال بـ Supabase
```javascript
// في Developer Console
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'موجود' : 'مفقود')
```

### فحص Storage
```bash
# تشغيل سكريبت فحص Storage
node fix-storage-issues.js
```

### فحص قاعدة البيانات
```sql
-- في Supabase SQL Editor
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

## 📞 معلومات الدعم

### بيانات Supabase
- **URL:** https://xmufnqzvxuowmvugmcpr.supabase.co
- **Project:** top.marketing
- **Region:** eu-west-3

### بيانات Vercel
- **Project:** top-markting
- **URL:** https://top-markting.vercel.app
- **Framework:** Next.js

### بيانات تسجيل الدخول للمدراء
- **المدير الرئيسي:** asdasheref@gmail.com / 0453328124
- **مدير النظام:** admin / admin123
- **مدير تجريبي:** test / 123456

## ✅ قائمة التحقق النهائية

- [ ] متغيرات البيئة محدثة في Vercel
- [ ] المشروع معاد نشره
- [ ] Cache المتصفح ممسوح
- [ ] جميع الجداول موجودة في Supabase
- [ ] Storage buckets متاحة
- [ ] RLS policies مفعلة
- [ ] تسجيل الدخول للمدراء يعمل
- [ ] رفع الصور يعمل
- [ ] إضافة العقارات تعمل
- [ ] إدارة الإيصالات تعمل
- [ ] صفحة النسخ الاحتياطي تعمل

## 🚨 في حالة استمرار المشاكل

1. تحقق من Vercel Logs في Dashboard
2. تحقق من Supabase Logs في Dashboard
3. تحقق من Browser Console للأخطاء
4. تأكد من أن جميع المتغيرات مضبوطة بشكل صحيح
5. جرب إعادة إنشاء المشروع في Vercel إذا لزم الأمر
