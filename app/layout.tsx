import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rawjli - منصة التسويق بالعمولة',
  description: 'منصة روجلي للتسويق بالعمولة - منصة احترافية للتسويق بالعمولة في الجزائر',
  manifest: '/manifest.json',
  themeColor: '#10b981',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'روجلي',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#10b981" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="روجلي" />
      </head>
      <body>{children}</body>
    </html>
  )
}
