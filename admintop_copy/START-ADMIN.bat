@echo off
title Top Marketing Admin - Quick Start
color 0B

echo.
echo ========================================
echo    Top Marketing Admin Panel
echo    نظام إدارة التسويق المتكامل
echo ========================================
echo.
echo المسار: C:\Users\Masrawy\Desktop\admin\
echo تاريخ الإنشاء: 2025-06-14
echo.
echo ========================================
echo    بدء تشغيل المشروع
echo ========================================
echo.

echo [1/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Checking environment file...
if not exist .env.local (
    echo Creating .env.local from example...
    copy .env.example .env.local
    echo.
    echo ⚠️  WARNING: Please edit .env.local with your Supabase credentials!
    echo.
    echo Required variables:
    echo - NEXT_PUBLIC_SUPABASE_URL
    echo - NEXT_PUBLIC_SUPABASE_ANON_KEY
    echo.
    pause
)

echo [3/4] Type checking...
call npm run type-check
if %errorlevel% neq 0 (
    echo Warning: Type check failed, but continuing...
)

echo.
echo [4/4] Starting development server...
echo.
echo ========================================
echo    🚀 Server starting...
echo    📍 URL: http://localhost:3000
echo    📁 Admin Panel: http://localhost:3000/admin
echo    📊 Location: Desktop\admin\
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

echo.
echo ========================================
echo    Server stopped
echo ========================================
pause
