// Top Marketing Desktop App
class TopMarketingApp {
    constructor() {
        this.apiBase = 'http://localhost:3001/api';
        this.currentUser = null;
        this.token = localStorage.getItem('auth_token');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        
        // التحقق من حالة التطبيق المكتبي
        if (window.electronAPI) {
            console.log('تطبيق سطح المكتب جاهز');
            this.setupDesktopFeatures();
        }
    }
    
    setupEventListeners() {
        // تسجيل الدخول
        document.getElementById('login-btn').addEventListener('click', () => {
            this.showLoginModal();
        });
        
        document.getElementById('cancel-login').addEventListener('click', () => {
            this.hideLoginModal();
        });
        
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        // بدء الاستخدام
        document.getElementById('start-btn').addEventListener('click', () => {
            this.showDashboard();
        });
        
        // روابط التنقل
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('href').substring(1);
                this.navigateTo(page);
            });
        });
    }
    
    setupDesktopFeatures() {
        // إضافة اختصارات لوحة المفاتيح
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch(e.key) {
                    case 'r':
                        e.preventDefault();
                        location.reload();
                        break;
                    case 'q':
                        e.preventDefault();
                        if (window.electronAPI) {
                            window.electronAPI.app.quit();
                        }
                        break;
                }
            }
        });
        
        // تحديث حالة الاتصال
        this.updateConnectionStatus();
    }
    
    updateConnectionStatus() {
        const statusElement = document.getElementById('connection-status');
        statusElement.innerHTML = `
            <i data-lucide="hard-drive" class="w-4 h-4 ml-1"></i>
            قاعدة بيانات محلية
        `;
        lucide.createIcons();
    }
    
    async checkAuthStatus() {
        if (this.token) {
            try {
                const response = await this.apiCall('/system/info');
                if (response) {
                    this.showUserMenu();
                }
            } catch (error) {
                localStorage.removeItem('auth_token');
                this.token = null;
                // إخفاء زر لوحة التحكم عند فشل المصادقة
                const dashboardLink = document.getElementById('dashboard-link');
                if (dashboardLink) {
                    dashboardLink.classList.add('hidden');
                }
            }
        } else {
            // إخفاء زر لوحة التحكم إذا لم يكن هناك توكن
            const dashboardLink = document.getElementById('dashboard-link');
            if (dashboardLink) {
                dashboardLink.classList.add('hidden');
            }
        }
    }
    
    showLoginModal() {
        document.getElementById('login-modal').classList.remove('hidden');
        document.getElementById('username').focus();
    }
    
    hideLoginModal() {
        document.getElementById('login-modal').classList.add('hidden');
        document.getElementById('login-form').reset();
        document.getElementById('login-error').classList.add('hidden');
    }
    
    async handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorElement = document.getElementById('login-error');
        
        try {
            const response = await fetch(`${this.apiBase}/auth/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.token = data.token;
                this.currentUser = data.user;
                localStorage.setItem('auth_token', this.token);
                
                this.hideLoginModal();
                this.showUserMenu();
                this.showDashboard();
                
                this.showNotification('تم تسجيل الدخول بنجاح', 'success');
            } else {
                errorElement.textContent = data.error || 'خطأ في تسجيل الدخول';
                errorElement.classList.remove('hidden');
            }
        } catch (error) {
            errorElement.textContent = 'خطأ في الاتصال بالخادم';
            errorElement.classList.remove('hidden');
        }
    }
    
    showUserMenu() {
        document.getElementById('login-btn').classList.add('hidden');
        document.getElementById('user-menu').classList.remove('hidden');

        // إظهار زر لوحة التحكم عند تسجيل الدخول
        const dashboardLink = document.getElementById('dashboard-link');
        if (dashboardLink) {
            dashboardLink.classList.remove('hidden');
        }

        if (this.currentUser) {
            document.getElementById('user-name').textContent = this.currentUser.name;
        }
    }

    logout() {
        // إزالة التوكن والبيانات
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('auth_token');

        // إخفاء قائمة المستخدم وإظهار زر تسجيل الدخول
        document.getElementById('user-menu').classList.add('hidden');
        document.getElementById('login-btn').classList.remove('hidden');

        // إخفاء زر لوحة التحكم
        const dashboardLink = document.getElementById('dashboard-link');
        if (dashboardLink) {
            dashboardLink.classList.add('hidden');
        }

        // العودة للصفحة الرئيسية
        this.showWelcomePage();

        this.showNotification('تم تسجيل الخروج بنجاح', 'success');
    }
    
    async apiCall(endpoint, options = {}) {
        const url = `${this.apiBase}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }
    
    navigateTo(page) {
        // إزالة التحديد من جميع الروابط
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('text-blue-600', 'bg-blue-50');
            link.classList.add('text-gray-700');
        });
        
        // تحديد الرابط الحالي
        const currentLink = document.querySelector(`[href="#${page}"]`);
        if (currentLink) {
            currentLink.classList.remove('text-gray-700');
            currentLink.classList.add('text-blue-600', 'bg-blue-50');
        }
        
        // تحميل المحتوى
        this.loadPageContent(page);
    }
    
    async loadPageContent(page) {
        const mainContent = document.getElementById('main-content');
        
        try {
            switch (page) {
                case 'dashboard':
                    await this.loadDashboard();
                    break;
                case 'services':
                    await this.loadServices();
                    break;
                case 'real-estate':
                    await this.loadRealEstate();
                    break;
                case 'packages':
                    await this.loadPackages();
                    break;
                case 'orders':
                    await this.loadOrders();
                    break;
                default:
                    this.showWelcomePage();
            }
        } catch (error) {
            console.error('خطأ في تحميل الصفحة:', error);
            this.showError('خطأ في تحميل المحتوى');
        }
    }
    
    showWelcomePage() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = document.getElementById('welcome-page').outerHTML;
        
        // إعادة ربط الأحداث
        document.getElementById('start-btn').addEventListener('click', () => {
            this.showDashboard();
        });
    }
    
    async showDashboard() {
        this.navigateTo('dashboard');
    }
    
    async loadDashboard() {
        const mainContent = document.getElementById('main-content');
        
        try {
            const stats = await this.apiCall('/stats/overview');
            
            mainContent.innerHTML = `
                <div class="px-4 py-6">
                    <h1 class="text-2xl font-bold text-gray-900 mb-6">لوحة التحكم</h1>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div class="bg-white rounded-lg shadow p-6">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <i data-lucide="home" class="w-8 h-8 text-blue-600"></i>
                                </div>
                                <div class="mr-4">
                                    <p class="text-sm font-medium text-gray-500">العقارات</p>
                                    <p class="text-2xl font-semibold text-gray-900">${stats.properties || 0}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white rounded-lg shadow p-6">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <i data-lucide="shopping-cart" class="w-8 h-8 text-green-600"></i>
                                </div>
                                <div class="mr-4">
                                    <p class="text-sm font-medium text-gray-500">الطلبات</p>
                                    <p class="text-2xl font-semibold text-gray-900">${stats.orders || 0}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white rounded-lg shadow p-6">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <i data-lucide="briefcase" class="w-8 h-8 text-purple-600"></i>
                                </div>
                                <div class="mr-4">
                                    <p class="text-sm font-medium text-gray-500">الخدمات</p>
                                    <p class="text-2xl font-semibold text-gray-900">${stats.services || 0}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white rounded-lg shadow p-6">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <i data-lucide="package" class="w-8 h-8 text-orange-600"></i>
                                </div>
                                <div class="mr-4">
                                    <p class="text-sm font-medium text-gray-500">الباقات</p>
                                    <p class="text-2xl font-semibold text-gray-900">${stats.packages || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div class="bg-white rounded-lg shadow p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">الأنشطة الأخيرة</h3>
                            <div class="space-y-3">
                                <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <i data-lucide="plus-circle" class="w-5 h-5 text-green-600 ml-3"></i>
                                    <span class="text-sm text-gray-700">تم إضافة عقار جديد</span>
                                </div>
                                <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <i data-lucide="edit" class="w-5 h-5 text-blue-600 ml-3"></i>
                                    <span class="text-sm text-gray-700">تم تحديث خدمة التصميم</span>
                                </div>
                                <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <i data-lucide="check-circle" class="w-5 h-5 text-green-600 ml-3"></i>
                                    <span class="text-sm text-gray-700">تم اعتماد طلب جديد</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white rounded-lg shadow p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">معلومات النظام</h3>
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-sm text-gray-500">إصدار التطبيق</span>
                                    <span class="text-sm font-medium">1.0.0</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-sm text-gray-500">قاعدة البيانات</span>
                                    <span class="text-sm font-medium">SQLite محلية</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-sm text-gray-500">حالة النظام</span>
                                    <span class="text-sm font-medium text-green-600">يعمل بشكل طبيعي</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            lucide.createIcons();
        } catch (error) {
            this.showError('خطأ في تحميل لوحة التحكم');
        }
    }
    
    async loadServices() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="px-4 py-6">
                <h1 class="text-2xl font-bold text-gray-900 mb-6">إدارة الخدمات</h1>
                <div class="text-center py-12">
                    <i data-lucide="briefcase" class="w-16 h-16 mx-auto text-gray-400 mb-4"></i>
                    <p class="text-gray-500">صفحة إدارة الخدمات قيد التطوير</p>
                </div>
            </div>
        `;
        lucide.createIcons();
    }
    
    async loadRealEstate() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="px-4 py-6">
                <h1 class="text-2xl font-bold text-gray-900 mb-6">إدارة العقارات</h1>
                <div class="text-center py-12">
                    <i data-lucide="home" class="w-16 h-16 mx-auto text-gray-400 mb-4"></i>
                    <p class="text-gray-500">صفحة إدارة العقارات قيد التطوير</p>
                </div>
            </div>
        `;
        lucide.createIcons();
    }
    
    async loadPackages() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="px-4 py-6">
                <h1 class="text-2xl font-bold text-gray-900 mb-6">إدارة الباقات</h1>
                <div class="text-center py-12">
                    <i data-lucide="package" class="w-16 h-16 mx-auto text-gray-400 mb-4"></i>
                    <p class="text-gray-500">صفحة إدارة الباقات قيد التطوير</p>
                </div>
            </div>
        `;
        lucide.createIcons();
    }
    
    async loadOrders() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="px-4 py-6">
                <h1 class="text-2xl font-bold text-gray-900 mb-6">إدارة الطلبات</h1>
                <div class="text-center py-12">
                    <i data-lucide="shopping-cart" class="w-16 h-16 mx-auto text-gray-400 mb-4"></i>
                    <p class="text-gray-500">صفحة إدارة الطلبات قيد التطوير</p>
                </div>
            </div>
        `;
        lucide.createIcons();
    }
    
    showError(message) {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="px-4 py-6">
                <div class="text-center py-12">
                    <i data-lucide="alert-circle" class="w-16 h-16 mx-auto text-red-400 mb-4"></i>
                    <p class="text-red-500">${message}</p>
                </div>
            </div>
        `;
        lucide.createIcons();
    }
    
    showNotification(message, type = 'info') {
        // إنشاء إشعار بسيط
        const notification = document.createElement('div');
        notification.className = `fixed top-4 left-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TopMarketingApp();
});
