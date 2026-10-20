import json
import codecs

files = ['es.json', 'en.json', 'eu.json', 'fr.json']

replacements = {
    'es.json': [('Compite y supérate', 'Progresa navegando'), ('Compite y sup\\u00e9rate', 'Progresa navegando')],
    'en.json': [('Compete and improve', 'Progress sailing'), ('Compete & improve', 'Progress sailing')],
    'eu.json': [('Lehiatu eta hobetu', 'Nabigatzen aurrera egin')],
    'fr.json': [(\"Visez l'excellence\", 'Progressez en naviguant'), ('Régates et perfectionnement', 'Progressez en naviguant'), ('R\\u00e9gates et perfectionnement', 'Progressez en naviguant')]
}

for f in files:
    path = f'c:/Users/User/Desktop/agenc-ia/apps/getxobelaeskola-web/messages/{f}'
    with codecs.open(path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    for old, new in replacements[f]:
        content = content.replace(old, new)
        
    with codecs.open(path, 'w', encoding='utf-8') as file:
        file.write(content)

print('Updated JSON files')
