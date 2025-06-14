#!/usr/bin/env node

/**
 * سكريبت إصلاح ونشر التحديثات
 * يقوم بدفع التحديثات وإعادة النشر على Vercel
 */

const { execSync } = require('child_process');

console.log('🚀 بدء عملية إصلاح ونشر التحديثات...\n');

try {
  // 1. التحقق من حالة Git
  console.log('1️⃣ فحص حالة Git...');
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      console.log('   📝 توجد تغييرات غير محفوظة');
    } else {
      console.log('   ✅ لا توجد تغييرات غير محفوظة');
    }
  } catch (error) {
    console.log('   ⚠️ خطأ في فحص Git:', error.message);
  }

  // 2. إضافة جميع التغييرات
  console.log('\n2️⃣ إضافة التغييرات...');
  try {
    execSync('git add .', { stdio: 'inherit' });
    console.log('   ✅ تم إضافة جميع التغييرات');
  } catch (error) {
    console.log('   ❌ خطأ في إضافة التغييرات:', error.message);
  }

  // 3. إنشاء commit
  console.log('\n3️⃣ إنشاء commit...');
  try {
    const commitMessage = `fix: إزالة زر لوحة التحكم من الزوار وإصلاح تسجيل الدخول - ${new Date().toISOString()}`;
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    console.log('   ✅ تم إنشاء commit بنجاح');
  } catch (error) {
    console.log('   ⚠️ لا توجد تغييرات للـ commit أو خطأ:', error.message);
  }

  // 4. دفع التحديثات
  console.log('\n4️⃣ دفع التحديثات إلى GitHub...');
  try {
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('   ✅ تم دفع التحديثات بنجاح');
  } catch (error) {
    console.log('   ❌ خطأ في دفع التحديثات:', error.message);
    console.log('   💡 جرب: git push origin master');
  }

  // 5. معلومات النشر
  console.log('\n5️⃣ معلومات النشر:');
  console.log('   🌐 الموقع: https://top-markting.vercel.app/');
  console.log('   📊 Vercel Dashboard: https://vercel.com/asd5000/top-markting');
  console.log('   📱 GitHub Repo: https://github.com/asd5000/top.markting');

  // 6. تعليمات إضافية
  console.log('\n6️⃣ خطوات إضافية:');
  console.log('   1. انتظر 2-3 دقائق لإعادة النشر التلقائي');
  console.log('   2. امسح cache المتصفح (Ctrl+Shift+R)');
  console.log('   3. تحقق من الموقع: https://top-markting.vercel.app/');
  console.log('   4. إذا استمرت المشكلة، تحقق من Vercel Dashboard');

  console.log('\n🎉 تم الانتهاء من عملية النشر!');

} catch (error) {
  console.error('\n❌ خطأ في عملية النشر:', error.message);
  console.log('\n🔧 حلول مقترحة:');
  console.log('   1. تحقق من اتصال الإنترنت');
  console.log('   2. تحقق من صلاحيات Git');
  console.log('   3. تحقق من إعدادات GitHub');
  console.log('   4. جرب تشغيل الأوامر يدوياً:');
  console.log('      git add .');
  console.log('      git commit -m "fix: update"');
  console.log('      git push origin main');
}
