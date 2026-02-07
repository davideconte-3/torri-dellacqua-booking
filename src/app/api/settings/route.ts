import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Recupera impostazioni
export async function GET(request: Request) {
  const pin = request.headers.get('x-view-pin');
  const expectedPin = process.env.BOOKING_VIEW_PIN;

  if (!expectedPin || pin !== expectedPin) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    const settings = await prisma.settings.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return NextResponse.json({
      notificationEmail: settingsMap['notification_email'] || process.env.RESTAURANT_EMAIL || process.env.ADMIN_EMAIL || '',
    });
  } catch (error) {
    console.error('Errore recupero impostazioni:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero' },
      { status: 500 }
    );
  }
}

// POST - Aggiorna impostazioni
export async function POST(request: Request) {
  const pin = request.headers.get('x-view-pin');
  const expectedPin = process.env.BOOKING_VIEW_PIN;

  if (!expectedPin || pin !== expectedPin) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    const data = await request.json();

    if (data.notificationEmail !== undefined) {
      await prisma.settings.upsert({
        where: { key: 'notification_email' },
        update: { value: data.notificationEmail },
        create: { key: 'notification_email', value: data.notificationEmail },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore salvataggio impostazioni:', error);
    return NextResponse.json(
      { error: 'Errore durante il salvataggio' },
      { status: 500 }
    );
  }
}
