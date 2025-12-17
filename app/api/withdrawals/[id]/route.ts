import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { status } = body

    const withdrawal = await prisma.withdrawal.update({
      where: { id: params.id },
      data: { status }
    })

    return NextResponse.json(withdrawal)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update withdrawal' }, { status: 500 })
  }
}
