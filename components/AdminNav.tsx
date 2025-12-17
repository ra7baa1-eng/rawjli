'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function AdminNav() {
  const pathname = usePathname()

  const links = [
    { href: '/admin', label: 'لوحة التحكم' },
    { href: '/admin/products', label: 'المنتجات' },
    { href: '/admin/categories', label: 'الفئات' },
    { href: '/admin/offers', label: 'العروض' },
    { href: '/admin/bundles', label: 'الباقات' },
    { href: '/admin/orders', label: 'الطلبيات' },
    { href: '/admin/shipping', label: 'التوصيل' },
    { href: '/admin/marketers', label: 'المسوقين' },
    { href: '/admin/withdrawals', label: 'السحوبات' },
  ]

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">روجلي - الإدارة</h1>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-lg"
          >
            تسجيل الخروج
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded text-lg ${
                pathname === link.href
                  ? 'bg-blue-800'
                  : 'bg-blue-700 hover:bg-blue-800'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
