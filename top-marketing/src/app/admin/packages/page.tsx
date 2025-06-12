'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  DollarSign, 
  Calendar,
  Settings,
  BarChart3,
  Check,
  X
} from 'lucide-react'

interface PackageData {
  id: string
  name: string
  price: number
  duration: number
  description: string
  features: string[]
  isActive: boolean
  subscribersCount: number
  createdAt: string
}

interface Subscription {
  id: string
  packageId: string
  clientName: string
  clientEmail: string
  status: 'active' | 'expired' | 'cancelled'
  startDate: string
  endDate: string
  totalPaid: number
}

export default function AdminPackagesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('packages')
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)

  const user = {
    name: 'أحمد محمد',
    email: 'admin@topmarketing.com',
    role: 'super_admin'
  }

  // بيانات تجريبية للباقات
  const mockPackages: Package[] = [
    {
      id: '1',
      name: 'باقة عادية',
      price: 500,
      duration: 1,
      description: 'مثالية للشركات الصغيرة والمشاريع الناشئة',
      features: ['إدارة صفحة واحدة', '5 منشورات أسبوعياً', 'رد على التعليقات', 'تقرير شهري'],
      isActive: true,
      subscribersCount: 25,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'باقة متوسطة',
      price: 800,
      duration: 1,
      description: 'الأكثر شعبية للشركات المتوسطة',
      features: ['إدارة 3 صفحات', '10 منشورات أسبوعياً', 'رد على التعليقات', 'تقارير أسبوعية', 'حملة إعلانية'],
      isActive: true,
      subscribersCount: 45,
      createdAt: '2024-01-15'
    },
    {
      id: '3',
      name: 'باقة احترافية',
      price: 1200,
      duration: 1,
      description: 'للشركات الكبيرة والعلامات التجارية المتقدمة',
      features: ['إدارة 5 صفحات', '15 منشور أسبوعياً', 'تقارير يومية', '3 حملات إعلانية', 'استشارة مجانية'],
      isActive: true,
      subscribersCount: 18,
      createdAt: '2024-01-15'
    }
  ]

  // استخدام البيانات الثابتة فقط
  useEffect(() => {
    // محاكاة تحميل البيانات
    setTimeout(() => {
      setPackages(mockPackages)
      setLoading(false)
    }, 500)
  }, [])

  // بيانات تجريبية للاشتراكات
  const mockSubscriptions: Subscription[] = [
    {
      id: '1',
      packageId: '2',
      clientName: 'شركة النور للتجارة',
      clientEmail: 'info@alnoor.com',
      status: 'active',
      startDate: '2024-06-01',
      endDate: '2024-07-01',
      totalPaid: 800
    },
    {
      id: '2',
      packageId: '1',
      clientName: 'مطعم الأصالة',
      clientEmail: 'contact@asala.com',
      status: 'active',
      startDate: '2024-06-05',
      endDate: '2024-07-05',
      totalPaid: 500
    },
    {
      id: '3',
      packageId: '3',
      clientName: 'مجموعة الفجر',
      clientEmail: 'admin@alfajr.com',
      status: 'expired',
      startDate: '2024-05-01',
      endDate: '2024-06-01',
      totalPaid: 1200
    }
  ]

  const [subscriptions] = useState<Subscription[]>(mockSubscriptions)

  const togglePackageStatus = (packageId: string) => {
    // تحديث الحالة المحلية فقط
    setPackages(packages.map(p =>
      p.id === packageId ? { ...p, isActive: !p.isActive } : p
    ))
  }

  const deletePackage = (packageId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الباقة؟')) return

    // تحديث الحالة المحلية فقط
    setPackages(packages.filter(pkg => pkg.id !== packageId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'expired': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'نشط'
      case 'expired': return 'منتهي'
      case 'cancelled': return 'ملغي'
      default: return status
    }
  }

  const totalRevenue = mockSubscriptions.reduce((sum, sub) => sum + sub.totalPaid, 0)
  const activeSubscriptions = mockSubscriptions.filter(sub => sub.status === 'active').length
  const totalSubscribers = packages.length * 15 // تقدير متوسط المشتركين

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        <main className="flex-1 lg:mr-64">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Package className="w-8 h-8 ml-3" />
                    إدارة الباقات والاشتراكات
                  </h1>
                  <p className="text-gray-600 mt-2">إدارة باقات إدارة الصفحات ومتابعة الاشتراكات</p>
                </div>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  إضافة باقة جديدة
                </button>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="card">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div className="mr-4">
                      <p className="text-sm text-gray-600">إجمالي الباقات</p>
                      <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="mr-4">
                      <p className="text-sm text-gray-600">إجمالي المشتركين</p>
                      <p className="text-2xl font-bold text-gray-900">{totalSubscribers}</p>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="mr-4">
                      <p className="text-sm text-gray-600">الاشتراكات النشطة</p>
                      <p className="text-2xl font-bold text-gray-900">{activeSubscriptions}</p>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div className="mr-4">
                      <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
                      <p className="text-2xl font-bold text-gray-900">{totalRevenue.toLocaleString()} ج.م</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('packages')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'packages'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    الباقات
                  </button>
                  <button
                    onClick={() => setActiveTab('subscriptions')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'subscriptions'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    الاشتراكات
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'analytics'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    التحليلات
                  </button>
                </nav>
              </div>

              {/* Packages Tab */}
              {activeTab === 'packages' && (
                <div>
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="mr-2">جاري التحميل...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {packages.map((pkg) => (
                        <div key={pkg.id} className="card">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                              <p className="text-gray-600 text-sm">{pkg.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setSelectedPackage(pkg)}
                                className="p-1 text-blue-600 hover:text-blue-800"
                                title="عرض التفاصيل"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1 text-green-600 hover:text-green-800"
                                title="تعديل"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deletePackage(pkg.id)}
                                className="p-1 text-red-600 hover:text-red-800"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="text-center mb-4">
                            <div className="text-3xl font-bold text-blue-600 mb-1">
                              {pkg.price} <span className="text-lg text-gray-600">ج.م</span>
                            </div>
                            <p className="text-gray-600">{pkg.duration} شهر</p>
                          </div>

                          <ul className="space-y-2 mb-6">
                            {pkg.features.slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="flex items-center text-sm text-gray-600">
                                <Check className="w-4 h-4 text-green-500 ml-2" />
                                {feature}
                              </li>
                            ))}
                            {pkg.features.length > 3 && (
                              <li className="text-sm text-gray-500">
                                +{pkg.features.length - 3} مميزات أخرى
                              </li>
                            )}
                          </ul>

                          <div className="flex items-center justify-between mb-4">
                            <div className="text-sm text-gray-600">
                              <Users className="w-4 h-4 inline ml-1" />
                              {Math.floor(Math.random() * 50) + 10} مشترك
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              pkg.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {pkg.isActive ? 'نشط' : 'معطل'}
                            </div>
                          </div>

                          <button
                            onClick={() => togglePackageStatus(pkg.id)}
                            className={`btn w-full ${
                              pkg.isActive
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'btn-primary'
                            }`}
                          >
                            {pkg.isActive ? 'تعطيل الباقة' : 'تفعيل الباقة'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Subscriptions Tab */}
              {activeTab === 'subscriptions' && (
                <div className="card">
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>العميل</th>
                          <th>الباقة</th>
                          <th>تاريخ البداية</th>
                          <th>تاريخ الانتهاء</th>
                          <th>المبلغ المدفوع</th>
                          <th>الحالة</th>
                          <th>إجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscriptions.map((sub) => {
                          const packageData = packages.find(pkg => pkg.id === sub.packageId)
                          return (
                            <tr key={sub.id} className="hover:bg-gray-50">
                              <td>
                                <div>
                                  <div className="font-medium text-gray-900">{sub.clientName}</div>
                                  <div className="text-sm text-gray-600">{sub.clientEmail}</div>
                                </div>
                              </td>
                              <td>
                                <div className="font-medium">{packageData?.name}</div>
                                <div className="text-sm text-gray-600">{packageData?.price} ج.م/شهر</div>
                              </td>
                              <td className="text-sm text-gray-600">{sub.startDate}</td>
                              <td className="text-sm text-gray-600">{sub.endDate}</td>
                              <td className="font-medium text-gray-900">{sub.totalPaid.toLocaleString()} ج.م</td>
                              <td>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sub.status)}`}>
                                  {getStatusLabel(sub.status)}
                                </span>
                              </td>
                              <td>
                                <div className="flex items-center space-x-2">
                                  <button className="p-1 text-blue-600 hover:text-blue-800" title="عرض التفاصيل">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button className="p-1 text-green-600 hover:text-green-800" title="تجديد">
                                    <Calendar className="w-4 h-4" />
                                  </button>
                                  <button className="p-1 text-red-600 hover:text-red-800" title="إلغاء">
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <BarChart3 className="w-5 h-5 ml-2" />
                        أداء الباقات
                      </h3>
                      <div className="space-y-4">
                        {packages.map((pkg) => (
                          <div key={pkg.id} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{pkg.name}</div>
                              <div className="text-sm text-gray-600">{pkg.subscribersCount} مشترك</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-blue-600">
                                {(pkg.subscribersCount * pkg.price).toLocaleString()} ج.م
                              </div>
                              <div className="text-sm text-gray-600">إيرادات شهرية</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">إحصائيات سريعة</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">متوسط سعر الباقة</span>
                          <span className="font-medium">
                            {Math.round(packages.reduce((sum, pkg) => sum + pkg.price, 0) / packages.length)} ج.م
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">معدل التجديد</span>
                          <span className="font-medium">85%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">الباقة الأكثر شعبية</span>
                          <span className="font-medium">
                            {packages.reduce((prev, current) => 
                              prev.subscribersCount > current.subscribersCount ? prev : current
                            ).name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">نمو الاشتراكات</span>
                          <span className="font-medium text-green-600">+12% هذا الشهر</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Package Details Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">تفاصيل الباقة</h3>
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">اسم الباقة</label>
                  <p className="text-gray-900 text-lg font-medium">{selectedPackage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">الوصف</label>
                  <p className="text-gray-900">{selectedPackage.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">السعر</label>
                    <p className="text-gray-900 text-xl font-bold">{selectedPackage.price} ج.م</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">المدة</label>
                    <p className="text-gray-900">{selectedPackage.duration} شهر</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">المميزات</label>
                  <ul className="mt-2 space-y-1">
                    {selectedPackage.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <Check className="w-4 h-4 text-green-500 ml-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">عدد المشتركين</label>
                    <p className="text-gray-900">{selectedPackage.subscribersCount} مشترك</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">الحالة</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedPackage.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedPackage.isActive ? 'نشط' : 'معطل'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Package Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">إضافة باقة جديدة</h3>
              <form className="space-y-4">
                <div>
                  <label className="form-label">اسم الباقة *</label>
                  <input type="text" className="form-input" required />
                </div>
                <div>
                  <label className="form-label">الوصف *</label>
                  <textarea className="form-input" rows={3} required></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">السعر (ج.م) *</label>
                    <input type="number" className="form-input" required />
                  </div>
                  <div>
                    <label className="form-label">المدة (شهر) *</label>
                    <input type="number" className="form-input" defaultValue={1} required />
                  </div>
                </div>
                <div>
                  <label className="form-label">المميزات *</label>
                  <textarea 
                    className="form-input" 
                    rows={4} 
                    placeholder="اكتب كل ميزة في سطر منفصل"
                    required
                  ></textarea>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="ml-2" defaultChecked />
                  <label className="text-gray-700">تفعيل الباقة فور الإنشاء</label>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button type="submit" className="btn btn-primary flex-1">
                    إضافة الباقة
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="btn border border-gray-300 flex-1"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
