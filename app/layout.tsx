import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { NoticeProvider } from '@/components/notice-provider'
import { LoadingProvider } from '@/components/loading-provider'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'CyberX Arena - Hệ thống quản lý quán net',
  description: 'CyberX Arena - Hệ thống quản lý quán net hiện đại với giao diện đẹp mắt và tính năng đầy đủ',
  keywords: ['quán net', 'quản lý', 'cyber arena', 'gaming', 'internet cafe'],
  authors: [{ name: 'CyberX Arena Team' }],
  creator: 'CyberX Arena',
  publisher: 'CyberX Arena',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'CyberX Arena - Hệ thống quản lý quán net',
    description: 'Hệ thống quản lý quán net hiện đại với giao diện đẹp mắt và tính năng đầy đủ',
    type: 'website',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CyberX Arena - Hệ thống quản lý quán net',
    description: 'Hệ thống quản lý quán net hiện đại với giao diện đẹp mắt và tính năng đầy đủ',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider>
          <LoadingProvider>
            <NoticeProvider>
              {children}
            </NoticeProvider>
          </LoadingProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
