'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { mockApi } from '@/lib/mockData'

interface CreateFridgeModalProps {
  onClose: () => void
  onSuccess: () => void
}

interface FridgeForm {
  name: string
}

export default function CreateFridgeModal({ onClose, onSuccess }: CreateFridgeModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FridgeForm>()

  const onSubmit = async (data: FridgeForm) => {
    setLoading(true)
    setError('')

    try {
      await mockApi.createFridge(data.name)
      onSuccess()
    } catch (err: any) {
      setError('新增冰箱失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h2 className="text-xl font-bold mb-4">新增冰箱</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              冰箱名稱 *
            </label>
            <input
              {...register('name', { required: '請輸入冰箱名稱' })}
              type="text"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="例如：家用冰箱、辦公室冰箱"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? '新增中...' : '新增'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
