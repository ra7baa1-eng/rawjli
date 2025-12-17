import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const wilayas = await prisma.wilaya.findMany({
      orderBy: { name: 'asc' },
      include: {
        communes: true
      }
    })
    return NextResponse.json(wilayas)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wilayas' }, { status: 500 })
  }
}
