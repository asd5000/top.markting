'use client'

export default function AdminTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          🧪 صفحة اختبار لوحة التحكم
        </h1>
        
        <div className="space-y-4 text-sm text-gray-600">
          <p>✅ هذه صفحة اختبار للتأكد من أن routing يعمل</p>
          <p>📅 تاريخ الإنشاء: {new Date().toLocaleString('ar-EG')}</p>
          <p>🌐 الرابط: /admin/test</p>
        </div>
        
        <div className="mt-6 space-y-2">
          <a
            href="/admin/login"
            className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            تسجيل الدخول
          </a>
          
          <a
            href="/admin/backup"
            className="block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            النسخ الاحتياطية
          </a>
          
          <a
            href="/"
            className="block bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            الصفحة الرئيسية
          </a>
        </div>
      </div>
    </div>
  )
}
