@echo off
echo ========================================
echo    Top Marketing Desktop - Development
echo ========================================
echo.

echo [1/3] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/3] Checking database...
if not exist "db\realestate.sqlite" (
    echo Creating database from schema...
    node -e "
    const sqlite3 = require('sqlite3').verbose();
    const fs = require('fs');
    const path = require('path');
    
    const dbPath = path.join(__dirname, 'db', 'realestate.sqlite');
    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    
    if (!fs.existsSync(path.dirname(dbPath))) {
        fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    }
    
    const db = new sqlite3.Database(dbPath);
    
    if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        db.exec(schema, (err) => {
            if (err) console.error('Schema error:', err);
            else console.log('Database created successfully');
            db.close();
        });
    } else {
        console.log('Schema file not found');
        db.close();
    }
    "
)

echo.
echo [3/3] Starting development server...
echo.
echo ========================================
echo    Development server starting...
echo    Press Ctrl+C to stop
echo ========================================
echo.

call npm run dev
