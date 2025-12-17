import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        wilaya: true,
        commune: true,
        marketer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        items: {
          include: {
            product: true,
            bundle: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (session.user.role === 'MARKETER' && order.marketerId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { status } = body

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        marketer: true
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: { status }
    })

    if (status === 'DELIVERED' && order.status !== 'DELIVERED') {
      await prisma.user.update({
        where: { id: order.marketerId },
        data: {
          balance: {
            increment: order.commission
          },
          withdrawableBalance: {
            increment: order.commission
          }
        }
      })
    }

    if (status !== 'DELIVERED' && order.status === 'DELIVERED') {
      await prisma.user.update({
        where: { id: order.marketerId },
        data: {
          balance: {
            decrement: order.commission
          },
          withdrawableBalance: {
            decrement: order.commission
          }
        }
      })
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
