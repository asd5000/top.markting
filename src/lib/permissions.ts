// نظام إدارة الصلاحيات المتقدم (Role-Based Access Control)

export type UserRole =
  | 'super_admin'
  | 'marketing_manager'
  | 'packages_manager'
  | 'real_estate_manager'
  | 'support'

export interface AdminRole {
  role: string
  name: string
  permissions: string[]
  allowedRoutes: string[]
  redirectRoute: string
  menuItems: string[]
}

export interface Permission {
  module: string
  actions: string[]
}

export interface RolePermissions {
  [key: string]: Permission[]
}

// تعريف الأدوار والصلاحيات الجديد
export const ADMIN_ROLES: { [key: string]: AdminRole } = {
  super_admin: {
    role: 'super_admin',
    name: 'مدير عام',
    permissions: ['*'], // جميع الصلاحيات
    allowedRoutes: [
      '/admin',
      '/admin/services',
      '/admin/packages',
      '/admin/real-estate',
      '/admin/orders',
      '/admin/receipts',
      '/admin/manage-admins',
      '/admin/site-settings'
    ],
    redirectRoute: '/admin',
    menuItems: ['services', 'packages', 'real-estate', 'orders', 'receipts', 'manage-admins', 'site-settings']
  },

  marketing_manager: {
    role: 'marketing_manager',
    name: 'مدير التسويق',
    permissions: ['services', 'marketing'],
    allowedRoutes: [
      '/admin',
      '/admin/services'
    ],
    redirectRoute: '/admin/services',
    menuItems: ['services']
  },

  packages_manager: {
    role: 'packages_manager',
    name: 'مدير الباقات',
    permissions: ['packages'],
    allowedRoutes: [
      '/admin',
      '/admin/packages'
    ],
    redirectRoute: '/admin/packages',
    menuItems: ['packages']
  },

  real_estate_manager: {
    role: 'real_estate_manager',
    name: 'مدير العقارات',
    permissions: ['real_estate'],
    allowedRoutes: [
      '/admin',
      '/admin/real-estate'
    ],
    redirectRoute: '/admin/real-estate',
    menuItems: ['real-estate']
  },

  support: {
    role: 'support',
    name: 'الدعم الفني',
    permissions: ['receipts', 'support'],
    allowedRoutes: [
      '/admin',
      '/admin/receipts'
    ],
    redirectRoute: '/admin/receipts',
    menuItems: ['receipts']
  }
}

// تعريف الصلاحيات لكل دور (النظام القديم للتوافق)
export const ROLE_PERMISSIONS: RolePermissions = {
  // المدير العام - جميع الصلاحيات
  super_admin: [
    {
      module: 'dashboard',
      actions: ['view', 'manage']
    },
    {
      module: 'services',
      actions: ['view', 'create', 'edit', 'delete', 'manage']
    },
    {
      module: 'packages',
      actions: ['view', 'create', 'edit', 'delete', 'manage']
    },
    {
      module: 'real_estate',
      actions: ['view', 'create', 'edit', 'delete', 'manage']
    },
    {
      module: 'orders',
      actions: ['view', 'create', 'edit', 'delete', 'manage']
    },
    {
      module: 'users',
      actions: ['view', 'create', 'edit', 'delete', 'manage']
    },
    {
      module: 'admins',
      actions: ['view', 'create', 'edit', 'delete', 'manage']
    },
    {
      module: 'site_settings',
      actions: ['view', 'edit', 'manage']
    },
    {
      module: 'reports',
      actions: ['view', 'export', 'manage']
    }
  ],

  // مدير التسويق - الخدمات والتسويق
  marketing_manager: [
    {
      module: 'dashboard',
      actions: ['view']
    },
    {
      module: 'services',
      actions: ['view', 'create', 'edit', 'delete', 'manage']
    },
    {
      module: 'orders',
      actions: ['view', 'edit', 'manage']
    },
    {
      module: 'reports',
      actions: ['view']
    }
  ],

  // مدير الباقات - باقات إدارة الصفحات فقط
  packages_manager: [
    {
      module: 'dashboard',
      actions: ['view']
    },
    {
      module: 'packages',
      actions: ['view', 'create', 'edit', 'delete', 'manage']
    },
    {
      module: 'orders',
      actions: ['view']
    }
  ],

  // مدير العقارات - التسويق العقاري فقط
  real_estate_manager: [
    {
      module: 'dashboard',
      actions: ['view']
    },
    {
      module: 'real_estate',
      actions: ['view', 'create', 'edit', 'delete', 'manage']
    },
    {
      module: 'orders',
      actions: ['view']
    }
  ],

  // الدعم الفني - صلاحيات محدودة
  support: [
    {
      module: 'dashboard',
      actions: ['view']
    },
    {
      module: 'orders',
      actions: ['view', 'edit']
    }
  ]
}

