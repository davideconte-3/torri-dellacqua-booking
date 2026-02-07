import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

function checkAdminPin(request: Request): boolean {
  const pin = request.headers.get('X-Admin-PIN') || request.headers.get('X-View-Pin');
  const expected = process.env.BOOKING_VIEW_PIN || process.env.MENU_ADMIN_PIN;
  return !!expected && pin === expected;
}

type ItemPayload = { id?: string; name: string; price: number; description?: string | null; order?: number };
type CategoryPayload = { id?: string; name: string; order?: number; items: ItemPayload[] };

export async function PUT(request: Request) {
  if (!checkAdminPin(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { categories: CategoryPayload[] };
    if (!Array.isArray(body.categories)) {
      return NextResponse.json({ error: 'categories richiesto' }, { status: 400 });
    }
    await prisma.menuItem.deleteMany();
    await prisma.menuCategory.deleteMany();
    for (let i = 0; i < body.categories.length; i++) {
      const cat = body.categories[i];
      const category = await prisma.menuCategory.create({
        data: { name: cat.name, order: cat.order ?? i },
      });
      const items = cat.items || [];
      for (let j = 0; j < items.length; j++) {
        const item = items[j];
        await prisma.menuItem.create({
          data: {
            categoryId: category.id,
            name: item.name,
            price: Number(item.price),
            description: item.description ?? null,
            order: item.order ?? j,
          },
        });
      }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT /api/menu/admin:', error);
    return NextResponse.json(
      { error: 'Errore nel salvataggio del menu' },
      { status: 500 }
    );
  }
}
