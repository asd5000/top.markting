# 🚀 توب ماركتنج - نظام إدارة الخدمات الرقمية

نظام متكامل لإدارة الخدمات الرقمية والتسويقية مع واجهة عربية RTL ونظام CRM شامل.

## 📋 المحتويات

- [نظرة عامة](#نظرة-عامة)
- [المميزات](#المميزات)
- [التقنيات المستخدمة](#التقنيات-المستخدمة)
- [التثبيت والإعداد](#التثبيت-والإعداد)
- [هيكل المشروع](#هيكل-المشروع)
- [الخدمات المتاحة](#الخدمات-المتاحة)
- [نظام الدفع](#نظام-الدفع)
- [لوحة التحكم](#لوحة-التحكم)
- [المساهمة](#المساهمة)

## 🎯 نظرة عامة

توب ماركتنج هو نظام شامل لإدارة الخدمات الرقمية يشمل:

- **موقع عام** لعرض الخدمات وتلقي الطلبات
- **نظام CRM** متكامل لإدارة العملاء والطلبات
- **نظام دفع** يدعم الطرق المصرية (فودافون كاش، فوري، إنستا باي)
- **معرض أعمال** تفاعلي لعرض المشاريع المنجزة
- **نظام إشعارات** تلقائي عبر واتساب
- **تقارير وإحصائيات** شاملة

## ✨ المميزات

### 🌐 الموقع العام
- ✅ واجهة عربية RTL كاملة
- ✅ تصميم متجاوب لجميع الأجهزة
- ✅ عرض 6 فئات خدمات رئيسية
- ✅ نظام طلب الخدمات المتقدم
- ✅ معرض أعمال تفاعلي
- ✅ أزرار تواصل ذكية (واتساب، اتصال، SMS)

### 🎨 الخدمات المتاحة
1. **التصميم الجرافيكي** - لوجوهات، هويات بصرية، بروشورات
2. **التسويق الرقمي** - إدارة حسابات، حملات إعلانية، SEO
3. **تطوير المواقع** - مواقع شركات، متاجر إلكترونية، تطبيقات
4. **سحب البيانات** - تحليل منافسين، بحث السوق، قوائم عملاء
5. **زيادة المتابعين** - نمو طبيعي على جميع المنصات
6. **مونتاج الفيديو** - فيديوهات تسويقية، موشن جرافيك
7. **الخدمات العقارية** - وساطة، تقييم، استشارات

### 💳 نظام الدفع المتقدم
- **فودافون كاش** (+201068275557)
- **فوري باي** مع API متكامل
- **إنستا باي** للدفع الفوري
- **التحويل البنكي** التقليدي
- تأكيد الدفع عبر رفع الإيصالات
- إشعارات تلقائية للإدارة

### 🎛️ لوحة التحكم (CRM)
- **إدارة الطلبات** - تتبع حالة الطلبات ومعالجتها
- **إدارة العملاء** - قاعدة بيانات شاملة للعملاء
- **إدارة الخدمات** - إضافة وتعديل الخدمات المتاحة
- **إدارة المحتوى (CMS)** - تحكم كامل في تصميم الموقع
- **التقارير والإحصائيات** - تقارير يومية وأسبوعية
- **نظام الإشعارات** - واتساب تلقائي للطلبات الجديدة

### 📊 نظام التقارير
- تقارير يومية وأسبوعية تلقائية
- إحصائيات المبيعات والعملاء
- تحليل أداء الخدمات
- إرسال التقارير عبر واتساب

## 🛠️ التقنيات المستخدمة

### Frontend
- **Next.js 14** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend & Database
- **Supabase** - Database & Authentication
- **PostgreSQL** - Relational Database
- **Row Level Security** - Data Protection

### Payment Integration
- **Vodafone Cash** - Mobile Wallet
- **Fawry Pay** - Payment Gateway
- **InstaPay** - Instant Payment
- **Bank Transfer** - Traditional Payment

### Communication
- **WhatsApp Business API** - Notifications
- **Email Integration** - SMTP Support
- **SMS Integration** - Text Messages

## 🚀 التثبيت والإعداد

### المتطلبات
- Node.js 18+ 
- npm أو yarn
- حساب Supabase
- حساب WhatsApp Business (اختياري)

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone https://github.com/your-username/top-marketing.git
cd top-marketing
```

2. **تثبيت التبعيات**
```bash
npm install
# أو
yarn install
```

3. **إعداد متغيرات البيئة**
```bash
cp .env.example .env.local
```

4. **تحديث ملف .env.local**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_COMPANY_PHONE=+201068275557

# Payment Settings
VODAFONE_CASH_NUMBER=+201068275557
FAWRY_MERCHANT_CODE=your_merchant_code
FAWRY_SECRET_KEY=your_secret_key
INSTAPAY_MERCHANT_ID=your_merchant_id
INSTAPAY_API_KEY=your_api_key

# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

# Email Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

5. **إعداد قاعدة البيانات**
```bash
# تشغيل migrations في Supabase
# أو استخدام SQL المرفق في /database/schema.sql
```

6. **تشغيل المشروع**
```bash
npm run dev
# أو
yarn dev
```

7. **فتح المتصفح**
```
http://localhost:3000
```

## 📁 هيكل المشروع

```
top-marketing/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── home/              # الصفحة الرئيسية
│   │   ├── services/          # صفحات الخدمات
│   │   ├── order/             # صفحة الطلبات
│   │   ├── payment/           # صفحة الدفع
│   │   ├── portfolio/         # معرض الأعمال
│   │   └── dashboard/         # لوحة التحكم
│   ├── components/            # المكونات المشتركة
│   │   ├── Portfolio.tsx      # معرض الأعمال
│   │   └── ContactButtons.tsx # أزرار التواصل
│   ├── lib/                   # المكتبات والإعدادات
│   │   ├── supabase-config.ts # إعدادات قاعدة البيانات
│   │   ├── payment-config.ts  # إعدادات الدفع
│   │   ├── cms-config.ts      # نظام إدارة المحتوى
│   │   └── notifications.ts   # نظام الإشعارات
│   └── data/                  # البيانات التجريبية
│       └── portfolio-data.ts  # بيانات معرض الأعمال
├── public/                    # الملفات العامة
│   ├── portfolio/             # صور معرض الأعمال
│   └── icons/                 # أيقونات طرق الدفع
├── database/                  # ملفات قاعدة البيانات
│   └── schema.sql            # هيكل قاعدة البيانات
└── docs/                     # الوثائق
    └── api.md                # وثائق API
```

## 🔧 الإعداد المتقدم

### إعداد Supabase

1. إنشاء مشروع جديد في [Supabase](https://supabase.com)
2. تشغيل SQL Schema من ملف `/database/schema.sql`
3. إعداد Row Level Security (RLS)
4. إضافة البيانات التجريبية

### إعداد WhatsApp Business API

1. إنشاء حساب [Meta for Developers](https://developers.facebook.com)
2. إعداد WhatsApp Business API
3. الحصول على Access Token و Phone Number ID
4. تحديث متغيرات البيئة

### إعداد أنظمة الدفع

#### فودافون كاش
- تحديث رقم الهاتف في الإعدادات
- لا يتطلب API (دفع يدوي)

#### فوري باي
1. التسجيل في [Fawry](https://fawry.com)
2. الحصول على Merchant Code و Secret Key
3. تحديث الإعدادات

#### إنستا باي
1. التسجيل في [InstaPay](https://instapay.com.eg)
2. الحصول على API credentials
3. تحديث الإعدادات

## 🎨 التخصيص

### تغيير الألوان والتصميم
```typescript
// في src/lib/cms-config.ts
export const DEFAULT_SITE_SETTINGS = {
  primaryColor: '#2563eb',    // اللون الأساسي
  secondaryColor: '#7c3aed',  // اللون الثانوي
  accentColor: '#f59e0b',     // لون التمييز
  // ...
}
```

### إضافة خدمات جديدة
```typescript
// في src/lib/supabase-config.ts
export const SERVICE_CATEGORIES = {
  'new-service': {
    name: 'خدمة جديدة',
    description: 'وصف الخدمة الجديدة',
    icon: 'icon-name',
    color: 'bg-color-500'
  }
}
```

### تخصيص معرض الأعمال
```typescript
// في src/data/portfolio-data.ts
export const portfolioData: PortfolioItem[] = [
  {
    id: 'new-project',
    title: 'مشروع جديد',
    description: 'وصف المشروع',
    category: 'design',
    type: 'image',
    // ...
  }
]
```

## 📱 الاستخدام

### للعملاء
1. زيارة الموقع الرئيسي
2. تصفح الخدمات المتاحة
3. طلب الخدمة المطلوبة
4. إتمام الدفع
5. متابعة حالة الطلب

### للإدارة
1. تسجيل الدخول إلى لوحة التحكم
2. مراجعة الطلبات الجديدة
3. تحديث حالة الطلبات
4. إدارة العملاء والخدمات
5. مراجعة التقارير

## 🔒 الأمان

- **Row Level Security** في Supabase
- **JWT Authentication** للمصادقة
- **HTTPS** إجباري في الإنتاج
- **Input Validation** لجميع النماذج
- **Rate Limiting** لمنع الإساءة

## 🚀 النشر

### Vercel (موصى به)
```bash
# ربط المشروع بـ Vercel
vercel

# إعداد متغيرات البيئة في Vercel Dashboard
# نشر المشروع
vercel --prod
```

### Netlify
```bash
# بناء المشروع
npm run build

# رفع مجلد out/ إلى Netlify
```

### خادم مخصص
```bash
# بناء المشروع
npm run build

# تشغيل الخادم
npm start
```

## 📈 الأداء

- **Lighthouse Score**: 95+
- **Core Web Vitals**: ممتاز
- **Image Optimization**: تلقائي مع Next.js
- **Code Splitting**: تلقائي
- **Caching**: متقدم

## 🤝 المساهمة

نرحب بالمساهمات! يرجى:

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 الدعم

- **الإيميل**: info@topmarketing.com
- **الهاتف**: +201068275557
- **واتساب**: [اضغط هنا](https://wa.me/201068275557)

## 🙏 شكر خاص

- [Next.js](https://nextjs.org) - React Framework
- [Supabase](https://supabase.com) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com) - CSS Framework
- [Lucide](https://lucide.dev) - Icon Library

---

**تم تطوير هذا المشروع بـ ❤️ في مصر**
