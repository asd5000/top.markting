// نظام الصلاحيات حسب الأدوار
export interface Permission {
  read: boolean
  write: boolean
  delete: boolean
}

export interface RolePermissions {
  // الصفحات الرئيسية
  dashboard: Permission
  
  // إدارة العقارات
  realEstate: Permission
  properties: Permission
  
  // إدارة الخدمات والتسويق
  services: Permission
  subServices: Permission
  orders: Permission
  
  // إدارة الباقات
  packages: Permission
  subscriptions: Permission
  
  // إدارة المديرين والنظام
  adminManagement: Permission
  systemSettings: Permission
  backupSystem: Permission
  contactInfo: Permission
  
  // إدارة المحتوى
  portfolio: Permission
  
  // التقارير والإحصائيات
  reports: Permission
}

// تعريف الصلاحيات لكل دور
export const ROLE_PERMISSIONS: Record<string, RolePermissions> = {
  // المدير العام - جميع الصلاحيات
  super_admin: {
    dashboard: { read: true, write: true, delete: true },
    realEstate: { read: true, write: true, delete: true },
    properties: { read: true, write: true, delete: true },
    services: { read: true, write: true, delete: true },
    subServices: { read: true, write: true, delete: true },
    orders: { read: true, write: true, delete: true },
    packages: { read: true, write: true, delete: true },
    subscriptions: { read: true, write: true, delete: true },
    adminManagement: { read: true, write: true, delete: true },
    systemSettings: { read: true, write: true, delete: true },
    backupSystem: { read: true, write: true, delete: true },
    contactInfo: { read: true, write: true, delete: true },
    portfolio: { read: true, write: true, delete: true },
    reports: { read: true, write: true, delete: true }
  },

  // مدير العقارات - العقارات فقط
  real_estate_manager: {
    dashboard: { read: true, write: false, delete: false },
    realEstate: { read: true, write: true, delete: true },
    properties: { read: true, write: true, delete: true },
    services: { read: false, write: false, delete: false },
    subServices: { read: false, write: false, delete: false },
    orders: { read: false, write: false, delete: false },
    packages: { read: false, write: false, delete: false },
    subscriptions: { read: false, write: false, delete: false },
    adminManagement: { read: false, write: false, delete: false },
    systemSettings: { read: false, write: false, delete: false },
    backupSystem: { read: false, write: false, delete: false },
    contactInfo: { read: false, write: false, delete: false },
    portfolio: { read: false, write: false, delete: false },
    reports: { read: true, write: false, delete: false }
  },

  // مدير التسويق - الخدمات فقط
  marketing_manager: {
    dashboard: { read: true, write: false, delete: false },
    realEstate: { read: false, write: false, delete: false },
    properties: { read: false, write: false, delete: false },
    services: { read: true, write: true, delete: true },
    subServices: { read: true, write: true, delete: true },
    orders: { read: true, write: true, delete: false },
    packages: { read: false, write: false, delete: false },
    subscriptions: { read: false, write: false, delete: false },
    adminManagement: { read: false, write: false, delete: false },
    systemSettings: { read: false, write: false, delete: false },
    backupSystem: { read: false, write: false, delete: false },
    contactInfo: { read: false, write: false, delete: false },
    portfolio: { read: true, write: true, delete: false },
    reports: { read: true, write: false, delete: false }
  },

  // مدير الباقات - الباقات فقط
  packages_manager: {
    dashboard: { read: true, write: false, delete: false },
    realEstate: { read: false, write: false, delete: false },
    properties: { read: false, write: false, delete: false },
    services: { read: false, write: false, delete: false },
    subServices: { read: false, write: false, delete: false },
    orders: { read: false, write: false, delete: false },
    packages: { read: true, write: true, delete: true },
    subscriptions: { read: true, write: true, delete: true },
    adminManagement: { read: false, write: false, delete: false },
    systemSettings: { read: false, write: false, delete: false },
    backupSystem: { read: false, write: false, delete: false },
    contactInfo: { read: false, write: false, delete: false },
    portfolio: { read: false, write: false, delete: false },
    reports: { read: true, write: false, delete: false }
  },

  // الدعم الفني - كل شيء عدا إدارة المديرين والإعدادات الحساسة
  support: {
    dashboard: { read: true, write: false, delete: false },
    realEstate: { read: true, write: true, delete: false },
    properties: { read: true, write: true, delete: false },
    services: { read: true, write: true, delete: false },
    subServices: { read: true, write: true, delete: false },
    orders: { read: true, write: true, delete: false },
    packages: { read: true, write: true, delete: false },
    subscriptions: { read: true, write: true, delete: false },
    adminManagement: { read: false, write: false, delete: false },
    systemSettings: { read: false, write: false, delete: false },
    backupSystem: { read: false, write: false, delete: false },
    contactInfo: { read: false, write: false, delete: false },
    portfolio: { read: true, write: true, delete: false },
    reports: { read: true, write: false, delete: false }
  }
}

