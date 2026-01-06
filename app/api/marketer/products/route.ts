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
    console.log('Request received at:', new Date().toISOString())
    
    const session = await getServerSession(authOptions)
    console.log('Session:', session)
    
    if (!session) {
      console.log('No session found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    console.log('FormData received, keys:', Array.from(formData.keys()))
    
    // Extract form fields with better error handling
    const productName = formData.get('productName')?.toString()?.trim() || ''
    const categoryId = formData.get('categoryId')?.toString() || ''
    const price = formData.get('price')?.toString() || ''
    const description = formData.get('description')?.toString() || ''
    const marketingDescription = formData.get('marketingDescription')?.toString() || ''
    const commission = formData.get('commission')?.toString() || ''
    const marketerId = session.user.id
    
    console.log('Form data extracted:', { productName, categoryId, price, marketerId })
    
    // Handle images with better error handling
    const images: File[] = []
    let imageIndex = 0
    try {
      while (true) {
        const image = formData.get(`image${imageIndex}`) as File
        if (!image) break
        if (image.size > 0) {
          images.push(image)
        }
        imageIndex++
      }
    } catch (error) {
      console.error('Error processing images:', error)
    }
    
    const imageUrls: string[] = []
    
    // Create uploads directory if it doesn't exist
    try {
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'products')
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }
      
      // Save uploaded images
      for (const image of images) {
        if (image.size > 0) {
          try {
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
          } catch (imgError) {
            console.error('Error saving image:', imgError)
            // Continue with other images even if one fails
          }
        }
      }
    } catch (error) {
      console.error('Error in image processing:', error)
    }
    
    // Validate required fields
    if (!productName || !price || !categoryId) {
      console.log('Validation failed:', { productName: !!productName, price: !!price, categoryId: !!categoryId })
      return NextResponse.json({ error: 'الرجاء ملء جميع الحقول المطلوبة: اسم المنتج، الفئة، والسعر' }, { status: 400 })
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

    // Create product in database with better error handling
    try {
      console.log('Creating product with data:', {
        name: productName,
        categoryId,
        price: parseFloat(price),
        marketerId,
        imageUrlsCount: imageUrls.length
      })

      const product = await prisma.product.create({
        data: {
          name: productName,
          marketingDescription: marketingDescription,
          basePrice: parseFloat(price),
          priceAfterDiscount: parseFloat(price),
          stock: 0,
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
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ 
        error: 'فشل في حفظ المنتج في قاعدة البيانات',
        details: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'حدث خطأ في الخادم: ' + (error instanceof Error ? error.message : 'Unknown error') }, { status: 500 })
  }
}
