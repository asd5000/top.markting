'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  Package,
  Plus,
  Edit,
  Eye,
  Trash2,
  Upload,
  Calculator,
  Users,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Target,
  Star
} from 'lucide-react'

export default function PackagesHelpPage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-purple-600 ml-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">دليل إدارة الباقات</h1>
                <p className="text-gray-600 mt-2">شرح شامل لكيفية إدارة باقات الصفحات</p>
              </div>
            </div>
            
            <Link
              href="/admin/packages"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <ArrowLeft className="w-5 h-5 ml-2" />
              العودة لإدارة الباقات
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* المحتوى الرئيسي */}
          <div className="lg:col-span-2 space-y-8">
            {/* مقدمة */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                <Target className="w-6 h-6 ml-2" />
                🎯 ما هو نظام إدارة الباقات؟
              </h2>
              <p className="text-blue-800 leading-relaxed mb-4">
                نظام إدارة الباقات يتيح لك إنشاء باقات جاهزة لإدارة صفحات السوشيال ميديا. 
                كل باقة تحتوي على خدمات محددة مثل التصميمات والفيديوهات والمحتوى بأسعار ثابتة.
              </p>
              <div className="bg-blue-100 p-4 rounded-lg">
                <p className="text-blue-900 font-semibold">
                  ⚠️ مهم: الزوار لا يستطيعون تخصيص الباقات - فقط الاشتراك في الباقات الجاهزة!
                </p>
              </div>
            </div>

            {/* خطوات إنشاء باقة جديدة */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Plus className="w-6 h-6 ml-2 text-green-600" />
                📝 خطوات إنشاء باقة جديدة
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center ml-4 mt-1">
                    <span className="text-purple-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">المعلومات الأساسية</h3>
                    <ul className="text-gray-700 space-y-1">
                      <li>• اسم الباقة (مثل: باقة احترافية، باقة مبتدئ)</li>
                      <li>• وصف مميز وجذاب للباقة</li>
                      <li>• السعر الشهري (يمكن تعديله تلقائياً من الجدول)</li>
                      <li>• رفع صورة جذابة للباقة</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center ml-4 mt-1">
                    <span className="text-indigo-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">جدول تفاصيل الخدمات</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 mb-3">أضف الخدمات التي تشملها الباقة:</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>أنواع الخدمات المتاحة:</strong>
                          <ul className="mt-2 space-y-1">
                            <li>🎨 تصميمات</li>
                            <li>🎬 ريلز</li>
                            <li>📝 محتوى مكتوب</li>
                            <li>🎥 فيديو تعريفي</li>
                          </ul>
                        </div>
                        <div>
                          <strong>خدمات إضافية:</strong>
                          <ul className="mt-2 space-y-1">
                            <li>🤖 رد تلقائي</li>
                            <li>📈 متابعة إعلانات</li>
                            <li>👥 زيادة متابعين</li>
                            <li>📱 إدارة صفحات</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center ml-4 mt-1">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">حساب الأسعار</h3>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-800 mb-2">
                        <strong>طريقتان لحساب السعر:</strong>
                      </p>
                      <ul className="text-green-700 space-y-1">
                        <li>• <strong>تلقائي:</strong> من مجموع أسعار الخدمات في الجدول</li>
                        <li>• <strong>يدوي:</strong> إدخال السعر الشهري مباشرة</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* إدارة الباقات الموجودة */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Edit className="w-6 h-6 ml-2 text-blue-600" />
                ⚙️ إدارة الباقات الموجودة
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center">
                    <Eye className="w-5 h-5 ml-2 text-blue-500" />
                    عرض الباقات
                  </h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• عرض جميع الباقات في شكل كروت</li>
                    <li>• إظهار السعر وحالة التفعيل</li>
                    <li>• عدد المشتركين لكل باقة</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 flex items-center">
                    <Users className="w-5 h-5 ml-2 text-green-500" />
                    إدارة الاشتراكات
                  </h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• مراجعة طلبات الاشتراك الجديدة</li>
                    <li>• تفعيل أو إلغاء الاشتراكات</li>
                    <li>• متابعة حالة الدفع</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* نصائح مهمة */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
              <h2 className="text-2xl font-bold text-orange-900 mb-4 flex items-center">
                <Lightbulb className="w-6 h-6 ml-2" />
                💡 نصائح مهمة
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 ml-2 mt-1" />
                  <p className="text-orange-800">
                    <strong>أسعار جذابة:</strong> اجعل أسعار الباقات منافسة ومناسبة للسوق
                  </p>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 ml-2 mt-1" />
                  <p className="text-orange-800">
                    <strong>وصف واضح:</strong> اكتب وصف مفصل وجذاب لكل باقة
                  </p>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 ml-2 mt-1" />
                  <p className="text-orange-800">
                    <strong>صور عالية الجودة:</strong> استخدم صور احترافية تعبر عن الباقة
                  </p>
                </div>
                
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 ml-2 mt-1" />
                  <p className="text-orange-800">
                    <strong>تحديث منتظم:</strong> راجع الباقات بانتظام وحدث الأسعار حسب السوق
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* الشريط الجانبي */}
          <div className="space-y-6">
            {/* روابط سريعة */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 ml-2 text-yellow-500" />
                🔗 روابط سريعة
              </h3>
              
              <div className="space-y-3">
                <Link
                  href="/admin/packages"
                  className="block bg-purple-50 hover:bg-purple-100 p-3 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-purple-600 ml-2" />
                    <span className="font-medium text-purple-800">إدارة الباقات</span>
                  </div>
                </Link>
                
                <Link
                  href="/plans"
                  className="block bg-blue-50 hover:bg-blue-100 p-3 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <Eye className="w-5 h-5 text-blue-600 ml-2" />
                    <span className="font-medium text-blue-800">عرض الباقات للزوار</span>
                  </div>
                </Link>
                
                <Link
                  href="/admin/orders"
                  className="block bg-green-50 hover:bg-green-100 p-3 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-green-600 ml-2" />
                    <span className="font-medium text-green-800">إدارة الطلبات</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
              <h3 className="font-bold text-indigo-900 mb-4 flex items-center">
                <Calculator className="w-5 h-5 ml-2" />
                📊 نصائح الأسعار
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="bg-white p-3 rounded-lg">
                  <p className="font-medium text-indigo-800">باقة مبتدئ</p>
                  <p className="text-indigo-600">200-500 ج.م</p>
                </div>
                
                <div className="bg-white p-3 rounded-lg">
                  <p className="font-medium text-indigo-800">باقة متوسطة</p>
                  <p className="text-indigo-600">500-1000 ج.م</p>
                </div>
                
                <div className="bg-white p-3 rounded-lg">
                  <p className="font-medium text-indigo-800">باقة احترافية</p>
                  <p className="text-indigo-600">1000+ ج.م</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
