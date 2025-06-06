// Local Storage Management for Data Persistence
export class LocalStorageManager {
  private static instance: LocalStorageManager
  
  private constructor() {}
  
  static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager()
    }
    return LocalStorageManager.instance
  }

  // Services Management
  saveServices(services: any[]) {
    try {
      if (typeof window === 'undefined') return

      localStorage.setItem('topmarketing_services', JSON.stringify(services))
      // Trigger storage event for cross-tab synchronization
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'topmarketing_services',
        newValue: JSON.stringify(services)
      }))
    } catch (error) {
      console.error('Error saving services:', error)
    }
  }

  getServices(): any[] {
    try {
      if (typeof window === 'undefined') return []

      const services = localStorage.getItem('topmarketing_services')
      return services ? JSON.parse(services) : []
    } catch (error) {
      console.error('Error loading services:', error)
      return []
    }
  }

  // Customers Management
  saveCustomers(customers: any[]) {
    try {
      if (typeof window === 'undefined') return

      localStorage.setItem('topmarketing_customers', JSON.stringify(customers))
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'topmarketing_customers',
        newValue: JSON.stringify(customers)
      }))
    } catch (error) {
      console.error('Error saving customers:', error)
    }
  }

  getCustomers(): any[] {
    try {
      if (typeof window === 'undefined') return []

      const customers = localStorage.getItem('topmarketing_customers')
      const parsedCustomers = customers ? JSON.parse(customers) : []

      // إضافة بيانات تجريبية إذا لم توجد بيانات
      if (parsedCustomers.length === 0) {
        const sampleCustomers = [
          {
            id: 'customer-1',
            name: 'سارة أحمد محمد',
            email: 'sara@example.com',
            phone: '+201234567890',
            whatsapp: '+201234567890',
            address: 'القاهرة، مدينة نصر، الحي الأول',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            notes: 'عميلة مهتمة بخدمات التسويق الرقمي'
          },
          {
            id: 'customer-2',
            name: 'خالد محمود علي',
            email: 'khaled@example.com',
            phone: '+201987654321',
            whatsapp: '+201987654321',
            address: 'الجيزة، المهندسين، شارع التحرير',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            notes: 'صاحب شركة يريد تطوير موقع إلكتروني'
          },
          {
            id: 'customer-3',
            name: 'نورا حسن إبراهيم',
            email: 'nora@example.com',
            phone: '+201555666777',
            whatsapp: '+201555666777',
            address: 'الإسكندرية، سيدي جابر، شارع الجيش',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            notes: 'مهتمة بخدمات إدارة وسائل التواصل الاجتماعي'
          }
        ]

        this.saveCustomers(sampleCustomers)
        return sampleCustomers
      }

      return parsedCustomers
    } catch (error) {
      console.error('Error loading customers:', error)
      return []
    }
  }

  // Orders Management
  saveOrders(orders: any[]) {
    try {
      localStorage.setItem('topmarketing_orders', JSON.stringify(orders))
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'topmarketing_orders',
        newValue: JSON.stringify(orders)
      }))
    } catch (error) {
      console.error('Error saving orders:', error)
    }
  }

  getOrders(): any[] {
    try {
      const orders = localStorage.getItem('topmarketing_orders')
      const parsedOrders = orders ? JSON.parse(orders) : []

      // إضافة بيانات تجريبية إذا لم توجد بيانات
      if (parsedOrders.length === 0) {
        const sampleOrders = [
          {
            id: 'order-1',
            customer: {
              name: 'سارة أحمد محمد',
              email: 'sara@example.com',
              phone: '+201234567890'
            },
            service_name: 'تصميم موقع إلكتروني',
            quantity: 1,
            price: 5000,
            total_amount: 5000,
            status: 'processing',
            payment_status: 'paid',
            payment_method: 'فودافون كاش',
            payment_receipt_url: '/images/sample-receipt.jpg',
            requirements: 'موقع تجاري لبيع المنتجات اليدوية مع نظام دفع إلكتروني',
            admin_notes: 'تم البدء في التصميم، العميلة متعاونة جداً',
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'order-2',
            customer: {
              name: 'خالد محمود علي',
              email: 'khaled@example.com',
              phone: '+201987654321'
            },
            service_name: 'إدارة وسائل التواصل الاجتماعي',
            quantity: 1,
            price: 2000,
            total_amount: 2000,
            status: 'active',
            payment_status: 'paid',
            payment_method: 'إنستاباي',
            payment_receipt_url: '/images/sample-receipt2.jpg',
            requirements: 'إدارة صفحات فيسبوك وإنستجرام لشركة تقنية',
            admin_notes: 'الحملة تسير بشكل ممتاز، نتائج جيدة',
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'order-3',
            customer: {
              name: 'نورا حسن إبراهيم',
              email: 'nora@example.com',
              phone: '+201555666777'
            },
            service_name: 'تحسين محركات البحث SEO',
            quantity: 1,
            price: 3000,
            total_amount: 3000,
            status: 'pending',
            payment_status: 'pending',
            payment_method: 'فوري',
            payment_receipt_url: null,
            requirements: 'تحسين موقع شركة للظهور في نتائج البحث الأولى',
            admin_notes: 'في انتظار تأكيد الدفع من العميلة',
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
          }
        ]

        this.saveOrders(sampleOrders)
        return sampleOrders
      }

      return parsedOrders
    } catch (error) {
      console.error('Error loading orders:', error)
      return []
    }
  }

  // Managers Management
  saveManagers(managers: any[]) {
    try {
      localStorage.setItem('topmarketing_managers', JSON.stringify(managers))
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'topmarketing_managers',
        newValue: JSON.stringify(managers)
      }))
    } catch (error) {
      console.error('Error saving managers:', error)
    }
  }

  getManagers(): any[] {
    try {
      const managers = localStorage.getItem('topmarketing_managers')
      return managers ? JSON.parse(managers) : []
    } catch (error) {
      console.error('Error loading managers:', error)
      return []
    }
  }

  // Settings Management
  saveSettings(settings: any) {
    try {
      localStorage.setItem('topmarketing_settings', JSON.stringify(settings))
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'topmarketing_settings',
        newValue: JSON.stringify(settings)
      }))
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  getSettings(): any {
    try {
      const settings = localStorage.getItem('topmarketing_settings')
      return settings ? JSON.parse(settings) : null
    } catch (error) {
      console.error('Error loading settings:', error)
      return null
    }
  }

  // Real Estate Management
  saveRealEstateClients(clients: any[]) {
    try {
      localStorage.setItem('topmarketing_realestate_clients', JSON.stringify(clients))
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'topmarketing_realestate_clients',
        newValue: JSON.stringify(clients)
      }))
    } catch (error) {
      console.error('Error saving real estate clients:', error)
    }
  }

  getRealEstateClients(): any[] {
    try {
      const clients = localStorage.getItem('topmarketing_realestate_clients')
      const parsedClients = clients ? JSON.parse(clients) : []

      // إضافة بيانات تجريبية إذا لم توجد بيانات
      if (parsedClients.length === 0) {
        const sampleClients = [
          {
            id: 'seller-sample-1',
            type: 'seller',
            name: 'أحمد محمد علي',
            phone: '01012345678',
            whatsapp: '01012345678',
            email: 'ahmed@example.com',
            address: 'القاهرة، مصر الجديدة',
            notes: 'عميل مهتم ببيع شقة في مدينة نصر',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            property: {
              type: 'apartment',
              title: 'شقة 3 غرف في مدينة نصر',
              description: 'شقة واسعة ومشمسة في موقع متميز',
              price: 2500000,
              area: 150,
              location: {
                governorate: 'القاهرة',
                city: 'مدينة نصر',
                district: 'الحي السابع',
                street: 'شارع مصطفى النحاس'
              },
              specifications: {
                bedrooms: 3,
                bathrooms: 2,
                livingRooms: 1,
                floor: 5,
                totalFloors: 10,
                buildingAge: 8,
                condition: 'good',
                parking: true,
                garden: false,
                elevator: true,
                furnished: false
              },
              features: ['مكيف', 'بلكونة', 'أمن وحراسة'],
              status: 'available',
              listed_date: new Date().toISOString()
            }
          },
          {
            id: 'buyer-sample-1',
            type: 'buyer',
            name: 'فاطمة أحمد حسن',
            phone: '01098765432',
            whatsapp: '01098765432',
            email: 'fatma@example.com',
            address: 'الجيزة، المهندسين',
            notes: 'تبحث عن شقة في منطقة هادئة',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            requirements: {
              propertyTypes: ['apartment', 'villa'],
              budget: {
                min: 1500000,
                max: 3000000
              },
              preferredLocations: [
                { governorate: 'القاهرة' },
                { governorate: 'الجيزة' }
              ],
              specifications: {
                minArea: 120,
                maxArea: 200,
                minBedrooms: 2,
                maxBedrooms: 4,
                minBathrooms: 2,
                parking: true,
                garden: false,
                elevator: true,
                furnished: false,
                maxFloor: 8,
                maxBuildingAge: 15
              },
              urgency: 'medium',
              notes: 'أفضل الأدوار العلوية مع إطلالة جيدة'
            }
          },
          {
            id: 'seller-sample-2',
            type: 'seller',
            name: 'محمد عبد الرحمن',
            phone: '01155667788',
            whatsapp: '01155667788',
            email: 'mohamed@example.com',
            address: 'الإسكندرية، سموحة',
            notes: 'يريد بيع فيلا بسرعة',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            property: {
              type: 'villa',
              title: 'فيلا مستقلة في سموحة',
              description: 'فيلا فاخرة مع حديقة كبيرة',
              price: 4500000,
              area: 300,
              location: {
                governorate: 'الإسكندرية',
                city: 'سموحة',
                district: 'سموحة الجديدة',
                street: 'شارع الجامعة'
              },
              specifications: {
                bedrooms: 4,
                bathrooms: 3,
                livingRooms: 2,
                floor: 1,
                totalFloors: 2,
                buildingAge: 5,
                condition: 'excellent',
                parking: true,
                garden: true,
                elevator: false,
                furnished: true
              },
              features: ['حديقة كبيرة', 'مسبح', 'جراج لسيارتين', 'نظام أمان'],
              status: 'available',
              listed_date: new Date().toISOString()
            }
          }
        ]

        this.saveRealEstateClients(sampleClients)
        return sampleClients
      }

      return parsedClients
    } catch (error) {
      console.error('Error loading real estate clients:', error)
      return []
    }
  }

  saveRealEstateProperties(properties: any[]) {
    try {
      localStorage.setItem('topmarketing_realestate_properties', JSON.stringify(properties))
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'topmarketing_realestate_properties',
        newValue: JSON.stringify(properties)
      }))
    } catch (error) {
      console.error('Error saving real estate properties:', error)
    }
  }

  getRealEstateProperties(): any[] {
    try {
      const properties = localStorage.getItem('topmarketing_realestate_properties')
      return properties ? JSON.parse(properties) : []
    } catch (error) {
      console.error('Error loading real estate properties:', error)
      return []
    }
  }

  // Clear all data
  clearAllData() {
    try {
      localStorage.removeItem('topmarketing_services')
      localStorage.removeItem('topmarketing_customers')
      localStorage.removeItem('topmarketing_orders')
      localStorage.removeItem('topmarketing_managers')
      localStorage.removeItem('topmarketing_settings')
      localStorage.removeItem('topmarketing_realestate_clients')
      localStorage.removeItem('topmarketing_realestate_properties')
    } catch (error) {
      console.error('Error clearing data:', error)
    }
  }

  // Listen for storage changes
  onStorageChange(callback: (key: string, newValue: any) => void) {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key && event.key.startsWith('topmarketing_')) {
        try {
          const newValue = event.newValue ? JSON.parse(event.newValue) : null
          callback(event.key, newValue)
        } catch (error) {
          console.error('Error parsing storage change:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }
}

export const storageManager = LocalStorageManager.getInstance()
