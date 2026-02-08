import { prisma } from '@/lib/db';
import type { Metadata } from 'next';
import MenuWrapper from './MenuWrapper';

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Menu del ristorante Torri dell\'Acqua - Marina di Leuca (LE)',
};

export const dynamic = 'force-dynamic';
export const revalidate = 60;

type Category = { id: string; name: string; order: number; items: { id: string; name: string; price: number; description: string | null; order: number }[] };

type SearchParams = { skipSplash?: string };

export default async function MenuPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const sp = await (searchParams ?? Promise.resolve({} as SearchParams));
  const skipSplash = sp.skipSplash === '1';

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