// التحقق من وجود صلاحية معينة
export function hasPermission(
  userRole: UserRole, 
  module: string, 
  action: string
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole]
  
  if (!rolePermissions) {
    return false
  }

  const modulePermission = rolePermissions.find(p => p.module === module)
  
  if (!modulePermission) {
    return false
  }

  return modulePermission.actions.includes(action)
}

// الحصول على جميع الوحدات المسموحة للمستخدم
export function getAllowedModules(userRole: UserRole): string[] {
  const rolePermissions = ROLE_PERMISSIONS[userRole]
  
  if (!rolePermissions) {
    return []
  }

  return rolePermissions.map(p => p.module)
}

// التحقق من إمكانية الوصول لصفحة معينة
export function canAccessPage(userRole: UserRole, page: string): boolean {
  const pageModuleMap: { [key: string]: string } = {
    '/admin': 'dashboard',
    '/admin/services': 'services',
    '/admin/packages': 'packages',
    '/admin/real-estate': 'real_estate',
    '/admin/orders': 'orders',
    '/admin/manage-admins': 'admins',
    '/admin/site-settings': 'site_settings',
    '/admin/reports': 'reports'
  }

  const module = pageModuleMap[page]
  
  if (!module) {
    return false
  }

  return hasPermission(userRole, module, 'view')
}

// الحصول على قائمة الصفحات المسموحة
export function getAllowedPages(userRole: UserRole): string[] {
  const allPages = [
    '/admin',
    '/admin/services',
    '/admin/packages',
    '/admin/real-estate',
    '/admin/orders',
    '/admin/manage-admins',
    '/admin/site-settings',
    '/admin/reports'
  ]

  return allPages.filter(page => canAccessPage(userRole, page))
}

// الحصول على عنوان الدور بالعربية
export function getRoleLabel(role: UserRole): string {
  const roleLabels: { [key in UserRole]: string } = {
    super_admin: 'مدير عام',
    marketing_manager: 'مدير التسويق',
    packages_manager: 'مدير الباقات',
    real_estate_manager: 'مدير العقارات',
    support: 'دعم فني'
  }

  return roleLabels[role] || role
}

// الحصول على لون الدور
export function getRoleColor(role: UserRole): string {
  const roleColors: { [key in UserRole]: string } = {
    super_admin: 'bg-red-100 text-red-800',
    marketing_manager: 'bg-blue-100 text-blue-800',
    packages_manager: 'bg-purple-100 text-purple-800',
    real_estate_manager: 'bg-green-100 text-green-800',
    support: 'bg-gray-100 text-gray-800'
  }

  return roleColors[role] || 'bg-gray-100 text-gray-800'
}

// ===== دوال النظام الجديد المتقدم =====

// فحص صلاحية الوصول لمسار معين
export function hasRouteAccess(userRole: string, route: string): boolean {
  const roleConfig = ADMIN_ROLES[userRole]
  if (!roleConfig) return false

  // المدير العام له صلاحية الوصول لكل شيء
  if (userRole === 'super_admin') return true

  // فحص المسارات المسموحة
  return roleConfig.allowedRoutes.some(allowedRoute =>
    route === allowedRoute || route.startsWith(allowedRoute + '/')
  )
}

// فحص صلاحية معينة (النظام الجديد)
export function hasNewPermission(userRole: string, permission: string): boolean {
  const roleConfig = ADMIN_ROLES[userRole]
  if (!roleConfig) return false

  // المدير العام له جميع الصلاحيات
  if (roleConfig.permissions.includes('*')) return true

  return roleConfig.permissions.includes(permission)
}

// الحصول على المسار الافتراضي للدور
export function getDefaultRoute(userRole: string): string {
  const roleConfig = ADMIN_ROLES[userRole]
  return roleConfig?.redirectRoute || '/admin'
}

// الحصول على اسم الدور بالعربية (النظام الجديد)
export function getRoleName(userRole: string): string {
  const roleConfig = ADMIN_ROLES[userRole]
  return roleConfig?.name || 'غير محدد'
}

// فحص صحة الدور
export function isValidRole(role: string): boolean {
  return Object.keys(ADMIN_ROLES).includes(role)
}

// الحصول على قائمة المسارات المسموحة
export function getAllowedRoutes(userRole: string): string[] {
  const roleConfig = ADMIN_ROLES[userRole]
  return roleConfig?.allowedRoutes || []
}

// فحص ما إذا كان المستخدم يمكنه رؤية عنصر في القائمة
export function canViewMenuItem(userRole: string, menuItem: string): boolean {
  const roleConfig = ADMIN_ROLES[userRole]
  if (!roleConfig) return false

  // المدير العام يرى كل شيء
  if (userRole === 'super_admin') return true

  return roleConfig.menuItems.includes(menuItem)
}

// الحصول على عناصر القائمة المسموحة
export function getAllowedMenuItems(userRole: string): string[] {
  const roleConfig = ADMIN_ROLES[userRole]
  return roleConfig?.menuItems || []
}
