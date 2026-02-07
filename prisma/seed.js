const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const jsonPath = path.join(process.cwd(), 'data', 'menu-torridellacqua.json');
  if (!fs.existsSync(jsonPath)) {
    console.warn('File data/menu-torridellacqua.json non trovato. Esegui prima: node scripts/extract-menu.js <path-to-ThinkSmartMenu.html>');
    return;
  }
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();

  for (let i = 0; i < data.categories.length; i++) {
    const cat = data.categories[i];
    const category = await prisma.menuCategory.create({
      data: { name: cat.categoria, order: i },
    });
    for (let j = 0; j < cat.items.length; j++) {
      const item = cat.items[j];
      await prisma.menuItem.create({
        data: {
          categoryId: category.id,
          name: item.nome,
          price: item.prezzo,
          description: item.descrizione ?? null,
          order: j,
        },
      });
    }
  }
  const total = data.categories.reduce((a, c) => a + c.items.length, 0);
  console.log('Seed menu: categorie', data.categories.length, '- voci', total);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
