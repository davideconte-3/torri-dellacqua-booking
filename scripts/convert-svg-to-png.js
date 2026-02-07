const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertSvgToPng() {
  const publicDir = path.join(__dirname, '../public');

  const files = [
    {
      input: path.join(publicDir, 'torri-dellacqua-logo.svg'),
      output: path.join(publicDir, 'torri-dellacqua-logo-white.png'),
      width: 600,
    },
    {
      input: path.join(publicDir, 'sanvalentino-title.svg'),
      output: path.join(publicDir, 'sanvalentino-title-white.png'),
      width: 800,
    }
  ];

  for (const file of files) {
    try {
      console.log(`Converting ${path.basename(file.input)}...`);

      // Read SVG
      let svgContent = fs.readFileSync(file.input, 'utf8');

      // Replace colors with white
      svgContent = svgContent
        .replace(/fill:rgb\([^)]+\)/g, 'fill:rgb(255,255,255)')
        .replace(/fill="#[^"]+"/g, 'fill="#ffffff"')
        .replace(/fill='#[^']+'/g, "fill='#ffffff'")
        .replace(/fill-rule:nonzero/g, 'fill:#ffffff;fill-rule:nonzero');

      // Convert to PNG
      await sharp(Buffer.from(svgContent))
        .resize({ width: file.width })
        .png()
        .toFile(file.output);

      console.log(`✅ Created: ${path.basename(file.output)}`);
    } catch (error) {
      console.error(`❌ Error converting ${path.basename(file.input)}:`, error.message);
    }
  }

  console.log('\n🎉 Conversion complete!');
}

convertSvgToPng();
