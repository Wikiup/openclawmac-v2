const fs = require('fs');
const path = require('path');

const imgPath = path.join(__dirname, 'images', 'apple_mascot.png');
const svgPath = path.join(__dirname, 'images', 'favicon.svg');

const bgBuffer = fs.readFileSync(imgPath);
const b64 = bgBuffer.toString('base64');

const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <clipPath id="squircle">
      <rect width="100" height="100" rx="22" ry="22"/>
    </clipPath>
  </defs>
  <image width="100" height="100" preserveAspectRatio="xMidYMid slice" href="data:image/png;base64,${b64}" clip-path="url(#squircle)" />
</svg>`;

fs.writeFileSync(svgPath, svgCode);
console.log('Created favicon.svg');
