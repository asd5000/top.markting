@echo off
echo 🚀 بدء عملية النشر المحسن لموقع Top Marketing...
echo ✨ المشروع محسن للعمل مع إعدادات Vercel التلقائية
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
git commit -m "🚀 Deploy: Update Top Marketing website - %date% %time%"
if errorlevel 1 (
    echo ⚠️ لا توجد تغييرات جديدة للـ commit
)
echo ✅ تم إنشاء Commit

echo.
echo 📋 الخطوة 4: رفع التغييرات إلى GitHub...
git push origin main
if errorlevel 1 (
    echo ❌ فشل في رفع التغييرات إلى GitHub
    echo 💡 تأكد من:
    echo    - إنشاء Repository على GitHub: https://github.com/new
    echo    - Repository name: top.markting
    echo    - ربط Remote origin
    echo    - صلاحيات الوصول
    pause
    exit /b 1
)
echo ✅ تم رفع التغييرات إلى GitHub بنجاح!

echo.
echo 🎉 تم النشر بنجاح!
echo 🌟 المشروع محسن للعمل مع Vercel التلقائي
echo 🔗 GitHub: https://github.com/asd5000/top.markting
echo 🚀 Vercel: https://vercel.com/new (اختر Repository: asd5000/top.markting)
echo 📊 Environment Variables المطلوبة:
echo    NEXT_PUBLIC_SUPABASE_URL=https://xmufnqzvxuowmvugmcpr.supabase.co
echo    NEXT_PUBLIC_SUPABASE_ANON_KEY=I9JU23NF394R6HH
echo.
pause
