import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const SAN_VALENTINO_DATE = '2026-02-14';
const EVENT_CLOSE_HOUR = 19; // 19:00

// GET - Check if bookings are enabled
export async function GET() {
  try {
    // Check if we're past event closing time
    const now = new Date();
    const eventDate = new Date(`${SAN_VALENTINO_DATE}T${EVENT_CLOSE_HOUR}:00:00`);

    if (now >= eventDate) {
      return NextResponse.json({
        enabled: false,
        reason: 'event_closed',
        message: 'Le prenotazioni sono chiuse'
      });
    }

    // Check admin settings
    const [enabledSetting, messageSetting] = await Promise.all([
      prisma.settings.findUnique({ where: { key: 'bookings_enabled' } }),
      prisma.settings.findUnique({ where: { key: 'bookings_closed_message' } })
    ]);

    const enabled = enabledSetting?.value === 'true';
    const customMessage = messageSetting?.value || 'Le prenotazioni sono momentaneamente sospese';

    return NextResponse.json({
      enabled,
      reason: enabled ? null : 'admin_disabled',
      message: enabled ? null : customMessage
    });
  } catch (error) {
    console.error('Error checking booking status:', error);
    return NextResponse.json({ enabled: true }); // Fail open
  }
}

// POST - Toggle bookings (admin only)
export async function POST(request: Request) {
  try {
    const pin = request.headers.get('X-View-Pin');
    const expectedPin = process.env.BOOKING_VIEW_PIN || '1234';

    if (pin !== expectedPin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { enabled, message } = await request.json();

    // Update enabled status
    await prisma.settings.upsert({
      where: { key: 'bookings_enabled' },
      update: { value: String(enabled) },
      create: { key: 'bookings_enabled', value: String(enabled) }
    });

    // Update custom message if provided
    if (message !== undefined && message !== null) {
      await prisma.settings.upsert({
        where: { key: 'bookings_closed_message' },
        update: { value: message },
        create: { key: 'bookings_closed_message', value: message }
      });
    }

    return NextResponse.json({ success: true, enabled, message });
  } catch (error) {
    console.error('Error toggling bookings:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
