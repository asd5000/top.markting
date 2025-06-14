const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const dbPath = path.join(__dirname, '..', 'db', 'realestate.sqlite');
const mediaPath = path.join(__dirname, '..', 'media');

// إعداد رفع الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(mediaPath, req.body.bucket || 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('نوع الملف غير مدعوم'));
    }
  }
});

// وظائف مساعدة لقاعدة البيانات
function getDB() {
  return new sqlite3.Database(dbPath);
}

function runQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    db.run(query, params, function(err) {
      db.close();
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function getQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    db.get(query, params, (err, row) => {
      db.close();
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function allQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    db.all(query, params, (err, rows) => {
      db.close();
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Middleware للمصادقة
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'رمز الوصول مطلوب' });
  }

  jwt.verify(token, 'desktop-secret-key', (err, user) => {
    if (err) return res.status(403).json({ error: 'رمز وصول غير صالح' });
    req.user = user;
    next();
  });
}

// === مسارات المصادقة ===

// تسجيل دخول المدير
router.post('/auth/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admin = await getQuery(
      'SELECT * FROM admins WHERE username = ? OR email = ?',
      [username, username]
    );
    
    if (!admin) {
      return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }
    
    const validPassword = await bcrypt.compare(password, admin.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }
    
    // تحديث آخر تسجيل دخول
    await runQuery(
      'UPDATE admins SET last_login = datetime("now") WHERE id = ?',
      [admin.id]
    );
    
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      'desktop-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: JSON.parse(admin.permissions || '{}')
      }
    });
  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// === مسارات الخدمات ===

// جلب جميع الخدمات
router.get('/services', async (req, res) => {
  try {
    const services = await allQuery(
      'SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order, name'
    );
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// إضافة خدمة جديدة
router.post('/services', authenticateToken, async (req, res) => {
  try {
    const { name, name_en, description, icon, custom_color, category } = req.body;
    
    const result = await runQuery(
      `INSERT INTO services (id, name, name_en, description, icon, custom_color, category, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [uuidv4(), name, name_en, description, icon, custom_color, category]
    );
    
    res.json({ id: result.id, message: 'تم إضافة الخدمة بنجاح' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === مسارات الخدمات الفرعية ===

// جلب الخدمات الفرعية
router.get('/sub-services', async (req, res) => {
  try {
    const { service_id } = req.query;
    let query = `
      SELECT ss.*, s.name as service_name 
      FROM sub_services ss 
      LEFT JOIN services s ON ss.service_id = s.id 
      WHERE ss.is_active = 1
    `;
    const params = [];
    
    if (service_id) {
      query += ' AND ss.service_id = ?';
      params.push(service_id);
    }
    
    query += ' ORDER BY ss.sort_order, ss.name';
    
    const subServices = await allQuery(query, params);
    res.json(subServices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === مسارات العقارات ===

// جلب جميع العقارات
router.get('/real-estate', authenticateToken, async (req, res) => {
  try {
    const { status, operation_type, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM real_estate WHERE 1=1';
    const params = [];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    if (operation_type) {
      query += ' AND operation_type = ?';
      params.push(operation_type);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const properties = await allQuery(query, params);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// إضافة عقار جديد
router.post('/real-estate', async (req, res) => {
  try {
    const propertyData = req.body;
    const id = uuidv4();
    
    const result = await runQuery(
      `INSERT INTO real_estate (
        id, customer_name, customer_email, customer_phone, customer_whatsapp,
        property_type, operation_type, title, description, governorate, city,
        district, area, rooms, bathrooms, price, price_negotiable,
        images, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'), datetime('now'))`,
      [
        id, propertyData.customer_name, propertyData.customer_email,
        propertyData.customer_phone, propertyData.customer_whatsapp,
        propertyData.property_type, propertyData.operation_type,
        propertyData.title, propertyData.description,
        propertyData.governorate, propertyData.city, propertyData.district,
        propertyData.area, propertyData.rooms, propertyData.bathrooms,
        propertyData.price, propertyData.price_negotiable ? 1 : 0,
        JSON.stringify(propertyData.images || [])
      ]
    );
    
    res.json({ id, message: 'تم إضافة العقار بنجاح' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === مسارات الباقات ===

// جلب جميع الباقات
router.get('/packages', async (req, res) => {
  try {
    const packages = await allQuery(
      'SELECT * FROM packages WHERE is_active = 1 ORDER BY sort_order, name'
    );
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === مسارات الطلبات ===

// جلب جميع الطلبات
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const orders = await allQuery(query, params);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === مسارات رفع الملفات ===

// رفع ملف
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'لم يتم اختيار ملف' });
    }
    
    const fileUrl = `/media/${req.body.bucket || 'uploads'}/${req.file.filename}`;
    
    res.json({
      url: fileUrl,
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === مسارات الإحصائيات ===

// إحصائيات عامة
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const stats = {};
    
    // عدد العقارات
    const propertiesCount = await getQuery('SELECT COUNT(*) as count FROM real_estate');
    stats.properties = propertiesCount.count;
    
    // عدد الطلبات
    const ordersCount = await getQuery('SELECT COUNT(*) as count FROM orders');
    stats.orders = ordersCount.count;
    
    // عدد الخدمات
    const servicesCount = await getQuery('SELECT COUNT(*) as count FROM services WHERE is_active = 1');
    stats.services = servicesCount.count;
    
    // عدد الباقات
    const packagesCount = await getQuery('SELECT COUNT(*) as count FROM packages WHERE is_active = 1');
    stats.packages = packagesCount.count;
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === مسارات النظام ===

// معلومات النظام
router.get('/system/info', (req, res) => {
  res.json({
    version: '1.0.0',
    database: 'SQLite',
    platform: process.platform,
    node_version: process.version,
    uptime: process.uptime()
  });
});

// نسخة احتياطية من قاعدة البيانات
router.get('/system/backup', authenticateToken, (req, res) => {
  try {
    const backupPath = path.join(__dirname, '..', 'db', `backup-${Date.now()}.sqlite`);
    fs.copyFileSync(dbPath, backupPath);
    
    res.download(backupPath, `top-marketing-backup-${new Date().toISOString().split('T')[0]}.sqlite`, (err) => {
      if (!err) {
        // حذف الملف المؤقت بعد التحميل
        fs.unlinkSync(backupPath);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
