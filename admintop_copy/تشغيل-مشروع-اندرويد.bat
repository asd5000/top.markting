@echo off
chcp 65001 >nul
title مشروع تطبيق Android - Top Marketing
color 0C

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    مشروع تطبيق Android                       ║
echo ║                  Top Marketing Mobile App                    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📍 الموقع: C:\Users\Masrawy\Desktop\اندرويد\
echo 📅 تاريخ الإنشاء: 2025-06-14
echo 🔧 الهدف: تحويل الموقع إلى تطبيق Android APK
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                        خيارات المشروع                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo [1] 🚀 إنشاء مشروع Android Studio جديد
echo [2] 📱 إنشاء مشروع Flutter جديد
echo [3] 🔧 فتح Android Studio
echo [4] 📖 فتح الدليل الشامل
echo [5] 🌐 فتح روابط مفيدة
echo [6] ❌ خروج
echo.
set /p choice="اختر رقم الخيار: "

if "%choice%"=="1" goto android_studio
if "%choice%"=="2" goto flutter_project
if "%choice%"=="3" goto open_android_studio
if "%choice%"=="4" goto open_guide
if "%choice%"=="5" goto open_links
if "%choice%"=="6" goto exit
goto invalid_choice

:android_studio
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   إنشاء مشروع Android Studio                 ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📋 خطوات إنشاء المشروع:
echo.
echo 1️⃣ تأكد من تثبيت Android Studio
echo    📥 التحميل: https://developer.android.com/studio
echo.
echo 2️⃣ افتح Android Studio
echo 3️⃣ اختر "Create New Project"
echo 4️⃣ اختر "Empty Activity"
echo 5️⃣ املأ البيانات:
echo    📝 Name: Top Marketing
echo    📦 Package: com.topmarketing.app
echo    📁 Location: C:\Users\Masrawy\Desktop\اندرويد\TopMarketingApp
echo    💻 Language: Java
echo    📱 Min SDK: API 26 (Android 8.0)
echo.
echo 6️⃣ اضغط "Finish" وانتظر إنشاء المشروع
echo.
echo 📖 للتفاصيل الكاملة، راجع الدليل الشامل
echo.
pause
goto menu

:flutter_project
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                     إنشاء مشروع Flutter                      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📋 خطوات إنشاء مشروع Flutter:
echo.
echo 1️⃣ تأكد من تثبيت Flutter SDK
echo    📥 التحميل: https://flutter.dev/docs/get-started/install
echo.
echo 2️⃣ افتح Command Prompt في مجلد اندرويد
echo 3️⃣ نفذ الأوامر التالية:
echo.
echo    cd "C:\Users\Masrawy\Desktop\اندرويد"
echo    flutter create top_marketing_app
echo    cd top_marketing_app
echo    flutter pub get
echo.
echo 4️⃣ افتح المشروع في VS Code أو Android Studio
echo 5️⃣ عدّل ملف lib/main.dart حسب الدليل
echo 6️⃣ أضف المكتبات المطلوبة في pubspec.yaml
echo.
echo 📖 للكود الكامل، راجع الدليل الشامل
echo.
pause
goto menu

:open_android_studio
echo.
echo 🔧 محاولة فتح Android Studio...
echo.
start "" "C:\Program Files\Android\Android Studio\bin\studio64.exe" 2>nul
if %errorlevel% neq 0 (
    echo ❌ لم يتم العثور على Android Studio
    echo 📥 يرجى تحميله من: https://developer.android.com/studio
) else (
    echo ✅ تم فتح Android Studio بنجاح
)
echo.
pause
goto menu

:open_guide
echo.
echo 📖 فتح الدليل الشامل...
echo.
start "" "دليل-تطبيق-اندرويد-شامل.md"
echo ✅ تم فتح الدليل الشامل
echo.
pause
goto menu

:open_links
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                        روابط مفيدة                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🔗 فتح الروابط المفيدة...
echo.
echo [1] Android Studio
start "" "https://developer.android.com/studio"
echo.
echo [2] Flutter SDK
start "" "https://flutter.dev/docs/get-started/install"
echo.
echo [3] Firebase Console
start "" "https://firebase.google.com/"
echo.
echo [4] Google Play Console
start "" "https://play.google.com/console"
echo.
echo [5] Android Asset Studio
start "" "https://romannurik.github.io/AndroidAssetStudio/"
echo.
echo [6] الموقع الأصلي
start "" "https://top-markting.vercel.app/"
echo.
echo ✅ تم فتح جميع الروابط في المتصفح
echo.
pause
goto menu

:invalid_choice
echo.
echo ❌ خيار غير صحيح! يرجى اختيار رقم من 1 إلى 6
echo.
pause
goto menu

:menu
cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    مشروع تطبيق Android                       ║
echo ║                  Top Marketing Mobile App                    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📍 الموقع: C:\Users\Masrawy\Desktop\اندرويد\
echo 📅 تاريخ الإنشاء: 2025-06-14
echo 🔧 الهدف: تحويل الموقع إلى تطبيق Android APK
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                        خيارات المشروع                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo [1] 🚀 إنشاء مشروع Android Studio جديد
echo [2] 📱 إنشاء مشروع Flutter جديد
echo [3] 🔧 فتح Android Studio
echo [4] 📖 فتح الدليل الشامل
echo [5] 🌐 فتح روابط مفيدة
echo [6] ❌ خروج
echo.
set /p choice="اختر رقم الخيار: "

if "%choice%"=="1" goto android_studio
if "%choice%"=="2" goto flutter_project
if "%choice%"=="3" goto open_android_studio
if "%choice%"=="4" goto open_guide
if "%choice%"=="5" goto open_links
if "%choice%"=="6" goto exit
goto invalid_choice

:exit
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                         شكراً لك!                           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📞 للدعم الفني:
echo    📧 البريد: asdasheref@gmail.com
echo    📱 واتساب: +201068275557
echo.
echo 📚 الملفات المتاحة:
echo    📖 دليل-تطبيق-اندرويد-شامل.md
echo    🚀 تشغيل-مشروع-اندرويد.bat
echo.
echo 🎯 الهدف: تحويل موقع Top Marketing إلى تطبيق Android
echo 🌟 المميزات: WebView + إشعارات + متوافق مع Google Play
echo.
pause
exit
