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
          // Create uploads directory if it doesn't exist
          const fs = require('fs')
          const path = require('path')
          const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products')
          
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true })
          }

          // Generate unique filename
          const timestamp = Date.now()
          const filename = `${timestamp}-${image.name}`
          const filepath = path.join(uploadsDir, filename)
          
          // Save file
          const buffer = Buffer.from(await image.arrayBuffer())
          fs.writeFileSync(filepath, buffer)
          
          imagePaths.push(`/uploads/products/${filename}`)
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

    const product = await prisma.product.create({
      data: {
        name,
        marketingTitle: title || '',
        marketingDescription: description || '',
        basePrice: parseFloat(price),
        priceAfterDiscount: parseFloat(price),
        images: images || [],
        categoryId: categoryId || null,
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

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json({ error: 'Failed to create product', details: error }, { status: 500 })
  }
}
