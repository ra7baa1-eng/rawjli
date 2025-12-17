import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role === 'ADMIN') {
      const totalOrders = await prisma.order.count()
      const deliveredOrders = await prisma.order.count({
        where: { status: 'DELIVERED' }
      })
      const totalMarketers = await prisma.user.count({
        where: { role: 'MARKETER' }
      })
      const pendingWithdrawals = await prisma.withdrawal.count({
        where: { status: 'PENDING' }
      })

      const totalRevenue = await prisma.order.aggregate({
        where: { status: 'DELIVERED' },
        _sum: { totalAmount: true }
      })

      return NextResponse.json({
        totalOrders,
        deliveredOrders,
        totalMarketers,
        pendingWithdrawals,
        totalRevenue: totalRevenue._sum.totalAmount || 0
      })
    } else {
      const totalOrders = await prisma.order.count({
        where: { marketerId: session.user.id }
      })
      const deliveredOrders = await prisma.order.count({
        where: { 
          marketerId: session.user.id,
          status: 'DELIVERED'
        }
      })

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          balance: true,
          withdrawableBalance: true
        }
      })

      return NextResponse.json({
        totalOrders,
        deliveredOrders,
        balance: user?.balance || 0,
        withdrawableBalance: user?.withdrawableBalance || 0
      })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
