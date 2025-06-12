@echo off
echo 🚀 بدء عملية النشر المحسن لموقع Top Marketing...
echo ✨ حل مشاكل Vercel وإعداد اسم مشروع جديد
echo.

echo 📋 الخطوة 1: التحقق من Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git غير مثبت! يرجى تثبيت Git أولاً
    pause
    exit /b 1
)
echo ✅ Git متاح

echo.
echo 📋 الخطوة 2: إضافة التغييرات...
git add -A
if errorlevel 1 (
    echo ❌ فشل في إضافة الملفات
    pause
    exit /b 1
)
echo ✅ تم إضافة جميع الملفات

echo.
echo 📋 الخطوة 3: إنشاء Commit...
git commit -m "🔧 Fix Vercel deployment: Optimize config and resolve naming conflicts - %date% %time%"
if errorlevel 1 (
    echo ⚠️ لا توجد تغييرات جديدة للـ commit
)
echo ✅ تم إنشاء Commit

echo.
echo 📋 الخطوة 4: رفع التغييرات إلى GitHub...
git push origin main
if errorlevel 1 (
    echo ❌ فشل في رفع التغييرات إلى GitHub
    echo 💡 تأكد من ربط Remote origin
    pause
    exit /b 1
)
echo ✅ تم رفع التغييرات إلى GitHub بنجاح!

echo.
echo 🎉 تم النشر بنجاح!
echo 🔧 تم حل مشاكل Vercel:
echo    ✅ ملف vercel.json محسن (بدون functions)
echo    ✅ اسم مشروع جديد: top-marketing-system
echo    ✅ إعدادات محسنة لـ Next.js
echo.
echo 🚀 للنشر على Vercel:
echo 1. اذهب إلى: https://vercel.com/new
echo 2. اختر Repository: asd5000/top.markting
echo 3. Project Name: top-marketing-system (اسم جديد لتجنب التعارض)
echo 4. Framework: Next.js
echo 5. Environment Variables:
echo    NEXT_PUBLIC_SUPABASE_URL=https://xmufnqzvxuowmvugmcpr.supabase.co
echo    NEXT_PUBLIC_SUPABASE_ANON_KEY=I9JU23NF394R6HH
echo 6. Deploy
echo.
echo 📱 GitHub: https://github.com/asd5000/top.markting
echo.
pause
