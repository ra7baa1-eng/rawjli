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

    // إذا كان content-type JSON واضح، اقرأ JSON مباشرة
    if (contentType?.includes('application/json')) {
      body = await req.json()
    } else {
      // وإلا، افترض أنه FormData (لأن fetch مع FormData قد لا يرسل content-type صحيح)
      const formData = await req.formData()
      body = {
        name: formData.get('name')?.toString() || '',
        title: formData.get('title')?.toString() || '',
        description: formData.get('description')?.toString() || '',
        price: formData.get('price')?.toString() || '',
        stock: formData.get('stock')?.toString() || '',
        categoryId: formData.get('categoryId')?.toString() || '',
      }

      // Handle images
      const images = formData.getAll('images') as File[]
      const imagePaths: string[] = []
      
      for (const image of images) {
        if (image && image.size > 0) {
          try {
            // For Vercel, we'll use base64 encoding instead of file system
            const bytes = await image.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const base64 = buffer.toString('base64')
            const mimeType = image.type || 'image/jpeg'
            const dataUrl = `data:${mimeType};base64,${base64}`
            
            imagePaths.push(dataUrl)
          } catch (imgError) {
            console.error('Error processing image:', imgError)
          }
        }
      }

      body.images = imagePaths
    }

    const { 
      name, 
      title, 
      description, 
      marketingDescription,
      price, 
      cost,
      stock,
      images, 
      image,
      categoryId,
      optionIds
    } = body

    console.log('Received product data:', { name, price, stock, categoryId, hasImages: !!images })

    // التحقق من الحقول المطلوبة
    if (!name || !name.toString().trim()) {
      return NextResponse.json({ error: 'اسم المنتج مطلوب' }, { status: 400 })
    }
    
    if (!price || !price.toString().trim()) {
      return NextResponse.json({ error: 'السعر مطلوب' }, { status: 400 })
    }
    
    // التحقق من أن السعر رقم صحيح
    const priceNum = parseFloat(price.toString())
    if (isNaN(priceNum) || priceNum <= 0) {
      return NextResponse.json({ error: 'السعر يجب أن يكون رقماً أكبر من صفر' }, { status: 400 })
    }
    
    // التحقق من stock إذا كان مطلوباً
    const stockNum = stock ? parseInt(stock.toString()) : 0
    if (stock && isNaN(stockNum)) {
      return NextResponse.json({ error: 'الكمية يجب أن تكون رقماً صحيحاً' }, { status: 400 })
    }

    // Validate marketing description length
    if (description && description.length > 10000) {
      return new Response(
        JSON.stringify({ error: 'الوصف التسويقي طويل جداً. الحد الأقصى هو 10000 حرف.' }),
        { status: 400 }
      );
    }

    // Handle categoryId - validate it exists if provided
    let productCategoryId = null
    if (categoryId && categoryId !== '') {
      try {
        const category = await prisma.category.findUnique({
          where: { id: categoryId }
        })
        
        if (!category) {
          return new Response(
            JSON.stringify({ error: 'الفئة المحددة غير موجودة' }),
            { status: 400 }
          );
        }
        
        productCategoryId = categoryId
      } catch (error) {
        console.error('Error validating category:', error)
        return new Response(
          JSON.stringify({ error: 'حدث خطأ أثناء التحقق من الفئة' }),
          { status: 500 }
        );
      }
    }

    try {
      // معالجة الصور - دعم كل من images (مصفوفة) و image (رابط واحد)
      const productImages = images || (image ? [image] : []);

      // إنشاء المنتج أولاً
      const product = await prisma.product.create({
        data: {
          name,
          marketingTitle: title || '',
          marketingDescription: marketingDescription || description || '',
          basePrice: parseFloat(price),
          priceAfterDiscount: parseFloat(price),
          images: productImages,
          category: productCategoryId ? {
            connect: { id: productCategoryId }
          } : undefined,
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

      // إنشاء الخيارات المحددة بعد إنشاء المنتج
      if (optionIds && optionIds.length > 0) {
        // جلب الخيارات المرجعية (templates) من المنتجات الأخرى
        const templateOptions = await prisma.productOption.findMany({
          where: {
            id: { in: optionIds }
          },
          include: {
            values: true
          }
        })

        // إنشاء نسخ من الخيارات للمنتج الجديد
        for (const templateOption of templateOptions) {
          await prisma.productOption.create({
            data: {
              name: templateOption.name,
              productId: product.id,
              values: {
                create: templateOption.values.map((val) => ({
                  value: val.value
                }))
              }
            }
          })
        }

        // إعادة جلب المنتج مع الخيارات الجديدة
        const updatedProduct = await prisma.product.findUnique({
          where: { id: product.id },
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

        return NextResponse.json(updatedProduct, { status: 201 })
      }

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
