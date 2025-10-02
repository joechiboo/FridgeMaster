import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { InitAuth } from './InitAuth'

const inter = Inter({ subsets: ['latin'] })

const basePath = process.env.NODE_ENV === 'production' ? '/FridgeMaster' : ''

export const metadata: Metadata = {
  title: '冰箱管理大師',
  description: '食材管理平台',
  icons: {
    icon: [
      { url: `${basePath}/favicon.png`, type: 'image/png' },
      { url: `${basePath}/favicon-16x16.png`, sizes: '16x16', type: 'image/png' },
      { url: `${basePath}/favicon-32x32.png`, sizes: '32x32', type: 'image/png' },
      { url: `${basePath}/favicon-64x64.png`, sizes: '64x64', type: 'image/png' },
    ],
    shortcut: `${basePath}/favicon.ico`,
    apple: [
      { url: `${basePath}/favicon-128x128.png`, sizes: '128x128', type: 'image/png' },
      { url: `${basePath}/favicon-256x256.png`, sizes: '256x256', type: 'image/png' },
    ],
  },
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
