import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { InitAuth } from './InitAuth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '冰箱管理大師',
  description: '食材管理平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        <Providers>
          <InitAuth />
          {children}
        </Providers>
      </body>
    </html>
  )
}
