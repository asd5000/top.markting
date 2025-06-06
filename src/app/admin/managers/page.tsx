'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  UserCheck,
  UserX,
  Settings,
  Mail,
  Phone,
  Calendar,
  X
} from 'lucide-react'
import { useAuth, usePermissions } from '@/lib/auth/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { userOperations, adminOperations } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'

interface Manager {
  id: string
  email: string
  name: string
  phone?: string
  role: 'admin' | 'manager'
  is_active: boolean
  created_at: string
  last_login?: string
  permissions: string[]
}

const availablePermissions = [
  { id: 'orders', name: 'إدارة الطلبات', description: 'عرض وتعديل الطلبات' },
  { id: 'customers', name: 'إدارة العملاء', description: 'عرض وتعديل بيانات العملاء' },
  { id: 'services', name: 'إدارة الخدمات', description: 'إضافة وتعديل الخدمات' },
  { id: 'reports', name: 'التقارير', description: 'عرض التقارير المالية' },
  { id: 'settings', name: 'إعدادات النظام', description: 'تعديل إعدادات الموقع' },
  { id: 'managers', name: 'إدارة المديرين', description: 'إضافة وإدارة المديرين' }
]

export default function AdminManagersPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { isAdmin } = usePermissions()
  const router = useRouter()
  // Mock managers data
  const mockManagers: Manager[] = [
    {
      id: 'admin-1',
      name: 'أحمد المدير العام',
      email: 'admin@topmarketing.com',
      phone: '+201068275557',
      role: 'admin',
      permissions: ['all'],
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      last_login: '2024-01-25T10:30:00Z'
    },
    {
      id: 'manager-1',
      name: 'سارة مديرة المبيعات',
      email: 'sara.manager@topmarketing.com',
      phone: '+201234567890',
      role: 'manager',
      permissions: ['orders', 'customers', 'reports'],
      is_active: true,
      created_at: '2024-01-05T00:00:00Z',
      last_login: '2024-01-24T14:20:00Z'
    },
    {
      id: 'manager-2',
      name: 'محمد مدير التسويق',
      email: 'mohamed.manager@topmarketing.com',
      phone: '+201987654321',
      role: 'manager',
      permissions: ['services', 'reports'],
      is_active: true,
      created_at: '2024-01-10T00:00:00Z',
      last_login: '2024-01-23T09:15:00Z'
    }
  ]

  const [managers, setManagers] = useState<Manager[]>(mockManagers)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null)
  const [isLoadingManagers, setIsLoadingManagers] = useState(false)
  const [newManager, setNewManager] = useState({
    email: '',
    name: '',
    phone: '',
    role: 'manager' as 'admin' | 'manager',
    permissions: [] as string[]
  })

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin())) {
      router.push('/auth/login')
      return
    }
  }, [user, isAuthenticated, isLoading, isAdmin, router])

  // تحميل المديرين من قاعدة البيانات
  useEffect(() => {
    const loadManagers = async () => {
      if (!isAuthenticated || !isAdmin()) return

      try {
        setIsLoadingManagers(true)
        const data = await userOperations.getUsers()

        if (data && data.length > 0) {
          // تحويل البيانات إلى تنسيق Manager مع تحميل الصلاحيات
          const managersData: Manager[] = await Promise.all(
            data.map(async (user) => {
              let permissions: string[] = []

              // تحميل الصلاحيات من الإعدادات
              try {
                const permissionsSetting = await adminOperations.getSetting(`user_permissions_${user.id}`)
                if (permissionsSetting?.value) {
                  permissions = permissionsSetting.value
                }
              } catch (error) {
                console.log('No permissions found for user:', user.id)
              }

              return {
                id: user.id,
                name: user.name || user.email,
                email: user.email,
                phone: user.phone || '',
                role: user.role as 'admin' | 'manager',
                permissions: user.role === 'admin' ? ['all'] : permissions,
                is_active: user.is_active ?? true,
                created_at: user.created_at || new Date().toISOString(),
                last_login: user.last_login
              }
            })
          )

          setManagers(managersData)
        }
      } catch (error) {
        console.error('Error loading managers:', error)
        toast.error('حدث خطأ أثناء تحميل المديرين')
      } finally {
        setIsLoadingManagers(false)
      }
    }

    loadManagers()
  }, [isAuthenticated, isAdmin])



  const filteredManagers = managers.filter(manager =>
    manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddManager = async () => {
    if (!newManager.email || !newManager.name) {
      toast.error('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    try {
      setIsLoadingManagers(true)

      const manager: Manager = {
        id: `manager-${Date.now()}`,
        name: newManager.name,
        email: newManager.email,
        phone: newManager.phone,
        role: newManager.role,
        permissions: newManager.role === 'admin' ? ['all'] : newManager.permissions,
        is_active: true,
        created_at: new Date().toISOString()
      }

      // إضافة المدير إلى قاعدة البيانات
      const data = await userOperations.createUser({
        email: manager.email,
        name: manager.name,
        phone: manager.phone,
        role: manager.role,
        is_active: manager.is_active
      })

      // حفظ الصلاحيات في إعدادات منفصلة
      if (manager.permissions.length > 0) {
        await adminOperations.setSetting(
          `user_permissions_${manager.id}`,
          manager.permissions,
          `صلاحيات المدير ${manager.name}`
        )
      }

      // تحديث القائمة المحلية بالبيانات الجديدة
      const newManagerData = data || manager
      setManagers(prev => [...prev, newManagerData])

      // إعادة تعيين النموذج
      setNewManager({
        email: '',
        name: '',
        phone: '',
        role: 'manager',
        permissions: []
      })
      setShowAddModal(false)
      toast.success(`تم إضافة المدير "${manager.name}" بنجاح!`)

    } catch (error) {
      console.error('Error adding manager:', error)
      toast.error('حدث خطأ أثناء إضافة المدير')
    } finally {
      setIsLoadingManagers(false)
    }
  }

  const toggleManagerStatus = async (managerId: string, currentStatus: boolean) => {
    try {
      setIsLoadingManagers(true)

      // تحديث في قاعدة البيانات
      await userOperations.updateUser(managerId, {
        is_active: !currentStatus
      })

      // تحديث القائمة المحلية
      setManagers(prev => prev.map(manager =>
        manager.id === managerId
          ? { ...manager, is_active: !currentStatus }
          : manager
      ))
      toast.success('تم تحديث حالة المدير')

    } catch (error) {
      console.error('Error toggling manager status:', error)
      toast.error('حدث خطأ أثناء تحديث حالة المدير')
    } finally {
      setIsLoadingManagers(false)
    }
  }

  const deleteManager = async (managerId: string) => {
    if (managerId === user?.id) {
      toast.error('لا يمكنك حذف حسابك الخاص')
      return
    }

    if (!confirm('هل أنت متأكد من حذف هذا المدير؟')) {
      return
    }

    try {
      setIsLoadingManagers(true)

      // حذف من قاعدة البيانات
      await userOperations.deleteUser(managerId)

      // تحديث القائمة المحلية
      setManagers(prev => prev.filter(manager => manager.id !== managerId))
      toast.success('تم حذف المدير بنجاح')

    } catch (error) {
      console.error('Error deleting manager:', error)
      toast.error('حدث خطأ أثناء حذف المدير')
    } finally {
      setIsLoadingManagers(false)
    }
  }

  const handlePermissionToggle = (permission: string) => {
    setNewManager(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  if (isLoading || isLoadingManagers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل المديرين...</p>
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
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة مدير
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث في المديرين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Managers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredManagers.map((manager, index) => (
            <motion.div
              key={manager.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              {/* Manager Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="mr-3">
                    <h3 className="font-semibold text-gray-900">{manager.name}</h3>
                    <p className="text-sm text-gray-500">{manager.role === 'admin' ? 'مدير عام' : 'مدير'}</p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${manager.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>

              {/* Manager Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 ml-2" />
                  {manager.email}
                </div>
                {manager.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 ml-2" />
                    {manager.phone}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 ml-2" />
                  انضم في: {new Date(manager.created_at).toLocaleDateString('ar-EG')}
                </div>
                {manager.last_login && (
                  <div className="flex items-center text-sm text-gray-600">
                    <UserCheck className="w-4 h-4 ml-2" />
                    آخر دخول: {new Date(manager.last_login).toLocaleDateString('ar-EG')}
                  </div>
                )}
              </div>

              {/* Permissions */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">الصلاحيات:</p>
                <div className="flex flex-wrap gap-1">
                  {manager.role === 'admin' ? (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      جميع الصلاحيات
                    </span>
                  ) : (
                    <>
                      {manager.permissions.length > 0 ? (
                        manager.permissions.slice(0, 2).map((permission) => (
                          <span
                            key={permission}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {availablePermissions.find(p => p.id === permission)?.name}
                          </span>
                        ))
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          لا توجد صلاحيات
                        </span>
                      )}
                      {manager.permissions.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{manager.permissions.length - 2}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={() => setSelectedManager(manager)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  title="عرض التفاصيل"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleManagerStatus(manager.id, manager.is_active)}
                  className={`flex-1 py-2 px-3 rounded-lg transition-colors flex items-center justify-center ${
                    manager.is_active
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                  title={manager.is_active ? 'إيقاف' : 'تفعيل'}
                >
                  {manager.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                </button>
                {manager.id !== user?.id && (
                  <button
                    onClick={() => deleteManager(manager.id)}
                    className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredManagers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              لا توجد مديرين
            </h3>
            <p className="text-gray-600 mb-6">
              لم يتم العثور على مديرين مطابقين للبحث
            </p>
          </motion.div>
        )}

        {/* Add Manager Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowAddModal(false)} />
              
              <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-right align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    إضافة مدير جديد
                  </h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="form-label">
                        الاسم الكامل *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={newManager.name}
                        onChange={(e) => setNewManager(prev => ({ ...prev, name: e.target.value }))}
                        className="form-input"
                        placeholder="أدخل الاسم الكامل"
                        required
                        disabled={isLoadingManagers}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="form-label">
                        البريد الإلكتروني *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={newManager.email}
                        onChange={(e) => setNewManager(prev => ({ ...prev, email: e.target.value }))}
                        className="form-input"
                        placeholder="example@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="form-label">
                        رقم الهاتف
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={newManager.phone}
                        onChange={(e) => setNewManager(prev => ({ ...prev, phone: e.target.value }))}
                        className="form-input"
                        placeholder="+201xxxxxxxxx"
                      />
                    </div>

                    <div>
                      <label htmlFor="role" className="form-label">
                        نوع المدير
                      </label>
                      <select
                        id="role"
                        value={newManager.role}
                        onChange={(e) => setNewManager(prev => ({ ...prev, role: e.target.value as 'admin' | 'manager' }))}
                        className="form-input"
                      >
                        <option value="manager">مدير</option>
                        <option value="admin">مدير عام</option>
                      </select>
                    </div>
                  </div>

                  {/* Permissions */}
                  {newManager.role === 'manager' && (
                    <div>
                      <label className="form-label">الصلاحيات</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {availablePermissions.map((permission) => (
                          <label
                            key={permission.id}
                            className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                              newManager.permissions.includes(permission.id)
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={newManager.permissions.includes(permission.id)}
                              onChange={() => handlePermissionToggle(permission.id)}
                              className="mt-1 ml-3"
                            />
                            <div>
                              <div className="font-medium text-gray-900">{permission.name}</div>
                              <div className="text-sm text-gray-500">{permission.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submit Buttons */}
                  <div className="flex gap-4 pt-6 border-t">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleAddManager}
                      disabled={isLoadingManagers}
                      className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isLoadingManagers ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                          جاري الإضافة...
                        </>
                      ) : (
                        'إضافة المدير'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manager Details Modal */}
        {selectedManager && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setSelectedManager(null)} />

              <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-right align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    تفاصيل المدير
                  </h3>
                  <button
                    onClick={() => setSelectedManager(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <Shield className="w-10 h-10 text-blue-600" />
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <h4 className="text-xl font-semibold text-gray-900">{selectedManager.name}</h4>
                    <p className="text-gray-500">{selectedManager.role === 'admin' ? 'مدير عام' : 'مدير'}</p>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                      selectedManager.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedManager.is_active ? 'نشط' : 'غير نشط'}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-5 h-5 ml-3" />
                      <span>{selectedManager.email}</span>
                    </div>

                    {selectedManager.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-5 h-5 ml-3" />
                        <span>{selectedManager.phone}</span>
                      </div>
                    )}

                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 ml-3" />
                      <span>انضم في: {new Date(selectedManager.created_at).toLocaleDateString('ar-EG')}</span>
                    </div>

                    {selectedManager.last_login && (
                      <div className="flex items-center text-gray-600">
                        <UserCheck className="w-5 h-5 ml-3" />
                        <span>آخر دخول: {new Date(selectedManager.last_login).toLocaleDateString('ar-EG')}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <h5 className="font-medium text-gray-900 mb-3">الصلاحيات:</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedManager.role === 'admin' ? (
                        <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                          جميع الصلاحيات
                        </span>
                      ) : (
                        selectedManager.permissions.length > 0 ? (
                          selectedManager.permissions.map((permission) => (
                            <span
                              key={permission}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                            >
                              {availablePermissions.find(p => p.id === permission)?.name}
                            </span>
                          ))
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                            لا توجد صلاحيات
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t">
                  <button
                    onClick={() => setSelectedManager(null)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    إغلاق
                  </button>
                  <button
                    onClick={() => toggleManagerStatus(selectedManager.id, selectedManager.is_active)}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                      selectedManager.is_active
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {selectedManager.is_active ? 'إيقاف' : 'تفعيل'}
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
