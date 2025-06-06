'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Palette, 
  Code, 
  TrendingUp, 
  Database, 
  Users, 
  Building,
  ExternalLink,
  Eye
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const categories = [
  { id: 'all', name: 'جميع الأعمال', icon: Eye },
  { id: 'design', name: 'التصميم', icon: Palette },
  { id: 'web', name: 'المواقع', icon: Code },
  { id: 'marketing', name: 'التسويق', icon: TrendingUp },
  { id: 'data', name: 'البيانات', icon: Database },
  { id: 'social', name: 'وسائل التواصل', icon: Users },
  { id: 'real-estate', name: 'العقارات', icon: Building }
]

const portfolioItems = [
  {
    id: 1,
    title: 'تصميم هوية بصرية لشركة تقنية',
    category: 'design',
    description: 'تصميم شعار وهوية بصرية متكاملة لشركة تقنية ناشئة',
    image: '/portfolio/design-1.jpg',
    tags: ['شعار', 'هوية بصرية', 'تقنية'],
    client: 'شركة تك سوليوشنز'
  },
  {
    id: 2,
    title: 'موقع إلكتروني لمطعم',
    category: 'web',
    description: 'تطوير موقع إلكتروني متجاوب لمطعم مع نظام طلبات أونلاين',
    image: '/portfolio/web-1.jpg',
    tags: ['موقع ويب', 'مطاعم', 'طلبات'],
    client: 'مطعم الذواقة'
  },
  {
    id: 3,
    title: 'حملة تسويقية لمتجر أزياء',
    category: 'marketing',
    description: 'حملة تسويقية شاملة على وسائل التواصل الاجتماعي',
    image: '/portfolio/marketing-1.jpg',
    tags: ['تسويق', 'أزياء', 'سوشيال ميديا'],
    client: 'متجر الأناقة'
  },
  {
    id: 4,
    title: 'استخراج بيانات السوق العقاري',
    category: 'data',
    description: 'جمع وتحليل بيانات أسعار العقارات في القاهرة',
    image: '/portfolio/data-1.jpg',
    tags: ['بيانات', 'عقارات', 'تحليل'],
    client: 'شركة العقارات المتميزة'
  },
  {
    id: 5,
    title: 'إدارة حسابات وسائل التواصل',
    category: 'social',
    description: 'إدارة وتنمية حسابات شركة على منصات التواصل الاجتماعي',
    image: '/portfolio/social-1.jpg',
    tags: ['إدارة حسابات', 'محتوى', 'تفاعل'],
    client: 'شركة الخدمات الطبية'
  },
  {
    id: 6,
    title: 'منصة تسويق عقاري',
    category: 'real-estate',
    description: 'تطوير منصة متكاملة لعرض وتسويق العقارات',
    image: '/portfolio/realestate-1.jpg',
    tags: ['عقارات', 'منصة', 'تسويق'],
    client: 'مجموعة العقارات الذهبية'
  },
  {
    id: 7,
    title: 'تصميم كتالوج منتجات',
    category: 'design',
    description: 'تصميم كتالوج احترافي لعرض منتجات الشركة',
    image: '/portfolio/design-2.jpg',
    tags: ['كتالوج', 'منتجات', 'طباعة'],
    client: 'شركة الصناعات الحديثة'
  },
  {
    id: 8,
    title: 'تطبيق جوال للتوصيل',
    category: 'web',
    description: 'تطوير تطبيق جوال لخدمات التوصيل السريع',
    image: '/portfolio/web-2.jpg',
    tags: ['تطبيق جوال', 'توصيل', 'خدمات'],
    client: 'شركة التوصيل السريع'
  },
  {
    id: 9,
    title: 'حملة إعلانية رقمية',
    category: 'marketing',
    description: 'حملة إعلانية متكاملة على جوجل وفيسبوك',
    image: '/portfolio/marketing-2.jpg',
    tags: ['إعلانات', 'جوجل', 'فيسبوك'],
    client: 'مركز التدريب المهني'
  }
]

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedItem, setSelectedItem] = useState<typeof portfolioItems[0] | null>(null)

  const filteredItems = activeCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="gradient-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              معرض أعمالنا
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              اكتشف مجموعة من أفضل المشاريع التي نفذناها لعملائنا
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-6 py-3 rounded-full font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <category.icon className="w-5 h-5 ml-2" />
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                onClick={() => setSelectedItem(item)}
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                    <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-8 h-8 mx-auto mb-2" />
                      <span className="text-sm font-medium">عرض التفاصيل</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    العميل: {item.client}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modal for Project Details */}
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-64 bg-gradient-to-br from-blue-500 to-purple-600"></div>
            
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedItem.title}
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {selectedItem.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">العميل</h4>
                  <p className="text-gray-600">{selectedItem.client}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">التصنيف</h4>
                  <p className="text-gray-600">
                    {categories.find(cat => cat.id === selectedItem.category)?.name}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">التقنيات المستخدمة</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  إغلاق
                </button>
                <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <ExternalLink className="w-5 h-5 ml-2" />
                  مشاهدة المشروع
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* CTA Section */}
      <section className="py-20 gradient-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              أعجبك ما رأيت؟
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              دعنا نساعدك في تحقيق مشروع مماثل أو أفضل لعملك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                ابدأ مشروعك
              </a>
              <a
                href="https://wa.me/201068275557"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
              >
                تواصل معنا
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
