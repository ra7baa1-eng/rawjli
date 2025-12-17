import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const bundles = await prisma.bundle.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    })
    return NextResponse.json(bundles)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bundles' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, totalPrice, commission, productIds } = body

    if (!name || !totalPrice || !commission) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const bundle = await prisma.bundle.create({
      data: {
        name,
        description,
        totalPrice,
        commission,
        products: {
          create: productIds?.map((pid: string) => ({
            productId: pid,
            quantity: 1
          })) || []
        }
      },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    })

    return NextResponse.json(bundle)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create bundle' }, { status: 500 })
  }
}
