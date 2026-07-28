const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '../src/app/[locale]');

// Folders to exclude from the public tree extractor as requested
const EXCLUDED_FOLDERS = ['academy', 'wind-lab', 'home2', 'test-chart', 'test-parallax'];

// List of top-level route folders considered authenticated / private
const PROTECTED_PREFIXES = ['student', 'instructor', 'logbook', 'auth'];

// English translation dictionary for routes and paths
const ENGLISH_NAMES = {
    '/': 'Home',
    '/about': 'About Us',
    '/blog': 'Blog',
    '/blog/aprendizaje': 'Blog > Learning',
    '/blog/noticias': 'Blog > News',
    '/club': 'Club',
    '/club/conocenos': 'Club > About Us',
    '/club/que-es-la-vela': 'Club > What is Sailing',
    '/club/regatas': 'Club > Regattas',
    '/club/socias': 'Club > Members',
    '/contact': 'Contact',
    '/contacto': 'Contact',
    '/contacto/localizacion': 'Contact > Location',
    '/contacto/trabaja-con-nosotras': 'Contact > Work With Us',
    '/contacto/voluntaria': 'Contact > Volunteer',
    '/cookies': 'Cookies Policy',
    '/courses': 'Courses',
    '/courses/[slug]': 'Course Details ([slug])',
    '/declaracion-de-accesibilidad': 'Accessibility Statement',
    '/experiences': 'Experiences',
    '/exploration': 'Exploration',
    '/glosario': 'Glossary',
    '/lab': 'Laboratory',
    '/privacy': 'Privacy Policy',
    '/rental': 'Rentals',
    '/servicios': 'Services',
    '/servicios/alquileres': 'Services > Equipment Rentals',
    '/servicios/centros-escolares': 'Services > School Groups',
    '/servicios/cumpleanos': 'Services > Birthday Events',
    '/servicios/cursos': 'Services > Sailing Courses',
    '/servicios/equipos': 'Services > Teams',
    '/servicios/material': 'Services > Gear & Equipment',
    '/servicios/socias': 'Services > Membership',
    '/servicios/team-building': 'Services > Team Building',
    '/servicios/tienda': 'Services > Store / Shop',
    '/servicios/udalekuak': 'Services > Summer Camps',
    '/skills': 'Sailing Skills',
    '/staff': 'Staff Portal',
    '/staff/activity/[userId]': 'Staff > User Activity',
    '/staff/reports': 'Staff > Reports',
    '/tienda': 'Store / Shop',
    '/tools': 'Nautical Tools',
    '/tools/nautical-chart': 'Tools > Nautical Chart Plotter',
    '/tools/nautical-converter': 'Tools > Nautical Unit Converter',
    '/verify/[hash]': 'Verification ([hash])',
    '/verify/id/[id]': 'Verification ID ([id])'
};

function getRoutes(dir, baseRoute = '') {
    let routes = [];
    if (!fs.existsSync(dir)) return routes;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    let hasPage = false;
    for (const entry of entries) {
        if (entry.isFile() && (entry.name.startsWith('page.tsx') || entry.name.startsWith('page.js') || entry.name.startsWith('page.jsx'))) {
            hasPage = true;
        }
    }

    if (hasPage) {
        const routePath = baseRoute === '' ? '/' : baseRoute;
        const isProtected = PROTECTED_PREFIXES.some(prefix => routePath === `/${prefix}` || routePath.startsWith(`/${prefix}/`));
        routes.push({ path: routePath, isProtected });
    }

    for (const entry of entries) {
        if (entry.isDirectory()) {
            if (EXCLUDED_FOLDERS.includes(entry.name)) {
                continue; // Skip excluded folders
            }
            if (entry.name.startsWith('(') || entry.name.startsWith('[...')) {
                continue; // Route group or fallback catch-all
            }
            const nextBase = baseRoute + '/' + entry.name;
            routes = routes.concat(getRoutes(path.join(dir, entry.name), nextBase));
        }
    }

    return routes;
}

function getEnglishName(pathStr, folderName) {
    if (ENGLISH_NAMES[pathStr]) {
        return ENGLISH_NAMES[pathStr];
    }
    // Fallback formatting for path names
    const segments = pathStr.split('/').filter(Boolean);
    const lastSeg = segments[segments.length - 1] || folderName;
    return lastSeg.charAt(0).toUpperCase() + lastSeg.slice(1).replace(/-/g, ' ');
}

function buildTree(routes) {
    const tree = {};

    routes.forEach(r => {
        const parts = r.path.split('/').filter(Boolean);
        let current = tree;
        if (parts.length === 0) {
            current['/'] = { _path: '/', _isProtected: r.isProtected };
        } else {
            parts.forEach((part, index) => {
                const curPath = '/' + parts.slice(0, index + 1).join('/');
                if (!current[part]) {
                    current[part] = { _path: curPath, _isProtected: r.isProtected };
                }
                current = current[part];
            });
        }
    });

    return tree;
}

function renderTree(node, prefix = '') {
    let output = '';
    const keys = Object.keys(node).filter(k => !k.startsWith('_'));
    keys.sort();

    keys.forEach((key, index) => {
        const isLast = index === keys.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        const childPrefix = isLast ? '    ' : '│   ';
        const itemPath = node[key]._path;
        const isProt = node[key]._isProtected;
        const englishLabel = getEnglishName(itemPath, key);
        const badge = isProt ? '🔒 [PRIVATE/AUTH]' : '🌐 [PUBLIC]';
        
        output += `${prefix}${connector}${englishLabel} (${itemPath}) ${badge}\n`;
        output += renderTree(node[key], prefix + childPrefix);
    });

    return output;
}

function main() {
    console.log("==========================================================");
    console.log(" GETXOBELAESKOLA WEB - PUBLIC PAGE EXTRACTOR (ENGLISH)   ");
    console.log("==========================================================\n");

    const allRoutes = getRoutes(APP_DIR);
    const publicRoutes = allRoutes.filter(r => !r.isProtected);
    const protectedRoutes = allRoutes.filter(r => r.isProtected);

    console.log(`📍 Found ${allRoutes.length} active pages (${publicRoutes.length} Public, ${protectedRoutes.length} Protected/Auth)\n`);

    console.log("--- 🌐 PUBLICLY ACCESSIBLE PAGES (ENGLISH TITLES) ---");
    publicRoutes.sort((a,b) => a.path.localeCompare(b.path));
    publicRoutes.forEach(r => {
        const englishName = getEnglishName(r.path, r.path);
        console.log(`  • ${englishName.padEnd(38, ' ')} -> ${r.path}`);
    });

    console.log("\n--- 🌳 PUBLIC & PROTECTED PAGE TREE (ENGLISH) ---");
    const tree = buildTree(allRoutes);
    console.log("Website Pages (app/[locale]/)");
    console.log(renderTree(tree));
}

main();
