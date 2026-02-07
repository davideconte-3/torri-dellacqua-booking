const fs = require('fs');
const path = require('path');

const htmlPath = process.argv[2] || path.join(process.env.HOME || '', 'Downloads', 'ThinkSmartMenu.html');
if (!fs.existsSync(htmlPath)) {
  console.error('File non trovato:', htmlPath);
  process.exit(1);
}
const html = fs.readFileSync(htmlPath, 'utf8');

function decode(s) {
  return (s || '')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

// Estrai categorie: sezione tipologia-header con h3, poi container con data-id-tip (il div tipologia-grp)
const categoryBlockRegex = /<section[^>]*tipologia-header[^>]*>[\s\S]*?<h3 class="tipologie-title">([^<]+)<\/h3>[\s\S]*?<\/section>[\s\S]*?<div[^>]*tipologia-grp[^>]*data-id-tip="(\d+)"[^>]*>/gi;
const categories = [];
let m;
while ((m = categoryBlockRegex.exec(html)) !== null) {
  const name = decode(m[1]);
  const id = parseInt(m[2], 10);
  if (!categories.find(c => c.id === id)) categories.push({ id, name });
}
categories.sort((a, b) => a.id - b.id);

// Estrai ogni blocco articolo: dalla opening div alla chiusura </div> del primo livello (semplificato: cerca dati nell'ordine)
const itemsByTip = {};
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
  const prezzo = numeroMatch ? parseFloat(numeroMatch[1].trim()) : parseFloat(dataPr) || 0;
  const descrizione = decode(testoMatch ? testoMatch[1] : '');
  if (!itemsByTip[idtip]) itemsByTip[idtip] = [];
  itemsByTip[idtip].push({
    nome: nome || decode(dataNome),
    prezzo,
    ...(descrizione ? { descrizione } : {}),
  });
}

const menu = categories.map(c => ({
  id: c.id,
  categoria: c.name,
  items: itemsByTip[c.id] || [],
}));

const out = {
  extractedAt: new Date().toISOString(),
  note: 'coperto 3,50€ - terrazza 5,00€',
  categories: menu,
};

const outPath = path.join(__dirname, '..', 'data', 'menu-torridellacqua.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
console.log('Estratto:', outPath);
console.log('Categorie:', menu.length, '- Voci:', menu.reduce((acc, c) => acc + c.items.length, 0));
