import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    console.log('=== POST /api/marketer/products ===')
    
    const session = await getServerSession(authOptions)
    console.log('Session:', session)
    
    if (!session) {
      console.log('No session found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    console.log('FormData received')
    
    // Extract form fields
    const productName = formData.get('productName')?.toString()?.trim() || ''
    const categoryId = formData.get('categoryId')?.toString() || ''
    const price = formData.get('price')?.toString() || ''
    const quantity = formData.get('quantity')?.toString() || ''
    const description = formData.get('description')?.toString() || ''
    const marketingTitle = formData.get('marketingTitle')?.toString() || ''
    const marketingDescription = formData.get('marketingDescription')?.toString() || ''
    const commission = formData.get('commission')?.toString() || ''
    const marketerId = session.user.id
    
    console.log('Form data extracted:', { productName, categoryId, price, quantity, marketerId })
    
    // Handle images
    const images: File[] = []
    let imageIndex = 0
    while (true) {
      const image = formData.get(`image${imageIndex}`) as File
      if (!image) break
      images.push(image)
      imageIndex++
    }
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
      console.log('Validation failed:', { productName: !!productName, price: !!price, categoryId: !!categoryId, quantity: !!quantity })
      return NextResponse.json({ error: 'الرجاء ملء جميع الحقول المطلوبة: اسم المنتج، الفئة، السعر، والكمية' }, { status: 400 })
    }

    console.log('Validation passed, checking category...')

    // Validate category exists
    console.log('Looking for category:', categoryId)
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })
    
    console.log('Category found:', category)
    
    if (!category) {
      console.log('Category not found')
      return NextResponse.json({ error: 'الفئة المحددة غير موجودة' }, { status: 400 })
    }

    console.log('Creating product...')

    // Create product in database
    console.log('Creating product with data:', {
      name: productName,
      categoryId,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      marketerId,
      imageUrlsCount: imageUrls.length
    })

    const product = await prisma.product.create({
      data: {
        name: productName,
        marketingTitle: marketingTitle,
        marketingDescription: marketingDescription,
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
    
    console.log('Product created successfully:', product.id)
    
    return NextResponse.json({
      message: 'تم إضافة المنتج بنجاح!',
      product
    })
    
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'حدث خطأ في الخادم: ' + (error instanceof Error ? error.message : 'Unknown error') }, { status: 500 })
  }
}
