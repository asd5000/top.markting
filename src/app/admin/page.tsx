import { ShoppingCart, Package, Building, Settings } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">لوحة التحكم الرئيسية</h1>
        <p className="text-gray-600">مرحبا بك في لوحة التحكم الإدارية - تعمل بنجاح!</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a href="/admin/services" className="p-4 bg-white border rounded-lg text-center hover:bg-blue-50">
          <Settings className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-sm font-medium">إدارة الخدمات</p>
        </a>
        <a href="/admin/packages" className="p-4 bg-white border rounded-lg text-center hover:bg-purple-50">
          <Package className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="text-sm font-medium">إدارة الباقات</p>
        </a>
        <a href="/admin/real-estate" className="p-4 bg-white border rounded-lg text-center hover:bg-green-50">
          <Building className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-sm font-medium">التسويق العقاري</p>
        </a>
        <a href="/admin/orders" className="p-4 bg-white border rounded-lg text-center hover:bg-orange-50">
          <ShoppingCart className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <p className="text-sm font-medium">الطلبات</p>
        </a>
      </div>
    </div>
  )
}
