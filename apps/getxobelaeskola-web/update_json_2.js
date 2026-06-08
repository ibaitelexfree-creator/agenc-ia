const fs = require('fs');

const jsonPath = 'C:\\Users\\User\\Desktop\\agenc-ia\\apps\\getxobelaeskola-web\\messages\\es.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// Update courses_page
data.courses_page.header_badge = "NUESTRA OFERTA";
data.courses_page.header_title = "Cursos de";
data.courses_page.header_highlight = "Navegación";
data.courses_page.header_desc = "En Getxo Bela Eskola ofrecemos cursos para todas las edades y niveles, siempre desde un enfoque cercano, progresivo y adaptado a cada persona. Nuestro objetivo es que cada una encuentre su lugar en la mar y aprenda a navegar con seguridad, calma y confianza.";

// Update rental_page
data.rental_page.header_eyebrow = "A TU RITMO";
data.rental_page.title_prefix = "Alquiler de";
data.rental_page.title_highlight = "Material";
data.rental_page.description = "Descubre la mar de cerca y a tu ritmo en embarcaciones ágiles y divertidas. Perfecto para disfrutar navegando en libertad. Vela Ligera, Crucero, Windsurf o Big SUP.";

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
console.log('es.json updated again');
