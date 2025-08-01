// Generate placeholder PWA icons
const fs = require('fs');
const path = require('path');

// Create SVG icon template
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">RI</text>
</svg>
`;

// Icon sizes needed for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create icons directory
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons
iconSizes.forEach(size => {
  const svgContent = createSVGIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svgContent.trim());
  console.log(`Generated ${filename}`);
});

// Create a simple PNG fallback using a data URL approach
const createPNGDataURL = (size) => {
  // This is a simple base64 encoded PNG for the RI logo
  // In a real project, you'd use a proper image generation library
  return `data:image/svg+xml;base64,${Buffer.from(createSVGIcon(size)).toString('base64')}`;
};

// Create a simple HTML file to convert SVG to PNG (for reference)
const htmlConverter = `
<!DOCTYPE html>
<html>
<head>
  <title>Icon Converter</title>
</head>
<body>
  <h1>PWA Icons Generated</h1>
  <p>SVG icons have been generated. For production, convert these to PNG format.</p>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 20px; margin: 20px 0;">
    ${iconSizes.map(size => `
      <div style="text-align: center;">
        <img src="icon-${size}x${size}.svg" alt="${size}x${size}" style="width: 64px; height: 64px; border: 1px solid #ccc;">
        <p>${size}x${size}</p>
      </div>
    `).join('')}
  </div>
  <h2>Instructions:</h2>
  <ol>
    <li>Open each SVG file in a graphics editor (like GIMP, Photoshop, or online converter)</li>
    <li>Export as PNG with the corresponding dimensions</li>
    <li>Replace the SVG files with PNG files</li>
    <li>Or use an online SVG to PNG converter</li>
  </ol>
</body>
</html>
`;

fs.writeFileSync(path.join(iconsDir, 'converter.html'), htmlConverter);

console.log('\n✅ PWA icons generated successfully!');
console.log('📁 Location: public/icons/');
console.log('📝 Open public/icons/converter.html to see all icons');
console.log('\n💡 For production:');
console.log('   - Convert SVG icons to PNG format');
console.log('   - Use proper image optimization');
console.log('   - Consider using a tool like PWA Asset Generator');