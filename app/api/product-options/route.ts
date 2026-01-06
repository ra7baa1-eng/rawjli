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

    // جلب جميع الخيارات من جميع المنتجات مع قيمها
    const options = await prisma.productOption.findMany({
      include: {
        values: {
          orderBy: {
            value: 'asc'
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // إرجاع البيانات بشكل متسق
    return NextResponse.json({
      success: true,
      data: options
    });
  } catch (error) {
    console.error('Error fetching product options:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'حدث خطأ في جلب الخيارات',
        data: [] // إرجاع مصفوفة فارغة في حالة الخطأ
      },
      { status: 500 }
    );
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
    const { name, values } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'اسم الخيار مطلوب' },
        { status: 400 }
      );
    }

    // ملاحظة: بما أن ProductOption مرتبط بمنتج في schema، 
    // يجب إنشاء الخيارات عند إنشاء المنتج أو ربطها بمنتج موجود
    // هنا نعيد رسالة توضيحية
    return NextResponse.json(
      { 
        success: false,
        error: 'يجب إنشاء الخيارات عند إنشاء المنتج أو ربطها بمنتج موجود'
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error creating product option:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'حدث خطأ في إنشاء الخيار'
      },
      { status: 500 }
    );
  }
}

