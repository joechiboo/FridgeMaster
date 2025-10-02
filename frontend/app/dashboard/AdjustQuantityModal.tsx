'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { mockApi } from '@/lib/mockData'

interface AdjustQuantityModalProps {
  item: {
    id: string
    name: string
    quantity: number
    unit: string
  }
  mode: 'purchase' | 'use'
  onClose: () => void
  onSuccess: () => void
}

export default function AdjustQuantityModal({ item, mode, onClose, onSuccess }: AdjustQuantityModalProps) {
  const [amount, setAmount] = useState<number>(1)

  const adjustMutation = useMutation({
    mutationFn: (amount: number) => mockApi.adjustQuantity(item.id, amount),
    onSuccess: () => {
      onSuccess()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const finalAmount = mode === 'use' ? -amount : amount
    adjustMutation.mutate(finalAmount)
  }

  const title = mode === 'purchase' ? '採購食材' : '使用食材'
  const buttonText = mode === 'purchase' ? '採購' : '使用'
  const buttonColor = mode === 'purchase' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              食材名稱
            </label>
            <div className="text-gray-900 font-medium">{item.name}</div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              目前庫存
            </label>
            <div className="text-gray-900">
              {item.quantity} {item.unit}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {mode === 'purchase' ? '採購數量' : '使用數量'}
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setAmount(Math.max(0.5, amount - 1))}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              >
                -
              </button>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-center"
                step="0.5"
                min="0"
                required
              />
              <button
                type="button"
                onClick={() => setAmount(amount + 1)}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              >
                +
              </button>
              <span className="text-gray-600">{item.unit}</span>
            </div>
          </div>

          {mode === 'use' && amount > item.quantity && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                警告：使用數量超過目前庫存
              </p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              預計結果
            </label>
            <div className="text-gray-900">
              {Math.max(0, mode === 'use' ? item.quantity - amount : item.quantity + amount)} {item.unit}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={adjustMutation.isPending || amount <= 0}
              className={`px-4 py-2 text-white rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed ${buttonColor}`}
            >
              {adjustMutation.isPending ? '處理中...' : buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
