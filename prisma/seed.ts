import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface AlgeriaCity {
  id: number
  commune_name: string
  daira_name: string
  wilaya_code: string
  wilaya_name: string
}

async function main() {
  console.log('Starting seed...')

  const hashedPassword = await bcrypt.hash('abdo@154122', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'alumabdo0@gmail.com' },
    update: {},
    create: {
      email: 'alumabdo0@gmail.com',
      password: hashedPassword,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'Rawjli',
      isActive: true,
    },
  })

  console.log('Admin created:', admin.email)

  const jsonPath = path.join(process.cwd(), 'algeria_cities.json')
  const citiesData: AlgeriaCity[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

  const wilayasMap = new Map<string, string>()
  citiesData.forEach(city => {
    if (!wilayasMap.has(city.wilaya_code)) {
      wilayasMap.set(city.wilaya_code, city.wilaya_name.trim())
    }
  })

  console.log(`Found ${wilayasMap.size} wilayas`)

  for (const [code, name] of wilayasMap) {
    await prisma.wilaya.upsert({
      where: { code },
      update: { name },
      create: { code, name },
    })
  }

  console.log('Wilayas created')

  for (const city of citiesData) {
    await prisma.commune.upsert({
      where: { id: city.id.toString() },
      update: {
        name: city.commune_name,
        wilayaCode: city.wilaya_code,
      },
      create: {
        id: city.id.toString(),
        name: city.commune_name,
        wilayaCode: city.wilaya_code,
      },
    })
  }

  console.log(`Created ${citiesData.length} communes`)

  for (const [code] of wilayasMap) {
    await prisma.shippingPrice.upsert({
      where: { wilayaCode: code },
      update: {},
      create: {
        wilayaCode: code,
        price: 500,
      },
    })
  }

  console.log('Default shipping prices created')
  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
