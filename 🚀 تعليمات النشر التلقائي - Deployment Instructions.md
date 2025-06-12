# 🚀 تعليمات النشر التلقائي لموقع Top Marketing

## ✅ **تم إعداد المشروع بالكامل!**

تم إعداد جميع ملفات المشروع وهي جاهزة للنشر. اتبع الخطوات التالية:

## 📋 **الخطوة 1: إنشاء Repository على GitHub**

### **1.1 إنشاء Repository جديد**:
1. اذهب إلى: https://github.com/new
2. **Repository name**: `top.markting`
3. **Description**: `🚀 Top Marketing - نظام إدارة الخدمات التسويقية المتكامل مع Next.js + TypeScript + Supabase`
4. **Visibility**: Public ✅
5. **Initialize**: لا تختر أي خيارات إضافية (Repository فارغ)
6. اضغط **"Create repository"**

### **1.2 ربط المشروع المحلي بـ GitHub**:
افتح Command Prompt في مجلد المشروع وشغل الأوامر التالية:

```bash
cd "C:\Users\Masrawy\asd"
git remote add origin https://github.com/asd5000/top.markting.git
git branch -M main
git push -u origin main
```

## 🚀 **الخطوة 2: النشر على Vercel**

### **2.1 إنشاء مشروع جديد على Vercel**:
1. اذهب إلى: https://vercel.com/new
2. اختر **"Import Git Repository"**
3. اختر Repository: `asd5000/top.markting`
4. **Project Name**: `top-markting`
5. **Framework Preset**: Next.js ✅
6. **Root Directory**: `./` (افتراضي)

### **2.2 إعداد متغيرات البيئة**:
في صفحة إعداد المشروع، اضغط على **"Environment Variables"** وأضف:

```
NEXT_PUBLIC_SUPABASE_URL=https://xmufnqzvxuowmvugmcpr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=I9JU23NF394R6HH
```

### **2.3 النشر**:
1. اضغط **"Deploy"**
2. انتظر انتهاء عملية البناء (Build)
3. ستحصل على رابط الموقع المباشر

## 🔧 **الخطوة 3: التحقق من النشر**

### **3.1 اختبار الموقع**:
1. افتح رابط الموقع من Vercel
2. تحقق من:
   - ✅ الصفحة الرئيسية تعمل
   - ✅ الإعلان يظهر في الأعلى
   - ✅ معلومات الاتصال صحيحة في Footer
   - ✅ صفحة التواصل تعمل

### **3.2 اختبار لوحة التحكم**:
1. اذهب إلى: `your-domain.vercel.app/admin/login`
2. سجل الدخول بـ:
   - **البريد الإلكتروني**: `asdasheref@gmail.com`
   - **كلمة المرور**: `0453328124`
3. تحقق من جميع الصفحات

## 🎯 **الخطوة 4: إعداد Domain مخصص (اختياري)**

### **4.1 إضافة Domain**:
1. في Vercel Dashboard، اذهب لمشروعك
2. اضغط **"Settings"** → **"Domains"**
3. أضف Domain الخاص بك
4. اتبع تعليمات DNS

## 📊 **معلومات المشروع**

### **🗂️ هيكل المشروع**:
```
top.markting/
├── src/
│   ├── app/                 # صفحات Next.js
│   ├── components/          # المكونات
│   ├── lib/                # المكتبات
│   └── hooks/              # React Hooks
├── database/               # ملفات قاعدة البيانات
├── public/                 # الملفات العامة
└── package.json           # التبعيات
```

### **🎛️ الصفحات الرئيسية**:
- `/` - الصفحة الرئيسية
- `/services` - الخدمات
- `/packages` - الباقات
- `/contact` - تواصل معنا
- `/admin` - لوحة التحكم

### **🔐 بيانات الدخول**:
- **Admin**: `asdasheref@gmail.com` / `0453328124`

## 🛠️ **استكمال الإعداد**

### **5.1 إعداد Supabase RLS**:
تأكد من أن Row Level Security مفعل في Supabase:

```sql
-- في Supabase SQL Editor
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
```

### **5.2 إعداد Storage Buckets**:
تأكد من وجود Buckets في Supabase Storage:
- `images` - للصور العامة
- `receipts` - للإيصالات

## 🔄 **التحديثات المستقبلية**

### **للتحديث**:
```bash
cd "C:\Users\Masrawy\asd"
git add .
git commit -m "Update: وصف التحديث"
git push origin main
```

سيتم النشر تلقائياً على Vercel عند Push.

## 📞 **الدعم الفني**

### **في حالة وجود مشاكل**:
1. **GitHub Issues**: https://github.com/asd5000/top.markting/issues
2. **Vercel Logs**: في Dashboard → Functions → View Logs
3. **Supabase Logs**: في Dashboard → Logs

## 🎉 **النتيجة المتوقعة**

بعد اتباع هذه الخطوات ستحصل على:

✅ **موقع مباشر** على Vercel  
✅ **Repository على GitHub** للتحكم في الإصدارات  
✅ **نشر تلقائي** عند كل تحديث  
✅ **إعدادات ديناميكية** من لوحة التحكم  
✅ **قاعدة بيانات متصلة** مع Supabase  

## 🔗 **الروابط المهمة**

- **GitHub**: https://github.com/asd5000/top.markting
- **Vercel**: https://vercel.com/dashboard
- **Supabase**: https://xmufnqzvxuowmvugmcpr.supabase.co

---

**🌟 مبروك! موقعك جاهز للنشر! 🌟**

**📅 تاريخ الإعداد**: 12 ديسمبر 2024  
**🔢 الإصدار**: 1.0.0  
**✅ الحالة**: جاهز للنشر
