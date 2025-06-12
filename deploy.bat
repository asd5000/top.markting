@echo off
echo 🚀 بدء عملية النشر التلقائي لموقع Top Marketing...
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
git add .
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
    echo    - إنشاء Repository على GitHub
    echo    - ربط Remote origin
    echo    - صلاحيات الوصول
    pause
    exit /b 1
)
echo ✅ تم رفع التغييرات إلى GitHub بنجاح!

echo.
echo 🎉 تم النشر بنجاح!
echo 🔗 تحقق من موقعك على Vercel
echo 📱 GitHub: https://github.com/asd5000/top.markting
echo.
pause
