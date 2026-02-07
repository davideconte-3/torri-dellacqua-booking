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

  const baseHtml = (title: string, intro: string, extra?: string) => `
  <!DOCTYPE html>
  <html lang="it">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Georgia,serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;padding:20px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#4a1f1f;border-radius:12px;">

            <!-- Header con Logo Testuale -->
            <tr>
              <td style="padding:40px 30px 20px 30px;text-align:center;background-color:#3d1a1a;border-radius:12px 12px 0 0;">
                <h1 style="margin:0;color:#fecddd;font-size:32px;font-weight:normal;letter-spacing:2px;font-family:Georgia,serif;">
                  TORRI DELL'ACQUA
                </h1>
                <div style="margin-top:8px;color:#fecddd;font-size:14px;letter-spacing:3px;opacity:0.8;">
                  RISTORANTE
                </div>
              </td>
            </tr>

            <!-- Titolo San Valentino -->
            <tr>
              <td style="padding:30px 30px 20px 30px;text-align:center;background-color:#3d1a1a;">
                <h2 style="margin:0;color:#ffa6b8;font-size:36px;font-weight:normal;font-family:Georgia,serif;text-shadow:2px 2px 4px rgba(0,0,0,0.3);">
                  ♥ San Valentino ♥
                </h2>
              </td>
            </tr>

            <!-- Badge Info -->
            <tr>
              <td style="padding:0 30px 30px 30px;text-align:center;background-color:#3d1a1a;">
                <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;background-color:rgba(255,255,255,0.1);border:2px solid #fecddd;border-radius:25px;">
                  <tr>
                    <td style="padding:10px 25px;color:#fecddd;font-size:14px;font-weight:bold;white-space:nowrap;">
                      Sabato 14 Febbraio 2026 · 60€
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Titolo Sezione -->
            <tr>
              <td style="padding:30px 30px 15px 30px;text-align:center;background-color:#4a1f1f;">
                <h3 style="margin:0;color:#ffa6b8;font-size:24px;font-weight:normal;font-family:Georgia,serif;">
                  ${title}
                </h3>
              </td>
            </tr>

            <!-- Intro Text -->
            <tr>
              <td style="padding:0 40px 25px 40px;text-align:center;background-color:#4a1f1f;color:#fecddd;font-size:16px;line-height:1.6;">
                ${intro}
              </td>
            </tr>
            <!-- Dettagli Prenotazione -->
            <tr>
              <td style="padding:0 30px 25px 30px;background-color:#4a1f1f;">
                <table width="100%" cellpadding="15" cellspacing="0" border="0" style="background-color:#5a2828;border:2px solid #8a4a4a;border-radius:8px;">
                  <tr>
                    <td>
                      <table width="100%" cellpadding="8" cellspacing="0" border="0" style="font-size:15px;">
                        <tr>
                          <td style="padding:8px 0;width:110px;color:#ffa6b8;font-weight:bold;">Nome:</td>
                          <td style="padding:8px 0;color:#ffffff;font-weight:bold;">${booking.customerName}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0;color:#ffa6b8;font-weight:bold;">Data:</td>
                          <td style="padding:8px 0;color:#ffffff;">${when}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0;color:#ffa6b8;font-weight:bold;">Ospiti:</td>
                          <td style="padding:8px 0;color:#ffffff;">${booking.guests} ${booking.guests === 1 ? 'persona' : 'persone'}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0;color:#ffa6b8;font-weight:bold;">Telefono:</td>
                          <td style="padding:8px 0;color:#ffffff;">${booking.customerPhone}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0;color:#ffa6b8;font-weight:bold;">Email:</td>
                          <td style="padding:8px 0;color:#ffffff;">${booking.customerEmail}</td>
                        </tr>
                        ${booking.notes ? `<tr>
                          <td style="padding:8px 0;color:#ffa6b8;font-weight:bold;vertical-align:top;">Note:</td>
                          <td style="padding:8px 0;color:#ffffff;">${booking.notes.replace(/</g, '&lt;')}</td>
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
                    <td style="padding:0 30px 25px 30px;background-color:#4a1f1f;">
                      <table width="100%" cellpadding="15" cellspacing="0" border="0" style="background-color:#6a3838;border-left:4px solid #ffa6b8;border-radius:8px;">
                        <tr>
                          <td style="color:#ffffff;font-size:15px;line-height:1.6;">
                            ${extra}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>`
                : ''
            }

            <!-- Footer -->
            <tr>
              <td style="padding:30px;text-align:center;background-color:#3d1a1a;border-top:2px solid #8a4a4a;">
                <div style="color:#fecddd;font-size:18px;font-weight:bold;margin-bottom:10px;letter-spacing:1px;">
                  TORRI DELL'ACQUA
                </div>
                <div style="color:#ffa6b8;font-size:14px;line-height:1.6;margin-bottom:15px;">
                  ${restaurantAddress}
                </div>
                <div style="color:#cc8899;font-size:12px;line-height:1.5;">
                  Messaggio generato automaticamente<br />dal sistema prenotazioni San Valentino
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;

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
