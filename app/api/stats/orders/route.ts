import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get orders stats
    const totalOrders = await prisma.order.count()
    const deliveredOrders = await prisma.order.count({
      where: { status: 'DELIVERED' }
    })
    
    // Get revenue
    const orders = await prisma.order.findMany({
      where: { status: 'DELIVERED' }
    })
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)

    return NextResponse.json({
      total: totalOrders,
      delivered: deliveredOrders,
      revenue: totalRevenue
    })
  } catch (error) {
    console.error('Error fetching orders stats:', error)
    return NextResponse.json({
      total: 0,
      delivered: 0,
      revenue: 0
    })
  }
}
