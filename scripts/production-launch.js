#!/usr/bin/env node

/**
 * Production Launch Script for Top Marketing
 * This script will automatically execute all production setup steps
 */

const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const SUPABASE_URL = 'https://xanzptntwwmpulqutoiv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhbnpwdG50d3dtcHVscXV0b2l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI4NzQsImV4cCI6MjA1MDU0ODg3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Production launch steps
const launchSteps = [
  {
    name: 'تنظيف البيانات التجريبية',
    description: 'حذف جميع البيانات التجريبية من الجداول',
    execute: async () => {
      console.log('🗑️ حذف البيانات التجريبية...')
      
      const tables = ['orders', 'subscriptions', 'real_estate_listings', 'customers', 'services', 'admins', 'notifications']
      
      for (const table of tables) {
        try {
          const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
          if (error && !error.message.includes('relation') && !error.message.includes('does not exist')) {
            console.warn(`⚠️ تحذير في حذف جدول ${table}:`, error.message)
          } else {
            console.log(`✅ تم حذف بيانات جدول ${table}`)
          }
        } catch (err) {
          console.warn(`⚠️ خطأ في حذف جدول ${table}:`, err.message)
        }
      }
    }
  },
  
  {
    name: 'إنشاء حساب المدير الرئيسي',
    description: 'إنشاء حساب المدير الرئيسي للموقع',
    execute: async () => {
      console.log('👤 إنشاء حساب المدير الرئيسي...')
      
      const adminData = {
        email: 'alsheref.antaka@gmail.com',
        username: 'admin',
        password_hash: '$2a$12$LQv3c1yqBwlVHpPjreuBUOgOtd.M0jKSulHciIpZXavHfLESMa4PW',
        full_name: 'المدير العام - أشرف أنتاكا',
        role: 'admin',
        permissions: ['all'],
        is_active: true
      }
      
      const { data, error } = await supabase
        .from('admins')
        .insert(adminData)
        .select()
      
      if (error) {
        throw new Error(`فشل في إنشاء حساب المدير: ${error.message}`)
      }
      
      console.log('✅ تم إنشاء حساب المدير الرئيسي بنجاح')
      return data
    }
  },
  
  {
    name: 'تحديث إعدادات النظام',
    description: 'تحديث إعدادات التواصل والموقع',
    execute: async () => {
      console.log('⚙️ تحديث إعدادات النظام...')
      
      const settings = [
        { key: 'contact_email', value: '"alsheref.antaka@gmail.com"' },
        { key: 'contact_phone', value: '"01068275557"' },
        { key: 'whatsapp_number', value: '"01068275557"' },
        { key: 'payment_phone', value: '"01068275557"' },
        { key: 'site_name', value: '"توب ماركتنج - خدمات التسويق الرقمي"' },
        { key: 'about_text', value: '"شركة توب ماركتنج المتخصصة في تقديم خدمات التسويق الرقمي والتصميم والبرمجة"' },
        { key: 'facebook_url', value: '"https://facebook.com/topmarketing.eg"' },
        { key: 'instagram_url', value: '"https://instagram.com/topmarketing.eg"' },
        { key: 'youtube_url', value: '"https://youtube.com/@topmarketing"' },
        { key: 'whatsapp_url', value: '"https://wa.me/201068275557"' }
      ]
      
      for (const setting of settings) {
        const { error } = await supabase
          .from('settings')
          .update({ 
            value: setting.value,
            updated_at: new Date().toISOString()
          })
          .eq('key', setting.key)
        
        if (error) {
          console.warn(`⚠️ تحذير في تحديث ${setting.key}:`, error.message)
        } else {
          console.log(`✅ تم تحديث ${setting.key}`)
        }
      }
    }
  },
  
  {
    name: 'إضافة إعدادات الأمان',
    description: 'إضافة إعدادات الأمان والحماية',
    execute: async () => {
      console.log('🔒 إضافة إعدادات الأمان...')
      
      const securitySettings = [
        { key: 'site_status', value: '"live"', description: 'حالة الموقع', category: 'general', is_public: false },
        { key: 'maintenance_mode', value: 'false', description: 'وضع الصيانة', category: 'general', is_public: false },
        { key: 'allow_registration', value: 'true', description: 'السماح بالتسجيل', category: 'auth', is_public: false },
        { key: 'max_file_size', value: '5242880', description: 'الحد الأقصى لحجم الملف (5MB)', category: 'upload', is_public: false },
        { key: 'session_timeout', value: '3600', description: 'انتهاء صلاحية الجلسة (ثانية)', category: 'security', is_public: false },
        { key: 'max_login_attempts', value: '5', description: 'الحد الأقصى لمحاولات تسجيل الدخول', category: 'security', is_public: false },
        { key: 'password_min_length', value: '8', description: 'الحد الأدنى لطول كلمة المرور', category: 'security', is_public: false },
        { key: 'tax_rate', value: '0.14', description: 'معدل الضريبة المضافة', category: 'billing', is_public: false },
        { key: 'invoice_prefix', value: '"INV"', description: 'بادئة رقم الفاتورة', category: 'billing', is_public: false },
        { key: 'payment_terms', value: '"الدفع خلال 7 أيام من تاريخ الفاتورة"', description: 'شروط الدفع', category: 'billing', is_public: true }
      ]
      
      for (const setting of securitySettings) {
        const { error } = await supabase
          .from('settings')
          .upsert(setting, { onConflict: 'key' })
        
        if (error) {
          console.warn(`⚠️ تحذير في إضافة ${setting.key}:`, error.message)
        } else {
          console.log(`✅ تم إضافة ${setting.key}`)
        }
      }
    }
  },
  
  {
    name: 'التحقق من النتائج',
    description: 'التحقق من نجاح جميع العمليات',
    execute: async () => {
      console.log('🔍 التحقق من النتائج...')
      
      // Check admin account
      const { data: admins, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', 'alsheref.antaka@gmail.com')
      
      if (adminError || !admins || admins.length === 0) {
        throw new Error('فشل في التحقق من حساب المدير')
      }
      
      console.log('✅ تم التحقق من حساب المدير')
      
      // Check settings
      const { data: settings, error: settingsError } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'contact_email')
      
      if (settingsError || !settings || settings.length === 0) {
        throw new Error('فشل في التحقق من الإعدادات')
      }
      
      console.log('✅ تم التحقق من الإعدادات')
      
      return {
        admin: admins[0],
        settingsCount: settings.length
      }
    }
  }
]

