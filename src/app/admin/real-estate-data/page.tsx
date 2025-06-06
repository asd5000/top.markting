'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Home, 
  Phone, 
  Mail, 
  User,
  MapPin,
  DollarSign,
  Calendar,
  Search,
  Download,
  MessageCircle,
  Eye,
  X,
  Trash2,
  Plus
} from 'lucide-react'
import { useAuth, usePermissions } from '@/lib/auth/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { storageManager } from '@/lib/storage/local-storage'

export default function RealEstateDataPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { isAdmin } = usePermissions()
  const router = useRouter()
  
  const [clients, setClients] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('all')
  const [clientTypeFilter, setClientTypeFilter] = useState('all')
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [showClientModal, setShowClientModal] = useState(false)
  const [showAddClientModal, setShowAddClientModal] = useState(false)
  const [newClient, setNewClient] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'buyer',
    propertyType: 'apartment',
    budget: '',
    location: '',
    notes: ''
  })

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin())) {
      router.push('/auth/login')
      return
    }
  }, [user, isAuthenticated, isLoading, isAdmin, router])

  // Load clients from localStorage on component mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const savedClients = storageManager.getRealEstateClients()
    setClients(savedClients)
  }, [])

  // Save clients to localStorage whenever clients change
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (clients.length > 0) {
      storageManager.saveRealEstateClients(clients)
    }
  }, [clients])

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm) ||
                         (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (client.property && client.property.type && client.property.type.includes(searchTerm.toLowerCase())) ||
                         (client.property && client.property.title && client.property.title.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesPropertyType = propertyTypeFilter === 'all' ||
                                (client.property && client.property.type === propertyTypeFilter) ||
                                (client.requirements && client.requirements.propertyTypes && client.requirements.propertyTypes.includes(propertyTypeFilter))

    const matchesClientType = clientTypeFilter === 'all' || client.type === clientTypeFilter

    return matchesSearch && matchesPropertyType && matchesClientType
  })

  const deleteClient = (clientId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      setClients(prev => prev.filter(c => c.id !== clientId))
      toast.success('تم حذف العميل بنجاح')
    }
  }

  const addClient = () => {
    if (!newClient.name || !newClient.phone) {
      toast.error('يرجى ملء الحقول المطلوبة')
      return
    }

    const client = {
      id: `client-${Date.now()}`,
      name: newClient.name,
      phone: newClient.phone,
      email: newClient.email,
      type: newClient.type,
      created_at: new Date().toISOString(),
      property: newClient.type === 'seller' ? {
        type: newClient.propertyType,
        title: `${newClient.propertyType} في ${newClient.location}`,
        price: parseInt(newClient.budget) || 0,
        location: { governorate: newClient.location }
      } : undefined,
      requirements: newClient.type === 'buyer' ? {
        propertyTypes: [newClient.propertyType],
        budget: { max: parseInt(newClient.budget) || 0 },
        preferredLocations: [{ governorate: newClient.location }],
        notes: newClient.notes
      } : undefined,
      notes: newClient.notes
    }

    setClients(prev => [...prev, client])
    setNewClient({
      name: '',
      phone: '',
      email: '',
      type: 'buyer',
      propertyType: 'apartment',
      budget: '',
      location: '',
      notes: ''
    })
    setShowAddClientModal(false)
    toast.success('تم إضافة العميل بنجاح')
  }

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '')
    const message = `مرحباً ${name}، نتواصل معك بخصوص طلبك العقاري`
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const exportData = () => {
    const csvContent = [
      ['النوع', 'الاسم', 'الهاتف', 'البريد الإلكتروني', 'تاريخ التسجيل'].join(','),
      ...filteredClients.map(client => [
        client.type === 'seller' ? 'بائع' : 'مشتري',
        client.name,
        client.phone,
        client.email || '',
        new Date(client.created_at).toLocaleDateString('ar-EG')
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `real-estate-data-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    toast.success('تم تصدير البيانات بنجاح')
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
              <h1 className="text-2xl font-bold text-gray-900">عملاء التسويق العقاري</h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={() => setShowAddClientModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة عميل
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
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي العملاء</p>
                <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">البائعين</p>
                <p className="text-2xl font-bold text-green-600">{clients.filter(c => c.type === 'seller').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Home className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المشترين</p>
                <p className="text-2xl font-bold text-purple-600">{clients.filter(c => c.type === 'buyer').length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative lg:col-span-2">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="بحث بالاسم، الهاتف، نوع العقار..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Property Type Filter */}
            <div>
              <select
                value={propertyTypeFilter}
                onChange={(e) => setPropertyTypeFilter(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع أنواع العقارات</option>
                <option value="apartment">شقة</option>
                <option value="house">بيت</option>
                <option value="villa">فيلا</option>
                <option value="land">أرض</option>
                <option value="shop">محل</option>
              </select>
            </div>

            {/* Client Type Filter */}
            <div>
              <select
                value={clientTypeFilter}
                onChange={(e) => setClientTypeFilter(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع العملاء</option>
                <option value="seller">البائعين</option>
                <option value="buyer">المشترين</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Clients List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">قائمة العملاء ({filteredClients.length})</h3>
          </div>
          
          {filteredClients.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      العميل
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      النوع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="mr-4">
                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                            <div className="text-sm text-gray-500">{client.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          client.type === 'seller' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {client.type === 'seller' ? 'بائع' : 'مشتري'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(client.created_at).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => {
                              setSelectedClient(client)
                              setShowClientModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openWhatsApp(client.whatsapp || client.phone, client.name)}
                            className="text-green-600 hover:text-green-900"
                            title="واتساب"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteClient(client.id)}
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
              <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                لا توجد بيانات
              </h3>
              <p className="text-gray-600">
                لم يتم إرسال أي بيانات عقارية بعد
              </p>
            </div>
          )}
        </div>

        {/* Add Client Modal */}
        {showAddClientModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowAddClientModal(false)} />

              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-right align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    إضافة عميل عقاري جديد
                  </h3>
                  <button
                    onClick={() => setShowAddClientModal(false)}
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
                      value={newClient.name}
                      onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="اسم العميل"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      value={newClient.phone}
                      onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="+201234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نوع العميل
                    </label>
                    <select
                      value={newClient.type}
                      onChange={(e) => setNewClient(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="buyer">مشتري</option>
                      <option value="seller">بائع</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نوع العقار
                    </label>
                    <select
                      value={newClient.propertyType}
                      onChange={(e) => setNewClient(prev => ({ ...prev, propertyType: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="apartment">شقة</option>
                      <option value="house">بيت</option>
                      <option value="villa">فيلا</option>
                      <option value="land">أرض</option>
                      <option value="shop">محل</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {newClient.type === 'seller' ? 'السعر المطلوب' : 'الميزانية المتاحة'}
                    </label>
                    <input
                      type="number"
                      value={newClient.budget}
                      onChange={(e) => setNewClient(prev => ({ ...prev, budget: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="500000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      المنطقة المطلوبة
                    </label>
                    <input
                      type="text"
                      value={newClient.location}
                      onChange={(e) => setNewClient(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="القاهرة، الجيزة..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ملاحظات
                    </label>
                    <textarea
                      value={newClient.notes}
                      onChange={(e) => setNewClient(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="أي ملاحظات إضافية..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowAddClientModal(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={addClient}
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
