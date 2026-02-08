import { prisma } from '@/lib/db';
import type { Metadata } from 'next';
import MenuWrapper from './MenuWrapper';

export const metadata: Metadata = {
  title: 'Menu | Torri Dell\'Acqua',
  description: 'Menu del ristorante Torri dell\'Acqua - Castrignano del Capo',
};

export const dynamic = 'force-dynamic';
export const revalidate = 60;

type Category = { id: string; name: string; order: number; items: { id: string; name: string; price: number; description: string | null; order: number }[] };

export default async function MenuPage({
  searchParams,
}: {
  searchParams?: Promise<{ skipSplash?: string }>;
}) {
  const sp = await (searchParams ?? Promise.resolve({}));
  const skipSplash = sp?.skipSplash === '1';

  let categories: Category[] = [];

  try {
    if (process.env.DATABASE_URL) {
      categories = await prisma.menuCategory.findMany({
        orderBy: { order: 'asc' },
        include: { items: { orderBy: { order: 'asc' } } },
      });
    }
  } catch {
    categories = [];
  }

  return <MenuWrapper categories={categories} skipSplash={skipSplash} />;
}
