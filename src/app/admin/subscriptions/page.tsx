'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Package,
  Phone,
  Mail,
  User,
  Calendar,
  DollarSign,
  Search,
  Download,
  MessageCircle,
  Eye,
  X,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Plus
} from 'lucide-react'
import { useAuth, usePermissions } from '@/lib/auth/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

export default function SubscriptionsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { isAdmin } = usePermissions()
  const router = useRouter()
  
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [showPackageModal, setShowPackageModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin())) {
      router.push('/auth/login')
      return
    }
  }, [user, isAuthenticated, isLoading, isAdmin, router])

  // Load subscriptions from localStorage on component mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const savedSubscriptions = JSON.parse(localStorage.getItem('topmarketing_subscriptions') || '[]')
    
    // إضافة بيانات تجريبية إذا لم توجد بيانات
    if (savedSubscriptions.length === 0) {
      const sampleSubscriptions = [
        {
          id: 'subscription-1',
          customer: {
            name: 'أحمد محمد علي',
            email: 'ahmed@example.com',
            phone: '+201234567890',
            company: 'شركة التقنية المتقدمة'
          },
          package: {
            id: 'professional-package',
            name: 'الباقة الاحترافية',
            type: 'professional',
            price: 4000,
            limits: {
              design: 20,
              video: 5,
              dataExtraction: 5,
              followers: 2000,
              webDevelopment: 2
            }
          },
          status: 'active',
          payment_status: 'paid',
          payment_method: 'فودافون كاش',
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
          requirements: 'تركيز على المحتوى التقني والتسويق للشركات',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          usage: {
            design: 12,
            video: 2,
            dataExtraction: 1,
            followers: 800,
            webDevelopment: 1
          }
        },
        {
          id: 'subscription-2',
          customer: {
            name: 'فاطمة حسن محمود',
            email: 'fatma@example.com',
            phone: '+201987654321',
            company: 'متجر الأزياء العصرية'
          },
          package: {
            id: 'medium-package',
            name: 'الباقة المتوسطة',
            type: 'medium',
            price: 2500,
            limits: {
              design: 10,
              video: 3,
              dataExtraction: 2,
              followers: 1000,
              webDevelopment: 1
            }
          },
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'إنستاباي',
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
          requirements: 'محتوى خاص بالأزياء النسائية والموضة',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          usage: {
            design: 0,
            video: 0,
            dataExtraction: 0,
            followers: 0,
            webDevelopment: 0
          }
        },
        {
          id: 'subscription-3',
          customer: {
            name: 'محمد عبد الرحمن',
            email: 'mohamed@example.com',
            phone: '+201555666777',
            company: 'مطعم الأصالة'
          },
          package: {
            id: 'basic-package',
            name: 'الباقة العادية',
            type: 'basic',
            price: 1500,
            limits: {
              design: 5,
              video: 1,
              dataExtraction: 1,
              followers: 500,
              webDevelopment: 0
            }
          },
          status: 'expired',
          payment_status: 'paid',
          payment_method: 'فوري',
          start_date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          requirements: 'محتوى خاص بالمطاعم والطعام',
          created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          usage: {
            design: 5,
            video: 1,
            dataExtraction: 1,
            followers: 500,
            webDevelopment: 0
          }
        }
      ]
      
      localStorage.setItem('topmarketing_subscriptions', JSON.stringify(sampleSubscriptions))
      setSubscriptions(sampleSubscriptions)
    } else {
      setSubscriptions(savedSubscriptions)
    }
  }, [])

  // Save subscriptions to localStorage whenever subscriptions change
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (subscriptions.length > 0) {
      localStorage.setItem('topmarketing_subscriptions', JSON.stringify(subscriptions))
    }
  }, [subscriptions])

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscription.customer.phone.includes(searchTerm) ||
                         subscription.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscription.package.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || subscription.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const updateSubscriptionStatus = (subscriptionId: string, newStatus: string) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === subscriptionId 
        ? { ...sub, status: newStatus, updated_at: new Date().toISOString() }
        : sub
    ))
    toast.success('تم تحديث حالة الاشتراك بنجاح')
  }

  const deleteSubscription = (subscriptionId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الاشتراك؟')) {
      setSubscriptions(prev => prev.filter(sub => sub.id !== subscriptionId))
      toast.success('تم حذف الاشتراك بنجاح')
    }
  }

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '')
    const message = `مرحباً ${name}، نتواصل معك بخصوص اشتراكك في باقة إدارة الصفحات`
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const exportData = () => {
    const csvContent = [
      ['العميل', 'الشركة', 'الهاتف', 'البريد الإلكتروني', 'الباقة', 'السعر', 'الحالة', 'تاريخ البدء', 'تاريخ الانتهاء'].join(','),
      ...filteredSubscriptions.map(sub => [
        sub.customer.name,
        sub.customer.company || '',
        sub.customer.phone,
        sub.customer.email,
        sub.package.name,
        sub.package.price,
        sub.status === 'active' ? 'نشط' : sub.status === 'pending' ? 'في الانتظار' : 'منتهي',
        sub.start_date,
        sub.end_date
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `subscriptions-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    toast.success('تم تصدير البيانات بنجاح')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'expired': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'expired': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط'
      case 'pending': return 'في الانتظار'
      case 'expired': return 'منتهي'
      default: return 'غير محدد'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800 ml-4">
                ← العودة للوحة التحكم
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">إدارة الاشتراكات</h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={() => setShowPackageModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 ml-2" />
                إدارة الخطط
              </button>
              <button
                onClick={exportData}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 ml-2" />
                تصدير البيانات
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الاشتراكات</p>
                <p className="text-2xl font-bold text-gray-900">{subscriptions.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الاشتراكات النشطة</p>
                <p className="text-2xl font-bold text-green-600">{subscriptions.filter(s => s.status === 'active').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">في الانتظار</p>
                <p className="text-2xl font-bold text-yellow-600">{subscriptions.filter(s => s.status === 'pending').length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الإيرادات الشهرية</p>
                <p className="text-2xl font-bold text-purple-600">
                  {subscriptions.filter(s => s.status === 'active').reduce((sum, s) => sum + s.package.price, 0)} جنيه
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="بحث في الاشتراكات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                نشط
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                في الانتظار
              </button>
              <button
                onClick={() => setFilterStatus('expired')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'expired'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                منتهي
              </button>
            </div>
          </div>
        </motion.div>

        {/* Subscriptions List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">قائمة الاشتراكات ({filteredSubscriptions.length})</h3>
          </div>
          
          {filteredSubscriptions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      العميل
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الباقة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التواريخ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubscriptions.map((subscription) => (
                    <tr key={subscription.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="mr-4">
                            <div className="text-sm font-medium text-gray-900">{subscription.customer.name}</div>
                            <div className="text-sm text-gray-500">{subscription.customer.phone}</div>
                            {subscription.customer.company && (
                              <div className="text-xs text-gray-400">{subscription.customer.company}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{subscription.package.name}</div>
                        <div className="text-sm text-gray-500">{subscription.package.price} جنيه/شهر</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                          {getStatusIcon(subscription.status)}
                          <span className="mr-1">{getStatusText(subscription.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>البدء: {new Date(subscription.start_date).toLocaleDateString('ar-EG')}</div>
                        <div>الانتهاء: {new Date(subscription.end_date).toLocaleDateString('ar-EG')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => {
                              setSelectedSubscription(subscription)
                              setShowSubscriptionModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openWhatsApp(subscription.customer.phone, subscription.customer.name)}
                            className="text-green-600 hover:text-green-900"
                            title="واتساب"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          {subscription.status === 'pending' && (
                            <button
                              onClick={() => updateSubscriptionStatus(subscription.id, 'active')}
                              className="text-green-600 hover:text-green-900"
                              title="تفعيل"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteSubscription(subscription.id)}
                            className="text-red-600 hover:text-red-900"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                لا توجد اشتراكات
              </h3>
              <p className="text-gray-600">
                لم يتم تفعيل أي اشتراكات بعد
              </p>
            </div>
          )}
        </div>

        {/* Package Management Modal */}
        {showPackageModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowPackageModal(false)} />

              <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-right align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    إدارة خطط الاشتراكات
                  </h3>
                  <button
                    onClick={() => setShowPackageModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Basic Package */}
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-colors">
                    <div className="text-center mb-4">
                      <h4 className="text-xl font-bold text-gray-900">الباقة العادية</h4>
                      <div className="text-3xl font-bold text-blue-600 mt-2">1,500 جنيه</div>
                      <div className="text-sm text-gray-500">شهرياً</div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">تصميمات</span>
                        <span className="font-semibold">5 تصميمات</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">فيديوهات</span>
                        <span className="font-semibold">1 فيديو</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">استخراج بيانات</span>
                        <span className="font-semibold">1 مرة</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">متابعين</span>
                        <span className="font-semibold">500 متابع</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        تعديل
                      </button>
                      <button className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                        حذف
                      </button>
                    </div>
                  </div>

                  {/* Medium Package */}
                  <div className="bg-white border-2 border-blue-500 rounded-xl p-6 relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">الأكثر شعبية</span>
                    </div>

                    <div className="text-center mb-4">
                      <h4 className="text-xl font-bold text-gray-900">الباقة المتوسطة</h4>
                      <div className="text-3xl font-bold text-blue-600 mt-2">2,500 جنيه</div>
                      <div className="text-sm text-gray-500">شهرياً</div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">تصميمات</span>
                        <span className="font-semibold">10 تصميمات</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">فيديوهات</span>
                        <span className="font-semibold">3 فيديوهات</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">استخراج بيانات</span>
                        <span className="font-semibold">2 مرة</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">متابعين</span>
                        <span className="font-semibold">1,000 متابع</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">تطوير ويب</span>
                        <span className="font-semibold">1 موقع</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        تعديل
                      </button>
                      <button className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                        حذف
                      </button>
                    </div>
                  </div>

                  {/* Professional Package */}
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-colors">
                    <div className="text-center mb-4">
                      <h4 className="text-xl font-bold text-gray-900">الباقة الاحترافية</h4>
                      <div className="text-3xl font-bold text-blue-600 mt-2">4,000 جنيه</div>
                      <div className="text-sm text-gray-500">شهرياً</div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">تصميمات</span>
                        <span className="font-semibold">20 تصميم</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">فيديوهات</span>
                        <span className="font-semibold">5 فيديوهات</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">استخراج بيانات</span>
                        <span className="font-semibold">5 مرات</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">متابعين</span>
                        <span className="font-semibold">2,000 متابع</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">تطوير ويب</span>
                        <span className="font-semibold">2 موقع</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        تعديل
                      </button>
                      <button className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                        حذف
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                    <Plus className="w-5 h-5 ml-2" />
                    إضافة خطة جديدة
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
