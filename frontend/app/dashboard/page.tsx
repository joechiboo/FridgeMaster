'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockApi, initMockData } from '@/lib/mockData'
import { useAuthStore } from '@/lib/store'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import AddItemModal from './AddItemModal'
import CreateFridgeModal from './CreateFridgeModal'
import AdjustQuantityModal from './AdjustQuantityModal'
import ConfirmDialog from '@/components/ConfirmDialog'
import { ThemeToggle } from '../ThemeToggle'

export default function DashboardPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, logout, isAuthenticated } = useAuthStore()
  const [selectedFridge, setSelectedFridge] = useState<string | null>(null)
  const [showAddItem, setShowAddItem] = useState(false)
  const [showCreateFridge, setShowCreateFridge] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [activeTab, setActiveTab] = useState<'fridge' | 'database'>('fridge')
  const [adjustQuantity, setAdjustQuantity] = useState<{
    show: boolean
    item: any
    mode: 'purchase' | 'use'
  } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; itemId: string | null; itemName: string }>({
    show: false,
    itemId: null,
    itemName: '',
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
    } else {
      initMockData()
    }
  }, [isAuthenticated, router])

  const { data: fridges, isLoading: fridgesLoading } = useQuery({
    queryKey: ['fridges'],
    queryFn: async () => {
      return await mockApi.getFridges()
    },
  })

  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey: ['items', selectedFridge, categoryFilter, searchTerm],
    queryFn: async () => {
      if (!selectedFridge) return []
      return await mockApi.getItems(selectedFridge, {
        category: categoryFilter || undefined,
        search: searchTerm || undefined,
      })
    },
    enabled: !!selectedFridge,
  })

  const deleteItemMutation = useMutation({
    mutationFn: (itemId: string) => mockApi.deleteItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
  })

  useEffect(() => {
    if (fridges && fridges.length > 0 && !selectedFridge) {
      setSelectedFridge(fridges[0].id)
    }
  }, [fridges, selectedFridge])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const getExpiryColor = (expireAt: string) => {
    const daysUntilExpiry = Math.ceil(
      (new Date(expireAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysUntilExpiry < 0) return 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30'
    if (daysUntilExpiry <= 3) return 'text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30'
    if (daysUntilExpiry <= 7) return 'text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30'
    return 'text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800'
  }

  if (fridgesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">載入中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ThemeToggle />

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">冰箱管理大師</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              登出
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('fridge')}
              className={`${
                activeTab === 'fridge'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              冰箱頁面
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`${
                activeTab === 'database'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              食材資料庫
            </button>
          </nav>
        </div>

        {/* Fridge Page Content */}
        {activeTab === 'fridge' && (
          <>
            {/* Fridge Selection */}
            <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">選擇冰箱：</label>
            <select
              value={selectedFridge || ''}
              onChange={(e) => setSelectedFridge(e.target.value)}
              className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              {fridges?.map((fridge: any) => (
                <option key={fridge.id} value={fridge.id}>
                  {fridge.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowCreateFridge(true)}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              + 新增冰箱
            </button>
          </div>

          <button
            onClick={() => setShowAddItem(true)}
            disabled={!selectedFridge}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + 新增食材
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="搜尋食材..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="">所有分類</option>
            <option value="蔬菜">蔬菜</option>
            <option value="水果">水果</option>
            <option value="肉類">肉類</option>
            <option value="海鮮">海鮮</option>
            <option value="乳製品">乳製品</option>
            <option value="調味料">調味料</option>
            <option value="其他">其他</option>
          </select>
        </div>

        {/* Items Table */}
        {itemsLoading ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">載入中...</div>
        ) : items && items.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    食材名稱
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    數量
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    分類
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    購買日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    到期日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    備註
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    庫存調整
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item: any) => (
                  <tr key={item.id} className={getExpiryColor(item.expireAt)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.category || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {format(new Date(item.boughtAt), 'yyyy/MM/dd', { locale: zhTW })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {format(new Date(item.expireAt), 'yyyy/MM/dd', { locale: zhTW })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {item.note || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setAdjustQuantity({ show: true, item, mode: 'use' })}
                          className="px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition text-sm font-medium"
                          title="使用食材"
                        >
                          使用
                        </button>
                        <button
                          onClick={() => setAdjustQuantity({ show: true, item, mode: 'purchase' })}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition text-sm font-medium"
                          title="採購食材"
                        >
                          採購
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setDeleteConfirm({
                            show: true,
                            itemId: item.id,
                            itemName: item.name,
                          })
                        }}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition"
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400">目前沒有食材，點擊上方按鈕新增食材</p>
          </div>
        )}
          </>
        )}

        {/* Ingredient Database Content */}
        {activeTab === 'database' && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">食材資料庫</h2>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                + 新增食材
              </button>
            </div>
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">食材資料庫功能開發中...</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddItem && selectedFridge && (
        <AddItemModal
          fridgeId={selectedFridge}
          onClose={() => setShowAddItem(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['items'] })
            setShowAddItem(false)
          }}
        />
      )}

      {showCreateFridge && (
        <CreateFridgeModal
          onClose={() => setShowCreateFridge(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['fridges'] })
            setShowCreateFridge(false)
          }}
        />
      )}

      {/* Adjust Quantity Modal */}
      {adjustQuantity?.show && adjustQuantity.item && (
        <AdjustQuantityModal
          item={adjustQuantity.item}
          mode={adjustQuantity.mode}
          onClose={() => setAdjustQuantity(null)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['items'] })
            setAdjustQuantity(null)
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.show}
        title="刪除食材"
        message={`確定要刪除「${deleteConfirm.itemName}」嗎？此操作無法復原。`}
        confirmText="刪除"
        cancelText="取消"
        type="danger"
        onConfirm={() => {
          if (deleteConfirm.itemId) {
            deleteItemMutation.mutate(deleteConfirm.itemId)
          }
          setDeleteConfirm({ show: false, itemId: null, itemName: '' })
        }}
        onCancel={() => {
          setDeleteConfirm({ show: false, itemId: null, itemName: '' })
        }}
      />
    </div>
  )
}
