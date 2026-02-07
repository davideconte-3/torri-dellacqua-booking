const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importMenu() {
  try {
    console.log('🍽️  Checking menu status...');

    // Check if menu already exists
    const existingCount = await prisma.menuCategory.count();

    if (existingCount > 0) {
      console.log(`✅ Menu already exists (${existingCount} categories found)`);
      console.log('   Skipping import to avoid duplicates.');
      return;
    }

    console.log('📂 Menu is empty. Starting import...\n');

    // Read menu data
    const menuPath = path.join(__dirname, '../data/menu-torridellacqua.json');

    if (!fs.existsSync(menuPath)) {
      console.error('❌ Menu file not found:', menuPath);
      console.log('   Create data/menu-torridellacqua.json with menu data.');
      return;
    }

    const menuData = JSON.parse(fs.readFileSync(menuPath, 'utf8'));

    if (!Array.isArray(menuData.categories)) {
      console.error('❌ Invalid menu format. Expected { categories: [...] }');
      return;
    }

    // Import categories and items
    let totalCategories = 0;
    let totalItems = 0;

    for (const category of menuData.categories) {
      console.log(`  📁 Importing category: ${category.name}`);

      const createdCategory = await prisma.menuCategory.create({
        data: {
          name: category.name,
          order: category.order || 0,
          items: {
            create: (category.items || []).map((item, index) => ({
              name: item.name,
              price: item.price,
              description: item.description || null,
              order: item.order !== undefined ? item.order : index,
            })),
          },
        },
      });

      totalCategories++;
      totalItems += category.items?.length || 0;

      console.log(`     ✓ Added ${category.items?.length || 0} items`);
    }

    console.log('\n🎉 Menu import complete!');
    console.log(`   📊 ${totalCategories} categories`);
    console.log(`   🍴 ${totalItems} items\n`);
  } catch (error) {
    console.error('❌ Error importing menu:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  importMenu()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { importMenu };