// دالة للتحقق من الصلاحية
export function hasPermission(
  userRole: string, 
  resource: keyof RolePermissions, 
  action: keyof Permission
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole]
  if (!rolePermissions) return false
  
  const resourcePermission = rolePermissions[resource]
  if (!resourcePermission) return false
  
  return resourcePermission[action]
}

// دالة للحصول على الصفحات المسموحة للدور
export function getAllowedPages(userRole: string): string[] {
  const rolePermissions = ROLE_PERMISSIONS[userRole]
  if (!rolePermissions) return []
  
  const allowedPages: string[] = []
  
  // الصفحة الرئيسية متاحة للجميع
  if (rolePermissions.dashboard.read) {
    allowedPages.push('/admin')
  }
  
  // العقارات
  if (rolePermissions.realEstate.read) {
    allowedPages.push('/admin/real-estate')
  }
  
  // الخدمات
  if (rolePermissions.services.read) {
    allowedPages.push('/admin/services')
    allowedPages.push('/admin/sub-services')
    allowedPages.push('/admin/orders')
  }
  
  // الباقات
  if (rolePermissions.packages.read) {
    allowedPages.push('/admin/packages')
    allowedPages.push('/admin/subscriptions')
  }
  
  // إدارة المديرين
  if (rolePermissions.adminManagement.read) {
    allowedPages.push('/admin/manage-admins')
  }
  
  // إعدادات النظام
  if (rolePermissions.systemSettings.read) {
    allowedPages.push('/admin/site-settings')
  }
  
  // النسخ الاحتياطية
  if (rolePermissions.backupSystem.read) {
    allowedPages.push('/admin/backup-system')
  }
  
  // معلومات الاتصال
  if (rolePermissions.contactInfo.read) {
    allowedPages.push('/admin/contact-info')
  }
  
  // معرض الأعمال
  if (rolePermissions.portfolio.read) {
    allowedPages.push('/admin/portfolio')
  }
  
  return allowedPages
}

// دالة للحصول على عناصر القائمة الجانبية المسموحة
export function getAllowedSidebarItems(userRole: string) {
  const rolePermissions = ROLE_PERMISSIONS[userRole]
  if (!rolePermissions) return []
  
  const items = []
  
  // الصفحة الرئيسية
  if (rolePermissions.dashboard.read) {
    items.push({
      title: 'الصفحة الرئيسية',
      href: '/admin',
      icon: 'Home'
    })
  }
  
  // العقارات
  if (rolePermissions.realEstate.read) {
    items.push({
      title: 'إدارة العقارات',
      href: '/admin/real-estate',
      icon: 'Building'
    })
  }
  
  // الخدمات
  if (rolePermissions.services.read) {
    items.push({
      title: 'إدارة الخدمات',
      href: '/admin/services',
      icon: 'Settings'
    })
    items.push({
      title: 'الطلبات',
      href: '/admin/orders',
      icon: 'ShoppingCart'
    })
  }
  
  // الباقات
  if (rolePermissions.packages.read) {
    items.push({
      title: 'إدارة الباقات',
      href: '/admin/packages',
      icon: 'Package'
    })
  }
  
  // معرض الأعمال
  if (rolePermissions.portfolio.read) {
    items.push({
      title: 'معرض الأعمال',
      href: '/admin/portfolio',
      icon: 'Image'
    })
  }
  
  // إدارة المديرين
  if (rolePermissions.adminManagement.read) {
    items.push({
      title: 'إدارة المديرين',
      href: '/admin/manage-admins',
      icon: 'Users'
    })
  }
  
  // إعدادات النظام
  if (rolePermissions.systemSettings.read) {
    items.push({
      title: 'إعدادات الموقع',
      href: '/admin/site-settings',
      icon: 'Settings'
    })
  }
  
  // النسخ الاحتياطية
  if (rolePermissions.backupSystem.read) {
    items.push({
      title: 'النسخ الاحتياطية',
      href: '/admin/backup-system',
      icon: 'Database'
    })
  }
  
  // معلومات الاتصال
  if (rolePermissions.contactInfo.read) {
    items.push({
      title: 'معلومات الاتصال',
      href: '/admin/contact-info',
      icon: 'Phone'
    })
  }
  
  return items
}

// دالة للحصول على اسم الدور بالعربية
export function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    super_admin: 'مدير عام',
    real_estate_manager: 'مدير عقارات',
    marketing_manager: 'مدير تسويق',
    packages_manager: 'مدير باقات',
    support: 'دعم فني'
  }
  
  return roleNames[role] || role
}
