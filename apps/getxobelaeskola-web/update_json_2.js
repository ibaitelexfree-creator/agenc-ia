const fs = require('fs');

const replacements = {
    'es.json': [['Compite y supérate', 'Progresa navegando'], ['Compite y sup\u00e9rate', 'Progresa navegando'], ['Compite y suprate', 'Progresa navegando']],
    'en.json': [['Compete and improve', 'Progress sailing'], ['Compete & improve', 'Progress sailing']],
    'eu.json': [['Lehiatu eta hobetu', 'Nabigatzen aurrera egin']],
    'fr.json': [["Visez l'excellence", 'Progressez en naviguant'], ['Régates et perfectionnement', 'Progressez en naviguant'], ['R\u00e9gates et perfectionnement', 'Progressez en naviguant'], ['Rgates et perfectionnement', 'Progressez en naviguant']]
};

for (const [f, reps] of Object.entries(replacements)) {
    const path = `c:/Users/User/Desktop/agenc-ia/apps/getxobelaeskola-web/messages/${f}`;
    let content = fs.readFileSync(path, 'utf8');
    for (const [old, newStr] of reps) {
        content = content.split(old).join(newStr);
    }
    fs.writeFileSync(path, content, 'utf8');
}
console.log('Updated JSON files');
