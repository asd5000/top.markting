'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Download,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  DollarSign,
  Package,
  X
} from 'lucide-react'
import { useAuth, usePermissions } from '@/lib/auth/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { userOperations } from '@/lib/supabase/client'

interface Customer {
  id: string
  email: string
  username: string
  name: string | null
  phone: string | null
  role: string | null
  is_active: boolean | null
  created_at: string
  updated_at: string
  last_login: string | null
  total_spent: number | null
  whatsapp_number: string | null
  preferred_payment_method: string | null
}

export default function AdminCustomersPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { isAdmin } = usePermissions()
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    username: '',
    phone: '',
    whatsapp_number: '',
    preferred_payment_method: 'vodafone_cash'
  })

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin())) {
      router.push('/auth/login')
      return
    }
  }, [user, isAuthenticated, isLoading, isAdmin, router])

  // Load customers from database
  useEffect(() => {
    const loadCustomers = async () => {
      if (!isAuthenticated || !isAdmin()) return

      try {
        setIsLoadingCustomers(true)
        const data = await userOperations.getUsers()

        // Filter only customers (not admins)
        const customerData = data.filter(user => user.role === 'customer' || !user.role)
        setCustomers(customerData)
        setFilteredCustomers(customerData)
      } catch (error) {
        console.error('Error loading customers:', error)
        toast.error('حدث خطأ أثناء تحميل العملاء')
      } finally {
        setIsLoadingCustomers(false)
      }
    }

    loadCustomers()
  }, [isAuthenticated, isAdmin])

  useEffect(() => {
    let filtered = customers

    if (searchTerm) {
      filtered = filtered.filter(customer =>
        (customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.phone?.includes(searchTerm) || false) ||
        (customer.username?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      )
    }

    setFilteredCustomers(filtered)
  }, [searchTerm, customers])

  const openWhatsApp = (phone: string, customerName: string) => {
    const message = `مرحباً ${customerName}، نتواصل معك من توب ماركتنج`
    const whatsappUrl = `https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const openGoogleMessages = (phone: string, customerName: string) => {
    const message = `مرحباً ${customerName}، نتواصل معك من توب ماركتنج`
    // This would typically integrate with Google Messages API
    toast('سيتم فتح Google Messages')
  }

  const deleteCustomer = async (customerId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      return
    }

    try {
      setIsLoadingCustomers(true)

      await userOperations.deleteUser(customerId)

      // حذف من القائمة المحلية
      setCustomers(prev => prev.filter(c => c.id !== customerId))
      setFilteredCustomers(prev => prev.filter(c => c.id !== customerId))

      toast.success('تم حذف العميل بنجاح')

    } catch (error) {
      console.error('Error deleting customer:', error)
      toast.error('حدث خطأ أثناء حذف العميل')
    } finally {
      setIsLoadingCustomers(false)
    }
  }

  const toggleCustomerStatus = async (customerId: string) => {
    try {
      setIsLoadingCustomers(true)

      const customer = customers.find(c => c.id === customerId)
      if (!customer) return

      await userOperations.updateUser(customerId, {
        is_active: !customer.is_active
      })

      // تحديث القائمة المحلية
      const updateCustomer = (customer: Customer) =>
        customer.id === customerId
          ? { ...customer, is_active: !customer.is_active }
          : customer

      setCustomers(prev => prev.map(updateCustomer))
      setFilteredCustomers(prev => prev.map(updateCustomer))

      toast.success('تم تحديث حالة العميل')

    } catch (error) {
      console.error('Error toggling customer status:', error)
      toast.error('حدث خطأ أثناء تحديث حالة العميل')
    } finally {
      setIsLoadingCustomers(false)
    }
  }

  const addCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.username) {
      toast.error('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    try {
      setIsLoadingCustomers(true)

      // إنشاء hash مؤقت للكلمة السرية
      const tempPassword = Math.random().toString(36).slice(-8)
      const passwordHash = btoa(tempPassword) // مؤقت - يجب استخدام bcrypt

      const data = await userOperations.createUser({
        email: newCustomer.email,
        username: newCustomer.username,
        password_hash: passwordHash,
        name: newCustomer.name,
        phone: newCustomer.phone,
        role: 'customer',
        is_active: true,
        whatsapp_number: newCustomer.whatsapp_number,
        preferred_payment_method: newCustomer.preferred_payment_method
      })

      // إضافة للقائمة المحلية
      setCustomers(prev => [...prev, data])
      setFilteredCustomers(prev => [...prev, data])

      // إعادة تعيين النموذج
      setNewCustomer({
        name: '',
        email: '',
        username: '',
        phone: '',
        whatsapp_number: '',
        preferred_payment_method: 'vodafone_cash'
      })
      setShowAddCustomer(false)
      toast.success('تم إضافة العميل بنجاح')

    } catch (error) {
      console.error('Error adding customer:', error)
      toast.error('حدث خطأ أثناء إضافة العميل')
    } finally {
      setIsLoadingCustomers(false)
    }
  }

  if (isLoading || isLoadingCustomers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل العملاء...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">إدارة العملاء</h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={() => setShowAddCustomer(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة عميل
              </button>
              <button
                onClick={() => toast.success('سيتم تصدير البيانات')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 ml-2" />
                تصدير
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="بحث في العملاء..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Stats */}
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{customers.length}</div>
              <div className="text-sm text-blue-600">إجمالي العملاء</div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {customers.filter(c => c.is_active).length}
              </div>
              <div className="text-sm text-green-600">عملاء نشطين</div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {customers.reduce((sum, c) => sum + (c.total_spent || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-purple-600">إجمالي الإيرادات</div>
            </div>
          </div>
        </motion.div>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              {/* Customer Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {(customer.name || customer.username || customer.email).charAt(0)}
                    </span>
                  </div>
                  <div className="mr-3">
                    <h3 className="font-semibold text-gray-900">{customer.name || customer.username}</h3>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${customer.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>

              {/* Customer Info */}
              <div className="space-y-3 mb-6">
                {customer.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 ml-2" />
                    {customer.phone}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 ml-2" />
                  إجمالي الإنفاق: {(customer.total_spent || 0).toLocaleString()} جنيه
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 ml-2" />
                  انضم في: {new Date(customer.created_at).toLocaleDateString('ar-EG')}
                </div>
                {customer.last_login && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 ml-2" />
                    آخر دخول: {new Date(customer.last_login).toLocaleDateString('ar-EG')}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={() => setSelectedCustomer(customer)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  title="عرض التفاصيل"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openWhatsApp(customer.whatsapp_number || customer.phone || '', customer.name || customer.username || '')}
                  className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  title="واتساب"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openGoogleMessages(customer.phone || '', customer.name || customer.username || '')}
                  className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                  title="Google Messages"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteCustomer(customer.id)}
                  className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              لا توجد عملاء
            </h3>
            <p className="text-gray-600 mb-6">
              لم يتم العثور على عملاء مطابقين للبحث
            </p>
          </motion.div>
        )}

        {/* Customer Details Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setSelectedCustomer(null)} />
              
              <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-right align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    تفاصيل العميل
                  </h3>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الاسم
                      </label>
                      <div className="text-lg font-semibold">
                        {selectedCustomer.name || selectedCustomer.username}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        البريد الإلكتروني
                      </label>
                      <div className="text-lg">
                        {selectedCustomer.email}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        رقم الهاتف
                      </label>
                      <div className="text-lg">
                        {selectedCustomer.phone || 'غير محدد'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        إجمالي الإنفاق
                      </label>
                      <div className="text-lg font-semibold text-green-600">
                        {(selectedCustomer.total_spent || 0).toLocaleString()} جنيه
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        تاريخ التسجيل
                      </label>
                      <div className="text-lg">
                        {new Date(selectedCustomer.created_at).toLocaleDateString('ar-EG')}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        آخر دخول
                      </label>
                      <div className="text-lg">
                        {selectedCustomer.last_login ? new Date(selectedCustomer.last_login).toLocaleDateString('ar-EG') : 'لم يسجل دخول'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      حالة العميل
                    </label>
                    <button
                      onClick={() => toggleCustomerStatus(selectedCustomer.id)}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        selectedCustomer.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedCustomer.is_active ? 'نشط' : 'غير نشط'}
                    </button>
                  </div>

                  <div className="flex gap-4 pt-6 border-t">
                    <button
                      onClick={() => openWhatsApp(selectedCustomer.whatsapp_number || selectedCustomer.phone || '', selectedCustomer.name || selectedCustomer.username || '')}
                      className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <MessageCircle className="w-5 h-5 ml-2" />
                      واتساب
                    </button>
                    <button
                      onClick={() => openGoogleMessages(selectedCustomer.phone || '', selectedCustomer.name || selectedCustomer.username || '')}
                      className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                    >
                      <Phone className="w-5 h-5 ml-2" />
                      Google Messages
                    </button>
                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Customer Modal */}
        {showAddCustomer && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowAddCustomer(false)} />

              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-right align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    إضافة عميل جديد
                  </h3>
                  <button
                    onClick={() => setShowAddCustomer(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم *
                    </label>
                    <input
                      type="text"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="اسم العميل"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اسم المستخدم *
                    </label>
                    <input
                      type="text"
                      value={newCustomer.username}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="+201234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      رقم الواتساب
                    </label>
                    <input
                      type="tel"
                      value={newCustomer.whatsapp_number}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="+201234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      طريقة الدفع المفضلة
                    </label>
                    <select
                      value={newCustomer.preferred_payment_method}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, preferred_payment_method: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="vodafone_cash">فودافون كاش</option>
                      <option value="instapay">إنستا باي</option>
                      <option value="fawry">فوري</option>
                      <option value="whatsapp">واتساب</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowAddCustomer(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={addCustomer}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      إضافة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
