'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  Edit, 
  Save, 
  Eye, 
  EyeOff,
  ShoppingBag,
  Clock,
  CheckCircle,
  X,
  MessageCircle,
  Calendar,
  DollarSign,
  Settings,
  LogOut
} from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

interface Order {
  id: string
  serviceName: string
  status: 'pending' | 'processing' | 'active' | 'completed' | 'cancelled'
  amount: number
  createdAt: string
  paymentMethod: string
}

// Mock orders for the customer
const mockOrders: Order[] = [
  {
    id: '1',
    serviceName: 'تصميم لوجو احترافي',
    status: 'completed',
    amount: 500,
    createdAt: '2024-01-15T10:00:00Z',
    paymentMethod: 'vodafone_cash'
  },
  {
    id: '2',
    serviceName: 'إدارة سوشيال ميديا',
    status: 'active',
    amount: 1500,
    createdAt: '2024-01-20T14:30:00Z',
    paymentMethod: 'instapay'
  },
  {
    id: '3',
    serviceName: 'متابعين إنستجرام',
    status: 'pending',
    amount: 400,
    createdAt: '2024-01-25T09:15:00Z',
    paymentMethod: 'fawry'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'processing': return 'bg-blue-100 text-blue-800'
    case 'active': return 'bg-green-100 text-green-800'
    case 'completed': return 'bg-gray-100 text-gray-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'في الانتظار'
    case 'processing': return 'قيد المعالجة'
    case 'active': return 'نشط'
    case 'completed': return 'مكتمل'
    case 'cancelled': return 'ملغي'
    default: return status
  }
}

export default function AccountPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [orders] = useState<Order[]>(mockOrders)
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    whatsappNumber: (user as any)?.whatsappNumber || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
      return
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        whatsappNumber: (user as any).whatsappNumber || ''
      }))
    }
  }, [user])

  const handleSaveProfile = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update user data (in real app, this would update the database)
      toast.success('تم تحديث البيانات بنجاح')
      setIsEditing(false)
    } catch (error) {
      toast.error('خطأ في تحديث البيانات')
    }
  }

  const handleChangePassword = async () => {
    if (profileData.newPassword !== profileData.confirmPassword) {
      toast.error('كلمة المرور الجديدة غير متطابقة')
      return
    }

    if (profileData.newPassword.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('تم تغيير كلمة المرور بنجاح')
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (error) {
      toast.error('خطأ في تغيير كلمة المرور')
    }
  }

  const handleLogout = () => {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      logout()
      router.push('/')
    }
  }

  const totalSpent = orders.reduce((sum, order) => sum + order.amount, 0)
  const completedOrders = orders.filter(order => order.status === 'completed').length

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
              <Link href="/" className="text-blue-600 hover:text-blue-800 ml-4">
                ← العودة للرئيسية
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">إدارة الحساب</h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-gray-600">مرحباً، {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <LogOut className="w-4 h-4 ml-2" />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{orders.length}</div>
                  <div className="text-xs text-blue-700">إجمالي الطلبات</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{completedOrders}</div>
                  <div className="text-xs text-green-700">طلبات مكتملة</div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-blue-100 text-blue-600 border-r-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-5 h-5 ml-3" />
                  الملف الشخصي
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-blue-100 text-blue-600 border-r-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5 ml-3" />
                  طلباتي
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-blue-100 text-blue-600 border-r-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-5 h-5 ml-3" />
                  الإعدادات
                </button>
              </nav>
            </motion.div>
          </div>

          {/* Content */}
          <div className="lg:w-3/4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">الملف الشخصي</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Edit className="w-4 h-4 ml-2" />
                      {isEditing ? 'إلغاء' : 'تعديل'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">الاسم الكامل</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        className="form-input disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="form-label">البريد الإلكتروني</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className="form-input disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="form-label">رقم الهاتف</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                        className="form-input disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="form-label">رقم الواتساب</label>
                      <input
                        type="tel"
                        value={profileData.whatsappNumber}
                        onChange={(e) => setProfileData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                        disabled={!isEditing}
                        className="form-input disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-4 pt-6 border-t">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                      >
                        إلغاء
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <Save className="w-5 h-5 ml-2" />
                        حفظ التغييرات
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">طلباتي</h2>

                  {/* Orders Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600">إجمالي الطلبات</p>
                          <p className="text-2xl font-bold text-blue-900">{orders.length}</p>
                        </div>
                        <ShoppingBag className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-600">طلبات مكتملة</p>
                          <p className="text-2xl font-bold text-green-900">{completedOrders}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-600">إجمالي الإنفاق</p>
                          <p className="text-2xl font-bold text-purple-900">{totalSpent} جنيه</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  {/* Orders List */}
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{order.serviceName}</h3>
                            <p className="text-sm text-gray-500">
                              طلب رقم: {order.id} • {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                            </p>
                          </div>
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-lg font-bold text-gray-900">
                            {order.amount} جنيه
                          </div>
                          <div className="flex space-x-2 space-x-reverse">
                            <a
                              href={`https://wa.me/+201068275557?text=استفسار عن الطلب رقم ${order.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                            >
                              <MessageCircle className="w-4 h-4 ml-2" />
                              واتساب
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {orders.length === 0 && (
                    <div className="text-center py-12">
                      <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        لا توجد طلبات
                      </h3>
                      <p className="text-gray-600 mb-6">
                        لم تقم بطلب أي خدمات بعد
                      </p>
                      <Link
                        href="/services-shop"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                      >
                        <ShoppingBag className="w-5 h-5 ml-2" />
                        تصفح الخدمات
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">إعدادات الحساب</h2>

                  {/* Change Password */}
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">تغيير كلمة المرور</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="form-label">كلمة المرور الحالية</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={profileData.currentPassword}
                            onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="form-input pl-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="form-label">كلمة المرور الجديدة</label>
                        <input
                          type="password"
                          value={profileData.newPassword}
                          onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="form-input"
                        />
                      </div>

                      <div>
                        <label className="form-label">تأكيد كلمة المرور الجديدة</label>
                        <input
                          type="password"
                          value={profileData.confirmPassword}
                          onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="form-input"
                        />
                      </div>

                      <button
                        onClick={handleChangePassword}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Save className="w-5 h-5 ml-2" />
                        تغيير كلمة المرور
                      </button>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات الحساب</h3>
                    
                    <div className="space-y-4">
                      <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                      >
                        <LogOut className="w-5 h-5 ml-2" />
                        تسجيل الخروج من جميع الأجهزة
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
