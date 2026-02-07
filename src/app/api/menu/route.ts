import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const categories = await prisma.menuCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        items: { orderBy: { order: 'asc' } },
      },
    });
    return NextResponse.json({
      note: 'coperto 3,50€ - terrazza 5,00€',
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        order: c.order,
        items: c.items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          description: i.description,
          order: i.order,
        })),
      })),
    });
  } catch (error) {
    console.error('GET /api/menu:', error);
    return NextResponse.json(
      { error: 'Errore nel caricamento del menu' },
      { status: 500 }
    );
  }
}
