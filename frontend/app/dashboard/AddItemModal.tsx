'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { mockApi } from '@/lib/mockData'

interface AddItemModalProps {
  fridgeId: string
  onClose: () => void
  onSuccess: () => void
}

interface ItemForm {
  name: string
  quantity: number
  unit: string
  boughtAt: string
  expireAt: string
  category?: string
  note?: string
}

export default function AddItemModal({ fridgeId, onClose, onSuccess }: AddItemModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ItemForm>({
    defaultValues: {
      boughtAt: new Date().toISOString().split('T')[0],
      unit: '個',
    },
  })

  const onSubmit = async (data: ItemForm) => {
    setLoading(true)
    setError('')

    try {
      await mockApi.createItem(fridgeId, data)
      onSuccess()
    } catch (err: any) {
      setError('新增食材失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">新增食材</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg text-base font-medium border-l-4 border-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
              食材名稱 *
            </label>
            <input
              {...register('name', { required: '請輸入食材名稱' })}
              type="text"
              className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/50 transition-all outline-none"
              placeholder="例如：雞蛋"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                數量 *
              </label>
              <input
                {...register('quantity', {
                  required: '請輸入數量',
                  min: { value: 0, message: '數量必須大於 0' },
                })}
                type="number"
                step="0.1"
                className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/50 transition-all outline-none"
                placeholder="1"
              />
              {errors.quantity && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{errors.quantity.message}</p>
              )}
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                單位 *
              </label>
              <select
                {...register('unit', { required: '請選擇單位' })}
                className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/50 transition-all outline-none"
              >
                <option value="個">個</option>
                <option value="包">包</option>
                <option value="盒">盒</option>
                <option value="罐">罐</option>
                <option value="瓶">瓶</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="L">L</option>
                <option value="ml">ml</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
              分類
            </label>
            <select
              {...register('category')}
              className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/50 transition-all outline-none"
            >
              <option value="">請選擇</option>
              <option value="蔬菜">蔬菜</option>
              <option value="水果">水果</option>
              <option value="肉類">肉類</option>
              <option value="海鮮">海鮮</option>
              <option value="乳製品">乳製品</option>
              <option value="調味料">調味料</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                購買日期 *
              </label>
              <input
                {...register('boughtAt', { required: '請選擇購買日期' })}
                type="date"
                className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/50 transition-all outline-none"
              />
              {errors.boughtAt && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{errors.boughtAt.message}</p>
              )}
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                到期日期 *
              </label>
              <input
                {...register('expireAt', { required: '請選擇到期日期' })}
                type="date"
                className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/50 transition-all outline-none"
              />
              {errors.expireAt && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{errors.expireAt.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
              備註
            </label>
            <textarea
              {...register('note')}
              rows={3}
              className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/50 transition-all resize-none outline-none"
              placeholder="額外說明..."
            />
          </div>

          <div className="flex justify-end space-x-4 mt-8 pt-4 border-t dark:border-gray-600">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 transition-all"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg text-base font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? '新增中...' : '新增'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
