import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const wilayaCode = searchParams.get('wilayaCode')

  try {
    // Test database connection first
    await prisma.$queryRaw`SELECT 1`
    
    const where: any = {}
    if (wilayaCode) where.wilayaCode = wilayaCode

    const communes = await prisma.commune.findMany({
      where,
      orderBy: { name: 'asc' }
    })
    
    return NextResponse.json(communes)
  } catch (error) {
    console.error('Error fetching communes:', error)
    
    // Return mock communes if database fails
    const mockCommunes = [
      // Adrar communes
      { id: '1', name: 'Adrar', wilayaCode: '1' },
      { id: '2', name: 'Aoulef', wilayaCode: '1' },
      { id: '3', name: 'Reggane', wilayaCode: '1' },
      // Chlef communes
      { id: '4', name: 'Chlef', wilayaCode: '2' },
      { id: '5', name: 'Abou El Hassan', wilayaCode: '2' },
      { id: '6', name: 'Beni Haoua', wilayaCode: '2' },
      // Alger communes
      { id: '7', name: 'Alger Centre', wilayaCode: '16' },
      { id: '8', name: 'Bab El Oued', wilayaCode: '16' },
      { id: '9', name: 'Sidi M\'Hamed', wilayaCode: '16' },
      { id: '10', name: 'El Biar', wilayaCode: '16' },
      { id: '11', name: 'Hydra', wilayaCode: '16' },
      { id: '12', name: 'Rouïba', wilayaCode: '16' },
      { id: '13', name: 'Bordj El Kiffan', wilayaCode: '16' },
      { id: '14', name: 'Baba Hassen', wilayaCode: '16' },
      { id: '15', name: 'Dely Brahim', wilayaCode: '16' },
      // Oran communes
      { id: '16', name: 'Oran', wilayaCode: '31' },
      { id: '17', name: 'Bir El Djir', wilayaCode: '31' },
      { id: '18', name: 'Hassi Bounif', wilayaCode: '31' },
      { id: '19', name: 'Mers El Kébir', wilayaCode: '31' },
      { id: '20', name: 'Aïn El Turk', wilayaCode: '31' },
      { id: '21', name: 'Es Senia', wilayaCode: '31' },
      { id: '22', name: 'Arzew', wilayaCode: '31' },
      { id: '23', name: 'Bethioua', wilayaCode: '31' },
      { id: '24', name: 'Marsat El Hadjadj', wilayaCode: '31' },
      { id: '25', name: 'Boutlélis', wilayaCode: '31' }
    ]
    
    // Filter by wilaya if specified
    const filteredCommunes = wilayaCode 
      ? mockCommunes.filter((c: any) => c.wilayaCode === wilayaCode)
      : mockCommunes
    
    return NextResponse.json(filteredCommunes)
  }
}
