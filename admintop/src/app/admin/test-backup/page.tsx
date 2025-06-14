'use client'

export default function TestBackupPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          🧪 اختبار صفحة النسخ الاحتياطية
        </h1>
        <p className="text-gray-600 mb-6">
          هذه صفحة اختبار للتأكد من أن المسارات تعمل
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-green-900 mb-2">
            ✅ صفحة الاختبار تعمل!
          </h2>
          <p className="text-green-700">
            إذا كانت هذه الصفحة تعمل، فالمشكلة في صفحة backup الأصلية.
          </p>
        </div>

        <div className="mt-6">
          <a 
            href="/admin/backup" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-block"
          >
            🔗 محاولة الذهاب لصفحة النسخ الاحتياطية
          </a>
        </div>
      </div>
    </div>
  )
}
