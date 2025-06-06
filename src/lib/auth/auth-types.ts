export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: 'customer' | 'admin' | 'super_admin'
  isActive: boolean
  createdAt: Date
  lastLogin?: Date
  avatar?: string
  permissions?: Permission[]
}

export interface Permission {
  id: string
  name: string
  description: string
  module: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

export interface AdminPermissions {
  canManageUsers: boolean
  canManageServices: boolean
  canManageOrders: boolean
  canManagePayments: boolean
  canViewReports: boolean
  canManageSettings: boolean
  canManageAdmins: boolean
}

export const defaultPermissions: Permission[] = [
  {
    id: 'manage_users',
    name: 'إدارة المستخدمين',
    description: 'إضافة وتعديل وحذف المستخدمين',
    module: 'users'
  },
  {
    id: 'manage_services',
    name: 'إدارة الخدمات',
    description: 'إدارة الخدمات والأسعار',
    module: 'services'
  },
  {
    id: 'manage_orders',
    name: 'إدارة الطلبات',
    description: 'عرض وإدارة طلبات العملاء',
    module: 'orders'
  },
  {
    id: 'manage_payments',
    name: 'إدارة المدفوعات',
    description: 'إدارة طرق الدفع والمعاملات',
    module: 'payments'
  },
  {
    id: 'view_reports',
    name: 'عرض التقارير',
    description: 'الوصول للتقارير والإحصائيات',
    module: 'reports'
  },
  {
    id: 'manage_settings',
    name: 'إدارة الإعدادات',
    description: 'تعديل إعدادات النظام',
    module: 'settings'
  },
  {
    id: 'manage_admins',
    name: 'إدارة المديرين',
    description: 'إضافة وإدارة المديرين والصلاحيات',
    module: 'admins'
  }
]

export interface Customer extends User {
  orders: Order[]
  totalSpent: number
  lastOrderDate?: Date
  preferredPaymentMethod?: string
  whatsappNumber?: string
}

export interface Admin extends User {
  permissions: Permission[]
  canAccessModule: (module: string) => boolean
  lastActivity?: Date
  createdBy?: string
}

export interface Order {
  id: string
  customerId: string
  serviceId: string
  serviceName: string
  quantity: number
  price: number
  totalAmount: number
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  deliveryDate?: Date
  requirements?: string
  attachments?: string[]
}

export interface PaymentMethod {
  id: string
  name: string
  type: 'vodafone_cash' | 'instapay' | 'fawry' | 'whatsapp' | 'bank_transfer'
  isActive: boolean
  details: {
    number?: string
    accountName?: string
    bankName?: string
    iban?: string
    instructions?: string
  }
  forCountries: string[]
  icon?: string
}

export interface SiteSettings {
  siteName: string
  siteDescription: string
  logo: string
  favicon: string
  primaryColor: string
  secondaryColor: string
  contactInfo: {
    phone: string
    email: string
    whatsapp: string
    address: string
  }
  socialMedia: {
    facebook?: string
    instagram?: string
    youtube?: string
    tiktok?: string
    telegram?: string
  }
  paymentMethods: PaymentMethod[]
  seoSettings: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
  maintenanceMode: boolean
  allowRegistration: boolean
}

export interface DashboardStats {
  totalCustomers: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
  activeServices: number
  newCustomersThisMonth: number
  revenueThisMonth: number
  topServices: Array<{
    serviceId: string
    serviceName: string
    orderCount: number
    revenue: number
  }>
  recentOrders: Order[]
  monthlyRevenue: Array<{
    month: string
    revenue: number
    orders: number
  }>
}

export interface Notification {
  id: string
  type: 'new_order' | 'payment_received' | 'new_customer' | 'system' | 'order_completed'
  title: string
  message: string
  isRead: boolean
  createdAt: Date
  userId?: string
  orderId?: string
  actionUrl?: string
  priority: 'low' | 'medium' | 'high'
}
