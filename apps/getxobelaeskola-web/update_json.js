const fs = require('fs');
const path = require('path');

const jsonPath = 'C:\\Users\\User\\Desktop\\agenc-ia\\apps\\getxobelaeskola-web\\messages\\es.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// Update Home -> Hero
data.home.hero.slide1_title = "¿Qué es Getxo";
data.home.hero.slide1_subtitle = "Bela Eskola? No somos una escuela convencional, sino una comunidad cercana construida alrededor de la mar y los valores que la acompañan.";
data.home.hero.slide1_action = "Nuestra Filosofía";

data.home.hero.slide2_title = "La Vela se Adapta a Ti";
data.home.hero.slide2_subtitle = "Navegación a la carta, según cómo quieras vivir el mar. La vela no es un deporte rígido. Es una forma de vivir el mar que se adapta a ti.";
data.home.hero.slide2_action = "Ver Opciones";

data.home.hero.slide3_title = "Descubre Tu Camino";
data.home.hero.slide3_subtitle = "Desde un nivel básico hasta medio, para jóvenes y adultos. Tenemos un plan para ti.";
data.home.hero.slide3_action = "Nuestros Cursos";

data.home.hero.slide4_title = "¿Por qué navegar con nosotros?";
data.home.hero.slide4_subtitle = "Económico, Comunidad, A tu medida. Cada persona es diferente, y aquí lo tenemos muy en cuenta.";
data.home.hero.slide4_action = "Hazte Socia";

// Update Home -> Filosofía (Experience)
data.home.experience.filosofia = "¿QUÉ ES GETXO BELA ESKOLA?";
data.home.experience.lifestyle_title = "No somos una";
data.home.experience.lifestyle_subtitle = "escuela convencional";
data.home.experience.desc1 = "Somos una comunidad cercana construida alrededor de la mar y los valores que la acompañan. Un lugar donde aprender a navegar va de la mano de compartir, disfrutar y crecer en grupo.";
data.home.experience.desc2 = "Creemos en un aprendizaje natural, accesible y sin presión, donde cada persona encuentra su ritmo. Más allá del agua, somos un punto de encuentro donde se generan vínculos, confianza y una forma de entender la mar que invita a volver.";

// Update Home -> Programas
data.home.programs.badge = "DESCUBRE TU CAMINO";
data.home.programs.title = "Aprende a Navegar";
data.home.programs.licencia_title = "Jóvenes (Básico / Medio)";
data.home.programs.licencia_desc = "Txikigune (Días sueltos), Udalekuak (5 días) y entrenamientos continuos 3 días al mes.";
data.home.programs.licencia_price = "A consultar";
data.home.programs.j80_title = "Adultos (Iniciación)";
data.home.programs.j80_desc = "Crucero iniciación. Primer contacto con la navegación en crucero adaptado a cada persona.";
data.home.programs.j80_price = "A consultar";
data.home.programs.rental_title = "Adultos (Nivel Medio)";
data.home.programs.rental_desc = "Vela ligera iniciación/avanzado, Crucero perfeccionamiento, Crucero con gennaker y tecnificación.";
data.home.programs.price_rental = "A consultar";

// Update about_page
data.about_page.header_badge = "CONÓCENOS";
data.about_page.header_title = "Historia del";
data.about_page.header_highlight = "Club";
data.about_page.header_suffix = "Getxo Bela Eskola";
data.about_page.desc1 = "Hace más de 15 años nacimos en Getxo con un objetivo claro: acercar la mar a todas las personas desde un enfoque humano, educativo y accesible. Somos una asociación sin ánimo de lucro y un proyecto social que entiende la vela como una herramienta de aprendizaje, de convivencia y de transformación personal.";
data.about_page.desc2 = "Con los años hemos ido creciendo, profesionalizándonos y ampliando actividades, siempre con la misma base: poner a las personas en el centro. La Eskola sigue siendo un lugar cercano, sencillo y construido desde la comunidad.";

