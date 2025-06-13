'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import RouteGuard from '@/components/admin/RouteGuard'
import {
  UserPlus,
  Users,
  ArrowLeft,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  CheckCircle,
  Mail,
  Lock,
  User,
  Shield,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import Link from 'next/link'
import bcrypt from 'bcryptjs'

interface AdminForm {
  full_name: string
  email: string
  password: string
  role: string
}

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  is_active: boolean
  created_at: string
}

export default function ManageAdminsPage() {
  const [formData, setFormData] = useState<AdminForm>({
    full_name: '',
    email: '',
    password: '',
    role: 'admin'
  })

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | null
    text: string
  }>({ type: null, text: '' })

  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loadingAdmins, setLoadingAdmins] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [deletingAdmin, setDeletingAdmin] = useState<string | null>(null)

  // تحميل المشرفين الموجودين
  const loadAdmins = async () => {
    try {
      setLoadingAdmins(true)
      console.log('📋 Loading existing admins...')

      const { data: adminUsers, error } = await supabase
        .from('admins')
        .select('id, name, email, role, is_active, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading admins:', error)
        setMessage({
          type: 'error',
          text: `خطأ في تحميل المديرين: ${error.message}`
        })
      } else {
        console.log('✅ Admins loaded:', adminUsers)
        setAdmins(adminUsers || [])
      }
    } catch (error) {
      console.error('Error loading admins:', error)
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء تحميل المديرين'
      })
    } finally {
      setLoadingAdmins(false)
    }
  }

  // حذف مدير
  const deleteAdmin = async (adminId: string, adminName: string) => {
    if (!confirm(`هل أنت متأكد من حذف المدير "${adminName}"؟\n\nهذا الإجراء لا يمكن التراجع عنه.`)) {
      return
    }

    try {
      setDeletingAdmin(adminId)
      console.log('🗑️ Deleting admin:', adminId)

      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('id', adminId)

      if (error) {
        console.error('Error deleting admin:', error)
        setMessage({
          type: 'error',
          text: `فشل في حذف المدير: ${error.message}`
        })
      } else {
        console.log('✅ Admin deleted successfully')
        setMessage({
          type: 'success',
          text: `تم حذف المدير "${adminName}" بنجاح`
        })

        // إعادة تحميل القائمة
        await loadAdmins()
      }
    } catch (error) {
      console.error('Error deleting admin:', error)
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء حذف المدير'
      })
    } finally {
      setDeletingAdmin(null)
    }
  }

  // تعديل حالة المدير (تفعيل/إلغاء تفعيل)
  const toggleAdminStatus = async (adminId: string, currentStatus: boolean, adminName: string) => {
    try {
      console.log('🔄 Toggling admin status:', adminId, !currentStatus)

      const { error } = await supabase
        .from('admins')
        .update({ is_active: !currentStatus })
        .eq('id', adminId)

      if (error) {
        console.error('Error updating admin status:', error)
        setMessage({
          type: 'error',
          text: `فشل في تحديث حالة المدير: ${error.message}`
        })
      } else {
        console.log('✅ Admin status updated successfully')
        setMessage({
          type: 'success',
          text: `تم ${!currentStatus ? 'تفعيل' : 'إلغاء تفعيل'} المدير "${adminName}" بنجاح`
        })

        // إعادة تحميل القائمة
        await loadAdmins()
      }
    } catch (error) {
      console.error('Error updating admin status:', error)
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء تحديث حالة المدير'
      })
    }
  }

  // تعديل دور المدير
  const updateAdminRole = async (adminId: string, newRole: string, adminName: string) => {
    try {
      console.log('🔄 Updating admin role:', adminId, newRole)

      const { error } = await supabase
        .from('admins')
        .update({ role: newRole })
        .eq('id', adminId)

      if (error) {
        console.error('Error updating admin role:', error)
        setMessage({
          type: 'error',
          text: `فشل في تحديث دور المدير: ${error.message}`
        })
      } else {
        console.log('✅ Admin role updated successfully')
        setMessage({
          type: 'success',
          text: `تم تحديث دور المدير "${adminName}" بنجاح`
        })

        // إعادة تحميل القائمة
        await loadAdmins()
      }
    } catch (error) {
      console.error('Error updating admin role:', error)
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء تحديث دور المدير'
      })
    }
  }

  // فتح نافذة التعديل
  const openEditModal = (admin: AdminUser) => {
    setEditingAdmin(admin)
    setShowEditModal(true)
  }

  // إغلاق نافذة التعديل
  const closeEditModal = () => {
    setEditingAdmin(null)
    setShowEditModal(false)
  }

  // حفظ تعديلات المدير
  const saveAdminEdit = async (updatedData: Partial<AdminUser>) => {
    if (!editingAdmin) return

    try {
      console.log('💾 Saving admin edit:', editingAdmin.id, updatedData)

      const { error } = await supabase
        .from('admins')
        .update(updatedData)
        .eq('id', editingAdmin.id)

      if (error) {
        console.error('Error updating admin:', error)
        setMessage({
          type: 'error',
          text: `فشل في تحديث بيانات المدير: ${error.message}`
        })
      } else {
        console.log('✅ Admin updated successfully')
        setMessage({
          type: 'success',
          text: `تم تحديث بيانات المدير "${editingAdmin.name}" بنجاح`
        })

        // إغلاق النافذة وإعادة تحميل القائمة
        closeEditModal()
        await loadAdmins()
      }
    } catch (error) {
      console.error('Error updating admin:', error)
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء تحديث بيانات المدير'
      })
    }
  }

  // تحميل المشرفين عند تحميل الصفحة
  React.useEffect(() => {
    loadAdmins()
  }, [])

  // التحقق من صحة البيانات
  const validateForm = (): boolean => {
    if (!formData.full_name.trim()) {
      setMessage({ type: 'error', text: 'الاسم الكامل مطلوب' })
      return false
    }

    if (!formData.email.trim()) {
      setMessage({ type: 'error', text: 'البريد الإلكتروني مطلوب' })
      return false
    }

    // التحقق من صيغة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: 'error', text: 'صيغة البريد الإلكتروني غير صحيحة' })
      return false
    }

    if (!formData.password.trim()) {
      setMessage({ type: 'error', text: 'كلمة المرور مطلوبة' })
      return false
    }

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })
      return false
    }

    return true
  }

  // التحقق من وجود البريد الإلكتروني مسبقاً
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      console.log('🔍 Checking if email exists:', email)

      // التحقق من جدول admins
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('email')
        .eq('email', email.toLowerCase())

      console.log('👤 Admin check result:', { data: adminData, error: adminError })

      if (adminError) {
        console.error('Error checking email in admins:', adminError)
        return false
      }

      const emailExists = adminData && adminData.length > 0
      console.log('📧 Email exists:', emailExists)

      return emailExists
    } catch (error) {
      console.error('Error checking email:', error)
      return false
    }
  }

  // معالجة إرسال النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ type: null, text: '' })

    // التحقق من صحة البيانات
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      console.log('🚀 Starting admin creation process...')
      console.log('📋 Form data:', {
        name: formData.full_name,
        email: formData.email,
        role: formData.role
      })

      // التحقق من وجود البريد الإلكتروني
      const emailExists = await checkEmailExists(formData.email)
      if (emailExists) {
        console.log('❌ Email already exists')
        setMessage({ type: 'error', text: 'البريد الإلكتروني موجود مسبقاً' })
        setLoading(false)
        return
      }

      console.log('✅ Email is unique, proceeding...')

      // تشفير كلمة المرور
      const hashedPassword = await bcrypt.hash(formData.password, 10)

      // إعداد البيانات للحفظ في جدول admins
      const adminData = {
        name: formData.full_name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: hashedPassword,
        role: formData.role,
        is_active: true
      }

      console.log('📝 Final admin data for insertion:', {
        ...adminData,
        password: '[ENCRYPTED]'
      })

      // حفظ المشرف في جدول admins
      const { data: adminResult, error: adminError } = await supabase
        .from('admins')
        .insert(adminData)
        .select()
        .single()

      console.log('💾 Insert operation result:')
      console.log('- Data:', adminResult ? { ...adminResult, password: '[HIDDEN]' } : null)
      console.log('- Error:', adminError)

      if (adminError) {
        console.error('❌ Detailed error:', {
          message: adminError.message,
          details: adminError.details,
          hint: adminError.hint,
          code: adminError.code
        })
      }

      if (adminError) {
        console.error('❌ Failed to create admin:', adminError)
        setMessage({
          type: 'error',
          text: `فشل في إضافة المشرف: ${adminError.message}`
        })
        return
      }

      if (!adminResult) {
        console.error('❌ No data returned from insert')
        setMessage({
          type: 'error',
          text: 'فشل في إضافة المشرف: لم يتم إرجاع بيانات'
        })
        return
      }

      console.log('✅ Admin created successfully:', { ...adminResult, password: '[HIDDEN]' })

      // نجح الحفظ فعلياً
      console.log('🎉 Admin creation completed successfully!')
      setMessage({
        type: 'success',
        text: `تم إضافة المشرف "${adminData.name}" بنجاح! الرقم التعريفي: ${adminResult.id.slice(0, 8)}`
      })

      // مسح النموذج
      setFormData({
        full_name: '',
        email: '',
        password: '',
        role: 'support'
      })

      // إعادة تحميل قائمة المشرفين فوراً
      console.log('🔄 Reloading admins list...')
      await loadAdmins()

      console.log('✅ Process completed successfully!')

    } catch (error) {
      console.error('Unexpected error:', error)
      setMessage({ 
        type: 'error', 
        text: 'حدث خطأ غير متوقع أثناء إضافة المشرف' 
      })
    } finally {
      setLoading(false)
    }
  }

  // اختبار إدراج مشرف واحد
  const testSingleAdminInsert = async () => {
    try {
      console.log('🧪 Testing single admin insert...')
      setMessage({ type: null, text: '' })

      const testPassword = await bcrypt.hash('123456', 10)
      const testAdmin = {
        name: 'مشرف تجريبي',
        email: `test-${Date.now()}@topmarketing.com`,
        password: testPassword,
        role: 'support',
        is_active: true
      }

      console.log('📝 Test admin data:', { ...testAdmin, password: '[ENCRYPTED]' })

      const { data: result, error } = await supabase
        .from('admins')
        .insert(testAdmin)
        .select()
        .single()

      if (error) {
        console.error('❌ Test insert failed:', error)
        setMessage({
          type: 'error',
          text: `فشل اختبار الإدراج: ${error.message}`
        })
      } else {
        console.log('✅ Test insert successful:', { ...result, password: '[HIDDEN]' })
        setMessage({
          type: 'success',
          text: `✅ نجح اختبار الإدراج! ID: ${result.id.slice(0, 8)}`
        })

        // إعادة تحميل القائمة
        await loadAdmins()
      }

    } catch (error) {
      console.error('❌ Test insert error:', error)
      setMessage({
        type: 'error',
        text: `خطأ في اختبار الإدراج: ${error}`
      })
    }
  }

  // اختبار الاتصال بقاعدة البيانات
  const testDatabaseConnection = async () => {
    try {
      console.log('🔍 Testing database connection...')
      setMessage({ type: null, text: '' })

      // اختبار قراءة جدول admins
      const { data: admins, error: adminsError } = await supabase
        .from('admins')
        .select('id, name, email, role')
        .limit(5)

      console.log('👥 Admins table test:', { data: admins, error: adminsError })

      if (adminsError) {
        setMessage({
          type: 'error',
          text: `خطأ في الاتصال بجدول المديرين: ${adminsError.message}`
        })
        return
      }

      // اختبار إدراج وحذف سجل تجريبي
      const testPassword = await bcrypt.hash('test123', 10)
      const testAdmin = {
        name: 'اختبار الاتصال',
        email: `test-${Date.now()}@test.com`,
        password: testPassword,
        role: 'support',
        is_active: true
      }

      console.log('📝 Testing insert operation...')
      const { data: insertResult, error: insertError } = await supabase
        .from('admins')
        .insert(testAdmin)
        .select()
        .single()

      if (insertError) {
        setMessage({
          type: 'error',
          text: `خطأ في عملية الإدراج: ${insertError.message}`
        })
        return
      }

      console.log('✅ Insert test successful:', { ...insertResult, password: '[HIDDEN]' })

      // حذف السجل التجريبي
      console.log('🗑️ Cleaning up test record...')
      await supabase
        .from('admins')
        .delete()
        .eq('id', insertResult.id)

      setMessage({
        type: 'success',
        text: `✅ الاتصال بقاعدة البيانات يعمل بشكل صحيح! عدد المديرين: ${admins?.length || 0}`
      })

    } catch (error) {
      console.error('Database test failed:', error)
      setMessage({
        type: 'error',
        text: `فشل اختبار قاعدة البيانات: ${error}`
      })
    }
  }

  // إدراج البيانات الأولية
  const insertSeedData = async () => {
    try {
      console.log('🌱 Inserting seed data...')
      setMessage({ type: null, text: '' })

      const defaultPassword = await bcrypt.hash('123456', 10)

      const seedAdmins = [
        {
          email: 'admin@topmarketing.com',
          name: 'أحمد محمد - المدير العام',
          password: defaultPassword,
          role: 'super_admin',
          is_active: true
        },
        {
          email: 'marketing@topmarketing.com',
          name: 'سارة أحمد - مدير التسويق',
          password: defaultPassword,
          role: 'marketing_manager',
          is_active: true
        },
        {
          email: 'packages@topmarketing.com',
          name: 'عمر خالد - مدير الباقات',
          password: defaultPassword,
          role: 'packages_manager',
          is_active: true
        },
        {
          email: 'realestate@topmarketing.com',
          name: 'فاطمة حسن - مدير العقارات',
          password: defaultPassword,
          role: 'real_estate_manager',
          is_active: true
        },
        {
          email: 'support@topmarketing.com',
          name: 'محمد علي - الدعم الفني',
          password: defaultPassword,
          role: 'support',
          is_active: true
        }
      ]

      console.log('📝 Inserting seed admins:', seedAdmins.map(admin => ({ ...admin, password: '[ENCRYPTED]' })))

      // إدراج كل مدير بشكل منفصل لتجنب مشاكل upsert
      let insertedCount = 0
      let existingCount = 0

      for (const admin of seedAdmins) {
        try {
          // التحقق من وجود المدير
          const { data: existingAdmin } = await supabase
            .from('admins')
            .select('email')
            .eq('email', admin.email)
            .single()

          if (!existingAdmin) {
            // إدراج المدير الجديد
            const { error: insertError } = await supabase
              .from('admins')
              .insert([admin])

            if (insertError) {
              console.error(`❌ Error inserting ${admin.email}:`, insertError)
            } else {
              insertedCount++
              console.log(`✅ Inserted: ${admin.name}`)
            }
          } else {
            existingCount++
            console.log(`⚠️ Admin already exists: ${admin.email}`)
          }
        } catch (error) {
          console.error(`❌ Error processing ${admin.email}:`, error)
        }
      }

      // إعادة تحميل قائمة المشرفين
      await loadAdmins()

      setMessage({
        type: 'success',
        text: `✅ تم إدراج ${insertedCount} مديرين جدد، ${existingCount} موجودين مسبقاً. كلمة المرور الافتراضية: 123456`
      })

    } catch (error) {
      console.error('Seed data insertion failed:', error)
      setMessage({
        type: 'error',
        text: `فشل في إدراج البيانات الأولية: ${error}`
      })
    }
  }

  // معالجة تغيير قيم النموذج
  const handleInputChange = (field: keyof AdminForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // مسح الرسائل عند التعديل
    if (message.type) {
      setMessage({ type: null, text: '' })
    }
  }

  return (
    <RouteGuard>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-blue-600 ml-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">إدارة المشرفين</h1>
                <p className="text-gray-600">إضافة مشرف جديد للنظام</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={testSingleAdminInsert}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm"
              >
                اختبار إدراج مشرف
              </button>
              <button
                onClick={insertSeedData}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                إدراج البيانات الأولية
              </button>
              <button
                onClick={testDatabaseConnection}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                اختبار قاعدة البيانات
              </button>
              <button
                onClick={loadAdmins}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                تحديث القائمة
              </button>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto">
          {/* نموذج إضافة مشرف */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <UserPlus className="w-6 h-6 text-blue-600 ml-3" />
              <h2 className="text-xl font-bold text-gray-900">إضافة مشرف جديد</h2>
            </div>

            {/* رسائل النجاح والخطأ */}
            {message.type && (
              <div className={`mb-6 p-4 rounded-lg flex items-center ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 ml-2" />
                )}
                <span className={`text-sm font-medium ${
                  message.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {message.text}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* الاسم الكامل */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل *
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل الاسم الكامل للمشرف"
                    required
                  />
                </div>
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني *
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>

              {/* كلمة المرور */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور *
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full pr-10 pl-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل كلمة مرور قوية (6 أحرف على الأقل)"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  كلمة المرور يجب أن تكون 6 أحرف على الأقل
                </p>
              </div>

              {/* الدور */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الدور
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="super_admin">مدير عام (جميع الصلاحيات)</option>
                  <option value="marketing_manager">مدير التسويق (الخدمات والتسويق)</option>
                  <option value="packages_manager">مدير الباقات (باقات إدارة الصفحات)</option>
                  <option value="real_estate_manager">مدير العقارات (التسويق العقاري)</option>
                  <option value="support">الدعم الفني (محدود)</option>
                </select>
              </div>

              {/* زر الإرسال */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                  ) : (
                    <Save className="w-5 h-5 ml-2" />
                  )}
                  {loading ? 'جاري الحفظ...' : 'إضافة المشرف'}
                </button>
              </div>
            </form>
          </div>

          {/* إحصائيات سريعة */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600 ml-3" />
                <div>
                  <p className="text-sm text-blue-600">إجمالي المشرفين</p>
                  <p className="text-2xl font-bold text-blue-800">{admins.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600 ml-3" />
                <div>
                  <p className="text-sm text-green-600">المشرفين النشطين</p>
                  <p className="text-2xl font-bold text-green-800">
                    {admins.filter(admin => admin.is_active).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-purple-600 ml-3" />
                <div>
                  <p className="text-sm text-purple-600">المشرفين العامين</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {admins.filter(admin => admin.role === 'super_admin').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* معلومات إضافية */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 ml-2 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">ملاحظات مهمة:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>يتم الحفظ في جدول admins مع تشفير كلمة المرور</li>
                  <li>البريد الإلكتروني يجب أن يكون فريد</li>
                  <li>المشرف الجديد سيتمكن من تسجيل الدخول فوراً</li>
                  <li>استخدم زر "اختبار قاعدة البيانات" للتأكد من الاتصال</li>
                  <li>كلمة المرور الافتراضية للبيانات الأولية: 123456</li>
                </ul>
              </div>
            </div>
          </div>

          {/* قائمة المشرفين الموجودين */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-green-600 ml-2" />
                <h3 className="text-lg font-bold text-gray-900">المشرفين الموجودين</h3>
              </div>
              <button
                onClick={loadAdmins}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors"
              >
                تحديث
              </button>
            </div>

            <div className="p-6">
              {loadingAdmins ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">جاري تحميل المشرفين...</p>
                </div>
              ) : admins.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">لا يوجد مشرفين</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          الاسم
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          البريد الإلكتروني
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          الدور
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          الحالة
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          تاريخ الإنشاء
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          الإجراءات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {admins.map((admin) => (
                        <tr key={admin.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center ml-3">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                                <div className="text-xs text-gray-500">#{admin.id.slice(0, 8)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{admin.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              admin.role === 'super_admin'
                                ? 'bg-red-100 text-red-800'
                                : admin.role === 'marketing_manager'
                                ? 'bg-blue-100 text-blue-800'
                                : admin.role === 'packages_manager'
                                ? 'bg-purple-100 text-purple-800'
                                : admin.role === 'real_estate_manager'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {admin.role === 'super_admin' ? 'مدير عام' :
                               admin.role === 'marketing_manager' ? 'مدير تسويق' :
                               admin.role === 'packages_manager' ? 'مدير باقات' :
                               admin.role === 'real_estate_manager' ? 'مدير عقارات' :
                               admin.role === 'support' ? 'دعم فني' : admin.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              admin.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {admin.is_active ? 'نشط' : 'غير نشط'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(admin.created_at).toLocaleDateString('ar-EG')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              {/* تعديل الدور */}
                              <select
                                value={admin.role}
                                onChange={(e) => updateAdminRole(admin.id, e.target.value, admin.name)}
                                className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="super_admin">مدير عام</option>
                                <option value="marketing_manager">مدير تسويق</option>
                                <option value="packages_manager">مدير باقات</option>
                                <option value="real_estate_manager">مدير عقارات</option>
                                <option value="support">دعم فني</option>
                              </select>

                              {/* تفعيل/إلغاء تفعيل */}
                              <button
                                onClick={() => toggleAdminStatus(admin.id, admin.is_active, admin.name)}
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  admin.is_active
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                                title={admin.is_active ? 'إلغاء التفعيل' : 'تفعيل'}
                              >
                                {admin.is_active ? 'إلغاء تفعيل' : 'تفعيل'}
                              </button>

                              {/* تعديل */}
                              <button
                                onClick={() => openEditModal(admin)}
                                className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded text-xs font-medium"
                                title="تعديل البيانات"
                              >
                                تعديل
                              </button>

                              {/* حذف */}
                              <button
                                onClick={() => deleteAdmin(admin.id, admin.name)}
                                disabled={deletingAdmin === admin.id}
                                className="bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 px-2 py-1 rounded text-xs font-medium"
                                title="حذف المدير"
                              >
                                {deletingAdmin === admin.id ? 'جاري الحذف...' : 'حذف'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* نافذة التعديل المنبثقة */}
      {showEditModal && editingAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              تعديل بيانات المدير: {editingAdmin.name}
            </h3>

            <EditAdminForm
              admin={editingAdmin}
              onSave={saveAdminEdit}
              onCancel={closeEditModal}
            />
          </div>
        </div>
      )}
    </RouteGuard>
  )
}

// مكون نموذج تعديل المدير
function EditAdminForm({
  admin,
  onSave,
  onCancel
}: {
  admin: AdminUser
  onSave: (data: Partial<AdminUser>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: admin.name,
    email: admin.email,
    role: admin.role,
    is_active: admin.is_active
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* الاسم */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          الاسم الكامل
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* البريد الإلكتروني */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          البريد الإلكتروني
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* الدور */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          الدور
        </label>
        <select
          value={formData.role}
          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="super_admin">مدير عام (جميع الصلاحيات)</option>
          <option value="marketing_manager">مدير التسويق</option>
          <option value="packages_manager">مدير الباقات</option>
          <option value="real_estate_manager">مدير العقارات</option>
          <option value="support">الدعم الفني</option>
        </select>
      </div>

      {/* الحالة */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="mr-2 text-sm text-gray-700">المدير نشط</span>
        </label>
      </div>

      {/* أزرار الإجراءات */}
      <div className="flex justify-end space-x-3 space-x-reverse pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          إلغاء
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          حفظ التغييرات
        </button>
      </div>
    </form>
  )
}
