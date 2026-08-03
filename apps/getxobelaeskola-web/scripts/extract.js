const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const scratchDir = path.join(__dirname, '..', 'scratch');

if (!fs.existsSync(scratchDir)) {
  fs.mkdirSync(scratchDir, { recursive: true });
}

function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else if (/\.(tsx|jsx|ts|js)$/.test(file)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allFiles = getFiles(srcDir);
const componentImages = {};

for (const file of allFiles) {
  const normPath = file.replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');
  
  const found = new Set();
  
  const regex1 = /["'`]\s*([^"'`\s]+\.(?:jpg|png|webp|svg|jpeg|gif|avif))["'`]/gi;
  let m;
  while ((m = regex1.exec(content)) !== null) {
    found.add(m[1]);
  }
  
  const regex2 = /(?:src|image|poster)\s*=\s*["'`]?([^"'`\s>]+)["'`]?/gi;
  while ((m = regex2.exec(content)) !== null) {
    if (/\.(jpg|png|webp|svg|jpeg|gif|avif)/i.test(m[1]) || m[1].startsWith('/images') || m[1].startsWith('/img')) {
      found.add(m[1]);
    }
  }

  if (found.size > 0) {
    componentImages[normPath] = Array.from(found);
  }
}

const pageRoutes = [];

for (const file of allFiles) {
  const normPath = file.replace(/\\/g, '/');
  if (normPath.includes('/app/[locale]/') && (normPath.endsWith('/page.tsx') || normPath.endsWith('/page.jsx'))) {
    let routePath = normPath.split('/app/[locale]')[1].replace(/\/page\.(tsx|jsx)$/, '');
    if (routePath === '') routePath = '/';
    
    const content = fs.readFileSync(file, 'utf8');
    const imagesInPage = new Set(componentImages[normPath] || []);

    for (const compPath of Object.keys(componentImages)) {
      const compName = path.basename(compPath, path.extname(compPath));
      if (compName !== 'page' && content.includes(compName)) {
        componentImages[compPath].forEach(img => imagesInPage.add(img));
      }
    }

    if (imagesInPage.size > 0) {
      pageRoutes.push({
        route: routePath,
        urlEn: `http://localhost:3000/en${routePath === '/' ? '' : routePath}`,
        file: normPath,
        imagesCount: imagesInPage.size,
        images: Array.from(imagesInPage)
      });
    }
  }
}

console.log(`Found ${pageRoutes.length} pages with images.`);

let csvContent = '\uFEFF"Route Path","Full URL (English)","Image Count","Image Sources","Source File"\n';
for (const p of pageRoutes) {
  csvContent += `"${p.route}","${p.urlEn}","${p.imagesCount}","${p.images.join('; ')}","${p.file}"\n`;
}

fs.writeFileSync(path.join(scratchDir, 'pages_with_images.csv'), csvContent, 'utf8');
fs.writeFileSync(path.join(scratchDir, 'pages_with_images.json'), JSON.stringify(pageRoutes, null, 2), 'utf8');

console.log('Saved CSV to ./scratch/pages_with_images.csv');
