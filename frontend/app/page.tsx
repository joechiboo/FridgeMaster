'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'

export default function Home() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          冰箱管理大師
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          輕鬆管理您的食材，減少浪費
        </p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition"
          >
            登入
          </Link>
          <Link
            href="/signup"
            className="inline-block px-6 py-3 bg-white text-primary-600 font-medium rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition"
          >
            註冊
          </Link>
        </div>
      </div>
    </div>
  )
}
