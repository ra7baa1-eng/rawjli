import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId')
    const offerId = searchParams.get('offerId')

    const where: any = {}
    if (categoryId) where.categoryId = categoryId
    if (offerId) where.offerId = offerId

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        offer: true,
        options: {
          include: {
            values: true
          }
        }
      }
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { 
      name, 
      marketingTitle, 
      marketingDescription, 
      basePrice, 
      priceAfterDiscount,
      images, 
      categoryId, 
      offerId,
      options
    } = body

    if (!name || !marketingTitle || !marketingDescription || !basePrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        marketingTitle,
        marketingDescription,
        basePrice,
        priceAfterDiscount,
        images: images || [],
        categoryId: categoryId || null,
        offerId: offerId || null,
        options: {
          create: options?.map((opt: any) => ({
            name: opt.name,
            values: {
              create: opt.values?.map((val: string) => ({ value: val })) || []
            }
          })) || []
        }
      },
      include: {
        category: true,
        offer: true,
        options: {
          include: {
            values: true
          }
        }
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
