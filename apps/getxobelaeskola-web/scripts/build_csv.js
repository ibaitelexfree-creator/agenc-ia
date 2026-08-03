const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'scratch', 'pages_with_images.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const cleanData = data.map(item => {
  const contentImages = item.images.filter(img => 
    !img.includes('openstreetmap') && 
    !img.includes('openseamap') && 
    !img.includes('leaflet')
  );
  return {
    ...item,
    contentImages,
    contentImagesCount: contentImages.length
  };
}).filter(item => item.contentImagesCount > 0);

console.log(`Filtered ${cleanData.length} pages with UI/Content images.`);

let csvContent = '\uFEFF"Route Path","Full English Link","Image Count","Image Sources"\n';
for (const p of cleanData) {
  csvContent += `"${p.route}","${p.urlEn}","${p.contentImagesCount}","${p.contentImages.join(' | ')}"\n`;
}

const csvPath = path.join(__dirname, '..', 'scratch', 'getxobelaeskola_images_report.csv');
fs.writeFileSync(csvPath, csvContent, 'utf8');

const jsonPath = path.join(__dirname, '..', 'scratch', 'getxobelaeskola_images_report.json');
fs.writeFileSync(jsonPath, JSON.stringify(cleanData, null, 2), 'utf8');

console.log('Successfully generated Excel CSV report at ./scratch/getxobelaeskola_images_report.csv');
