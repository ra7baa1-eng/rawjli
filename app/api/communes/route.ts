import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const wilayaCode = searchParams.get('wilayaCode')

    const where: any = {}
    if (wilayaCode) where.wilayaCode = wilayaCode

    const communes = await prisma.commune.findMany({
      where,
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(communes)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch communes' }, { status: 500 })
  }
}
