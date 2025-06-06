export interface ServiceItem {
  id: string
  name: string
  description: string
  price: number
  duration: string
  features: string[]
  isActive: boolean
  category: string
  image?: string
  isForm?: boolean
  formType?: 'sell-property' | 'buy-property'
}

export interface ServiceCategory {
  id: string
  name: string
  description: string
  icon: string
  isActive: boolean
  services: ServiceItem[]
}

// Payment Methods
export const paymentMethods = [
  {
    id: 'vodafone_cash',
    name: 'فودافون كاش',
    icon: '📱',
    number: '01068275557',
    instructions: 'احول المبلغ على رقم فودافون كاش وأرسل صورة الإيصال',
    isActive: true,
    forCountries: ['مصر']
  },
  {
    id: 'instapay',
    name: 'إنستا باي',
    icon: '💳',
    instructions: 'ادفع عبر إنستا باي وأرسل رقم العملية',
    isActive: true,
    forCountries: ['مصر']
  },
  {
    id: 'fawry',
    name: 'فوري',
    icon: '🏪',
    instructions: 'ادفع من أقرب نقطة فوري وأرسل رقم العملية',
    isActive: true,
    forCountries: ['مصر']
  },
  {
    id: 'whatsapp',
    name: 'واتساب (خارج مصر)',
    icon: '💬',
    number: '201068275557',
    instructions: 'تواصل معنا عبر واتساب لترتيب الدفع',
    isActive: true,
    forCountries: ['دولي']
  }
]

export const servicesData: ServiceCategory[] = [
  {
    id: 'design',
    name: 'التصميم',
    description: 'خدمات التصميم الجرافيكي والبصري',
    icon: 'Palette',
    isActive: true,
    services: [
      {
        id: 'logo-design',
        name: 'تصميم لوجو',
        description: 'تصميم شعار احترافي لعلامتك التجارية',
        price: 500,
        duration: '3-5 أيام',
        features: ['3 مفاهيم مختلفة', 'ملفات عالية الجودة', 'تعديلات مجانية', 'ملفات متعددة الصيغ'],
        isActive: true,
        category: 'design'
      },
      {
        id: 'social-media-design',
        name: 'تصميم سوشيال ميديا',
        description: 'تصميم منشورات وقصص لوسائل التواصل',
        price: 200,
        duration: '1-2 يوم',
        features: ['تصميم منشورات', 'قصص انستجرام', 'أغلفة الصفحات', 'تصاميم متجاوبة'],
        isActive: true,
        category: 'design'
      },
      {
        id: 'banner-design',
        name: 'تصميم بانر',
        description: 'تصميم بانرات إعلانية احترافية',
        price: 300,
        duration: '2-3 أيام',
        features: ['تصميم جذاب', 'أحجام متعددة', 'تحسين للويب', 'ملفات للطباعة'],
        isActive: true,
        category: 'design'
      },
      {
        id: 'cover-design',
        name: 'تصميم غلاف',
        description: 'تصميم أغلفة للكتب والمجلات',
        price: 400,
        duration: '3-4 أيام',
        features: ['تصميم أمامي وخلفي', 'دقة عالية للطباعة', 'تعديلات مجانية', 'ملف PDF جاهز'],
        isActive: true,
        category: 'design'
      },
      {
        id: 'youtube-thumbnail',
        name: 'تصميم صور مصغرة ليوتيوب',
        description: 'تصميم صور مصغرة جذابة لفيديوهات يوتيوب',
        price: 150,
        duration: '1 يوم',
        features: ['تصميم جذاب', 'أبعاد يوتيوب المثلى', 'ألوان زاهية', 'نص واضح'],
        isActive: true,
        category: 'design'
      },
      {
        id: 'print-design',
        name: 'تصميم ورقي',
        description: 'تصميم مطبوعات ورقية متنوعة',
        price: 350,
        duration: '2-4 أيام',
        features: ['بروشورات', 'فلايرز', 'بطاقات عمل', 'كتالوجات'],
        isActive: true,
        category: 'design'
      }
    ]
  },
  {
    id: 'video-editing',
    name: 'المونتاج',
    description: 'خدمات مونتاج الفيديو والموشن جرافيك',
    icon: 'Video',
    isActive: true,
    services: [
      {
        id: 'video-editing',
        name: 'مونتاج فيديو',
        description: 'مونتاج فيديوهات احترافية',
        price: 800,
        duration: '3-7 أيام',
        features: ['قص ودمج', 'تأثيرات بصرية', 'تصحيح الألوان', 'إضافة موسيقى'],
        isActive: true,
        category: 'video-editing'
      },
      {
        id: 'reels-editing',
        name: 'مونتاج Reels',
        description: 'مونتاج فيديوهات قصيرة للريلز',
        price: 300,
        duration: '1-2 يوم',
        features: ['مونتاج سريع', 'تأثيرات ترندينج', 'موسيقى مناسبة', 'نسبة عمودية'],
        isActive: true,
        category: 'video-editing'
      },
      {
        id: 'motion-graphics',
        name: 'موشن جرافيك',
        description: 'إنشاء رسوم متحركة احترافية',
        price: 1200,
        duration: '5-10 أيام',
        features: ['رسوم متحركة', 'تأثيرات بصرية', 'انتقالات سلسة', 'جودة عالية'],
        isActive: true,
        category: 'video-editing'
      },
      {
        id: 'intro-video',
        name: 'فيديو تعريفي',
        description: 'إنتاج فيديو تعريفي للشركة أو المنتج',
        price: 1500,
        duration: '7-14 يوم',
        features: ['سيناريو احترافي', 'رسوم متحركة', 'تعليق صوتي', 'موسيقى تصويرية'],
        isActive: true,
        category: 'video-editing'
      },
      {
        id: 'intro-animation',
        name: 'Intro (مقدمة)',
        description: 'تصميم مقدمة متحركة للفيديوهات',
        price: 600,
        duration: '3-5 أيام',
        features: ['رسوم متحركة', 'شعار الشركة', 'تأثيرات بصرية', 'مدة 5-15 ثانية'],
        isActive: true,
        category: 'video-editing'
      }
    ]
  },
  {
    id: 'marketing',
    name: 'التسويق',
    description: 'خدمات التسويق الرقمي والإعلان',
    icon: 'TrendingUp',
    isActive: true,
    services: [
      {
        id: 'product-marketing',
        name: 'تسويق منتج',
        description: 'حملة تسويقية شاملة للمنتج',
        price: 1000,
        duration: '1 شهر',
        features: ['استراتيجية تسويقية', 'إعلانات مدفوعة', 'محتوى تسويقي', 'تقارير أسبوعية'],
        isActive: true,
        category: 'marketing'
      },
      {
        id: 'page-marketing',
        name: 'تسويق صفحات',
        description: 'تسويق وإدارة صفحات السوشيال ميديا',
        price: 800,
        duration: '1 شهر',
        features: ['إدارة المحتوى', 'زيادة المتابعين', 'تفاعل مع الجمهور', 'تحليل الأداء'],
        isActive: true,
        category: 'marketing'
      },
      {
        id: 'store-marketing',
        name: 'تسويق متاجر',
        description: 'تسويق المتاجر الإلكترونية',
        price: 1200,
        duration: '1 شهر',
        features: ['تحسين SEO', 'إعلانات جوجل', 'تسويق بالمحتوى', 'زيادة المبيعات'],
        isActive: true,
        category: 'marketing'
      },
      {
        id: 'google-verification',
        name: 'توثيق متجر جوجل',
        description: 'توثيق وتحسين متجرك على جوجل',
        price: 500,
        duration: '3-7 أيام',
        features: ['توثيق Google My Business', 'تحسين المعلومات', 'إضافة الصور', 'إدارة التقييمات'],
        isActive: true,
        category: 'marketing'
      },
      {
        id: 'google-maps',
        name: 'إنشاء خريطة Google',
        description: 'إنشاء وتحسين موقعك على خرائط جوجل',
        price: 300,
        duration: '2-3 أيام',
        features: ['إضافة الموقع', 'معلومات كاملة', 'صور المكان', 'ساعات العمل'],
        isActive: true,
        category: 'marketing'
      }
    ]
  },
  {
    id: 'followers',
    name: 'إضافة متابعين',
    description: 'خدمات زيادة المتابعين على وسائل التواصل',
    icon: 'Users',
    isActive: true,
    services: [
      {
        id: 'facebook-followers',
        name: 'متابعين فيسبوك',
        description: 'زيادة متابعين صفحة فيسبوك',
        price: 200,
        duration: '1-7 أيام',
        features: ['متابعين حقيقيين', 'تفاعل طبيعي', 'ضمان عدم النقصان', 'دعم 24/7'],
        isActive: true,
        category: 'followers'
      },
      {
        id: 'instagram-followers',
        name: 'متابعين إنستجرام',
        description: 'زيادة متابعين حساب إنستجرام',
        price: 250,
        duration: '1-7 أيام',
        features: ['متابعين مستهدفين', 'تفاعل حقيقي', 'نمو تدريجي', 'ضمان الجودة'],
        isActive: true,
        category: 'followers'
      },
      {
        id: 'youtube-subscribers',
        name: 'مشتركين يوتيوب',
        description: 'زيادة مشتركين قناة يوتيوب',
        price: 300,
        duration: '3-10 أيام',
        features: ['مشتركين حقيقيين', 'زيادة المشاهدات', 'تحسين الترتيب', 'نمو طبيعي'],
        isActive: true,
        category: 'followers'
      },
      {
        id: 'tiktok-followers',
        name: 'متابعين تيك توك',
        description: 'زيادة متابعين حساب تيك توك',
        price: 180,
        duration: '1-5 أيام',
        features: ['متابعين نشطين', 'زيادة الإعجابات', 'تحسين الوصول', 'نمو سريع'],
        isActive: true,
        category: 'followers'
      },
      {
        id: 'telegram-members',
        name: 'أعضاء تليجرام',
        description: 'زيادة أعضاء قناة أو مجموعة تليجرام',
        price: 150,
        duration: '1-3 أيام',
        features: ['أعضاء حقيقيين', 'تفاعل نشط', 'نمو سريع', 'ضمان البقاء'],
        isActive: true,
        category: 'followers'
      },
      {
        id: 'whatsapp-members',
        name: 'أعضاء واتساب',
        description: 'زيادة أعضاء مجموعة واتساب',
        price: 100,
        duration: '1-2 يوم',
        features: ['أعضاء نشطين', 'إضافة تدريجية', 'أرقام حقيقية', 'دعم مستمر'],
        isActive: true,
        category: 'followers'
      }
    ]
  },
  {
    id: 'websites',
    name: 'إنشاء مواقع',
    description: 'خدمات تطوير المواقع والمتاجر الإلكترونية',
    icon: 'Code',
    isActive: true,
    services: [
      {
        id: 'web-hosting',
        name: 'استضافة موقع',
        description: 'خدمة استضافة مواقع سريعة وآمنة',
        price: 500,
        duration: 'فوري',
        features: ['استضافة سريعة', 'شهادة SSL', 'نسخ احتياطية', 'دعم فني 24/7'],
        isActive: true,
        category: 'websites'
      },
      {
        id: 'ecommerce-store',
        name: 'متجر إلكتروني',
        description: 'إنشاء متجر إلكتروني متكامل',
        price: 3500,
        duration: '2-4 أسابيع',
        features: ['تصميم متجاوب', 'نظام دفع آمن', 'إدارة المخزون', 'لوحة تحكم'],
        isActive: true,
        category: 'websites'
      },
      {
        id: 'business-website',
        name: 'موقع تعريفي',
        description: 'موقع تعريفي للشركة أو الخدمات',
        price: 2000,
        duration: '1-2 أسبوع',
        features: ['تصميم احترافي', 'متجاوب', 'تحسين SEO', 'نماذج تواصل'],
        isActive: true,
        category: 'websites'
      },
      {
        id: 'landing-page',
        name: 'صفحة هبوط',
        description: 'صفحة هبوط محسنة للتحويل',
        price: 1200,
        duration: '3-7 أيام',
        features: ['تصميم محسن للتحويل', 'سرعة عالية', 'نماذج تفاعلية', 'تتبع التحليلات'],
        isActive: true,
        category: 'websites'
      }
    ]
  },
  {
    id: 'data-extraction',
    name: 'سحب الداتا',
    description: 'خدمات استخراج وجمع البيانات',
    icon: 'Database',
    isActive: true,
    services: [
      {
        id: 'business-data',
        name: 'داتا حسب النشاط',
        description: 'جمع بيانات الشركات حسب نوع النشاط',
        price: 400,
        duration: '2-5 أيام',
        features: ['بيانات مصنفة', 'معلومات تواصل', 'تحديث دوري', 'تصدير Excel'],
        isActive: true,
        category: 'data-extraction'
      },
      {
        id: 'detailed-data',
        name: 'داتا مفصلة',
        description: 'بيانات تفصيلية شاملة',
        price: 600,
        duration: '3-7 أيام',
        features: ['معلومات شاملة', 'تفاصيل كاملة', 'تحقق من الصحة', 'تنسيق احترافي'],
        isActive: true,
        category: 'data-extraction'
      },
      {
        id: 'random-data',
        name: 'داتا عشوائية',
        description: 'بيانات عشوائية متنوعة',
        price: 200,
        duration: '1-3 أيام',
        features: ['بيانات متنوعة', 'سعر اقتصادي', 'تسليم سريع', 'جودة مضمونة'],
        isActive: true,
        category: 'data-extraction'
      },
      {
        id: 'location-data',
        name: 'داتا حسب المحافظة',
        description: 'بيانات مصنفة جغرافياً',
        price: 350,
        duration: '2-4 أيام',
        features: ['تصنيف جغرافي', 'دقة عالية', 'تحديث مستمر', 'تغطية شاملة'],
        isActive: true,
        category: 'data-extraction'
      },
      {
        id: 'country-data',
        name: 'داتا بلد',
        description: 'بيانات على مستوى الدولة',
        price: 800,
        duration: '5-10 أيام',
        features: ['تغطية وطنية', 'بيانات شاملة', 'تصنيف متقدم', 'جودة عالية'],
        isActive: true,
        category: 'data-extraction'
      },
      {
        id: 'hotels-data',
        name: 'داتا فنادق',
        description: 'بيانات الفنادق والمنتجعات',
        price: 500,
        duration: '3-6 أيام',
        features: ['معلومات الفنادق', 'تقييمات', 'أسعار', 'مواقع'],
        isActive: true,
        category: 'data-extraction'
      },
      {
        id: 'factories-data',
        name: 'داتا مصانع',
        description: 'بيانات المصانع والشركات الصناعية',
        price: 700,
        duration: '4-8 أيام',
        features: ['معلومات المصانع', 'نوع الإنتاج', 'بيانات التواصل', 'تصنيف صناعي'],
        isActive: true,
        category: 'data-extraction'
      }
    ]
  },
  {
    id: 'real-estate',
    name: 'التسويق العقاري',
    description: 'خدمات تسويق العقارات للبيع والشراء',
    icon: 'Building',
    isActive: true,
    services: [
      {
        id: 'real-estate-marketing',
        name: 'تسويق عقاري',
        description: 'خدمة تسويق العقارات للبيع والشراء',
        price: 0,
        duration: 'حسب الطلب',
        features: ['نموذج بيع العقار', 'نموذج شراء العقار', 'متابعة مع العملاء', 'خدمة مجانية'],
        isActive: true,
        category: 'real-estate',
        isDirectForm: true
      }
    ]
  },
  {
    id: 'page-management-packages',
    name: 'باقات إدارة الصفحات',
    description: 'باقات شاملة لإدارة وتطوير حضورك الرقمي',
    icon: 'Package',
    isActive: true,
    services: [
      {
        id: 'basic-package',
        name: 'الباقة العادية',
        description: 'باقة أساسية بجودة بسيطة مناسبة للمبتدئين',
        price: 0, // سيتم حساب السعر حسب الاختيار
        duration: 'شهرياً',
        features: [
          'تصميم حتى 15 تصميم - 70 جنيه/تصميم',
          'مونتاج حتى 7 فيديو - 120 جنيه/فيديو',
          'إضافة متابعين حتى 5,000 - 100 جنيه/1000',
          'سحب بيانات حتى 5,000 - 100 جنيه/1000',
          'التسويق - 120 جنيه شهرياً',
          'جودة بسيطة مناسبة للمبتدئين'
        ],
        isActive: true,
        category: 'page-management-packages',
        isSubscription: true,
        packageType: 'basic',
        limits: {
          design: { max: 15, price: 70 },
          video: { max: 7, price: 120 },
          followers: { max: 5000, price: 100, unit: 1000 },
          dataExtraction: { max: 5000, price: 100, unit: 1000 },
          marketing: { price: 120 }
        }
      },
      {
        id: 'medium-package',
        name: 'الباقة المتوسطة',
        description: 'باقة متوسطة بجودة مناسبة للأعمال الصغيرة والمتوسطة',
        price: 0, // سيتم حساب السعر حسب الاختيار
        duration: 'شهرياً',
        features: [
          'تصميم حتى 15 تصميم - 180 جنيه/تصميم',
          'مونتاج حتى 7 فيديو - 90 جنيه/فيديو',
          'إضافة متابعين حتى 20,000 - 200 جنيه/1000',
          'سحب بيانات حتى 20,000 - 200 جنيه/1000',
          'التسويق - 90 جنيه شهرياً',
          'جودة متوسطة للأعمال الصغيرة والمتوسطة'
        ],
        isActive: true,
        category: 'page-management-packages',
        isSubscription: true,
        packageType: 'medium',
        limits: {
          design: { max: 15, price: 180 },
          video: { max: 7, price: 90 },
          followers: { max: 20000, price: 200, unit: 1000 },
          dataExtraction: { max: 20000, price: 200, unit: 1000 },
          marketing: { price: 90 }
        }
      },
      {
        id: 'professional-package',
        name: 'الباقة الاحترافية',
        description: 'باقة احترافية بجودة عالية للشركات والمؤسسات',
        price: 0, // سيتم حساب السعر حسب الاختيار
        duration: 'شهرياً',
        features: [
          'تصميم حتى 15 تصميم - 250 جنيه/تصميم',
          'مونتاج حتى 7 فيديو - 70 جنيه/فيديو',
          'إضافة متابعين حتى 5,000 - 100 جنيه/1000',
          'سحب بيانات حتى 5,000 - 100 جنيه/1000',
          'التسويق - 120 جنيه شهرياً',
          'جودة عالية واحترافية',
          'دعم فني 24/7',
          'تقارير شهرية مفصلة'
        ],
        isActive: true,
        category: 'page-management-packages',
        isSubscription: true,
        packageType: 'professional',
        limits: {
          design: { max: 15, price: 250 },
          video: { max: 7, price: 70 },
          followers: { max: 5000, price: 100, unit: 1000 },
          dataExtraction: { max: 5000, price: 100, unit: 1000 },
          marketing: { price: 120 }
        }
      }
    ]
  }
]

