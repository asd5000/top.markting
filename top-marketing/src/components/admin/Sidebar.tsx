'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home,
  Users, 
  Building2, 
  Package, 
  BarChart3,
  Settings,
  FileText,
  MessageSquare,
  Calendar,
  CreditCard,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  X,
  Activity,
  Bell,
  Database
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface MenuItem {
  id: string
  label: string
  icon: any
  href?: string
  children?: MenuItem[]
  badge?: string
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard'])

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'لوحة التحكم',
      icon: Home,
      href: '/admin'
    },
    {
      id: 'real-estate',
      label: 'إدارة العقارات',
      icon: Building2,
      children: [
        { id: 'real-estate-list', label: 'قائمة العقارات', icon: Building2, href: '/admin/real-estate' },
        { id: 'real-estate-add', label: 'إضافة عقار', icon: Building2, href: '/admin/real-estate/add' },
        { id: 'real-estate-categories', label: 'تصنيفات العقارات', icon: Building2, href: '/admin/real-estate/categories' }
      ]
    },
    {
      id: 'clients',
      label: 'إدارة العملاء',
      icon: Users,
      children: [
        { id: 'clients-list', label: 'قائمة العملاء', icon: Users, href: '/admin/clients' },
        { id: 'clients-add', label: 'إضافة عميل', icon: Users, href: '/admin/clients/add' },
        { id: 'clients-groups', label: 'مجموعات العملاء', icon: Users, href: '/admin/clients/groups' }
      ]
    },
    {
      id: 'packages',
      label: 'إدارة الباقات',
      icon: Package,
      children: [
        { id: 'packages-list', label: 'قائمة الباقات', icon: Package, href: '/admin/packages' },
        { id: 'packages-subscriptions', label: 'الاشتراكات', icon: Package, href: '/admin/packages/subscriptions' },
        { id: 'packages-billing', label: 'الفواتير', icon: CreditCard, href: '/admin/packages/billing' }
      ]
    },
    {
      id: 'services',
      label: 'إدارة الخدمات',
      icon: Activity,
      children: [
        { id: 'services-list', label: 'قائمة الخدمات', icon: Activity, href: '/admin/services' },
        { id: 'services-orders', label: 'طلبات الخدمات', icon: Activity, href: '/admin/services/orders' },
        { id: 'services-categories', label: 'تصنيفات الخدمات', icon: Activity, href: '/admin/services/categories' }
      ]
    },
    {
      id: 'reports',
      label: 'التقارير والإحصائيات',
      icon: BarChart3,
      children: [
        { id: 'reports-overview', label: 'نظرة عامة', icon: BarChart3, href: '/admin/reports' },
        { id: 'reports-revenue', label: 'تقارير الإيرادات', icon: BarChart3, href: '/admin/reports/revenue' },
        { id: 'reports-clients', label: 'تقارير العملاء', icon: BarChart3, href: '/admin/reports/clients' },
        { id: 'reports-properties', label: 'تقارير العقارات', icon: BarChart3, href: '/admin/reports/properties' }
      ]
    },
    {
      id: 'communications',
      label: 'التواصل والرسائل',
      icon: MessageSquare,
      children: [
        { id: 'messages', label: 'الرسائل', icon: MessageSquare, href: '/admin/messages' },
        { id: 'notifications', label: 'الإشعارات', icon: Bell, href: '/admin/notifications' },
        { id: 'email-templates', label: 'قوالب البريد', icon: MessageSquare, href: '/admin/email-templates' }
      ]
    },
    {
      id: 'content',
      label: 'إدارة المحتوى',
      icon: FileText,
      children: [
        { id: 'pages', label: 'الصفحات', icon: FileText, href: '/admin/pages' },
        { id: 'blog', label: 'المدونة', icon: FileText, href: '/admin/blog' },
        { id: 'media', label: 'ملفات الوسائط', icon: FileText, href: '/admin/media' }
      ]
    },
    {
      id: 'system',
      label: 'إدارة النظام',
      icon: Settings,
      children: [
        { id: 'settings', label: 'الإعدادات العامة', icon: Settings, href: '/admin/settings' },
        { id: 'users', label: 'المستخدمين', icon: Shield, href: '/admin/users' },
        { id: 'permissions', label: 'الصلاحيات', icon: Shield, href: '/admin/permissions' },
        { id: 'backup', label: 'النسخ الاحتياطي', icon: Database, href: '/admin/backup' }
      ]
    },
    {
      id: 'help',
      label: 'المساعدة والدعم',
      icon: HelpCircle,
      href: '/admin/help'
    }
  ]

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const isActive = (href: string) => {
    return pathname === href
  }

  const isParentActive = (item: MenuItem) => {
    if (item.href && isActive(item.href)) return true
    if (item.children) {
      return item.children.some(child => child.href && isActive(child.href))
    }
    return false
  }

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.id)
    const active = isParentActive(item)

    if (hasChildren) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggleExpanded(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 text-right rounded-lg transition-colors ${
              active 
                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                : 'text-gray-700 hover:bg-gray-100'
            } ${level > 0 ? 'mr-4' : ''}`}
          >
            <div className="flex items-center">
              <item.icon className={`w-5 h-5 ml-3 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="mr-2 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>
          
          {isExpanded && (
            <div className="mt-1 space-y-1">
              {item.children?.map(child => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.id}
        href={item.href || '#'}
        onClick={onClose}
        className={`flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
          item.href && isActive(item.href)
            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
            : 'text-gray-700 hover:bg-gray-100'
        } ${level > 0 ? 'mr-4' : ''}`}
      >
        <item.icon className={`w-5 h-5 ml-3 ${
          item.href && isActive(item.href) ? 'text-blue-600' : 'text-gray-500'
        }`} />
        <span className="font-medium">{item.label}</span>
        {item.badge && (
          <span className="mr-auto px-2 py-1 text-xs bg-red-500 text-white rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 right-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Mobile Close Button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">القائمة</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500">Top Marketing Admin</p>
            <p className="text-xs text-gray-400">الإصدار 1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  )
}
