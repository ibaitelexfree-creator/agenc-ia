const fs = require('fs');

const coursesPath = 'C:\\Users\\User\\Desktop\\agenc-ia\\apps\\getxobelaeskola-web\\src\\app\\[locale]\\courses\\page.tsx';
let coursesContent = fs.readFileSync(coursesPath, 'utf-8');

coursesContent = coursesContent.replace(
    "'Explora nuestro catálogo de cursos de vela, kayak y licencias de navegación en Getxo. Formación náutica para todos los niveles.'",
    "'En Getxo Bela Eskola ofrecemos cursos para todas las edades y niveles, siempre desde un enfoque cercano, progresivo y adaptado a cada persona.'"
);

fs.writeFileSync(coursesPath, coursesContent, 'utf-8');

const rentalPath = 'C:\\Users\\User\\Desktop\\agenc-ia\\apps\\getxobelaeskola-web\\src\\app\\[locale]\\rental\\page.tsx';
let rentalContent = fs.readFileSync(rentalPath, 'utf-8');
// rental page already uses getTranslations for metadata, so no hardcoded text needs replacing.

console.log('courses metadata updated');
