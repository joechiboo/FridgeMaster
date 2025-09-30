// Mock data for demo purposes

export interface User {
  id: string
  email: string
  name?: string
}

export interface Fridge {
  id: string
  name: string
  ownerId: string
  createdAt: string
  items?: Item[]
}

export interface Item {
  id: string
  fridgeId: string
  name: string
  quantity: number
  unit: string
  boughtAt: string
  expireAt: string
  category?: string
  note?: string
  createdAt: string
  updatedAt: string
}

// Demo user
export const mockUser: User = {
  id: 'user-1',
  email: 'demo@example.com',
  name: '示範使用者',
}

// Demo fridges
export const mockFridges: Fridge[] = [
  {
    id: 'fridge-1',
    name: '家用冰箱',
    ownerId: 'user-1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fridge-2',
    name: '辦公室冰箱',
    ownerId: 'user-1',
    createdAt: new Date().toISOString(),
  },
]

// Demo items
export const mockItems: Item[] = [
  {
    id: 'item-1',
    fridgeId: 'fridge-1',
    name: '雞蛋',
    quantity: 10,
    unit: '個',
    boughtAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expireAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days
    category: '乳製品',
    note: '新鮮雞蛋',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-2',
    fridgeId: 'fridge-1',
    name: '牛奶',
    quantity: 1,
    unit: '瓶',
    boughtAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expireAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day - should be orange
    category: '乳製品',
    note: '全脂牛奶',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-3',
    fridgeId: 'fridge-1',
    name: '高麗菜',
    quantity: 1,
    unit: '顆',
    boughtAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expireAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days
    category: '蔬菜',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-4',
    fridgeId: 'fridge-1',
    name: '豬肉',
    quantity: 500,
    unit: 'g',
    boughtAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    expireAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // expired - should be red
    category: '肉類',
    note: '梅花肉片',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-5',
    fridgeId: 'fridge-1',
    name: '蘋果',
    quantity: 5,
    unit: '個',
    boughtAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expireAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days
    category: '水果',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-6',
    fridgeId: 'fridge-2',
    name: '咖啡豆',
    quantity: 250,
    unit: 'g',
    boughtAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    expireAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    category: '其他',
    note: '中深焙',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Local storage keys
const STORAGE_KEYS = {
  USER: 'fridgemaster_user',
  FRIDGES: 'fridgemaster_fridges',
  ITEMS: 'fridgemaster_items',
  TOKEN: 'fridgemaster_token',
}

// Initialize mock data in localStorage
export function initMockData() {
  if (typeof window === 'undefined') return

  if (!localStorage.getItem(STORAGE_KEYS.FRIDGES)) {
    localStorage.setItem(STORAGE_KEYS.FRIDGES, JSON.stringify(mockFridges))
  }
  if (!localStorage.getItem(STORAGE_KEYS.ITEMS)) {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(mockItems))
  }
}

// Mock API functions
export const mockApi = {
  // Auth
  login: async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const user = { ...mockUser, email }
    const token = 'mock-jwt-token-' + Date.now()
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
    return { user, access_token: token }
  },

  signup: async (email: string, password: string, name?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const user = { ...mockUser, email, name }
    const token = 'mock-jwt-token-' + Date.now()
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
    initMockData()
    return { user, access_token: token }
  },

  // Fridges
  getFridges: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const fridges = JSON.parse(localStorage.getItem(STORAGE_KEYS.FRIDGES) || '[]')
    const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]')

    return fridges.map((fridge: Fridge) => ({
      ...fridge,
      items: items.filter((item: Item) => item.fridgeId === fridge.id),
    }))
  },

  createFridge: async (name: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const fridges = JSON.parse(localStorage.getItem(STORAGE_KEYS.FRIDGES) || '[]')
    const newFridge: Fridge = {
      id: 'fridge-' + Date.now(),
      name,
      ownerId: 'user-1',
      createdAt: new Date().toISOString(),
    }
    fridges.push(newFridge)
    localStorage.setItem(STORAGE_KEYS.FRIDGES, JSON.stringify(fridges))
    return newFridge
  },

  deleteFridge: async (fridgeId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const fridges = JSON.parse(localStorage.getItem(STORAGE_KEYS.FRIDGES) || '[]')
    const filtered = fridges.filter((f: Fridge) => f.id !== fridgeId)
    localStorage.setItem(STORAGE_KEYS.FRIDGES, JSON.stringify(filtered))

    // Also delete items
    const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]')
    const filteredItems = items.filter((i: Item) => i.fridgeId !== fridgeId)
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(filteredItems))
  },

  // Items
  getItems: async (fridgeId: string, filters?: { category?: string; search?: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    let items = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]')

    items = items.filter((item: Item) => item.fridgeId === fridgeId)

    if (filters?.category) {
      items = items.filter((item: Item) => item.category === filters.category)
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase()
      items = items.filter((item: Item) =>
        item.name.toLowerCase().includes(search) ||
        item.note?.toLowerCase().includes(search)
      )
    }

    return items.sort((a: Item, b: Item) =>
      new Date(a.expireAt).getTime() - new Date(b.expireAt).getTime()
    )
  },

  createItem: async (fridgeId: string, data: Partial<Item>) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]')
    const newItem: Item = {
      id: 'item-' + Date.now(),
      fridgeId,
      name: data.name!,
      quantity: data.quantity!,
      unit: data.unit!,
      boughtAt: data.boughtAt!,
      expireAt: data.expireAt!,
      category: data.category,
      note: data.note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    items.push(newItem)
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items))
    return newItem
  },

  updateItem: async (itemId: string, data: Partial<Item>) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]')
    const index = items.findIndex((item: Item) => item.id === itemId)
    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...data,
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items))
      return items[index]
    }
    throw new Error('Item not found')
  },

  deleteItem: async (itemId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS) || '[]')
    const filtered = items.filter((item: Item) => item.id !== itemId)
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(filtered))
  },
}
