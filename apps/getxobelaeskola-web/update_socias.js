const fs = require('fs');

const pagePath = 'C:\\Users\\User\\Desktop\\agenc-ia\\apps\\getxobelaeskola-web\\src\\app\\[locale]\\club\\socias\\page.tsx';
let content = fs.readFileSync(pagePath, 'utf-8');

// Update text 1
content = content.replace(
    'Únete al club y disfruta de una experiencia náutica premium con acceso prioritario a barcos, formación continua de élite y una comunidad apasionada por la vela.',
    'Un espacio para navegar en comunidad, a tu ritmo y sin prisas. Hacemos la vela accesible a todos los públicos y bolsillos, a un precio inmejorable, en un entorno cercano, cuidado y humano.'
);

// Update text 2
content = content.replace(
    'Ser socia de Getxo Bela Eskola significa entrar en un círculo exclusivo de navegantes que respetan el Cantábrico y buscan la excelencia técnica. Compartimos barcos, entrenamientos y experiencias inolvidables en las aguas del Abra.',
    'Ser parte de Getxo Bela Eskola es pertenecer a una comunidad que comparte la mar desde la cercanía, la calma y el compañerismo. Las personas son el corazón de la Eskola, y aquí la navegación se vive sin prisas y sin distancias.'
);

// Update text 3
content = content.replace(
    'Contamos con cuotas flexibles y adaptadas según tu nivel de uso de la flota, tanto si eres un navegante independiente que busca barcos listos para zarpar, como si quieres aprender en actividades dirigidas.',
    'Aunque la vela suele verse como un mundo elitista, con precios inaccesibles para la mayoría, nuestro objetivo es justo el contrario: acercar la navegación a todos los públicos y a todos los bolsillos. El Club de Socias es una forma de dar continuidad a la navegación y de crear un vínculo estable con la escuela.'
);

// Update benefits
const newBenefits = `const benefits = [
        {
            icon: <Anchor className="w-8 h-8 text-accent" />,
            title: "Socia Básica",
            desc: "Hasta 30 salidas al año de 4-5 horas cada una (en crucero J80 o vela ligera). 630€/año o 350€ por 15 salidas medio año."
        },
        {
            icon: <Users className="w-8 h-8 text-accent" />,
            title: "Pack Completo",
            desc: "Tecnificación + Socia. Participación en entrenamientos (3 días/mes, 4h) y salidas ilimitadas. 1200€/año."
        },
        {
            icon: <Shield className="w-8 h-8 text-accent" />,
            title: "Navega en Grupo",
            desc: "Acceso a un grupo de WhatsApp donde se forman tripulaciones y se organizan salidas según nivel y condiciones."
        },
        {
            icon: <Star className="w-8 h-8 text-accent" />,
            title: "Acompañamiento Real",
            desc: "Las socias aprenden a su ritmo, sin presión, y forman parte de la vida interna del club: propuestas y mejoras compartidas."
        },
        {
            icon: <Award className="w-8 h-8 text-accent" />,
            title: "Comunidad Activa",
            desc: "No se trata solo de venir un día puntual, sino de formar parte de una comunidad que aprende, evoluciona y disfruta junta."
        },
        {
            icon: <Gift className="w-8 h-8 text-accent" />,
            title: "Federación y Seguro",
            desc: "En ambas opciones es necesario federarse en la Federación Vasca de Vela, aportando seguro y acceso a regatas (aprox 64€)."
        }
    ];`;

content = content.replace(/const benefits = \[[\s\S]*?\];/m, newBenefits);

fs.writeFileSync(pagePath, content, 'utf-8');
console.log('socias/page.tsx updated');
