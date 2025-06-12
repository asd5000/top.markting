'use client'

import { useState } from 'react'
import { Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'marketing' | 'support' | 'content'
  status: 'active' | 'inactive'
  createdAt: string
}

interface UserManagementProps {
  users?: User[]
}

export default function UserManagement({ users = [] }: UserManagementProps) {
  const [activeTab, setActiveTab] = useState('اسم المستخدم')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')

  const tabs = [
    'اسم المستخدم',
    'الحالة', 
    'الدور',
    'البريد الإلكتروني',
    'إجراءات'
  ]

  const roleLabels = {
    super_admin: 'مدير عام',
    marketing: 'مدير تسويق',
    support: 'دعم فني',
    content: 'مدير محتوى'
  }

  const statusLabels = {
    active: 'نشط',
    inactive: 'غير نشط'
  }

  const mockUsers: User[] = [
    {
      id: '1',
      name: 'أحمد محمد',
      email: 'ahmed@topmarketing.com',
      role: 'super_admin',
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: '2', 
      name: 'فاطمة علي',
      email: 'fatima@topmarketing.com',
      role: 'marketing',
      status: 'active',
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      name: 'محمد حسن',
      email: 'mohamed@topmarketing.com', 
      role: 'support',
      status: 'inactive',
      createdAt: '2024-01-25'
    }
  ]

  const displayUsers = users.length > 0 ? users : mockUsers

  const filteredUsers = displayUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === '' || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">إدارة المستخدمين</h1>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة مستخدم جديد
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } rounded-t-lg`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="ابحث عن مستخدم"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pr-10"
          />
        </div>

        {/* Role Filter */}
        <div className="relative">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="form-input w-48"
          >
            <option value="">جميع الأدوار</option>
            <option value="super_admin">مدير عام</option>
            <option value="marketing">مدير تسويق</option>
            <option value="support">دعم فني</option>
            <option value="content">مدير محتوى</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>اسم المستخدم</th>
                  <th>البريد الإلكتروني</th>
                  <th>الدور</th>
                  <th>الحالة</th>
                  <th>تاريخ الإنشاء</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="font-medium">{user.name}</td>
                    <td className="text-gray-600">{user.email}</td>
                    <td>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {statusLabels[user.status]}
                      </span>
                    </td>
                    <td className="text-gray-600">{user.createdAt}</td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-blue-600 hover:text-blue-800">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-green-600 hover:text-green-800">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-800">
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
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد مستخدمين</h3>
            <p className="mt-1 text-sm text-gray-500">ابدأ بإضافة مستخدم جديد</p>
            <div className="mt-6">
              <button 
                onClick={() => setShowAddForm(true)}
                className="btn btn-primary"
              >
                إضافة مستخدم جديد
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
                إضافة مستخدم جديد
              </h3>
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
                  <label className="form-label">الدور *</label>
                  <select className="form-input" required>
                    <option value="">اختر واحداً</option>
                    <option value="super_admin">مدير عام</option>
                    <option value="marketing">مدير تسويق</option>
                    <option value="support">دعم فني</option>
                    <option value="content">مدير محتوى</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">كلمة المرور *</label>
                  <input type="password" className="form-input" required />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    إضافة
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
