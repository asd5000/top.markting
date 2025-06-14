@echo off
chcp 65001 >nul
title نظام إدارة التسويق المتكامل - الموقع الأساسي
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    نظام إدارة التسويق المتكامل                    ║
echo ║                  Top Marketing Management System             ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📍 الموقع: C:\Users\Masrawy\Desktop\موقع اساسي\
echo 📅 تاريخ الإنشاء: 2025-06-14
echo 🔧 الإصدار: v1.0.0
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                        بدء تشغيل المشروع                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [1/5] 🔍 فحص Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ خطأ: Node.js غير مثبت!
    echo 📥 يرجى تحميل Node.js من: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js مثبت بنجاح
)

echo.
echo [2/5] 📦 تثبيت المكتبات...
call npm install
if %errorlevel% neq 0 (
    echo ❌ خطأ: فشل في تثبيت المكتبات
    echo 🔧 جرب: npm cache clean --force
    pause
    exit /b 1
) else (
    echo ✅ تم تثبيت المكتبات بنجاح
)

echo.
echo [3/5] ⚙️ فحص ملف البيئة...
if not exist .env.local (
    echo 📝 إنشاء ملف .env.local من المثال...
    copy .env.example .env.local >nul
    echo.
    echo ⚠️  تحذير مهم: يجب تحديث ملف .env.local!
    echo.
    echo 📋 المطلوب إضافته:
    echo    NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
    echo    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
    echo.
    echo 🔗 للحصول على المفاتيح:
    echo    1. اذهب إلى https://supabase.com/
    echo    2. أنشئ مشروع جديد
    echo    3. اذهب إلى Settings → API
    echo    4. انسخ URL والمفتاح العام
    echo.
    echo 📄 لتطبيق قاعدة البيانات:
    echo    1. اذهب إلى SQL Editor في Supabase
    echo    2. انسخ محتوى database/schema.sql
    echo    3. الصق واضغط Run
    echo.
    pause
) else (
    echo ✅ ملف .env.local موجود
)

echo.
echo [4/5] 🔍 فحص TypeScript...
call npm run type-check >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  تحذير: توجد أخطاء في TypeScript، لكن سنتابع...
) else (
    echo ✅ فحص TypeScript مكتمل
)

echo.
echo [5/5] 🚀 بدء تشغيل الخادم...
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                      🌐 الخادم يعمل الآن                       ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║  📍 الرابط المحلي: http://localhost:3000                      ║
echo ║  🔧 لوحة الإدارة: http://localhost:3000/admin                ║
echo ║  📊 الخدمات: http://localhost:3000/services                  ║
echo ║  📦 الباقات: http://localhost:3000/packages                  ║
echo ║  🏠 العقارات: http://localhost:3000/real-estate              ║
echo ║  🎨 المعرض: http://localhost:3000/portfolio                   ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║  💡 نصائح:                                                   ║
echo ║     • اضغط Ctrl+C لإيقاف الخادم                             ║
echo ║     • اضغط Ctrl+Shift+R لإعادة تحميل الصفحة                 ║
echo ║     • اضغط F12 لفتح أدوات المطور                            ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🔄 بدء الخادم...
call npm run dev

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                        تم إيقاف الخادم                         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📞 للدعم الفني:
echo    📧 البريد: asdasheref@gmail.com
echo    📱 واتساب: +201068275557
echo.
echo 📚 الوثائق:
echo    📖 دليل-المشروع-الكامل.md
echo    🔤 ترجمة-المجلدات-والملفات.md
echo    ✅ VERIFICATION.md
echo.
pause
