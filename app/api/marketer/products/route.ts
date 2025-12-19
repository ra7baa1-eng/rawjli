import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    
    // Extract form fields
    const productName = formData.get('productName')?.toString()?.trim() || ''
    const categoryId = formData.get('categoryId')?.toString() || ''
    const price = formData.get('price')?.toString() || ''
    const quantity = formData.get('quantity')?.toString() || ''
    const productDescription = formData.get('productDescription')?.toString() || ''
    const commission = formData.get('commission')?.toString() || ''
    const marketerId = session.user.id
    
    // Handle images
    const images = formData.getAll('images') as File[]
    const imageUrls: string[] = []
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'products')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }
    
    // Save uploaded images
    for (const image of images) {
      if (image.size > 0) {
        const bytes = await image.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // Generate unique filename
        const timestamp = Date.now()
        const filename = `${timestamp}-${image.name}`
        const filepath = join(uploadsDir, filename)
        
        // Save file
        await writeFile(filepath, buffer)
        
        // Add to image URLs
        imageUrls.push(`/uploads/products/${filename}`)
      }
    }
    
    // Validate required fields
    if (!productName || !price || !categoryId || !quantity) {
      return NextResponse.json({ error: 'الرجاء ملء جميع الحقول المطلوبة: اسم المنتج، الفئة، السعر، والكمية' }, { status: 400 })
    }

    // Validate category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })
    
    if (!category) {
      return NextResponse.json({ error: 'الفئة المحددة غير موجودة' }, { status: 400 })
    }

    // Create product in database
    const product = await prisma.product.create({
      data: {
        name: productName,
        marketingTitle: productName,
        marketingDescription: productDescription,
        basePrice: parseFloat(price),
        priceAfterDiscount: parseFloat(price),
        stock: parseInt(quantity),
        category: {
          connect: { id: categoryId }
        },
        images: imageUrls,
        marketer: {
          connect: { id: marketerId }
        },
        commission: commission ? parseFloat(commission) : 10,
        isActive: true
      },
      include: {
        category: true,
        marketer: true
      }
    })
    
    return NextResponse.json({
      message: 'تم إضافة المنتج بنجاح!',
      product
    })
    
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'حدث خطأ في الخادم: ' + (error instanceof Error ? error.message : 'Unknown error') }, { status: 500 })
  }
}
