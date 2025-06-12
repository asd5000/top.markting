'use client'

import { useState } from 'react'
import { 
  Home, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  FileText, 
  Settings, 
  Building2,
  Palette,
  Megaphone,
  Video,
  Database,
  Globe,
  Package,
  Receipt,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['services'])

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const menuItems = [
    {
      id: 'dashboard',
      name: 'لوحة التحكم',
      icon: Home,
      href: '/admin',
      active: true
    },
    {
      id: 'services',
      name: 'إدارة الخدمات',
      icon: Package,
      expandable: true,
      children: [
        { name: 'تصميم', icon: Palette, href: '/admin/services/design' },
        { name: 'تسويق', icon: Megaphone, href: '/admin/services/marketing' },
        { name: 'مونتاج', icon: Video, href: '/admin/services/video' },
        { name: 'سحب داتا', icon: Database, href: '/admin/services/data' },
        { name: 'موقع ويب', icon: Globe, href: '/admin/services/web' },
      ]
    },
    {
      id: 'orders',
      name: 'إدارة الطلبات',
      icon: ShoppingCart,
      href: '/admin/orders'
    },
    {
      id: 'clients',
      name: 'إدارة العملاء',
      icon: Users,
      href: '/admin/clients'
    },
    {
      id: 'subscriptions',
      name: 'اشتراكات الصفحات',
      icon: FileText,
      href: '/admin/subscriptions'
    },
    {
      id: 'real-estate',
      name: 'إدارة العقارات',
      icon: Building2,
      href: '/admin/real-estate'
    },
    {
      id: 'receipts',
      name: 'إدارة الإيصالات',
      icon: Receipt,
      href: '/admin/receipts'
    },
    {
      id: 'analytics',
      name: 'التقارير والإحصائيات',
      icon: BarChart3,
      href: '/admin/analytics'
    },
    {
      id: 'settings',
      name: 'إعدادات النظام',
      icon: Settings,
      href: '/admin/settings'
    }
  ]

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 right-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">القائمة الرئيسية</h2>
            <button 
              onClick={onClose}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-500"
            >
              ×
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <div key={item.id}>
                {item.expandable ? (
                  <div>
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 ml-3" />
                        {item.name}
                      </div>
                      {expandedItems.includes(item.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    
                    {expandedItems.includes(item.id) && item.children && (
                      <div className="mr-6 mt-2 space-y-1">
                        {item.children.map((child) => (
                          <a
                            key={child.name}
                            href={child.href}
                            className="flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100"
                          >
                            <child.icon className="w-4 h-4 ml-2" />
                            {child.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                      item.active
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5 ml-3" />
                    {item.name}
                  </a>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="text-xs text-gray-500 text-center">
              Top Marketing v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
