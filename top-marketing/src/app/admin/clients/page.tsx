'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Building2,
  Package,
  MoreVertical,
  Download,
  Upload
} from 'lucide-react'
import Header from '@/components/admin/Header'
import Sidebar from '@/components/admin/Sidebar'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  city: string
  joinDate: string
  totalSpent: number
  propertiesCount: number
  subscriptionsCount: number
  status: 'active' | 'inactive' | 'pending'
  lastActivity: string
  avatar?: string
}

export default function ClientsManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [showAddForm, setShowAddForm] = useState(false)

  const user = {
    name: 'أحمد محمد',
    email: 'admin@topmarketing.com',
    role: 'مدير عام'
  }

  // بيانات العملاء التجريبية
  const mockClients: Client[] = [
    {
      id: '1',
      name: 'محمد أحمد علي',
      email: 'mohamed@example.com',
      phone: '01012345678',
      city: 'القاهرة',
      joinDate: '2024-01-15',
      totalSpent: 15000,
      propertiesCount: 3,
      subscriptionsCount: 2,
      status: 'active',
      lastActivity: 'منذ يومين'
    },
    {
      id: '2',
      name: 'فاطمة محمود',
      email: 'fatma@example.com',
      phone: '01098765432',
      city: 'الجيزة',
      joinDate: '2024-02-20',
      totalSpent: 8500,
      propertiesCount: 1,
      subscriptionsCount: 1,
      status: 'active',
      lastActivity: 'منذ ساعة'
    },
    {
      id: '3',
      name: 'أحمد حسن',
      email: 'ahmed@example.com',
      phone: '01156789012',
      city: 'الإسكندرية',
      joinDate: '2024-03-10',
      totalSpent: 22000,
      propertiesCount: 5,
      subscriptionsCount: 3,
      status: 'active',
      lastActivity: 'منذ 3 أيام'
    },
    {
      id: '4',
      name: 'سارة عبدالله',
      email: 'sara@example.com',
      phone: '01234567890',
      city: 'المنصورة',
      joinDate: '2024-01-05',
      totalSpent: 5200,
      propertiesCount: 1,
      subscriptionsCount: 0,
      status: 'inactive',
      lastActivity: 'منذ أسبوع'
    },
    {
      id: '5',
      name: 'خالد محمد',
      email: 'khaled@example.com',
      phone: '01087654321',
      city: 'طنطا',
      joinDate: '2024-03-25',
      totalSpent: 0,
      propertiesCount: 0,
      subscriptionsCount: 0,
      status: 'pending',
      lastActivity: 'منذ يوم'
    }
  ]

  useEffect(() => {
    // محاكاة تحميل البيانات
    setTimeout(() => {
      setClients(mockClients)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm)
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'نشط'
      case 'inactive': return 'غير نشط'
      case 'pending': return 'معلق'
      default: return status
    }
  }

  const handleSelectClient = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    )
  }

  const handleSelectAll = () => {
    setSelectedClients(
      selectedClients.length === filteredClients.length 
        ? [] 
        : filteredClients.map(client => client.id)
    )
  }

  const deleteClient = (clientId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      setClients(clients.filter(client => client.id !== clientId))
    }
  }

  const stats = [
    { label: 'إجمالي العملاء', value: clients.length, color: 'text-blue-600' },
    { label: 'عملاء نشطون', value: clients.filter(c => c.status === 'active').length, color: 'text-green-600' },
    { label: 'عملاء جدد هذا الشهر', value: clients.filter(c => new Date(c.joinDate).getMonth() === new Date().getMonth()).length, color: 'text-purple-600' },
    { label: 'إجمالي الإيرادات', value: `${clients.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()} ج.م`, color: 'text-orange-600' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات العملاء...</p>
        </div>
      </div>
    )
  }

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
                    <Users className="w-8 h-8 ml-3" />
                    إدارة العملاء
                  </h1>
                  <p className="text-gray-600 mt-2">إدارة ومتابعة جميع عملاء النظام</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="btn border border-gray-300 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    تصدير
                  </button>
                  <button className="btn border border-gray-300 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    استيراد
                  </button>
                  <button 
                    onClick={() => setShowAddForm(true)}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة عميل جديد
                  </button>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="card">
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Search and Filter */}
              <div className="card mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="البحث عن عميل..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input pr-10"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="form-input"
                    >
                      <option value="all">جميع الحالات</option>
                      <option value="active">نشط</option>
                      <option value="inactive">غير نشط</option>
                      <option value="pending">معلق</option>
                    </select>
                    <button className="btn border border-gray-300 flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      فلترة
                    </button>
                  </div>
                </div>
              </div>

              {/* Clients Table */}
              <div className="card">
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th>العميل</th>
                        <th>معلومات التواصل</th>
                        <th>تاريخ الانضمام</th>
                        <th>إجمالي الإنفاق</th>
                        <th>العقارات</th>
                        <th>الاشتراكات</th>
                        <th>الحالة</th>
                        <th>آخر نشاط</th>
                        <th>إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.map((client) => (
                        <tr key={client.id} className="hover:bg-gray-50">
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedClients.includes(client.id)}
                              onChange={() => handleSelectClient(client.id)}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td>
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                                {client.name.charAt(0)}
                              </div>
                              <div className="mr-3">
                                <div className="font-medium text-gray-900">{client.name}</div>
                                <div className="text-sm text-gray-600">{client.city}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="text-sm">
                              <div className="flex items-center text-gray-900">
                                <Mail className="w-4 h-4 ml-1" />
                                {client.email}
                              </div>
                              <div className="flex items-center text-gray-600 mt-1">
                                <Phone className="w-4 h-4 ml-1" />
                                {client.phone}
                              </div>
                            </div>
                          </td>
                          <td className="text-sm text-gray-600">
                            {new Date(client.joinDate).toLocaleDateString('ar-EG')}
                          </td>
                          <td className="font-medium text-gray-900">
                            {client.totalSpent.toLocaleString()} ج.م
                          </td>
                          <td className="text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {client.propertiesCount}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {client.subscriptionsCount}
                            </span>
                          </td>
                          <td>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                              {getStatusLabel(client.status)}
                            </span>
                          </td>
                          <td className="text-sm text-gray-600">
                            {client.lastActivity}
                          </td>
                          <td>
                            <div className="flex items-center space-x-2">
                              <button className="p-1 text-blue-600 hover:text-blue-800" title="عرض التفاصيل">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-green-600 hover:text-green-800" title="تعديل">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => deleteClient(client.id)}
                                className="p-1 text-red-600 hover:text-red-800" 
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

                {filteredClients.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">لا توجد عملاء مطابقون للبحث</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Client Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">إضافة عميل جديد</h3>
              <form className="space-y-4">
                <div>
                  <label className="form-label">الاسم الكامل *</label>
                  <input type="text" className="form-input" required />
                </div>
                <div>
                  <label className="form-label">البريد الإلكتروني *</label>
                  <input type="email" className="form-input" required />
                </div>
                <div>
                  <label className="form-label">رقم الهاتف *</label>
                  <input type="tel" className="form-input" required />
                </div>
                <div>
                  <label className="form-label">المدينة</label>
                  <input type="text" className="form-input" />
                </div>
                <div>
                  <label className="form-label">الحالة</label>
                  <select className="form-input">
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                    <option value="pending">معلق</option>
                  </select>
                </div>
                <div className="flex items-center justify-end space-x-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="btn border border-gray-300"
                  >
                    إلغاء
                  </button>
                  <button type="submit" className="btn btn-primary">
                    إضافة العميل
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
