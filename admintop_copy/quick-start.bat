@echo off
echo ========================================
echo    Top Marketing - Quick Start
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
    echo WARNING: Please edit .env.local with your Supabase credentials!
    echo.
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
echo    Server will start on:
echo    http://localhost:3000
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause
