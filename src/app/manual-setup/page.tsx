'use client'

import { useState } from 'react'

export default function ManualSetupPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const servicesTableSQL = `-- إنشاء جدول الخدمات
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    description_ar TEXT,
    description_en TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'EGP',
    duration_text VARCHAR(100),
    features TEXT[],
    category VARCHAR(100),
    category_name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`

  const permissionsSQL = `-- منح الصلاحيات
GRANT ALL ON services TO anon, authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;`

  const sampleDataSQL = `-- إدخال بيانات تجريبية
INSERT INTO services (name_ar, name_en, description_ar, description_en, price, duration_text, features, category, category_name, is_active, is_featured) VALUES
('تصميم شعار احترافي', 'Professional Logo Design', 'تصميم شعار احترافي يعكس هوية علامتك التجارية بأعلى جودة ممكنة', 'Professional logo design that reflects your brand identity with highest quality', 500.00, '2-3 أيام', ARRAY['تصميم احترافي', '3 مراجعات مجانية', 'ملفات عالية الجودة'], 'design', 'التصميم', true, true),

('إدارة حسابات التواصل الاجتماعي', 'Social Media Management', 'إدارة شاملة لحساباتك على منصات التواصل الاجتماعي مع محتوى إبداعي يومي', 'Comprehensive management of your social media accounts with daily creative content', 1200.00, '30 يوم', ARRAY['إدارة يومية', 'محتوى إبداعي', 'تقارير شهرية'], 'marketing', 'التسويق', true, true),

('مونتاج فيديو احترافي', 'Professional Video Editing', 'مونتاج فيديو احترافي بأعلى جودة مع مؤثرات بصرية وصوتية مميزة', 'Professional video editing with highest quality and special visual and audio effects', 800.00, '5-7 أيام', ARRAY['مونتاج احترافي', 'مؤثرات بصرية', 'موسيقى مجانية'], 'video-editing', 'مونتاج الفيديو', true, false),

('تصميم موقع إلكتروني', 'Website Design', 'تصميم موقع إلكتروني متجاوب وحديث يناسب جميع الأجهزة', 'Responsive and modern website design suitable for all devices', 2500.00, '10-14 يوم', ARRAY['تصميم متجاوب', 'لوحة تحكم', 'تحسين محركات البحث'], 'web-development', 'تطوير المواقع', true, true),

('كتابة محتوى تسويقي', 'Marketing Content Writing', 'كتابة محتوى تسويقي جذاب ومؤثر لجميع منصات التواصل الاجتماعي', 'Attractive and effective marketing content writing for all social media platforms', 300.00, '1-2 يوم', ARRAY['محتوى حصري', 'مناسب للجمهور المستهدف', 'تحسين SEO'], 'content-writing', 'كتابة المحتوى', true, false);`

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🛠️ إعداد قاعدة البيانات يدوياً
        </h1>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">📋 خطوات الإعداد:</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>اذهب إلى Supabase SQL Editor</li>
            <li>انسخ والصق الأكواد أدناه بالترتيب</li>
            <li>اضغط "Run" بعد كل كود</li>
            <li>تأكد من عدم وجود أخطاء</li>
            <li>اختبر الاتصال من الموقع</li>
          </ol>
        </div>

        {/* Step 1 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">1️⃣ إنشاء جدول الخدمات</h3>
            <button
              onClick={() => copyToClipboard(servicesTableSQL, 'table')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {copied === 'table' ? '✅ تم النسخ' : '📋 نسخ الكود'}
            </button>
          </div>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
            {servicesTableSQL}
          </pre>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">2️⃣ منح الصلاحيات</h3>
            <button
              onClick={() => copyToClipboard(permissionsSQL, 'permissions')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {copied === 'permissions' ? '✅ تم النسخ' : '📋 نسخ الكود'}
            </button>
          </div>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
            {permissionsSQL}
          </pre>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">3️⃣ إدخال البيانات التجريبية</h3>
            <button
              onClick={() => copyToClipboard(sampleDataSQL, 'data')}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              {copied === 'data' ? '✅ تم النسخ' : '📋 نسخ الكود'}
            </button>
          </div>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
            {sampleDataSQL}
          </pre>
        </div>

        {/* Links */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">🔗 روابط مفيدة:</h3>
          <div className="space-y-3">
            <a
              href="https://supabase.com/dashboard/project/xanzptntwwmpulqutoiv/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 text-center"
            >
              🚀 فتح Supabase SQL Editor
            </a>
            
            <a
              href="https://top-markting.vercel.app/setup-db"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 text-center"
            >
              🧪 اختبار الإعداد
            </a>
            
            <a
              href="https://top-markting.vercel.app/services-shop"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 text-center"
            >
              🛒 متجر الخدمات (للاختبار النهائي)
            </a>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ تحذير مهم:</h3>
          <p className="text-red-700">
            تأكد من تنفيذ الأكواد بالترتيب الصحيح. إذا واجهت أي خطأ، تواصل معي فوراً مع نسخ رسالة الخطأ.
          </p>
        </div>
      </div>
    </div>
  )
}
