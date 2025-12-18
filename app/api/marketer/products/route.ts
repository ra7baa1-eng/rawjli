import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    
    // Extract form fields
    const productName = formData.get('productName')?.toString()?.trim() || ''
    const categoryId = formData.get('categoryId')?.toString() || ''
    const price = formData.get('price')?.toString() || ''
    const quantity = formData.get('quantity')?.toString() || ''
    const productDescription = formData.get('productDescription')?.toString() || ''
    const commission = formData.get('commission')?.toString() || ''
    const marketerId = formData.get('marketerId')?.toString() || ''
    
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
    
    // Create product data (in a real app, save to database)
    const product = {
      id: `product-${Date.now()}`,
      name: productName,
      categoryId,
      marketerId,
      basePrice: parseFloat(price),
      priceAfterDiscount: parseFloat(price),
      stock: parseInt(quantity),
      description: productDescription,
      images: imageUrls,
      commission: commission ? parseFloat(commission) : 10,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // For now, just return success (in production, save to database)
    return NextResponse.json({
      message: 'تم إضافة المنتج بنجاح!',
      product
    })
    
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'فشل في إنشاء المنتج' },
      { status: 500 }
    )
  }
}
