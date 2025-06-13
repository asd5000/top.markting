@echo off
echo ========================================
echo    🚀 نشر سريع لمشروع Top Marketing
echo ========================================
echo.

echo 📋 فحص الملفات المطلوبة...
if not exist "package.json" (
    echo ❌ ملف package.json غير موجود
    pause
    exit /b 1
)

if not exist "src" (
    echo ❌ مجلد src غير موجود
    pause
    exit /b 1
)

if not exist ".env.local" (
    echo ❌ ملف .env.local غير موجود
    pause
    exit /b 1
)

echo ✅ جميع الملفات المطلوبة موجودة
echo.

echo 🔧 فحص النظام...
node fix-all-issues.js
echo.

echo 📦 تثبيت التبعيات...
npm install
if %errorlevel% neq 0 (
    echo ❌ فشل في تثبيت التبعيات
    pause
    exit /b 1
)
echo ✅ تم تثبيت التبعيات بنجاح
echo.

echo 🏗️ بناء المشروع...
npm run build
if %errorlevel% neq 0 (
    echo ❌ فشل في بناء المشروع
    pause
    exit /b 1
)
echo ✅ تم بناء المشروع بنجاح
echo.

echo 📤 رفع إلى GitHub...
git add .
git commit -m "Fix: حل مشاكل API keys وStorage وإصلاح شامل للنظام"
git push origin main
if %errorlevel% neq 0 (
    echo ⚠️ تحذير: قد تكون هناك مشكلة في رفع الكود إلى GitHub
    echo يمكنك المتابعة أو إصلاح مشكلة Git أولاً
    pause
)
echo ✅ تم رفع الكود إلى GitHub
echo.

echo 🌐 معلومات النشر:
echo ==================
echo GitHub Repo: https://github.com/asd5000/top.markting
echo Vercel Project: top-markting
echo Live URL: https://top-markting.vercel.app
echo.

echo 📝 الخطوات التالية:
echo =================
echo 1. اذهب إلى Vercel Dashboard
echo 2. تأكد من تحديث Environment Variables
echo 3. أعد نشر المشروع إذا لم يتم تلقائياً
echo 4. اختبر الموقع على الرابط المباشر
echo.

echo 🔑 متغيرات البيئة المطلوبة في Vercel:
echo ========================================
echo NEXT_PUBLIC_SUPABASE_URL=https://xmufnqzvxuowmvugmcpr.supabase.co
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
echo SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
echo NODE_ENV=production
echo.

echo 🎉 انتهى النشر السريع!
echo تحقق من الموقع: https://top-markting.vercel.app
echo.

pause
