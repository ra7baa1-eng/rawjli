import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const where: any = {}
    
    if (session.user.role === 'MARKETER') {
      where.marketerId = session.user.id
    }
    
    if (status) {
      where.status = status
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'MARKETER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      customerFirstName,
      customerLastName,
      customerPhone,
      wilayaCode,
      communeId,
      deliveryMethod,
      items,
      commission
    } = body

    if (!customerFirstName || !customerLastName || !customerPhone || !wilayaCode || !communeId || !deliveryMethod || !items || !commission) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const shippingPrice = await prisma.shippingPrice.findUnique({
      where: { wilayaCode }
    })

    const shippingCost = shippingPrice?.price || 0

    let totalAmount = shippingCost

    for (const item of items) {
      if (item.productId) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        })
        if (product) {
          const price = product.priceAfterDiscount || product.basePrice
          totalAmount += price * (item.quantity || 1)
        }
      } else if (item.bundleId) {
        const bundle = await prisma.bundle.findUnique({
          where: { id: item.bundleId }
        })
        if (bundle) {
          totalAmount += bundle.totalPrice * (item.quantity || 1)
        }
      }
    }

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerFirstName,
        customerLastName,
        customerPhone,
        wilayaCode,
        communeId,
        deliveryMethod,
        shippingCost,
        totalAmount,
        commission,
        marketerId: session.user.id,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId || null,
            bundleId: item.bundleId || null,
            quantity: item.quantity || 1,
            price: item.price,
            selectedVariants: item.selectedVariants || null
          }))
        }
      },
      include: {
        wilaya: true,
        commune: true,
        items: {
          include: {
            product: true,
            bundle: true
          }
        }
      }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