data.about_page.team_section_title = "El Equipo";
data.about_page.team.member1_name = "Angharad y Urko";
data.about_page.team.member1_role = "Coordinación";
data.about_page.team.member1_desc = "Nuestro equipo está formado por personas técnicas y con sensibilidad social, apasionadas por la enseñanza y por la mar. Angharad y Urko coordinan la eskola y la operativa diaria, y además ejercen como técnicas deportivas.";
data.about_page.team.member2_name = "Monitoras y técnicos";
data.about_page.team.member2_role = "Especialistas";
data.about_page.team.member2_desc = "Junto a ellas y ellos, contamos con responsables de mantenimiento, windsurf, entrenadores de Optimist, Laser/420 y J80. Todas comparten una forma de trabajar cercana, tranquila y basada en el acompañamiento.";
data.about_page.team.member3_name = "Comunidad";
data.about_page.team.member3_role = "Socias";
data.about_page.team.member3_desc = "La eskola funciona con una relación sencilla y humana: las monitoras escuchan, observan ritmos, acompañan miedos y fomentan autonomía; el equipo comparte decisiones y la voz de las socias forma parte de la vida del proyecto.";

data.about_page.values.v1_title = "Nuestras Instalaciones";
data.about_page.values.v1_desc = "Ubicadas en una zona privilegiada del Puerto Deportivo de Getxo, a pocos metros de la playa de Ereaga y con salida directa al Abra. Contamos con aula audiovisual, vestuarios cuidados, amplio espacio exterior, taller y zona chill-out con pequeña sauna.";
data.about_page.values.v2_title = "Pantalán Propio";
data.about_page.values.v2_desc = "El pantalán es nuestro enlace directo con la mar. La flota es variada: vela ligera, cruceros, windsurf, big SUP, paddle surf, piraguas y lanchas de apoyo.";
data.about_page.values.v3_title = "Nuestra Filosofía";
data.about_page.values.v3_desc = "Aquí la técnica y el cuidado van juntas, porque entendemos que aprender a navegar es también aprender a confiar.";

// Update courses_page
data.courses_page.header_badge = "SERVICIOS";
data.courses_page.header_title = "Nuestros";
data.courses_page.header_highlight = "Cursos";
data.courses_page.header_desc = "En Getxo Bela Eskola ofrecemos cursos para todas las edades y niveles, siempre desde un enfoque cercano, progresivo y adaptado a cada persona. Nuestro objetivo es que cada una encuentre su lugar en la mar y aprenda a navegar con seguridad, calma y confianza.";

// Add or update club_socias (since it might not exist, we can add it to nav or root)
data.club_socias = {
    "title": "Club de Socias",
    "subtitle": "Un espacio para navegar en comunidad, a tu ritmo y sin prisas.",
    "description1": "Ser parte de Getxo Bela Eskola es pertenecer a una comunidad que comparte la mar desde la cercanía, la calma y el compañerismo. Las personas son el corazón de la Eskola, y aquí la navegación se vive sin prisas y sin distancias.",
    "description2": "Hacemos la vela accesible a todos los públicos y bolsillos, a un precio inmejorable, en un entorno cercano, cuidado y humano. Ser socia permite navegar y entrenar demostrando que navegar nunca había sido tan accesible.",
    "basic": {
        "title": "Socia Básica",
        "price": "630€/año (o 350€ medio año)",
        "includes": [
            "Hasta 30 salidas al año de 4-5 horas cada una",
            "Acceso a un grupo de WhatsApp para formar tripulaciones",
            "Navegar con otras personas o salir por tu cuenta",
            "Ideal para conocer gente y aprender de otras navegantes"
        ]
    },
    "premium": {
        "title": "Pack Completo: Tecnificación + Socia",
        "price": "1200€/año",
        "includes": [
            "Entrenamientos del equipo de tecnificación (3 días al mes, 4 horas)",
            "Salidas ilimitadas como socia",
            "La opción más completa: entrenar de forma estructurada y navegar libremente"
        ]
    },
    "federation": "Federación y seguro: Licencia de la Federación Vasca de Vela (aprox. 64€ anuales)."
};

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
console.log('es.json updated');
