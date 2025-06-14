const { app, BrowserWindow, Menu, dialog, shell, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

// إعداد المتغيرات العامة
let mainWindow;
let server;
const PORT = 3001;
const isDev = process.argv.includes('--dev');

// مسارات الملفات
const dbPath = path.join(__dirname, 'db', 'realestate.sqlite');
const mediaPath = path.join(__dirname, 'media');
const appPath = path.join(__dirname, 'app');

// إنشاء مجلدات إذا لم تكن موجودة
function ensureDirectories() {
  const dirs = [
    path.dirname(dbPath),
    mediaPath,
    path.join(mediaPath, 'receipts'),
    path.join(mediaPath, 'portfolio'),
    path.join(mediaPath, 'properties')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// إنشاء قاعدة البيانات
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('خطأ في إنشاء قاعدة البيانات:', err);
        reject(err);
        return;
      }
      
      console.log('تم الاتصال بقاعدة البيانات SQLite');
      
      // قراءة وتنفيذ schema.sql
      const schemaPath = path.join(__dirname, 'db', 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // تحويل PostgreSQL إلى SQLite
        const sqliteSchema = convertPostgresToSQLite(schema);
        
        db.exec(sqliteSchema, (err) => {
          if (err) {
            console.error('خطأ في تنفيذ Schema:', err);
            reject(err);
          } else {
            console.log('تم إنشاء جداول قاعدة البيانات بنجاح');
            
            // تنفيذ البيانات الأولية
            const seedPath = path.join(__dirname, 'db', 'seed.sql');
            if (fs.existsSync(seedPath)) {
              const seedData = fs.readFileSync(seedPath, 'utf8');
              const sqliteSeed = convertPostgresToSQLite(seedData);
              
              db.exec(sqliteSeed, (err) => {
                if (err) {
                  console.log('تحذير: خطأ في البيانات الأولية:', err);
                }
                db.close();
                resolve();
              });
            } else {
              db.close();
              resolve();
            }
          }
        });
      } else {
        console.log('لم يتم العثور على ملف schema.sql');
        db.close();
        resolve();
      }
    });
  });
}

// تحويل PostgreSQL إلى SQLite
function convertPostgresToSQLite(sql) {
  return sql
    // تحويل أنواع البيانات
    .replace(/UUID/g, 'TEXT')
    .replace(/TIMESTAMPTZ/g, 'DATETIME')
    .replace(/JSONB/g, 'TEXT')
    .replace(/TEXT\[\]/g, 'TEXT')
    .replace(/NUMERIC/g, 'REAL')
    .replace(/VARCHAR/g, 'TEXT')
    .replace(/BOOLEAN/g, 'INTEGER')
    
    // تحويل الدوال
    .replace(/gen_random_uuid\(\)/g, "lower(hex(randomblob(16)))")
    .replace(/now\(\)/g, "datetime('now')")
    
    // إزالة الإضافات غير المدعومة
    .replace(/CREATE EXTENSION[^;]+;/g, '')
    .replace(/CREATE OR REPLACE FUNCTION[^$]+\$\$[^$]+\$\$[^;]+;/g, '')
    .replace(/CREATE TRIGGER[^;]+;/g, '')
    
    // تحويل القيود
    .replace(/CHECK \([^)]+\)/g, '')
    .replace(/REFERENCES [^(]+\([^)]+\)( ON DELETE CASCADE)?/g, '')
    
    // إزالة الفهارس المعقدة
    .replace(/CREATE INDEX[^;]+;/g, '');
}

// إنشاء خادم Express محلي
function createLocalServer() {
  const expressApp = express();
  
  expressApp.use(cors());
  expressApp.use(express.json());
  expressApp.use(express.static(appPath));
  expressApp.use('/media', express.static(mediaPath));
  
  // API endpoints
  expressApp.use('/api', require('./api/routes'));
  
  // تقديم تطبيق Next.js المبني
  expressApp.get('*', (req, res) => {
    res.sendFile(path.join(appPath, 'index.html'));
  });
  
  server = expressApp.listen(PORT, () => {
    console.log(`الخادم المحلي يعمل على المنفذ ${PORT}`);
  });
}

// إنشاء نافذة التطبيق
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false
    },
    titleBarStyle: 'default',
    show: false
  });

  // تحميل التطبيق
  mainWindow.loadURL(`http://localhost:${PORT}`);
  
  // إظهار النافذة عند الانتهاء من التحميل
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // إنشاء القائمة
  createMenu();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// إنشاء قائمة التطبيق
