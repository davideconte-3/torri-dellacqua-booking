import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';

const prisma = new PrismaClient();
const SAN_VALENTINO_DATE = '2026-02-14';

function formatItalianDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatItalianDateLong(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

type EmailTheme = {
  cardBg: string;
  headerBg: string;
  accent: string;
  accentLight: string;
  border: string;
  boxBg: string;
  boxBorder: string;
  extraBoxBg: string;
  extraBoxBorder: string;
  footerMuted: string;
};

const themeSanValentino: EmailTheme = {
  cardBg: '#4a1f1f',
  headerBg: '#3d1a1a',
  accent: '#ffa6b8',
  accentLight: '#fecddd',
  border: '#8a4a4a',
  boxBg: '#5a2828',
  boxBorder: '#8a4a4a',
  extraBoxBg: '#6a3838',
  extraBoxBorder: '#ffa6b8',
  footerMuted: '#cc8899',
};

const themeGeneric: EmailTheme = {
  cardBg: '#34495e',
  headerBg: '#2c3e50',
  accent: '#63B1D2',
  accentLight: '#a8d4e6',
  border: '#4a6572',
  boxBg: '#3d5666',
  boxBorder: '#4a6572',
  extraBoxBg: '#4a6572',
  extraBoxBorder: '#63B1D2',
  footerMuted: '#7f9eb5',
};

function buildEmailHtml(
  booking: { customerName: string; customerEmail: string; customerPhone: string; date: string; time: string; guests: number; notes: string | null },
  theme: EmailTheme,
  options: {
    siteUrl: string;
    restaurantAddress: string;
    showEventBlock: boolean;
    eventBadgeHtml: string;
    footerDisclaimer: string;
  },
  title: string,
  intro: string,
  extra?: string
) {
  const when = `${formatItalianDate(booking.date)} · ore ${booking.time}`;
  const eventBlock = options.showEventBlock
    ? `
            <tr>
              <td style="padding:30px 30px 20px 30px;text-align:center;background-color:${theme.headerBg};">
                <img src="${options.siteUrl}/sanvalentino-title-white.png" alt="San Valentino" width="280" style="display:block;margin:0 auto;width:280px;height:auto;max-width:100%;" />
              </td>
            </tr>
            <tr>
              <td style="padding:0 30px 30px 30px;text-align:center;background-color:${theme.headerBg};">
                <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;background-color:rgba(255,255,255,0.1);border:2px solid ${theme.accentLight};border-radius:25px;">
                  <tr>
                    <td style="padding:10px 25px;color:${theme.accentLight};font-size:14px;font-weight:bold;white-space:nowrap;">
                      Sabato 14 Febbraio 2026 · 60€
                    </td>
                  </tr>
                </table>
              </td>
            </tr>`
    : options.eventBadgeHtml
      ? `
            <tr>
              <td style="padding:0 30px 30px 30px;text-align:center;background-color:${theme.headerBg};">
                <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;background-color:rgba(255,255,255,0.1);border:2px solid ${theme.accentLight};border-radius:25px;">
                  <tr>
                    <td style="padding:10px 25px;color:${theme.accentLight};font-size:14px;font-weight:bold;">
                      ${options.eventBadgeHtml}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>`
      : '';

  return `
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
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:${theme.cardBg};border-radius:12px;">

            <tr>
              <td style="padding:40px 30px 20px 30px;text-align:center;background-color:${theme.headerBg};border-radius:12px 12px 0 0;">
                <img src="${options.siteUrl}/torri-dellacqua-logo-white.png" alt="Torri dell'Acqua" width="200" style="display:block;margin:0 auto;width:200px;height:auto;max-width:100%;" />
              </td>
            </tr>
            ${eventBlock}

            <tr>
              <td style="padding:30px 30px 15px 30px;text-align:center;background-color:${theme.cardBg};">
                <h3 style="margin:0;color:${theme.accent};font-size:24px;font-weight:normal;font-family:Georgia,serif;">
                  ${title}
                </h3>
              </td>
            </tr>

            <tr>
              <td style="padding:0 40px 25px 40px;text-align:center;background-color:${theme.cardBg};color:${theme.accentLight};font-size:16px;line-height:1.6;">
                ${intro}
              </td>
            </tr>

            <tr>
              <td style="padding:0 30px 25px 30px;background-color:${theme.cardBg};">
                <table width="100%" cellpadding="15" cellspacing="0" border="0" style="background-color:${theme.boxBg};border:2px solid ${theme.boxBorder};border-radius:8px;">
                  <tr>
                    <td>
                      <table width="100%" cellpadding="8" cellspacing="0" border="0" style="font-size:15px;">
                        <tr>
                          <td style="padding:8px 0;width:110px;color:${theme.accent};font-weight:bold;">Nome:</td>
                          <td style="padding:8px 0;color:#ffffff;font-weight:bold;">${booking.customerName}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0;color:${theme.accent};font-weight:bold;">Data:</td>
                          <td style="padding:8px 0;color:#ffffff;">${when}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0;color:${theme.accent};font-weight:bold;">Ospiti:</td>
                          <td style="padding:8px 0;color:#ffffff;">${booking.guests} ${booking.guests === 1 ? 'persona' : 'persone'}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0;color:${theme.accent};font-weight:bold;">Telefono:</td>
                          <td style="padding:8px 0;color:#ffffff;">${booking.customerPhone}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0;color:${theme.accent};font-weight:bold;">Email:</td>
                          <td style="padding:8px 0;color:#ffffff;">${booking.customerEmail}</td>
                        </tr>
                        ${booking.notes ? `<tr>
                          <td style="padding:8px 0;color:${theme.accent};font-weight:bold;vertical-align:top;">Note:</td>
                          <td style="padding:8px 0;color:#ffffff;">${booking.notes.replace(/</g, '&lt;')}</td>
                        </tr>` : ''}
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            ${extra ? `
            <tr>
              <td style="padding:0 30px 25px 30px;background-color:${theme.cardBg};">
                <table width="100%" cellpadding="15" cellspacing="0" border="0" style="background-color:${theme.extraBoxBg};border-left:4px solid ${theme.extraBoxBorder};border-radius:8px;">
                  <tr>
                    <td style="color:#ffffff;font-size:15px;line-height:1.6;">
                      ${extra}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>` : ''}

            <tr>
              <td style="padding:30px;text-align:center;background-color:${theme.headerBg};border-top:2px solid ${theme.border};">
                <img src="${options.siteUrl}/torri-dellacqua-logo-white.png" alt="Torri dell'Acqua" width="150" style="display:block;margin:0 auto 15px auto;width:150px;height:auto;max-width:100%;opacity:0.6;" />
                <div style="color:${theme.accent};font-size:14px;line-height:1.6;margin-bottom:15px;">
                  ${options.restaurantAddress}
                </div>
                <div style="color:${theme.footerMuted};font-size:12px;line-height:1.5;">
                  ${options.footerDisclaimer}
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}

async function sendBookingEmails(
  booking: {
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
  },
  options: { fromSanValentino: boolean }
) {
  const restaurantName = process.env.RESTAURANT_NAME || "Torri dell'Acqua";
  const restaurantAddress =
    process.env.RESTAURANT_ADDRESS ||
    "Via Dante Alighieri n. 8, 73040 Marina di Leuca (LE)";

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY non configurata, email non inviata.');
    return;
  }

  let restaurantEmail = process.env.RESTAURANT_EMAIL || 'info@torridellacqua.it';
  try {
    const notificationEmailSetting = await prisma.settings.findUnique({
      where: { key: 'notification_email' },
    });
    if (notificationEmailSetting?.value) {
      restaurantEmail = notificationEmailSetting.value;
    }
  } catch {
    // use env fallback
  }

  const resend = new Resend(apiKey);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prenota.torridellacqua.it';
  const isSanValentino = options.fromSanValentino;

  const theme = isSanValentino ? themeSanValentino : themeGeneric;
  const eventBadgeGeneric = formatItalianDateLong(booking.date);

  const emailOptions = isSanValentino
    ? {
        siteUrl,
        restaurantAddress,
        showEventBlock: true,
        eventBadgeHtml: '',
        footerDisclaimer: 'Messaggio generato automaticamente<br />dal sistema prenotazioni San Valentino',
      }
    : {
        siteUrl,
        restaurantAddress,
        showEventBlock: false,
        eventBadgeHtml: eventBadgeGeneric,
        footerDisclaimer: 'Messaggio generato automaticamente<br />dal sistema prenotazioni',
      };

  const subjectCustomer = isSanValentino
    ? `Conferma prenotazione San Valentino - ${restaurantName}`
    : `Conferma prenotazione - ${restaurantName}`;
  const subjectAdmin = isSanValentino
    ? `Nuova prenotazione San Valentino - ${booking.customerName}`
    : `Nuova prenotazione - ${booking.customerName}`;

  const htmlCustomer = buildEmailHtml(
    booking,
    theme,
    emailOptions,
    'Prenotazione Ricevuta',
    isSanValentino
      ? "Grazie per aver scelto Torri dell'Acqua per la vostra cena di San Valentino. La tua richiesta di prenotazione è stata ricevuta con successo."
      : "La tua richiesta di prenotazione è stata ricevuta. Ti contatteremo al più presto per conferma. Per modifiche o annullamenti rispondi a questa email o contatta il ristorante.",
    'Per qualsiasi modifica o annullamento, contattaci rispondendo a questa email o telefonando al ristorante. Ti aspettiamo.'
  );

  const htmlAdmin = buildEmailHtml(
    booking,
    theme,
    emailOptions,
    'Nuova Prenotazione Ricevuta',
    isSanValentino
      ? "È stata ricevuta una nuova richiesta di prenotazione per la cena di San Valentino. Verifica i dettagli qui sotto."
      : "È stata ricevuta una nuova richiesta di prenotazione. Verifica i dettagli qui sotto.",
    isSanValentino
      ? `<strong>Totale:</strong> ${booking.guests} ${booking.guests === 1 ? 'persona' : 'persone'} × 60€ = ${booking.guests * 60}€`
      : undefined
  );

  try {
    await resend.emails.send({
      from:
        process.env.RESEND_FROM ||
        `Torri dell'Acqua <no-reply@${process.env.RESEND_DOMAIN || 'example.com'}>`,
      to: booking.customerEmail,
      subject: subjectCustomer,
      html: htmlCustomer,
    });
  } catch (err) {
    console.error('Errore invio email cliente:', err);
  }

  try {
    await resend.emails.send({
      from:
        process.env.RESEND_FROM ||
        `Torri dell'Acqua <no-reply@${process.env.RESEND_DOMAIN || 'example.com'}>`,
      to: restaurantEmail,
      subject: subjectAdmin,
      html: htmlAdmin,
    });
  } catch (err) {
    console.error('Errore invio email ristorante:', err);
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

    const fromSanValentino = data.source === 'sanvalentino';
    sendBookingEmails(booking, { fromSanValentino }).catch((err) =>
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

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ bookings: [] });
  }

  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Errore recupero prenotazioni:', error);
    return NextResponse.json({ bookings: [] });
  }
}
