import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get users stats
    const totalUsers = await prisma.user.count()
    const totalMarketers = await prisma.user.count({
      where: { role: 'MARKETER' }
    })

    return NextResponse.json({
      total: totalUsers,
      marketers: totalMarketers
    })
  } catch (error) {
    console.error('Error fetching users stats:', error)
    return NextResponse.json({
      total: 0,
      marketers: 0
    })
  }
}
