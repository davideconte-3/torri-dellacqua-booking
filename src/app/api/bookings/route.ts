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
  const restaurantEmail = process.env.RESTAURANT_EMAIL || 'info@torridellacqua.it';
  const restaurantAddress =
    process.env.RESTAURANT_ADDRESS ||
    "Via Dante Alighieri n. 8, 73040 Castrignano del Capo (LE)";
  const themeColor = '#3d1a1a';

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY non configurata, email non inviata.');
    return;
  }

  const resend = new Resend(apiKey);
  const when = `${formatItalianDate(booking.date)} · ore ${booking.time}`;
  const subjectCustomer = `Conferma prenotazione San Valentino - ${restaurantName}`;
  const subjectAdmin = `Nuova prenotazione San Valentino - ${booking.customerName}`;

  const baseHtml = (title: string, intro: string, extra?: string) => `
  <div style="background:#0b0202;margin:0;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:linear-gradient(135deg,#3d1a1a,#120506);border-radius:24px;overflow:hidden;border:1px solid rgba(212,175,55,0.16);">
      <tr>
        <td style="padding:28px 24px 8px 24px;text-align:center;">
          <div style="color:#fbe9f1;font-size:24px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:4px;">San Valentino</div>
          <div style="color:#f9d5dd;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;">Torri dell'acqua</div>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 8px 24px;text-align:center;">
          <div style="display:inline-block;padding:6px 18px;border-radius:999px;border:1px solid rgba(249,213,221,0.7);color:#f9d5dd;font-size:12px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;">
            Sabato 14 Febbraio · 60 € a persona
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 24px 8px 24px;color:#ffeef5;font-size:18px;font-weight:600;text-align:center;">
          ${title}
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 16px 24px;color:#fbe9f1;font-size:14px;line-height:1.6;text-align:center;">
          ${intro}
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 24px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 6px;font-size:13px;color:#fbe9f1;">
            <tr>
              <td style="padding:6px 0;width:110px;color:rgba(249,213,221,0.8);">Nome</td>
              <td style="padding:6px 0;">${booking.customerName}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:rgba(249,213,221,0.8);">Quando</td>
              <td style="padding:6px 0;">${when}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:rgba(249,213,221,0.8);">Ospiti</td>
              <td style="padding:6px 0;">${booking.guests}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:rgba(249,213,221,0.8);">Telefono</td>
              <td style="padding:6px 0;">${booking.customerPhone}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:rgba(249,213,221,0.8);">Email</td>
              <td style="padding:6px 0;">${booking.customerEmail}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:rgba(249,213,221,0.8);vertical-align:top;">Note</td>
              <td style="padding:6px 0;">${booking.notes ? booking.notes.replace(/</g, '&lt;') : '—'}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:rgba(249,213,221,0.8);">Consenso privacy</td>
              <td style="padding:6px 0;">${booking.privacyConsent ? 'Sì' : 'No'}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:rgba(249,213,221,0.8);">Consenso marketing</td>
              <td style="padding:6px 0;">${booking.marketingConsent ? 'Sì' : 'No'}</td>
            </tr>
          </table>
        </td>
      </tr>
      ${
        extra
          ? `<tr><td style="padding:0 24px 20px 24px;color:#fbe9f1;font-size:13px;line-height:1.5;">${extra}</td></tr>`
          : ''
      }
      <tr>
        <td style="padding:16px 24px 20px 24px;border-top:1px solid rgba(212,175,55,0.16);color:rgba(249,213,221,0.7);font-size:11px;line-height:1.6;text-align:center;">
          ${restaurantName}<br />
          ${restaurantAddress}<br />
          Questo messaggio è stato generato automaticamente dal sistema prenotazioni San Valentino.
        </td>
      </tr>
    </table>
  </div>`;

  try {
    await resend.emails.send({
      from:
        process.env.RESEND_FROM ||
        `Torri dell'Acqua <no-reply@${process.env.RESEND_DOMAIN || 'example.com'}>`,
      to: booking.customerEmail,
      subject: subjectCustomer,
      html: baseHtml(
        'La tua prenotazione è stata ricevuta',
        'Grazie per aver prenotato la cena di San Valentino a Torri dell’acqua. Riceverai conferma della prenotazione via email.',
        'Se hai bisogno di modificare o annullare la prenotazione, rispondi a questa email o contatta direttamente il ristorante.'
      ),
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
      html: baseHtml(
        'Nuova prenotazione San Valentino',
        'Hai ricevuto una nuova richiesta di prenotazione per la cena di San Valentino.',
        ''
      ),
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
