import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

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
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contentType = req.headers.get('content-type')
    let body: any = {}

    if (contentType?.includes('multipart/form-data')) {
      // Handle FormData with images
      const formData = await req.formData()
      body = {
        name: formData.get('name'),
        title: formData.get('title'),
        description: formData.get('description'),
        price: formData.get('price'),
        stock: formData.get('stock'),
        categoryId: formData.get('categoryId'),
      }

      // Handle images
      const images = formData.getAll('images') as File[]
      const imagePaths: string[] = []
      
      for (const image of images) {
        if (image.size > 0) {
          // For Vercel, we'll use base64 encoding instead of file system
          const bytes = await image.arrayBuffer()
          const buffer = Buffer.from(bytes)
          const base64 = buffer.toString('base64')
          const mimeType = image.type
          const dataUrl = `data:${mimeType};base64,${base64}`
          
          imagePaths.push(dataUrl)
        }
      }

      body.images = imagePaths
    } else {
      // Handle JSON data
      body = await req.json()
    }

    const { 
      name, 
      title, 
      description, 
      price, 
      stock,
      images, 
      categoryId
    } = body

    if (!name || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Handle categoryId - validate it exists if provided
    let productCategoryId = null
    if (categoryId && categoryId !== '') {
      // Verify the category exists
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      })
      
      if (!category) {
        return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 })
      }
      
      productCategoryId = categoryId
    }

    try {
      const product = await prisma.product.create({
        data: {
          name,
          marketingTitle: title || '',
          marketingDescription: description || '',
          basePrice: parseFloat(price),
          priceAfterDiscount: parseFloat(price),
          images: images || [],
          categoryId: productCategoryId,
          stock: stock ? parseInt(stock) : 0,
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

      return NextResponse.json(product, { status: 201 })
    } catch (error) {
      console.error('Error creating product:', error)
      console.error('Product data:', {
        name,
        title,
        description,
        price,
        stock,
        imagesCount: images?.length || 0,
        categoryId: productCategoryId
      })
      
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return NextResponse.json({ 
          error: 'Database error', 
          details: error.message,
          code: error.code
        }, { status: 400 })
      }
      
      return NextResponse.json({ 
        error: 'Failed to create product',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json({ error: 'Failed to create product', details: error }, { status: 500 })
  }
}
