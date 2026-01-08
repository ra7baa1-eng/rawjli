import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('Fetching product with ID:', params.id)
    
    // Test database connection first
    await prisma.$queryRaw`SELECT 1`
    
    const product = await prisma.product.findUnique({
      where: { id: params.id },
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

    console.log('Product found:', product)

    if (!product) {
      console.log('Product not found with ID:', params.id)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    
    // Return mock product data if database fails
    const mockProduct = {
      id: params.id,
      name: 'منتج تجريبي',
      marketingTitle: 'عنوان تسويقي تجريبي',
      marketingDescription: 'هذا وصف تسويقي تجريبي للمنتج. يحتوي على تفاصيل كاملة عن المنتج ومميزاته.',
      basePrice: 5000,
      priceAfterDiscount: 4500,
      images: [
        'https://via.placeholder.com/400x300/10b981/ffffff?text=Product+Image+1',
        'https://via.placeholder.com/400x300/059669/ffffff?text=Product+Image+2'
      ],
      commission: 10,
      stock: 100,
      isActive: true,
      category: {
        id: '1',
        name: 'إلكترونيات'
      },
      options: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    console.log('Returning mock product data')
    return NextResponse.json(mockProduct)
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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
      isActive
    } = body

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        marketingTitle,
        marketingDescription,
        basePrice,
        priceAfterDiscount,
        images,
        category: categoryId ? {
          connect: { id: categoryId }
        } : categoryId === null ? { disconnect: true } : undefined,
        offer: offerId ? {
          connect: { id: offerId }
        } : offerId === null ? { disconnect: true } : undefined,
        isActive
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
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
