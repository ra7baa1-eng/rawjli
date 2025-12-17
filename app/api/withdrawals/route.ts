import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const where: any = {}
    
    if (session.user.role === 'MARKETER') {
      where.marketerId = session.user.id
    }

    const withdrawals = await prisma.withdrawal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        marketer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    return NextResponse.json(withdrawals)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch withdrawals' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'MARKETER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { amount, method, accountNumber } = body

    if (!amount || !method || !accountNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user || user.withdrawableBalance < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }

    const withdrawal = await prisma.withdrawal.create({
      data: {
        amount,
        method,
        accountNumber,
        marketerId: session.user.id
      }
    })

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        withdrawableBalance: {
          decrement: amount
        }
      }
    })

    return NextResponse.json(withdrawal)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create withdrawal' }, { status: 500 })
  }
}
