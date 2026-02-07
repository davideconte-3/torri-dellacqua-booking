import { prisma } from '@/lib/db';
import type { Metadata } from 'next';
import MenuWrapper from './MenuWrapper';

export const metadata: Metadata = {
  title: 'Menu | Torri Dell\'Acqua',
  description: 'Menu del ristorante Torri dell\'Acqua - Castrignano del Capo',
};

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

export default async function MenuPage() {
  const categories = await prisma.menuCategory.findMany({
    orderBy: { order: 'asc' },
    include: { items: { orderBy: { order: 'asc' } } },
  });

  return <MenuWrapper categories={categories} />;
}