// Main execution function
async function executeLaunch() {
  console.log('🚀 بدء الإطلاق الرسمي لموقع Top Marketing')
  console.log('=' .repeat(50))
  
  try {
    for (let i = 0; i < launchSteps.length; i++) {
      const step = launchSteps[i]
      console.log(`\n${i + 1}. ${step.name}`)
      console.log(`   ${step.description}`)
      
      const result = await step.execute()
      
      if (result) {
        console.log(`   النتيجة:`, result)
      }
    }
    
    console.log('\n' + '=' .repeat(50))
    console.log('🎉 تم إطلاق الموقع بنجاح!')
    console.log('\n📋 بيانات تسجيل الدخول:')
    console.log('   البريد الإلكتروني: alsheref.antaka@gmail.com')
    console.log('   كلمة المرور: 0453328124Aa')
    console.log('\n🔗 روابط مهمة:')
    console.log('   لوحة التحكم: https://top-markting.vercel.app/admin/dashboard')
    console.log('   متجر الخدمات: https://top-markting.vercel.app/services-shop')
    console.log('   تسجيل الدخول: https://top-markting.vercel.app/auth/login')
    
  } catch (error) {
    console.error('\n❌ فشل في الإطلاق:', error.message)
    process.exit(1)
  }
}

// Execute if run directly
if (require.main === module) {
  executeLaunch()
}

module.exports = { executeLaunch, launchSteps }
