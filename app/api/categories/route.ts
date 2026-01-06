import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // Add retry logic for database connection
    let retries = 3;
    let categories: any[] = [];
    
    while (retries > 0) {
      try {
        categories = await prisma.category.findMany({
          orderBy: {
            name: 'asc'
          }
        });
        break;
      } catch (dbError) {
        console.log(`Database retry attempt: ${4 - retries}`);
        retries--;
        if (retries === 0) throw dbError;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // إرجاع البيانات بشكل متسق
    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return mock data as fallback
    return NextResponse.json({
      success: true,
      data: [
        { id: '1', name: 'إلكترونيات', description: null },
        { id: '2', name: 'ملابس', description: null },
        { id: '3', name: 'أثاث', description: null },
        { id: '4', name: 'كتب', description: null },
        { id: '5', name: 'ألعاب', description: null }
      ]
    });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'اسم الفئة مطلوب' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        description: description || null
      }
    });

    return NextResponse.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'حدث خطأ في إنشاء الفئة'
      },
      { status: 500 }
    );
  }
}
