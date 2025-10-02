'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { mockApi } from '@/lib/mockData'
import { useAuthStore } from '@/lib/store'
import Link from 'next/link'
import { ThemeToggle } from '../ThemeToggle'

interface SignupForm {
  email: string
  password: string
  confirmPassword: string
  name?: string
}

export default function SignupPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>()

  const password = watch('password')

  const onSubmit = async (data: SignupForm) => {
    setLoading(true)
    setError('')

    try {
      const result = await mockApi.signup(data.email, data.password, data.name)
      setAuth(result.user, result.access_token)
      router.push('/dashboard')
    } catch (err: any) {
      setError('註冊失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <ThemeToggle />

      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            冰箱管理大師
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            建立新帳號
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                電子郵件
              </label>
              <input
                {...register('email', {
                  required: '請輸入電子郵件',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: '電子郵件格式不正確',
                  },
                })}
                type="email"
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                姓名（選填）
              </label>
              <input
                {...register('name')}
                type="text"
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="您的姓名"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                密碼
              </label>
              <input
                {...register('password', {
                  required: '請輸入密碼',
                  minLength: {
                    value: 6,
                    message: '密碼至少需要 6 個字元',
                  },
                })}
                type="password"
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="至少 6 個字元"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                確認密碼
              </label>
              <input
                {...register('confirmPassword', {
                  required: '請再次輸入密碼',
                  validate: (value) => value === password || '密碼不一致',
                })}
                type="password"
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="再次輸入密碼"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '註冊中...' : '註冊'}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
            >
              已有帳號？立即登入
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
