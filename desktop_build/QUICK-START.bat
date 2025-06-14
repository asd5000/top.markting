@echo off
title Top Marketing Desktop - Quick Start
color 0A

echo.
echo ========================================
echo    Top Marketing Desktop Application
echo    نظام إدارة التسويق المتكامل
echo ========================================
echo.
echo اختر العملية المطلوبة:
echo.
echo [1] تشغيل التطبيق (Development)
echo [2] بناء ملف التثبيت (Build Setup)
echo [3] تثبيت المكتبات فقط (Install Dependencies)
echo [4] إنشاء قاعدة البيانات (Create Database)
echo [5] عرض معلومات المشروع (Project Info)
echo [0] خروج (Exit)
echo.
set /p choice="اختر رقم العملية (1-5): "

if "%choice%"=="1" goto run_dev
if "%choice%"=="2" goto build_app
if "%choice%"=="3" goto install_deps
if "%choice%"=="4" goto create_db
if "%choice%"=="5" goto show_info
if "%choice%"=="0" goto exit
goto invalid

:run_dev
echo.
echo ========================================
echo    تشغيل التطبيق في وضع التطوير
echo ========================================
echo.
call dev.bat
goto end

:build_app
echo.
echo ========================================
echo    بناء ملف التثبيت
echo ========================================
echo.
call build.bat
goto end

:install_deps
echo.
echo ========================================
echo    تثبيت المكتبات
echo ========================================
echo.
echo جاري تثبيت المكتبات...
call npm install
if %errorlevel% equ 0 (
    echo.
    echo ✅ تم تثبيت المكتبات بنجاح!
) else (
    echo.
    echo ❌ فشل في تثبيت المكتبات!
)
goto end

:create_db
echo.
echo ========================================
echo    إنشاء قاعدة البيانات
echo ========================================
echo.
if not exist "db" mkdir db
if not exist "media" mkdir media
if not exist "media\receipts" mkdir media\receipts
if not exist "media\portfolio" mkdir media\portfolio
if not exist "media\properties" mkdir media\properties

echo جاري إنشاء قاعدة البيانات...
node -e "
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db', 'realestate.sqlite');
const schemaPath = path.join(__dirname, 'db', 'schema.sql');

console.log('إنشاء قاعدة البيانات في:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('خطأ في إنشاء قاعدة البيانات:', err);
        return;
    }
    
    console.log('تم الاتصال بقاعدة البيانات SQLite');
    
    if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        db.exec(schema, (err) => {
            if (err) {
                console.error('خطأ في تنفيذ Schema:', err);
            } else {
                console.log('✅ تم إنشاء قاعدة البيانات بنجاح!');
            }
            db.close();
        });
    } else {
        console.log('❌ لم يتم العثور على ملف schema.sql');
        db.close();
    }
});
"
goto end

:show_info
echo.
echo ========================================
echo    معلومات المشروع
echo ========================================
echo.
echo اسم المشروع: Top Marketing Desktop
echo الإصدار: 1.0.0
echo النوع: تطبيق سطح مكتب (Electron)
echo قاعدة البيانات: SQLite محلية
echo.
echo الملفات الرئيسية:
echo - main.js (ملف Electron الرئيسي)
echo - app/ (ملفات التطبيق)
echo - api/ (خادم محلي)
echo - db/ (قاعدة البيانات)
echo.
echo للمزيد من المعلومات راجع:
echo - README-Windows.txt
echo - PROJECT-INFO.md
echo - VERIFICATION.md
echo.
goto end

:invalid
echo.
echo ❌ اختيار غير صحيح! يرجى اختيار رقم من 1 إلى 5
echo.
pause
goto start

:exit
echo.
echo شكراً لاستخدام Top Marketing Desktop!
echo.
exit /b 0

:end
echo.
echo ========================================
echo    انتهت العملية
echo ========================================
echo.
pause

:start
cls
goto :eof
