import { NextResponse } from 'next/server';

const DEFAULT_TSM_URL = 'https://www.thinksmartmenu.it/menu/0GZ8O0RFO1';

function checkAdminPin(request: Request): boolean {
  const pin = request.headers.get('X-Admin-PIN') || request.headers.get('X-View-Pin');
  const expected = process.env.BOOKING_VIEW_PIN || process.env.MENU_ADMIN_PIN;
  return !!expected && pin === expected;
}

function decode(s: string): string {
  return (s || '')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

type ScrapedCategory = { id: number; name: string };
type ScrapedItem = { nome: string; prezzo: number; descrizione?: string };

function parseThinkSmartMenuHtml(html: string): { name: string; order: number; items: { name: string; price: number; description: string | null; order: number }[] }[] {
  const categories: ScrapedCategory[] = [];
  const categoryBlockRegex = /<section[^>]*tipologia-header[^>]*>[\s\S]*?<h3 class="tipologie-title">([^<]+)<\/h3>[\s\S]*?<\/section>[\s\S]*?<div[^>]*tipologia-grp[^>]*data-id-tip="(\d+)"[^>]*>/gi;
  let m;
  while ((m = categoryBlockRegex.exec(html)) !== null) {
    const name = decode(m[1]);
    const id = parseInt(m[2], 10);
    if (!categories.find((c) => c.id === id)) categories.push({ id, name });
  }
  categories.sort((a, b) => a.id - b.id);

  const itemsByTip: Record<string, ScrapedItem[]> = {};
  const articoloStart = /<div class="articolo "[^>]*>/g;
  let blockStart;
  while ((blockStart = articoloStart.exec(html)) !== null) {
    const start = blockStart.index;
    const openTag = html.slice(start, html.indexOf('>', start) + 1);
    const idtip = (openTag.match(/data-idtip="(\d+)"/) || [])[1];
    const dataNome = (openTag.match(/data-nome="([^"]*)"/) || [])[1];
    const dataPr = (openTag.match(/data-pr="([^"]*)"/) || [])[1];
    if (!idtip) continue;
    const slice = html.slice(start, start + 2500);
    const nomeMatch = slice.match(/<div class="nome">([^<]*)<\/div>/);
    const numeroMatch = slice.match(/<span class="numero">([^<]*)<\/span>/);
    const testoMatch = slice.match(/<div class="testo">([^<]*)<\/div>/);
    const nome = decode(nomeMatch ? nomeMatch[1] : dataNome);
    const prezzo = numeroMatch ? parseFloat(numeroMatch[1].trim()) : parseFloat(dataPr || '0') || 0;
    const descrizione = decode(testoMatch ? testoMatch[1] : '');
    if (!itemsByTip[idtip]) itemsByTip[idtip] = [];
    itemsByTip[idtip].push({
      nome: nome || decode(dataNome || ''),
      prezzo,
      ...(descrizione ? { descrizione } : {}),
    });
  }

  return categories.map((c, index) => ({
    name: c.name,
    order: index,
    items: (itemsByTip[String(c.id)] || []).map((item, j) => ({
      name: item.nome,
      price: item.prezzo,
      description: item.descrizione ?? null,
      order: j,
    })),
  }));
}

export async function POST(request: Request) {
  if (!checkAdminPin(request)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }
  try {
    let url = DEFAULT_TSM_URL;
    try {
      const body = await request.json().catch(() => ({}));
      if (typeof body.url === 'string' && body.url.startsWith('https://www.thinksmartmenu.it/')) {
        url = body.url;
      }
    } catch {
      // use default
    }

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Errore nel recupero della pagina: ${res.status}` },
        { status: 502 }
      );
    }
    const html = await res.text();
    const categories = parseThinkSmartMenuHtml(html);
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('POST /api/menu/scrape:', error);
    return NextResponse.json(
      { error: 'Errore durante lo scraping del menu' },
      { status: 500 }
    );
  }
}
