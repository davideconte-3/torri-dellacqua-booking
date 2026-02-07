import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DELETE - Elimina prenotazione
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const pin = request.headers.get('x-view-pin');
  const expectedPin = process.env.BOOKING_VIEW_PIN;

  if (!expectedPin || pin !== expectedPin) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    const params = await context.params;
    await prisma.booking.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore eliminazione prenotazione:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'eliminazione' },
      { status: 500 }
    );
  }
}
