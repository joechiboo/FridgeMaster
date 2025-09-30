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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">新增食材</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              食材名稱 *
            </label>
            <input
              {...register('name', { required: '請輸入食材名稱' })}
              type="text"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="例如：雞蛋"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                數量 *
              </label>
              <input
                {...register('quantity', {
                  required: '請輸入數量',
                  min: { value: 0, message: '數量必須大於 0' },
                })}
                type="number"
                step="0.1"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="1"
              />
              {errors.quantity && (
                <p className="mt-1 text-xs text-red-600">{errors.quantity.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                單位 *
              </label>
              <select
                {...register('unit', { required: '請選擇單位' })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分類
            </label>
            <select
              {...register('category')}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                購買日期 *
              </label>
              <input
                {...register('boughtAt', { required: '請選擇購買日期' })}
                type="date"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              {errors.boughtAt && (
                <p className="mt-1 text-xs text-red-600">{errors.boughtAt.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                到期日期 *
              </label>
              <input
                {...register('expireAt', { required: '請選擇到期日期' })}
                type="date"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
              {errors.expireAt && (
                <p className="mt-1 text-xs text-red-600">{errors.expireAt.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              備註
            </label>
            <textarea
              {...register('note')}
              rows={3}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="額外說明..."
            />
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