function createMenu() {
  const template = [
    {
      label: 'ملف',
      submenu: [
        {
          label: 'نسخة احتياطية من قاعدة البيانات',
          click: () => exportDatabase()
        },
        {
          label: 'استيراد قاعدة بيانات',
          click: () => importDatabase()
        },
        { type: 'separator' },
        {
          label: 'إعدادات',
          click: () => openSettings()
        },
        { type: 'separator' },
        {
          label: 'خروج',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'عرض',
      submenu: [
        {
          label: 'إعادة تحميل',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow.reload()
        },
        {
          label: 'ملء الشاشة',
          accelerator: 'F11',
          click: () => {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          }
        },
        { type: 'separator' },
        {
          label: 'تكبير',
          accelerator: 'CmdOrCtrl+Plus',
          click: () => {
            const currentZoom = mainWindow.webContents.getZoomLevel();
            mainWindow.webContents.setZoomLevel(currentZoom + 0.5);
          }
        },
        {
          label: 'تصغير',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            const currentZoom = mainWindow.webContents.getZoomLevel();
            mainWindow.webContents.setZoomLevel(currentZoom - 0.5);
          }
        }
      ]
    },
    {
      label: 'مساعدة',
      submenu: [
        {
          label: 'حول البرنامج',
          click: () => showAbout()
        },
        {
          label: 'دليل الاستخدام',
          click: () => openUserGuide()
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// وظائف القائمة
function exportDatabase() {
  dialog.showSaveDialog(mainWindow, {
    title: 'حفظ نسخة احتياطية',
    defaultPath: `top-marketing-backup-${new Date().toISOString().split('T')[0]}.db`,
    filters: [
      { name: 'قاعدة بيانات SQLite', extensions: ['db', 'sqlite'] },
      { name: 'جميع الملفات', extensions: ['*'] }
    ]
  }).then(result => {
    if (!result.canceled) {
      fs.copyFileSync(dbPath, result.filePath);
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'نجح الحفظ',
        message: 'تم حفظ النسخة الاحتياطية بنجاح'
      });
    }
  });
}

function importDatabase() {
  dialog.showOpenDialog(mainWindow, {
    title: 'استيراد قاعدة بيانات',
    filters: [
      { name: 'قاعدة بيانات SQLite', extensions: ['db', 'sqlite'] },
      { name: 'جميع الملفات', extensions: ['*'] }
    ]
  }).then(result => {
    if (!result.canceled && result.filePaths.length > 0) {
      dialog.showMessageBox(mainWindow, {
        type: 'warning',
        title: 'تأكيد الاستيراد',
        message: 'سيتم استبدال قاعدة البيانات الحالية. هل أنت متأكد؟',
        buttons: ['نعم', 'إلغاء']
      }).then(response => {
        if (response.response === 0) {
          fs.copyFileSync(result.filePaths[0], dbPath);
          dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'نجح الاستيراد',
            message: 'تم استيراد قاعدة البيانات بنجاح. سيتم إعادة تشغيل التطبيق.'
          }).then(() => {
            app.relaunch();
            app.exit();
          });
        }
      });
    }
  });
}

function openSettings() {
  // فتح صفحة الإعدادات في التطبيق
  mainWindow.webContents.executeJavaScript(`
    window.location.href = '/admin/settings';
  `);
}

function showAbout() {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'حول البرنامج',
    message: 'Top Marketing Desktop',
    detail: `الإصدار: 1.0.0
نظام إدارة التسويق المتكامل
تطوير: فريق Top Marketing

البرنامج يعمل محلياً بدون الحاجة للإنترنت
قاعدة البيانات: SQLite محلية`
  });
}

function openUserGuide() {
  const guidePath = path.join(__dirname, 'README-Windows.txt');
  shell.openPath(guidePath);
}

// أحداث التطبيق
app.whenReady().then(async () => {
  try {
    ensureDirectories();
    await initializeDatabase();
    createLocalServer();
    createWindow();
  } catch (error) {
    console.error('خطأ في بدء التطبيق:', error);
    dialog.showErrorBox('خطأ في بدء التطبيق', error.message);
  }
});

app.on('window-all-closed', () => {
  if (server) {
    server.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// التعامل مع الأخطاء
process.on('uncaughtException', (error) => {
  console.error('خطأ غير متوقع:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('رفض غير معالج:', reason);
});
