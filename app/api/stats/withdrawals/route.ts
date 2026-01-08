import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get withdrawals stats
    const totalWithdrawals = await prisma.withdrawal.count()
    const pendingWithdrawals = await prisma.withdrawal.count({
      where: { status: 'PENDING' }
    })

    return NextResponse.json({
      total: totalWithdrawals,
      pending: pendingWithdrawals
    })
  } catch (error) {
    console.error('Error fetching withdrawals stats:', error)
    return NextResponse.json({
      total: 0,
      pending: 0
    })
  }
}
