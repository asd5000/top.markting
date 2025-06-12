# دليل التطوير - Top Marketing

## 🚀 البدء السريع

### 1. إعداد البيئة المحلية
```bash
# استنساخ المشروع
git clone <repository-url>
cd top-marketing

# تثبيت المتطلبات
npm install

# نسخ ملف البيئة
cp .env.example .env.local

# تحديث متغيرات البيئة
# قم بتحديث .env.local بمعلومات Supabase الخاصة بك
```

### 2. إعداد قاعدة البيانات
راجع `database/README.md` للتعليمات التفصيلية.

### 3. تشغيل المشروع
```bash
# التطوير العادي
npm run dev

# التطوير مع Turbopack (أسرع)
npm run dev:turbo

# عرض التصميم التوضيحي
npm run demo
```

## 🏗️ هيكل المشروع

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout الرئيسي
│   ├── page.tsx           # الصفحة الرئيسية
│   ├── globals.css        # الأنماط العامة
│   └── favicon.ico        # الأيقونة
├── components/            # المكونات القابلة لإعادة الاستخدام
│   ├── Header.tsx         # رأس الصفحة
│   ├── Sidebar.tsx        # الشريط الجانبي
│   └── UserManagement.tsx # إدارة المستخدمين
└── lib/                   # المكتبات والأدوات
    ├── supabase.ts        # إعداد Supabase
    └── utils.ts           # دوال مساعدة
```

## 🎨 نظام التصميم

### الألوان
```css
/* الألوان الأساسية */
--primary: #0ea5e9 (أزرق)
--secondary: #d946ef (بنفسجي)

/* ألوان الحالة */
--success: #10b981 (أخضر)
--warning: #f59e0b (برتقالي)
--error: #ef4444 (أحمر)
--info: #3b82f6 (أزرق فاتح)
```

### الخطوط
- **Cairo**: الخط الأساسي للنصوص العربية
- **Tajawal**: خط بديل للعناوين

### المكونات الأساسية
```tsx
// الأزرار
<button className="btn btn-primary">زر أساسي</button>
<button className="btn btn-secondary">زر ثانوي</button>

// النماذج
<input className="form-input" />
<label className="form-label">تسمية</label>

// الكروت
<div className="card">محتوى الكرت</div>

// الجداول
<table className="table">...</table>
```

## 🔧 أدوات التطوير

### Scripts المتاحة
```bash
npm run dev          # تشغيل الخادم المحلي
npm run build        # بناء المشروع للإنتاج
npm run start        # تشغيل المشروع المبني
npm run lint         # فحص الكود
npm run lint:fix     # إصلاح مشاكل الكود تلقائياً
npm run type-check   # فحص أنواع TypeScript
npm run db:types     # توليد أنواع قاعدة البيانات
```

### إعدادات VS Code الموصى بها
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### الإضافات الموصى بها
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag
- Prettier - Code formatter
- ESLint

## 📝 معايير الكود

### تسمية الملفات
- **المكونات**: PascalCase (مثل `UserManagement.tsx`)
- **الصفحات**: kebab-case (مثل `user-profile.tsx`)
- **الأدوات**: camelCase (مثل `formatDate.ts`)

### تنظيم الواردات
```tsx
// 1. مكتبات خارجية
import React from 'react'
import { NextPage } from 'next'

// 2. مكونات داخلية
import Header from '@/components/Header'
import { supabase } from '@/lib/supabase'

// 3. أنواع وواجهات
import type { User } from '@/lib/types'
```

### تسمية المتغيرات والدوال
```tsx
// متغيرات: camelCase
const userName = 'أحمد محمد'
const isLoading = false

// دوال: camelCase مع فعل
const handleSubmit = () => {}
const fetchUserData = async () => {}

// ثوابت: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'
const MAX_FILE_SIZE = 1024 * 1024
```

## 🧪 الاختبارات

### إعداد Jest (مستقبلي)
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### مثال على اختبار مكون
```tsx
import { render, screen } from '@testing-library/react'
import Header from '@/components/Header'

test('يعرض اسم المستخدم', () => {
  const user = { name: 'أحمد محمد', email: 'ahmed@test.com', role: 'admin' }
  render(<Header user={user} />)
  
  expect(screen.getByText('أحمد محمد')).toBeInTheDocument()
})
```

## 🚀 النشر

### Vercel (موصى به)
```bash
# تثبيت Vercel CLI
npm i -g vercel

# النشر
vercel

# ربط متغيرات البيئة
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Netlify
```bash
# بناء المشروع
npm run build

# رفع مجلد out/ إلى Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 استكشاف الأخطاء

### مشاكل شائعة

#### 1. خطأ في الاتصال بـ Supabase
```bash
# تحقق من متغيرات البيئة
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

#### 2. مشاكل في Tailwind CSS
```bash
# إعادة بناء ملفات CSS
rm -rf .next
npm run dev
```

#### 3. مشاكل TypeScript
```bash
# فحص الأنواع
npm run type-check

# إعادة تشغيل TypeScript server في VS Code
Ctrl+Shift+P > "TypeScript: Restart TS Server"
```

## 📚 موارد مفيدة

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Documentation](https://react.dev)

## 🤝 المساهمة

### قبل إرسال Pull Request
1. تأكد من تشغيل `npm run lint` بدون أخطاء
2. تأكد من تشغيل `npm run type-check` بدون أخطاء
3. اختبر التغييرات محلياً
4. اكتب وصف واضح للتغييرات

### Git Workflow
```bash
# إنشاء branch جديد
git checkout -b feature/new-feature

# إضافة التغييرات
git add .
git commit -m "feat: إضافة ميزة جديدة"

# دفع التغييرات
git push origin feature/new-feature

# إنشاء Pull Request
```

---

**سعيد بالتطوير! 🚀**
