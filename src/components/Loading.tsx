'use client'

import { motion } from 'framer-motion'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'white' | 'gray'
  text?: string
  fullScreen?: boolean
  overlay?: boolean
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

const colorClasses = {
  primary: 'border-blue-600',
  secondary: 'border-purple-600',
  white: 'border-white',
  gray: 'border-gray-600'
}

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
}

export default function Loading({ 
  size = 'md', 
  color = 'primary', 
  text, 
  fullScreen = false,
  overlay = false 
}: LoadingProps) {
  const spinnerClasses = `${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin`
  const textClasses = `${textSizeClasses[size]} mt-3 text-gray-600`

  const LoadingContent = () => (
    <div className="flex flex-col items-center justify-center">
      {/* Animated Logo Spinner */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        {/* Outer Ring */}
        <div className={`${spinnerClasses} relative`}>
          {/* Inner Dot */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`absolute top-0 right-0 w-1 h-1 ${color === 'white' ? 'bg-white' : color === 'gray' ? 'bg-gray-600' : color === 'secondary' ? 'bg-purple-600' : 'bg-blue-600'} rounded-full`}
          />
        </div>
        
        {/* Pulsing Center */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`absolute inset-0 m-auto w-2 h-2 ${color === 'white' ? 'bg-white' : color === 'gray' ? 'bg-gray-600' : color === 'secondary' ? 'bg-purple-600' : 'bg-blue-600'} rounded-full opacity-60`}
        />
      </motion.div>

      {/* Loading Text */}
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={textClasses}
        >
          {text}
        </motion.p>
      )}

      {/* Loading Dots Animation */}
      {text && (
        <motion.div
          className="flex space-x-1 space-x-reverse mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className={`w-1 h-1 ${color === 'white' ? 'bg-white' : color === 'gray' ? 'bg-gray-400' : color === 'secondary' ? 'bg-purple-400' : 'bg-blue-400'} rounded-full`}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${overlay ? 'bg-black bg-opacity-50' : 'bg-white'}`}>
        <LoadingContent />
      </div>
    )
  }

  return <LoadingContent />
}

// Skeleton Loading Components
export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-200 rounded ${
            index === lines - 1 ? 'w-2/3' : 'w-full'
          }`}
        ></div>
      ))}
    </div>
  )
}

export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <div className={`${sizeClasses[size]} bg-gray-200 rounded-full animate-pulse`}></div>
  )
}

export function SkeletonButton() {
  return (
    <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-24"></div>
  )
}

// Page Loading Component
export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loading size="xl" text="جاري التحميل..." />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">توب ماركتنج</h2>
          <p className="text-gray-600">نحول أفكارك إلى واقع رقمي</p>
        </motion.div>
      </div>
    </div>
  )
}

// Section Loading Component
export function SectionLoading({ height = 'h-64' }: { height?: string }) {
  return (
    <div className={`${height} flex items-center justify-center bg-gray-50 rounded-lg`}>
      <Loading text="جاري التحميل..." />
    </div>
  )
}

// Table Loading Component
export function TableLoading({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="animate-pulse">
      <div className="grid gap-4">
        {/* Header */}
        <div className={`grid grid-cols-${cols} gap-4 p-4 bg-gray-100 rounded-lg`}>
          {Array.from({ length: cols }).map((_, index) => (
            <div key={index} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className={`grid grid-cols-${cols} gap-4 p-4 border-b`}>
            {Array.from({ length: cols }).map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
