'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  TrendingUp, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  BarChart3,
  PieChart,
  Download
} from 'lucide-react'

interface BackupStats {
  totalBackups: number
  successfulBackups: number
  failedBackups: number
  totalSize: string
  averageSize: string
  lastWeekBackups: number
  successRate: number
}

interface BackupActivity {
  date: string
  type: 'daily' | 'weekly' | 'manual'
  status: 'success' | 'failed'
  size: string
  duration: string
}

export default function BackupReport() {
  const [stats, setStats] = useState<BackupStats>({
    totalBackups: 0,
    successfulBackups: 0,
    failedBackups: 0,
    totalSize: '0 MB',
    averageSize: '0 MB',
    lastWeekBackups: 0,
    successRate: 0
  })

  const [recentActivity, setRecentActivity] = useState<BackupActivity[]>([])
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  useEffect(() => {
    loadBackupStats()
    loadRecentActivity()
  }, [])

  const loadBackupStats = () => {
    // محاكاة بيانات الإحصائيات
    setStats({
      totalBackups: 45,
      successfulBackups: 43,
      failedBackups: 2,
      totalSize: '1.8 GB',
      averageSize: '42.3 MB',
      lastWeekBackups: 7,
      successRate: 95.6
    })
  }

  const loadRecentActivity = () => {
    // محاكاة النشاط الأخير
    const activities: BackupActivity[] = [
      {
        date: '2024-12-12 02:00:00',
        type: 'daily',
        status: 'success',
        size: '45.2 MB',
        duration: '2m 15s'
      },
      {
        date: '2024-12-11 02:00:00',
        type: 'daily',
        status: 'success',
        size: '44.8 MB',
        duration: '2m 08s'
      },
      {
        date: '2024-12-10 14:30:00',
        type: 'manual',
        status: 'success',
        size: '42.1 MB',
        duration: '1m 55s'
      },
      {
        date: '2024-12-10 02:00:00',
        type: 'daily',
        status: 'failed',
        size: '0 MB',
        duration: '0m 30s'
      },
      {
        date: '2024-12-09 02:00:00',
        type: 'daily',
        status: 'success',
        size: '43.7 MB',
        duration: '2m 12s'
      }
    ]
    setRecentActivity(activities)
  }

  const generateDetailedReport = () => {
    setIsGeneratingReport(true)
    
    // محاكاة إنتاج التقرير
    setTimeout(() => {
      setIsGeneratingReport(false)
      // محاكاة تحميل التقرير
      alert('تم إنتاج التقرير المفصل بنجاح!')
    }, 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'daily':
        return 'يومي'
      case 'weekly':
        return 'أسبوعي'
      case 'manual':
        return 'يدوي'
      default:
        return 'غير محدد'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily':
        return 'bg-blue-100 text-blue-800'
      case 'weekly':
        return 'bg-green-100 text-green-800'
      case 'manual':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="w-5 h-5 ml-2" />
          تقرير النسخ الاحتياطية
        </h2>
        
        <button
          onClick={generateDetailedReport}
          disabled={isGeneratingReport}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center text-sm"
        >
          <Download className="w-4 h-4 ml-2" />
          {isGeneratingReport ? 'جاري الإنتاج...' : 'تقرير مفصل'}
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">إجمالي النسخ</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBackups}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">معدل النجاح</p>
              <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <PieChart className="w-6 h-6 text-purple-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">الحجم الإجمالي</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSize}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">متوسط الحجم</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageSize}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Rate Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">معدل نجاح النسخ الاحتياطية</h3>
        
        <div className="flex items-center space-x-6 space-x-reverse">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">نجحت ({stats.successfulBackups})</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">فشلت ({stats.failedBackups})</span>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${stats.successRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">النشاط الأخير</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {recentActivity.map((activity, index) => (
            <div key={index} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                  {getStatusIcon(activity.status)}
                  <div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
                        {getTypeLabel(activity.type)}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {activity.status === 'success' ? 'نجحت' : 'فشلت'}
                      </span>
                    </div>
                    <div className="flex items-center mt-1 space-x-4 space-x-reverse text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 ml-1" />
                        {new Date(activity.date).toLocaleDateString('ar-EG')}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 ml-1" />
                        {new Date(activity.date).toLocaleTimeString('ar-EG', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">{activity.size}</div>
                  <div className="text-xs text-gray-500">{activity.duration}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">ملخص الأداء</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">النسخ الأسبوع الماضي:</span>
            <span className="text-blue-700 mr-2">{stats.lastWeekBackups} نسخة</span>
          </div>
          <div>
            <span className="font-medium text-blue-800">معدل النجاح:</span>
            <span className="text-blue-700 mr-2">{stats.successRate}%</span>
          </div>
          <div>
            <span className="font-medium text-blue-800">متوسط الحجم:</span>
            <span className="text-blue-700 mr-2">{stats.averageSize}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
