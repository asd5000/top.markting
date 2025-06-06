'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Phone, 
  Mail, 
  User,
  Calendar,
  Search,
  Download,
  MessageCircle,
  Eye,
  X,
  Trash2,
  Plus,
  Edit,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useAuth, usePermissions } from '@/lib/auth/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

interface Admin {
  id: string
  name: string
  email: string
  phone: string
  role: 'super_admin' | 'admin' | 'moderator'
  permissions: string[]
  isActive: boolean
  created_at: string
  last_login?: string
}

export default function AdminsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { isAdmin } = usePermissions()
  const router = useRouter()
  
  const [admins, setAdmins] = useState<Admin[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [showAddAdminModal, setShowAddAdminModal] = useState(false)

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin())) {
      router.push('/auth/login')
      return
    }
  }, [user, isAuthenticated, isLoading, isAdmin, router])

  // Load admins from localStorage on component mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const savedAdmins = JSON.parse(localStorage.getItem('topmarketing_admins') || '[]')
    
    // إضافة بيانات تجريبية إذا لم توجد بيانات
    if (savedAdmins.length === 0) {
      const sampleAdmins: Admin[] = [
        {
          id: 'admin-1',
          name: 'أحمد محمد المدير',
          email: 'admin@topmarketing.com',
          phone: '+201234567890',
          role: 'super_admin',
          permissions: ['all'],
          isActive: true,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        },
        {
          id: 'admin-2',
          name: 'فاطمة أحمد مشرفة',
          email: 'fatma@topmarketing.com',
          phone: '+201987654321',
          role: 'admin',
          permissions: ['customers', 'orders', 'real-estate'],
          isActive: true,
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          last_login: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'admin-3',
          name: 'محمد علي منسق',
          email: 'mohamed@topmarketing.com',
          phone: '+201555666777',
          role: 'moderator',
          permissions: ['customers', 'subscriptions'],
          isActive: false,
          created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          last_login: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
      
      localStorage.setItem('topmarketing_admins', JSON.stringify(sampleAdmins))
      setAdmins(sampleAdmins)
    } else {
      setAdmins(savedAdmins)
    }
  }, [])

  // Save admins to localStorage whenever admins change
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (admins.length > 0) {
      localStorage.setItem('topmarketing_admins', JSON.stringify(admins))
    }
  }, [admins])

  // Filter admins
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.phone.includes(searchTerm)
    return matchesSearch
  })

  const toggleAdminStatus = (adminId: string) => {
    setAdmins(prev => prev.map(admin => 
      admin.id === adminId 
        ? { ...admin, isActive: !admin.isActive }
        : admin
    ))
    toast.success('تم تحديث حالة المدير بنجاح')
  }

  const deleteAdmin = (adminId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المدير؟')) {
      setAdmins(prev => prev.filter(admin => admin.id !== adminId))
      toast.success('تم حذف المدير بنجاح')
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'super_admin': return 'مدير عام'
      case 'admin': return 'مدير'
      case 'moderator': return 'منسق'
      default: return 'غير محدد'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800'
      case 'admin': return 'bg-blue-100 text-blue-800'
      case 'moderator': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const exportData = () => {
    const csvContent = [
      ['الاسم', 'البريد الإلكتروني', 'الهاتف', 'الدور', 'الحالة', 'تاريخ الإنشاء'].join(','),
      ...filteredAdmins.map(admin => [
        admin.name,
        admin.email,
        admin.phone,
        getRoleText(admin.role),
        admin.isActive ? 'نشط' : 'غير نشط',
        new Date(admin.created_at).toLocaleDateString('ar-EG')
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `admins-${new Date().toISOString().split('T')[0]}.csv`
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
              <h1 className="text-2xl font-bold text-gray-900">إدارة المديرين</h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={() => setShowAddAdminModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة مدير
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
                <p className="text-sm font-medium text-gray-600">إجمالي المديرين</p>
                <p className="text-2xl font-bold text-gray-900">{admins.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المديرين النشطين</p>
                <p className="text-2xl font-bold text-green-600">{admins.filter(a => a.isActive).length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">غير النشطين</p>
                <p className="text-2xl font-bold text-red-600">{admins.filter(a => !a.isActive).length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="بحث في المديرين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Admins List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">قائمة المديرين ({filteredAdmins.length})</h3>
          </div>
          
          {filteredAdmins.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المدير
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الدور
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      آخر دخول
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Shield className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="mr-4">
                            <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                            <div className="text-sm text-gray-500">{admin.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(admin.role)}`}>
                          {getRoleText(admin.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          admin.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {admin.isActive ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {admin.last_login ? new Date(admin.last_login).toLocaleDateString('ar-EG') : 'لم يسجل دخول'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => {
                              setSelectedAdmin(admin)
                              setShowAdminModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleAdminStatus(admin.id)}
                            className={admin.isActive ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                            title={admin.isActive ? "إلغاء التفعيل" : "تفعيل"}
                          >
                            {admin.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => deleteAdmin(admin.id)}
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
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                لا توجد بيانات
              </h3>
              <p className="text-gray-600">
                لم يتم إضافة أي مديرين بعد
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
