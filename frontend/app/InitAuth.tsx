'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store'

export function InitAuth() {
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage)

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  return null
}
