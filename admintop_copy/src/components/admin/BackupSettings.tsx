'use client'

import { useState } from 'react'
import { 
  Settings, 
  Clock, 
  Calendar, 
  HardDrive, 
  Save, 
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface BackupSettings {
  dailyEnabled: boolean
  dailyTime: string
  weeklyEnabled: boolean
  weeklyDay: string
  weeklyTime: string
  retentionDays: number
  retentionWeeks: number
  autoCleanup: boolean
  emailNotifications: boolean
  notificationEmail: string
}

export default function BackupSettings() {
  const [settings, setSettings] = useState<BackupSettings>({
    dailyEnabled: true,
    dailyTime: '02:00',
    weeklyEnabled: true,
    weeklyDay: '0', // Sunday
    weeklyTime: '03:00',
    retentionDays: 7,
    retentionWeeks: 4,
    autoCleanup: true,
    emailNotifications: false,
    notificationEmail: ''
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSave = async () => {
    setIsSaving(true)
    
    // محاكاة حفظ الإعدادات
    setTimeout(() => {
      setIsSaving(false)
      setSaveStatus('success')
      
      setTimeout(() => setSaveStatus('idle'), 3000)
    }, 1500)
  }

  const weekDays = [
    { value: '0', label: 'الأحد' },
    { value: '1', label: 'الاثنين' },
    { value: '2', label: 'الثلاثاء' },
    { value: '3', label: 'الأربعاء' },
    { value: '4', label: 'الخميس' },
    { value: '5', label: 'الجمعة' },
    { value: '6', label: 'السبت' }
  ]

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Settings className="w-5 h-5 ml-2" />
          إعدادات النسخ الاحتياطية
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Daily Backup Settings */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-900 flex items-center">
            <Clock className="w-4 h-4 ml-2" />
            النسخ اليومية
          </h3>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="dailyEnabled"
              checked={settings.dailyEnabled}
              onChange={(e) => setSettings(prev => ({ ...prev, dailyEnabled: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="dailyEnabled" className="mr-2 text-sm text-gray-700">
              تفعيل النسخ الاحتياطية اليومية
            </label>
          </div>

          {settings.dailyEnabled && (
            <div className="mr-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وقت النسخ اليومي
              </label>
              <input
                type="time"
                value={settings.dailyTime}
                onChange={(e) => setSettings(prev => ({ ...prev, dailyTime: e.target.value }))}
                className="block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>

        {/* Weekly Backup Settings */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-900 flex items-center">
            <Calendar className="w-4 h-4 ml-2" />
            النسخ الأسبوعية
          </h3>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="weeklyEnabled"
              checked={settings.weeklyEnabled}
              onChange={(e) => setSettings(prev => ({ ...prev, weeklyEnabled: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="weeklyEnabled" className="mr-2 text-sm text-gray-700">
              تفعيل النسخ الاحتياطية الأسبوعية
            </label>
          </div>

          {settings.weeklyEnabled && (
            <div className="mr-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  يوم النسخ الأسبوعي
                </label>
                <select
                  value={settings.weeklyDay}
                  onChange={(e) => setSettings(prev => ({ ...prev, weeklyDay: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {weekDays.map(day => (
                    <option key={day.value} value={day.value}>{day.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  وقت النسخ الأسبوعي
                </label>
                <input
                  type="time"
                  value={settings.weeklyTime}
                  onChange={(e) => setSettings(prev => ({ ...prev, weeklyTime: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Retention Settings */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-900 flex items-center">
            <HardDrive className="w-4 h-4 ml-2" />
            إعدادات الاحتفاظ
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الاحتفاظ بالنسخ اليومية (أيام)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.retentionDays}
                onChange={(e) => setSettings(prev => ({ ...prev, retentionDays: parseInt(e.target.value) }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الاحتفاظ بالنسخ الأسبوعية (أسابيع)
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={settings.retentionWeeks}
                onChange={(e) => setSettings(prev => ({ ...prev, retentionWeeks: parseInt(e.target.value) }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoCleanup"
              checked={settings.autoCleanup}
              onChange={(e) => setSettings(prev => ({ ...prev, autoCleanup: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="autoCleanup" className="mr-2 text-sm text-gray-700">
              تنظيف تلقائي للنسخ القديمة
            </label>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-900 flex items-center">
            <AlertTriangle className="w-4 h-4 ml-2" />
            إعدادات التنبيهات
          </h3>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="emailNotifications" className="mr-2 text-sm text-gray-700">
              إرسال تنبيهات بالبريد الإلكتروني
            </label>
          </div>

          {settings.emailNotifications && (
            <div className="mr-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                البريد الإلكتروني للتنبيهات
              </label>
              <input
                type="email"
                value={settings.notificationEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, notificationEmail: e.target.value }))}
                placeholder="admin@topmarketing.com"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>

        {/* Save Status */}
        {saveStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
              <span className="text-green-800">تم حفظ الإعدادات بنجاح!</span>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 ml-2" />
            )}
            {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </button>
        </div>
      </div>
    </div>
  )
}
