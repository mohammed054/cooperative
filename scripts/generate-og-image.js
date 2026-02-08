import sharp from 'sharp';

async function generateOpenGraphImage() {
  try {
    console.log('Generating Open Graph image...');
    
    // Create 1200x630 image with brand colors and logo
    const canvas = sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background: { r: 26, g: 26, b: 46, alpha: 1 } // Brand dark background
      }
    });

    // Composite logo in center
    const result = await canvas
      .composite([{
        input: 'public/images/logo.webp',
        gravity: 'center'
      }])
      .png()
      .toFile('public/images/og-image.png');
    
    console.log('✅ Open Graph image created: public/images/og-image.png');
    
  } catch (error) {
    console.error('Error generating Open Graph image:', error);
  }
}

generateOpenGraphImage();