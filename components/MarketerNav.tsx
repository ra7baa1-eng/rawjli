'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function MarketerNav() {
  const pathname = usePathname()

  const links = [
    { href: '/dashboard', label: 'لوحة التحكم' },
    { href: '/dashboard/products', label: 'المنتجات' },
    { href: '/dashboard/create-order', label: 'طلبية جديدة' },
    { href: '/dashboard/orders', label: 'طلبياتي' },
    { href: '/dashboard/withdrawals', label: 'السحوبات' },
    { href: '/dashboard/profile', label: 'الملف الشخصي' },
  ]

  return (
    <nav className="bg-green-600 text-white p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">روجلي - المسوق</h1>
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
                  ? 'bg-green-800'
                  : 'bg-green-700 hover:bg-green-800'
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
