const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('🚀 Setting up Supabase database...')

  try {
    // Test connection
    const { data, error } = await supabase.from('users').select('count').limit(1)
    if (error && error.code === '42P01') {
      console.log('📋 Tables not found. Please run the SQL schema first.')
      console.log('Go to your Supabase dashboard > SQL Editor and run the schema.sql file')
      return
    }

    // Insert default services if they don't exist
    console.log('📦 Setting up default services...')
    
    const services = [
      // Design Services
      {
        id: 'logo-design',
        name: 'تصميم لوجو',
        description: 'تصميم لوجو احترافي ومميز لعلامتك التجارية',
        price: 500,
        duration: '2-3 أيام',
        features: ['3 مفاهيم مختلفة', 'مراجعات مجانية', 'ملفات عالية الجودة', 'حقوق ملكية كاملة'],
        category: 'design',
        category_name: 'التصميم',
        is_form: false
      },
      {
        id: 'social-media-design',
        name: 'تصميم سوشيال ميديا',
        description: 'تصاميم جذابة لمنصات التواصل الاجتماعي',
        price: 200,
        duration: '1-2 يوم',
        features: ['تصاميم متنوعة', 'مقاسات مختلفة', 'جودة عالية', 'تسليم سريع'],
        category: 'design',
        category_name: 'التصميم',
        is_form: false
      },
      {
        id: 'banner-design',
        name: 'تصميم بانر',
        description: 'تصميم بانرات إعلانية احترافية',
        price: 300,
        duration: '1-2 يوم',
        features: ['تصميم جذاب', 'مقاسات مختلفة', 'جودة عالية'],
        category: 'design',
        category_name: 'التصميم',
        is_form: false
      },
      // Video Services
      {
        id: 'video-editing',
        name: 'مونتاج فيديو',
        description: 'مونتاج احترافي للفيديوهات',
        price: 800,
        duration: '3-5 أيام',
        features: ['مونتاج احترافي', 'مؤثرات بصرية', 'تصحيح ألوان', 'موسيقى مناسبة'],
        category: 'video',
        category_name: 'المونتاج',
        is_form: false
      },
      {
        id: 'reels-editing',
        name: 'مونتاج ريلز',
        description: 'مونتاج ريلز قصيرة وجذابة',
        price: 300,
        duration: '1-2 يوم',
        features: ['مونتاج سريع', 'مؤثرات حديثة', 'موسيقى ترندينج'],
        category: 'video',
        category_name: 'المونتاج',
        is_form: false
      },
      // Real Estate Services
      {
        id: 'sell-property',
        name: 'بيع عقار',
        description: 'خدمة عرض عقارك للبيع مع تسويق شامل',
        price: 0,
        duration: 'حسب الطلب',
        features: ['عرض العقار على المنصة', 'تسويق مجاني', 'متابعة العملاء المهتمين'],
        category: 'real-estate-marketing',
        category_name: 'التسويق العقاري',
        is_form: true,
        form_type: 'sell-property'
      },
      {
        id: 'buy-property',
        name: 'شراء عقار',
        description: 'خدمة البحث عن العقار المناسب لك',
        price: 0,
        duration: 'حسب الطلب',
        features: ['بحث مخصص حسب المتطلبات', 'عرض العقارات المناسبة', 'ترتيب المعاينات'],
        category: 'real-estate-marketing',
        category_name: 'التسويق العقاري',
        is_form: true,
        form_type: 'buy-property'
      },
      {
        id: 'property-photography',
        name: 'تصوير العقارات',
        description: 'تصوير احترافي للعقارات بجودة عالية',
        price: 500,
        duration: '1-2 يوم',
        features: ['تصوير داخلي وخارجي', 'صور بدقة 4K', 'تعديل احترافي'],
        category: 'real-estate-marketing',
        category_name: 'التسويق العقاري',
        is_form: false
      }
    ]

    for (const service of services) {
      const { error } = await supabase
        .from('services')
        .upsert(service, { onConflict: 'id' })
      
      if (error) {
        console.error(`Error inserting service ${service.id}:`, error)
      } else {
        console.log(`✅ Service ${service.name} inserted/updated`)
      }
    }

    // Insert admin settings
    console.log('⚙️ Setting up admin settings...')
    
    const settings = [
      {
        key: 'site_name',
        value: 'توب ماركتنج',
        description: 'اسم الموقع'
      },
      {
        key: 'contact_phone',
        value: '+201068275557',
        description: 'رقم الهاتف الرئيسي'
      },
      {
        key: 'contact_email',
        value: 'info@topmarketing.com',
        description: 'البريد الإلكتروني الرئيسي'
      },
      {
        key: 'whatsapp_number',
        value: '+201068275557',
        description: 'رقم واتساب'
      },
      {
        key: 'payment_methods',
        value: {
          vodafone_cash: {
            name: 'فودافون كاش',
            number: '01068275557',
            active: true
          },
          instapay: {
            name: 'إنستا باي',
            active: true
          },
          fawry: {
            name: 'فوري',
            active: true
          }
        },
        description: 'طرق الدفع المتاحة'
      }
    ]

    for (const setting of settings) {
      const { error } = await supabase
        .from('admin_settings')
        .upsert(setting, { onConflict: 'key' })
      
      if (error) {
        console.error(`Error inserting setting ${setting.key}:`, error)
      } else {
        console.log(`✅ Setting ${setting.key} inserted/updated`)
      }
    }

    console.log('🎉 Database setup completed successfully!')
    console.log('📝 Next steps:')
    console.log('1. Update your .env.local file with your Supabase credentials')
    console.log('2. Start your development server: npm run dev')
    console.log('3. Test the application at http://localhost:3001')

  } catch (error) {
    console.error('❌ Error setting up database:', error)
    process.exit(1)
  }
}

setupDatabase()
