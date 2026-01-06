import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // First try to get shipping prices with wilaya
    let shippingPrices = []
    try {
      shippingPrices = await prisma.shippingPrice.findMany({
        include: {
          wilaya: true
        },
        orderBy: {
          price: 'asc'
        }
      })
    } catch (dbError) {
      console.log('Error with wilaya relation, trying without:', dbError)
      // Fallback: try without wilaya relation
      shippingPrices = await prisma.shippingPrice.findMany({
        orderBy: {
          price: 'asc'
        }
      })
    }
    
    return NextResponse.json(shippingPrices)
  } catch (error) {
    console.error('Error fetching shipping prices:', error)
    // Return empty array instead of error to prevent app crash
    return NextResponse.json([])
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { wilayaCode, price } = body

    if (!wilayaCode || price === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Find Wilaya by code first
    let wilaya = await prisma.wilaya.findUnique({
      where: { code: wilayaCode }
    })

    // If wilaya doesn't exist, create it
    if (!wilaya) {
      wilaya = await prisma.wilaya.create({
        data: {
          code: wilayaCode,
          name: wilayaCode // You may want to add a name field to the request
        }
      })
    }

    // Then upsert shipping price using wilayaId
    const shippingPrice = await prisma.shippingPrice.upsert({
      where: { wilayaId: wilaya.id },
      update: { price },
      create: { wilayaId: wilaya.id, price }
    })

    return NextResponse.json(shippingPrice)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update shipping price' }, { status: 500 })
  }
}
