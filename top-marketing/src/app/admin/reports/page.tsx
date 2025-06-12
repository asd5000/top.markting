'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  Users,
  Building2,
  Package,
  DollarSign,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import Header from '@/components/admin/Header'
import Sidebar from '@/components/admin/Sidebar'

export default function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedReport, setSelectedReport] = useState('overview')

  const user = {
    name: 'أحمد محمد',
    email: 'admin@topmarketing.com',
    role: 'مدير عام'
  }

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const overviewStats = [
    {
      title: 'إجمالي الإيرادات',
      value: '125,000 ج.م',
      change: '+22%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'عدد العملاء الجدد',
      value: '156',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'العقارات المضافة',
      value: '89',
      change: '+8%',
      changeType: 'positive',
      icon: Building2,
      color: 'bg-purple-500'
    },
    {
      title: 'الاشتراكات النشطة',
      value: '342',
      change: '+15%',
      changeType: 'positive',
      icon: Package,
      color: 'bg-orange-500'
    }
  ]

  const revenueData = [
    { month: 'يناير', revenue: 85000, subscriptions: 45, properties: 23 },
    { month: 'فبراير', revenue: 92000, subscriptions: 52, properties: 31 },
    { month: 'مارس', revenue: 88000, subscriptions: 48, properties: 28 },
    { month: 'أبريل', revenue: 95000, subscriptions: 58, properties: 35 },
    { month: 'مايو', revenue: 102000, subscriptions: 62, properties: 42 },
    { month: 'يونيو', revenue: 125000, subscriptions: 68, properties: 48 }
  ]

  const propertyTypes = [
    { type: 'شقق', count: 245, percentage: 45 },
    { type: 'فيلل', count: 132, percentage: 24 },
    { type: 'محلات تجارية', count: 89, percentage: 16 },
    { type: 'أراضي', count: 67, percentage: 12 },
    { type: 'مكاتب', count: 23, percentage: 4 }
  ]

  const topClients = [
    { name: 'محمد أحمد علي', spent: 25000, properties: 5 },
    { name: 'فاطمة محمود', spent: 18500, properties: 3 },
    { name: 'أحمد حسن', spent: 15200, properties: 4 },
    { name: 'سارة عبدالله', spent: 12800, properties: 2 },
    { name: 'خالد محمد', spent: 9500, properties: 2 }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل التقارير...</p>
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
                    <BarChart3 className="w-8 h-8 ml-3" />
                    التقارير والإحصائيات
                  </h1>
                  <p className="text-gray-600 mt-2">تحليلات شاملة لأداء النظام</p>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="form-input"
                  >
                    <option value="week">هذا الأسبوع</option>
                    <option value="month">هذا الشهر</option>
                    <option value="quarter">هذا الربع</option>
                    <option value="year">هذا العام</option>
                  </select>
                  <button className="btn btn-primary flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    تصدير التقرير
                  </button>
                </div>
              </div>

              {/* Report Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'overview', label: 'نظرة عامة' },
                    { id: 'revenue', label: 'الإيرادات' },
                    { id: 'properties', label: 'العقارات' },
                    { id: 'clients', label: 'العملاء' },
                    { id: 'subscriptions', label: 'الاشتراكات' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedReport(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        selectedReport === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Overview Tab */}
              {selectedReport === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {overviewStats.map((stat, index) => (
                      <div key={index} className="card hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className={`flex items-center text-sm ${
                            stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stat.changeType === 'positive' ? (
                              <ArrowUpRight className="w-4 h-4 ml-1" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4 ml-1" />
                            )}
                            {stat.change}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Charts Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Chart */}
                    <div className="card">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <BarChart3 className="w-5 h-5 ml-2" />
                        الإيرادات الشهرية
                      </h3>
                      <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                        <div className="h-full flex items-end justify-between space-x-2">
                          {revenueData.map((data, index) => (
                            <div key={index} className="flex flex-col items-center flex-1">
                              <div 
                                className="bg-blue-500 rounded-t w-full"
                                style={{ height: `${(data.revenue / 125000) * 100}%` }}
                              ></div>
                              <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Property Types Chart */}
                    <div className="card">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <PieChart className="w-5 h-5 ml-2" />
                        توزيع أنواع العقارات
                      </h3>
                      <div className="space-y-3">
                        {propertyTypes.map((type, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div 
                                className="w-4 h-4 rounded-full ml-3"
                                style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                              ></div>
                              <span className="text-sm font-medium text-gray-900">{type.type}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-bold text-gray-900">{type.count}</span>
                              <span className="text-xs text-gray-500 mr-2">({type.percentage}%)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Top Clients */}
                  <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Users className="w-5 h-5 ml-2" />
                      أفضل العملاء
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>العميل</th>
                            <th>إجمالي الإنفاق</th>
                            <th>عدد العقارات</th>
                            <th>متوسط الإنفاق</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topClients.map((client, index) => (
                            <tr key={index}>
                              <td>
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                    {client.name.charAt(0)}
                                  </div>
                                  <span className="mr-3 font-medium">{client.name}</span>
                                </div>
                              </td>
                              <td className="font-medium text-green-600">
                                {client.spent.toLocaleString()} ج.م
                              </td>
                              <td>{client.properties}</td>
                              <td className="text-gray-600">
                                {Math.round(client.spent / client.properties).toLocaleString()} ج.م
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Other tabs content */}
              {selectedReport !== 'overview' && (
                <div className="card">
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      تقرير {selectedReport === 'revenue' ? 'الإيرادات' : 
                              selectedReport === 'properties' ? 'العقارات' :
                              selectedReport === 'clients' ? 'العملاء' : 'الاشتراكات'}
                    </h3>
                    <p className="text-gray-600">سيتم إضافة هذا التقرير قريباً</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
