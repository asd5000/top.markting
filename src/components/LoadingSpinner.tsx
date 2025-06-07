import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'جاري التحميل...', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        className={`border-4 border-blue-200 border-t-blue-600 rounded-full ${sizeClasses[size]}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`mt-3 text-gray-600 ${textSizeClasses[size]}`}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
        <div className="w-20 h-4 bg-gray-300 rounded"></div>
      </div>
      <div className="w-3/4 h-6 bg-gray-300 rounded mb-2"></div>
      <div className="w-full h-4 bg-gray-300 rounded mb-4"></div>
      <div className="space-y-2">
        <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
        <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
      </div>
      <div className="flex space-x-2 space-x-reverse mt-4">
        <div className="flex-1 h-10 bg-gray-300 rounded-lg"></div>
        <div className="flex-1 h-10 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  )
}

export function LoadingTable() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="w-1/4 h-6 bg-gray-300 rounded animate-pulse"></div>
      </div>
      <div className="divide-y divide-gray-200">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-gray-300 rounded"></div>
                  <div className="w-24 h-3 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="flex space-x-2 space-x-reverse">
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
