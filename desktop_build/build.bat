@echo off
echo ========================================
echo    Top Marketing Desktop Builder
echo ========================================
echo.

echo [1/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/5] Installing Electron dependencies...
call npm install electron-builder --save-dev
if %errorlevel% neq 0 (
    echo Error: Failed to install electron-builder
    pause
    exit /b 1
)

echo.
echo [3/5] Preparing application files...
if not exist "app\public" mkdir app\public
if not exist "assets\icon.ico" (
    echo Warning: No icon file found. Using default.
)

echo.
echo [4/5] Building application...
call npm run build-win
if %errorlevel% neq 0 (
    echo Error: Build failed
    pause
    exit /b 1
)

echo.
echo [5/5] Build completed!
echo.
echo ========================================
echo    Build Results:
echo ========================================
echo.
echo Setup file: dist\Top-Marketing-Setup-1.0.0.exe
echo Portable app: dist\win-unpacked\
echo.
echo You can now distribute the setup file!
echo.

pause
