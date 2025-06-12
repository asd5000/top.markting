'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Bell, 
  Search, 
  Settings, 
  User, 
  LogOut,
  Menu,
  ChevronDown,
  Home,
  MessageSquare,
  HelpCircle
} from 'lucide-react'

interface User {
  name: string
  email: string
  role: string
  avatar?: string
}

interface HeaderProps {
  user: User
  onMenuClick?: () => void
}

export default function Header({ user, onMenuClick }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    {
      id: 1,
      title: 'طلب عقار جديد',
      message: 'تم إضافة طلب عقار جديد للمراجعة',
      time: 'منذ 5 دقائق',
      unread: true
    },
    {
      id: 2,
      title: 'اشتراك جديد',
      message: 'عميل جديد اشترك في الباقة المتوسطة',
      time: 'منذ 15 دقيقة',
      unread: true
    },
    {
      id: 3,
      title: 'انتهاء اشتراك',
      message: 'سينتهي اشتراك أحد العملاء خلال 3 أيام',
      time: 'منذ ساعة',
      unread: false
    }
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link href="/admin" className="flex items-center mr-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">TM</span>
              </div>
              <div className="mr-3 hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Top Marketing</h1>
                <p className="text-xs text-gray-500">لوحة التحكم</p>
              </div>
            </Link>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-lg mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في النظام..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            <div className="hidden lg:flex items-center space-x-2">
              <Link
                href="/"
                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg"
                title="عرض الموقع"
              >
                <Home className="w-5 h-5" />
              </Link>
              <button
                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg"
                title="المساعدة"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">الإشعارات</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                          notification.unread ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {notification.time}
                            </p>
                          </div>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <Link
                      href="/admin/notifications"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      عرض جميع الإشعارات
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="py-2">
                    <Link
                      href="/admin/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4 ml-3" />
                      الملف الشخصي
                    </Link>
                    <Link
                      href="/admin/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 ml-3" />
                      الإعدادات
                    </Link>
                    <Link
                      href="/admin/messages"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <MessageSquare className="w-4 h-4 ml-3" />
                      الرسائل
                    </Link>
                  </div>
                  <div className="border-t border-gray-200 py-2">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4 ml-3" />
                      تسجيل الخروج
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="البحث في النظام..."
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </header>
  )
}