// Real Estate System Data Structure
export interface RealEstateProperty {
  id: string
  operationType: 'buyer' | 'seller'
  propertyType: 'house' | 'apartment' | 'land' | 'shop' | 'villa'

  // Basic Info
  title: string
  description: string
  area: number
  price: number
  priceType: 'total' | 'per_meter' | 'negotiable'

  // Location Details
  location: {
    governorate: string
    city: string
    district: string
    street?: string
    nearbyLandmarks: string[]
    coordinates?: {
      lat: number
      lng: number
    }
  }

  // Property Details
  details: {
    rooms?: number
    bathrooms?: number
    floors?: number
    floor?: number
    buildingAge?: number
    furnished?: 'furnished' | 'semi_furnished' | 'unfurnished'
    direction?: 'north' | 'south' | 'east' | 'west' | 'north_east' | 'north_west' | 'south_east' | 'south_west'
    view?: string[]
    parking?: boolean
    garden?: boolean
    balcony?: boolean
    elevator?: boolean
    security?: boolean
    airConditioning?: boolean
    heating?: boolean
    internet?: boolean
    landType?: 'residential' | 'commercial' | 'industrial' | 'agricultural'
    buildingPermit?: boolean
    utilities?: string[]
  }

  // Features & Amenities
  features: string[]
  amenities: string[]

  // Financial Details
  financial: {
    downPayment?: number
    monthlyInstallment?: number
    installmentPeriod?: number
    taxes?: number
    maintenance?: number
    commission?: number
  }

  // Media
  images: string[]
  videos?: string[]
  virtualTour?: string

  // Contact Info
  contactInfo: {
    name: string
    phone: string
    email?: string
    whatsapp?: string
    preferredContactTime?: string
    isOwner: boolean
    agentName?: string
    agentPhone?: string
  }

  // System Fields
  createdAt: Date
  updatedAt: Date
  status: 'pending' | 'active' | 'sold' | 'rented' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  featured: boolean
  views: number
  inquiries: number

  // Admin Notes
  adminNotes?: string
  verificationStatus: 'pending' | 'verified' | 'rejected'
}

export const realEstatePropertyTypes = [
  {
    id: 'apartment',
    name: 'شقة',
    icon: '🏢',
    fields: ['rooms', 'bathrooms', 'floor', 'elevator', 'balcony', 'furnished']
  },
  {
    id: 'house',
    name: 'بيت',
    icon: '🏠',
    fields: ['rooms', 'bathrooms', 'floors', 'garden', 'parking', 'furnished']
  },
  {
    id: 'villa',
    name: 'فيلا',
    icon: '🏰',
    fields: ['rooms', 'bathrooms', 'floors', 'garden', 'parking', 'pool', 'security']
  },
  {
    id: 'land',
    name: 'أرض',
    icon: '🏞️',
    fields: ['landType', 'buildingPermit', 'utilities']
  },
  {
    id: 'shop',
    name: 'محل تجاري',
    icon: '🏪',
    fields: ['floor', 'parking', 'storage', 'displayWindow']
  }
]

export const realEstateOperationTypes = [
  { id: 'seller', name: 'بايع', icon: '🏷️', color: 'bg-green-500' },
  { id: 'buyer', name: 'شاري', icon: '💰', color: 'bg-blue-500' }
]

export const egyptianGovernorates = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'البحر الأحمر', 'البحيرة',
  'الفيوم', 'الغربية', 'الإسماعيلية', 'المنوفية', 'المنيا', 'القليوبية',
  'الوادي الجديد', 'السويس', 'أسوان', 'أسيوط', 'بني سويف', 'بورسعيد',
  'دمياط', 'الشرقية', 'جنوب سيناء', 'كفر الشيخ', 'مطروح', 'الأقصر',
  'قنا', 'شمال سيناء', 'سوهاج'
]

export const propertyFeatures = [
  'مصعد', 'موقف سيارات', 'حديقة', 'بلكونة', 'مكيف', 'أمن وحراسة',
  'قريب من المواصلات', 'إطلالة مميزة', 'تشطيب فاخر', 'مطبخ مجهز',
  'غرفة خادمة', 'مدخل خاص', 'سطح', 'بدروم', 'جراج', 'حمام سباحة',
  'ملعب أطفال', 'صالة رياضية', 'مول تجاري قريب', 'مدارس قريبة',
  'مستشفيات قريبة', 'مساجد قريبة', 'حديقة عامة قريبة', 'شاطئ قريب'
]

export const propertyAmenities = [
  'كهرباء', 'مياه', 'غاز طبيعي', 'تليفون أرضي', 'إنترنت', 'كابل TV',
  'صرف صحي', 'مولد كهرباء', 'خزان مياه', 'سخان مركزي', 'تكييف مركزي',
  'نظام إنذار', 'كاميرات مراقبة', 'بوابة إلكترونية', 'حارس أمن'
]

export const propertyViews = [
  'إطلالة على البحر', 'إطلالة على النيل', 'إطلالة على الحديقة', 'إطلالة على الشارع',
  'إطلالة على المدينة', 'إطلالة على الجبال', 'إطلالة داخلية', 'إطلالة بانورامية'
]
