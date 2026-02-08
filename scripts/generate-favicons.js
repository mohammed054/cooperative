import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

// Input and output paths
const inputLogo = 'public/images/logo.webp';
const outputDir = 'public/icons';

// Favicon sizes to generate
const faviconSizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 512, name: 'favicon-512x512.png' }
];

async function generateFavicons() {
  try {
    console.log('Generating favicons from logo...');
    
    // Create output directory if it doesn't exist
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Generate each favicon size
    for (const { size, name } of faviconSizes) {
      console.log(`Generating ${name} (${size}x${size})...`);
      
      await sharp(inputLogo)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 26, g: 26, b: 46, alpha: 1 } // Brand background color
        })
        .png()
        .toFile(path.join(outputDir, name));
      
      console.log(`✓ Created ${name}`);
    }

    console.log('✅ All favicons generated successfully!');
    
    // Update HTML with new favicon links
    const htmlPath = 'dist/index.html';
    let htmlContent = readFileSync(htmlPath, 'utf8');
    
    const faviconLinks = `
    <!-- Favicon -->
    <link rel="icon" type="image/png" sizes="32x32" href="/cooperative/icons/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/cooperative/icons/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/cooperative/icons/apple-touch-icon.png" />
    <link rel="manifest" href="/cooperative/site.webmanifest" />`;

    // Replace existing favicon link
    htmlContent = htmlContent.replace(
      /<link rel="icon"[^>]*>/,
      faviconLinks.trim()
    );
    
    writeFileSync(htmlPath, htmlContent);
    console.log('✅ Updated HTML with new favicon links');
    
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons();