#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 فحص النظام لمشروع Top Marketing...\n');

// فحص Node.js
try {
  const nodeVersion = process.version;
  console.log(`✅ Node.js: ${nodeVersion}`);
  
  if (parseInt(nodeVersion.slice(1)) < 18) {
    console.log('⚠️  تحذير: يُنصح بـ Node.js 18 أو أحدث');
  }
} catch (error) {
  console.log('❌ Node.js غير مثبت');
  process.exit(1);
}

// فحص الملفات المطلوبة
const requiredFiles = [
  'package.json',
  'next.config.js',
  'tailwind.config.ts',
  'tsconfig.json',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/globals.css'
];

console.log('\n📁 فحص الملفات المطلوبة:');
let missingFiles = [];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - مفقود`);
    missingFiles.push(file);
  }
});

// فحص المجلدات المطلوبة
const requiredDirs = [
  'src/app',
  'src/components'
];

console.log('\n📂 فحص المجلدات المطلوبة:');
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}`);
  } else {
    console.log(`❌ ${dir} - مفقود`);
  }
});

// فحص الصفحات
const pages = [
  'src/app/page.tsx',
  'src/app/about/page.tsx',
  'src/app/services/page.tsx',
  'src/app/portfolio/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/design/page.tsx',
  'src/app/marketing/page.tsx',
  'src/app/web-development/page.tsx',
  'src/app/data-extraction/page.tsx',
  'src/app/followers/page.tsx',
  'src/app/real-estate/page.tsx'
];

console.log('\n📄 فحص الصفحات (11 صفحة):');
let pageCount = 0;
pages.forEach(page => {
  if (fs.existsSync(page)) {
    const pageName = page === 'src/app/page.tsx' ? 'الرئيسية' : path.basename(path.dirname(page));
    console.log(`✅ ${pageName}`);
    pageCount++;
  } else {
    const pageName = page === 'src/app/page.tsx' ? 'الرئيسية' : path.basename(path.dirname(page));
    console.log(`❌ ${pageName} - مفقود`);
  }
});

// فحص المكونات
const components = [
  'src/components/Navbar.tsx',
  'src/components/Footer.tsx',
  'src/components/Loading.tsx'
];

console.log('\n🧩 فحص المكونات:');
let componentCount = 0;
components.forEach(component => {
  if (fs.existsSync(component)) {
    console.log(`✅ ${path.basename(component, '.tsx')}`);
    componentCount++;
  } else {
    console.log(`❌ ${path.basename(component, '.tsx')} - مفقود`);
  }
});

// فحص ملفات SEO
const seoFiles = [
  'public/robots.txt',
  'public/sitemap.xml',
  'public/manifest.json'
];

console.log('\n🔍 فحص ملفات SEO:');
let seoCount = 0;
seoFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${path.basename(file)}`);
    seoCount++;
  } else {
    console.log(`❌ ${path.basename(file)} - مفقود`);
  }
});

// فحص ملفات البيئة
console.log('\n🔧 فحص ملفات البيئة:');
if (fs.existsSync('.env.local')) {
  console.log('✅ .env.local موجود');
} else {
  console.log('⚠️  .env.local غير موجود');
}

// فحص node_modules
console.log('\n📦 فحص التبعيات:');
if (fs.existsSync('node_modules')) {
  console.log('✅ node_modules موجود');
} else {
  console.log('❌ node_modules غير موجود - يجب تشغيل npm install');
}

// النتيجة النهائية
console.log('\n' + '='.repeat(50));
console.log('📊 ملخص الفحص:');
console.log(`📄 الصفحات: ${pageCount}/${pages.length}`);
console.log(`🧩 المكونات: ${componentCount}/${components.length}`);
console.log(`🔍 ملفات SEO: ${seoCount}/${seoFiles.length}`);
console.log(`📁 الملفات المفقودة: ${missingFiles.length}`);

const totalExpected = pages.length + components.length + seoFiles.length;
const totalFound = pageCount + componentCount + seoCount;
const completionPercentage = Math.round((totalFound / totalExpected) * 100);

console.log(`📈 نسبة الاكتمال: ${completionPercentage}%`);

if (missingFiles.length === 0 && pageCount === pages.length && componentCount === components.length && seoCount === seoFiles.length) {
  console.log('\n🎉 المشروع مكتمل 100% وجاهز للتشغيل!');
  console.log('\n🌟 المميزات المتاحة:');
  console.log('   ✅ 11 صفحة متكاملة');
  console.log('   ✅ 3 مكونات أساسية');
  console.log('   ✅ تحسين SEO كامل');
  console.log('   ✅ واجهة عربية RTL');
  console.log('   ✅ تصميم متجاوب');
  console.log('\n🚀 لتشغيل المشروع:');
  console.log('   npm install  (إذا لم تكن التبعيات مثبتة)');
  console.log('   npm run dev');
  console.log('\n🌐 ثم افتح: http://localhost:3000');
} else {
  console.log('\n⚠️  المشروع يحتاج لبعض الإصلاحات');
  if (missingFiles.length > 0) {
    console.log('📁 ملفات مفقودة:', missingFiles.join(', '));
  }
}

console.log('\n📚 للمساعدة، راجع:');
console.log('   - README.md');
console.log('   - TROUBLESHOOTING.md (إذا كان متاحاً)');
