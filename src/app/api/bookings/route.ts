import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';

const prisma = new PrismaClient();

function formatItalianDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

async function sendBookingEmails(booking: {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  notes: string | null;
  privacyConsent: boolean;
  marketingConsent: boolean;
}) {
  const restaurantName = process.env.RESTAURANT_NAME || "Torri dell'Acqua";
  const restaurantAddress =
    process.env.RESTAURANT_ADDRESS ||
    "Via Dante Alighieri n. 8, 73040 Castrignano del Capo (LE)";
  const themeColor = '#3d1a1a';

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY non configurata, email non inviata.');
    return;
  }

  // Recupera email notifica da DB o fallback su env
  let restaurantEmail = process.env.RESTAURANT_EMAIL || 'info@torridellacqua.it';
  try {
    const notificationEmailSetting = await prisma.settings.findUnique({
      where: { key: 'notification_email' },
    });
    if (notificationEmailSetting?.value) {
      restaurantEmail = notificationEmailSetting.value;
      console.log('📧 Email notifica da DB:', restaurantEmail);
    }
  } catch (err) {
    console.warn('⚠️ Errore recupero email notifica da DB, uso env:', err);
  }

  const resend = new Resend(apiKey);
  const when = `${formatItalianDate(booking.date)} · ore ${booking.time}`;
  const subjectCustomer = `Conferma prenotazione San Valentino - ${restaurantName}`;
  const subjectAdmin = `Nuova prenotazione San Valentino - ${booking.customerName}`;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prenota.torridellacqua.it';

  const baseHtml = (title: string, intro: string, extra?: string) => `
  <div style="background:#1a0a0c;margin:0;padding:32px 16px;font-family:'Playfair Display',Georgia,serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:linear-gradient(180deg,#3d1a1a 0%,#2d1515 100%);border-radius:24px;overflow:hidden;border:1px solid rgba(254,205,211,0.2);box-shadow:0 20px 60px rgba(0,0,0,0.5);">

      <!-- Logo Ristorante -->
      <tr>
        <td style="padding:40px 24px 24px 24px;text-align:center;">
          <img src="${siteUrl}/torri-dellacqua-logo.svg" alt="Torri dell'Acqua" width="180" height="auto" style="display:block;margin:0 auto;max-width:180px;height:auto;filter:brightness(0) saturate(100%) invert(85%) sepia(12%) saturate(766%) hue-rotate(296deg) brightness(103%) contrast(97%);" />
        </td>
      </tr>

      <!-- Titolo San Valentino -->
      <tr>
        <td style="padding:0 24px 32px 24px;text-align:center;">
          <img src="${siteUrl}/sanvalentino-title.svg" alt="San Valentino" width="240" height="auto" style="display:block;margin:0 auto;max-width:240px;height:auto;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.3));" />
        </td>
      </tr>

      <!-- Info Badge -->
      <tr>
        <td style="padding:0 24px 24px 24px;text-align:center;">
          <div style="display:inline-block;padding:8px 24px;border-radius:999px;background:rgba(254,205,211,0.1);border:1px solid rgba(254,205,211,0.3);color:#fecddd;font-size:13px;font-weight:500;letter-spacing:0.05em;">
            Sabato 14 Febbraio 2026 · Menu Degustazione 60€
          </div>
        </td>
      </tr>

      <!-- Titolo Sezione -->
      <tr>
        <td style="padding:32px 24px 16px 24px;color:#fecddd;font-size:22px;font-weight:600;text-align:center;letter-spacing:0.02em;">
          ${title}
        </td>
      </tr>

      <!-- Intro Text -->
      <tr>
        <td style="padding:0 32px 24px 32px;color:rgba(254,205,211,0.85);font-size:15px;line-height:1.7;text-align:center;">
          ${intro}
        </td>
      </tr>
      <!-- Dettagli Prenotazione -->
      <tr>
        <td style="padding:0 32px 32px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(0,0,0,0.3);border-radius:16px;border:1px solid rgba(254,205,211,0.15);padding:24px;">
            <tr>
              <td>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 10px;font-size:14px;color:#fecddd;">
                  <tr>
                    <td style="padding:8px 0;width:120px;color:rgba(254,205,211,0.6);font-weight:500;">Nome</td>
                    <td style="padding:8px 0;color:#fecddd;font-weight:500;">${booking.customerName}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:rgba(254,205,211,0.6);font-weight:500;">Quando</td>
                    <td style="padding:8px 0;color:#fecddd;">${when}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:rgba(254,205,211,0.6);font-weight:500;">Ospiti</td>
                    <td style="padding:8px 0;color:#fecddd;">${booking.guests} ${booking.guests === 1 ? 'persona' : 'persone'}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:rgba(254,205,211,0.6);font-weight:500;">Telefono</td>
                    <td style="padding:8px 0;color:#fecddd;">${booking.customerPhone}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:rgba(254,205,211,0.6);font-weight:500;">Email</td>
                    <td style="padding:8px 0;color:#fecddd;">${booking.customerEmail}</td>
                  </tr>
                  ${booking.notes ? `<tr>
                    <td style="padding:8px 0;color:rgba(254,205,211,0.6);font-weight:500;vertical-align:top;">Note</td>
                    <td style="padding:8px 0;color:#fecddd;">${booking.notes.replace(/</g, '&lt;')}</td>
                  </tr>` : ''}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      ${
        extra
          ? `<tr>
              <td style="padding:0 32px 24px 32px;">
                <div style="background:rgba(212,149,160,0.1);border-left:3px solid #D495A0;padding:16px 20px;border-radius:8px;color:rgba(254,205,211,0.9);font-size:14px;line-height:1.7;">
                  ${extra}
                </div>
              </td>
            </tr>`
          : ''
      }

      <!-- Footer -->
      <tr>
        <td style="padding:32px 24px 24px 24px;border-top:1px solid rgba(254,205,211,0.15);text-align:center;">
          <img src="${siteUrl}/torri-dellacqua-logo.svg" alt="Torri dell'Acqua" width="140" height="auto" style="display:block;margin:0 auto 16px auto;max-width:140px;height:auto;opacity:0.5;filter:brightness(0) saturate(100%) invert(85%) sepia(12%) saturate(766%) hue-rotate(296deg) brightness(103%) contrast(97%);" />

          <div style="color:rgba(254,205,211,0.7);font-size:13px;line-height:1.6;margin-bottom:8px;">
            <strong style="color:rgba(254,205,211,0.9);">${restaurantName}</strong><br />
            ${restaurantAddress}
          </div>

          <div style="color:rgba(254,205,211,0.5);font-size:11px;line-height:1.5;margin-top:16px;">
            Questo messaggio è stato generato automaticamente<br />dal sistema di prenotazioni San Valentino
          </div>
        </td>
      </tr>
    </table>
  </div>`;

  try {
    console.log('📤 Invio email CLIENTE...');
    console.log('  - Destinatario:', booking.customerEmail);
    console.log('  - From:', process.env.RESEND_FROM);

    const result = await resend.emails.send({
      from:
        process.env.RESEND_FROM ||
        `Torri dell'Acqua <no-reply@${process.env.RESEND_DOMAIN || 'example.com'}>`,
      to: booking.customerEmail,
      subject: subjectCustomer,
      html: baseHtml(
        'Prenotazione Ricevuta',
        'Grazie per aver scelto Torri dell\'Acqua per la vostra cena di San Valentino. La tua richiesta di prenotazione è stata ricevuta con successo.',
        'Per qualsiasi modifica o annullamento, contattaci rispondendo a questa email o telefonando al ristorante. Ti aspettiamo per una serata indimenticabile.'
      ),
    });
    console.log('✅ Email cliente inviata con successo! ID:', result.data?.id);
  } catch (err) {
    console.error('❌ ERRORE invio email cliente:');
    console.error('  - Errore completo:', err);
    console.error('  - Tipo errore:', typeof err);
    if (err && typeof err === 'object') {
      console.error('  - Dettagli:', JSON.stringify(err, null, 2));
    }
  }

  try {
    console.log('📤 Invio email RISTORANTE...');
    console.log('  - Destinatario:', restaurantEmail);
    console.log('  - From:', process.env.RESEND_FROM);

    const result = await resend.emails.send({
      from:
        process.env.RESEND_FROM ||
        `Torri dell'Acqua <no-reply@${process.env.RESEND_DOMAIN || 'example.com'}>`,
      to: restaurantEmail,
      subject: subjectAdmin,
      html: baseHtml(
        'Nuova Prenotazione Ricevuta',
        'È stata ricevuta una nuova richiesta di prenotazione per la cena di San Valentino. Verifica i dettagli qui sotto.',
        `<strong>Totale:</strong> ${booking.guests} ${booking.guests === 1 ? 'persona' : 'persone'} × 60€ = ${booking.guests * 60}€`
      ),
    });
    console.log('✅ Email ristorante inviata con successo! ID:', result.data?.id);
  } catch (err) {
    console.error('❌ ERRORE invio email ristorante:');
    console.error('  - Errore completo:', err);
    console.error('  - Tipo errore:', typeof err);
    if (err && typeof err === 'object') {
      console.error('  - Dettagli:', JSON.stringify(err, null, 2));
    }
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.privacyConsent) {
      return NextResponse.json(
        { success: false, error: 'È necessario accettare l\'informativa sulla privacy.' },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        date: data.date,
        time: data.time,
        guests: parseInt(data.guests),
        notes: data.notes || null,
        privacyConsent: !!data.privacyConsent,
        marketingConsent: !!data.marketingConsent,
      },
    });

    // Invia email di conferma (non blocca la risposta in caso di errore)
    sendBookingEmails(booking).catch((err) =>
      console.error('Errore invio email (async):', err)
    );

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error('Errore creazione prenotazione:', error);
    return NextResponse.json(
      { success: false, error: 'Errore durante la prenotazione' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const pin = request.headers.get('x-view-pin');
  const expectedPin = process.env.BOOKING_VIEW_PIN;

  if (!expectedPin || pin !== expectedPin) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }

  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Errore recupero prenotazioni:', error);
    return NextResponse.json(
      { success: false, error: 'Errore durante il recupero' },
      { status: 500 }
    );
  }
}
