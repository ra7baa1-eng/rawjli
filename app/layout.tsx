import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rawjli - منصة التسويق بالعمولة',
  description: 'منصة روجلي للتسويق بالعمولة',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
