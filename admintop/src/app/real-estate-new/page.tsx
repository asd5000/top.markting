'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  Building, Search, Plus, Edit, Trash2, Eye,
  MapPin, DollarSign, Home, Users, Phone, Mail,
  Save, X, MessageCircle, CheckCircle, AlertCircle,
  BarChart3, Filter, Calendar, Clock, Star,
  TrendingUp, TrendingDown, Activity, Target,
  UserCheck, UserX, FileText, Download, Share2,
  ArrowRight, ArrowUp, StickyNote, Bell, RefreshCw,
  ArrowLeft, LogOut
} from 'lucide-react'

interface Property {
  id: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  customer_whatsapp?: string
  property_type: 'apartment' | 'villa' | 'land' | 'shop' | 'house' | 'office'
  operation_type: 'seller' | 'buyer'
  title: string
  description?: string
  governorate: string
  city: string
  district?: string
  area?: number
  rooms?: number
  bathrooms?: number
  price: number
  price_negotiable: boolean
  sale_status?: 'new' | 'selling' | 'sold'
  internal_notes?: string
  follow_up_status?: 'pending' | 'contacted' | 'needs_follow_up'
  last_contact_date?: string
  contact_count?: number
  trust_rating?: number
  created_at: string
}

export default function NewRealEstateSystemPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Real Estate System States
  const [properties, setProperties] = useState<Property[]>([])
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterOperation, setFilterOperation] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterFollowUp, setFilterFollowUp] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | null
    text: string
  }>({ type: null, text: '' })

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_whatsapp: '',
    property_type: 'apartment',
    operation_type: 'seller',
    title: '',
    description: '',
    governorate: '',
    city: '',
    district: '',
    area: '',
    rooms: '',
    bathrooms: '',
    price: '',
    price_negotiable: false,
    sale_status: 'new',
    internal_notes: '',
    follow_up_status: 'pending'
  })

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (admin) {
      loadProperties()
    }
  }, [admin])

  const checkAuth = () => {
    try {
      const adminData = localStorage.getItem('admin')
      const adminSession = localStorage.getItem('adminSession')
      
      if (adminData || adminSession) {
        const adminInfo = JSON.parse(adminData || adminSession || '{}')
        setAdmin(adminInfo)
      } else {
        router.push('/admin/login')
        return
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/admin/login')
      return
    }
    
    setLoading(false)
  }

  const loadProperties = async () => {
    try {
      setLoading(true)
      console.log('🏠 تحميل العقارات...')

      const { data, error } = await supabase
        .from('real_estate')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ خطأ في تحميل العقارات:', error)
        setMessage({
          type: 'error',
          text: `خطأ في تحميل العقارات: ${error.message}`
        })
        return
      }

      console.log('✅ تم تحميل العقارات:', data)
      setProperties(data || [])

    } catch (error) {
      console.error('❌ خطأ عام:', error)
      setMessage({
        type: 'error',
        text: 'حدث خطأ أثناء تحميل العقارات'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin')
    localStorage.removeItem('adminSession')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من جلسة المدير...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  // Statistics calculations
  const stats = {
    total: properties.length,
    selling: properties.filter(p => p.sale_status === 'selling').length,
    sold: properties.filter(p => p.sale_status === 'sold').length,
    new: properties.filter(p => p.sale_status === 'new').length,
    sellers: properties.filter(p => p.operation_type === 'seller').length,
    buyers: properties.filter(p => p.operation_type === 'buyer').length,
    byType: {
      apartment: properties.filter(p => p.property_type === 'apartment').length,
      villa: properties.filter(p => p.property_type === 'villa').length,
      house: properties.filter(p => p.property_type === 'house').length,
      land: properties.filter(p => p.property_type === 'land').length,
      shop: properties.filter(p => p.property_type === 'shop').length,
      office: properties.filter(p => p.property_type === 'office').length,
    },
    sellersByType: {
      apartment: properties.filter(p => p.property_type === 'apartment' && p.operation_type === 'seller').length,
      villa: properties.filter(p => p.property_type === 'villa' && p.operation_type === 'seller').length,
      house: properties.filter(p => p.property_type === 'house' && p.operation_type === 'seller').length,
      land: properties.filter(p => p.property_type === 'land' && p.operation_type === 'seller').length,
      shop: properties.filter(p => p.property_type === 'shop' && p.operation_type === 'seller').length,
      office: properties.filter(p => p.property_type === 'office' && p.operation_type === 'seller').length,
    },
    buyersByType: {
      apartment: properties.filter(p => p.property_type === 'apartment' && p.operation_type === 'buyer').length,
      villa: properties.filter(p => p.property_type === 'villa' && p.operation_type === 'buyer').length,
      house: properties.filter(p => p.property_type === 'house' && p.operation_type === 'buyer').length,
      land: properties.filter(p => p.property_type === 'land' && p.operation_type === 'buyer').length,
      shop: properties.filter(p => p.property_type === 'shop' && p.operation_type === 'buyer').length,
      office: properties.filter(p => p.property_type === 'office' && p.operation_type === 'buyer').length,
    }
  }

  const getPropertyTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      apartment: 'شقة',
      villa: 'فيلا',
      house: 'بيت',
      land: 'أرض',
      shop: 'محل',
      office: 'مكتب'
    }
    return types[type] || type
  }

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg border-l border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div className="mr-3">
              <h1 className="text-lg font-bold text-gray-900">برنامج التسويق العقاري الجديد</h1>
              <p className="text-sm text-gray-600">نظام إدارة العقارات المتكامل</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-right transition-colors ${
                activeTab === 'dashboard' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5 ml-3" />
              🏠 لوحة التحكم
            </button>

            <button
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center px-4 py-3 rounded-lg text-right text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-5 h-5 ml-3" />
              ➕ إضافة عقار
            </button>

            <button
              onClick={() => setActiveTab('statistics')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-right transition-colors ${
                activeTab === 'statistics' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5 ml-3" />
              📊 الإحصائيات
            </button>

            <button
              onClick={() => setActiveTab('matching')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-right transition-colors ${
                activeTab === 'matching' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Target className="w-5 h-5 ml-3" />
              🔍 المطابقة
            </button>

            <button
              onClick={() => setActiveTab('selling')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-right transition-colors ${
                activeTab === 'selling' 
                  ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <TrendingUp className="w-5 h-5 ml-3" />
              🔁 جاري البيع ({stats.selling})
            </button>

            <button
              onClick={() => setActiveTab('sold')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-right transition-colors ${
                activeTab === 'sold' 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CheckCircle className="w-5 h-5 ml-3" />
              ✅ تم البيع ({stats.sold})
            </button>
          </nav>
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-gray-900">{admin.name}</p>
              <p className="text-xs text-gray-600">مدير عقارات</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Link
              href="/admin"
              className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة للوحة التحكم
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {activeTab === 'dashboard' && 'لوحة التحكم'}
                {activeTab === 'statistics' && 'الإحصائيات'}
                {activeTab === 'matching' && 'المطابقة الذكية'}
                {activeTab === 'selling' && 'العقارات جاري البيع'}
                {activeTab === 'sold' && 'العقارات المباعة'}
              </h2>
              <p className="text-gray-600">إجمالي العقارات: {stats.total}</p>
            </div>
            
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
              ✅ النظام الجديد يعمل!
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="mr-4">
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                      <p className="text-gray-600">إجمالي العقارات</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="mr-4">
                      <p className="text-2xl font-bold text-gray-900">{stats.selling}</p>
                      <p className="text-gray-600">جاري البيع</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="mr-4">
                      <p className="text-2xl font-bold text-gray-900">{stats.sold}</p>
                      <p className="text-gray-600">تم البيع</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="mr-4">
                      <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
                      <p className="text-gray-600">عقارات جديدة</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Type Statistics */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">إحصائيات حسب نوع العقار</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(stats.byType).map(([type, count]) => (
                    <div key={type} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{getPropertyTypeLabel(type)}</span>
                        <span className="text-2xl font-bold text-blue-600">{count}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>بائعين: {stats.sellersByType[type as keyof typeof stats.sellersByType]}</span>
                        <span>مشترين: {stats.buyersByType[type as keyof typeof stats.buyersByType]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Other tabs content would go here */}
          {activeTab !== 'dashboard' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {activeTab === 'statistics' && '📊 الإحصائيات المتقدمة'}
                {activeTab === 'matching' && '🔍 نظام المطابقة الذكي'}
                {activeTab === 'selling' && '🔁 العقارات جاري البيع'}
                {activeTab === 'sold' && '✅ العقارات المباعة'}
              </h3>
              <p className="text-gray-600">هذا القسم قيد التطوير...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
