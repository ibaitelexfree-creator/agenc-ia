const { createClient } = require('@supabase/supabase-js');

const url = 'https://xbledhifomblirxurtyv.supabase.co';
const serviceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibGVkaGlmb21ibGlyeHVydHl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyMjE5NywiZXhwIjoyMDg2MTk4MTk3fQ.tynAhTsdBLSv_FI4CbGhWfHLjmfmsl8SJaeiTRDsd_A';

const supabase = createClient(url, serviceRole);

// Update imagen_url for items that currently have NULL
const updates = [
    // #23 Omega/Raquero sin patrón (140€) → without skipper image
    { id: '173df7e4-dbbb-4fcc-94d2-e657e6933232', imagen_url: '/images/alquiler-raquero-without-skipper.jpg', name: 'Omega/Raquero sin patrón' },
    // #26 Omega con patrón (200€) → omega image
    { id: '7bb96eda-6fd4-49c8-912a-7ce7cf9e4356', imagen_url: '/images/alquiler-raquero-omega.jpg', name: 'Omega con patrón' },
    // #25 J-80 sin patrón (180€)
    { id: '73029f05-b912-426a-aed1-d82e03b4712b', imagen_url: '/images/alquiler-j80-sin-patron.jpg', name: 'J-80 sin patrón' },
    // #28 J-80 con patrón (250€)
    { id: '48939ce4-9fd5-4e2b-8f38-8b308f13ce3f', imagen_url: '/images/j80-con-patron.jpg', name: 'J-80 con patrón' },
    // #27 Tarpon con patrón (200€)
    { id: '3a212620-3580-4ba1-8dbf-f0f591247019', imagen_url: '/images/alquiler-raquero.jpg', name: 'Tarpon con patrón' },
    // #15 Laser (45€) 
    { id: 'b409ca75-83af-46ba-9960-ae826d2b7de8', imagen_url: '/images/alquiler-laser-16.jpg', name: 'Laser 45€' },
    // #20 420 (80€) 
    { id: '5254dfa8-66d6-4971-8086-cab1894f8178', imagen_url: '/images/420.jpg', name: '420 80€' },
    // #21 Bigsub (80€) 
    { id: 'd82f3cf8-9f98-4e2e-812d-60a1391fa461', imagen_url: '/images/rental-bigsub.jpg', name: 'Bigsub' },
    // #22 Socia Premium (110€)
    { id: '9428c758-165d-468e-97d8-b7b41f4859f2', imagen_url: '/images/atraque-velero.webp', name: 'Socia Premium' },
    // #07 Atraque Piragua (25€)
    { id: 'f7cee082-fae9-47ed-8b2d-3d83005ae0d0', imagen_url: '/images/canoe-mooring.jpg', name: 'Atraque Piragua' },
    // #08 Atraque Transeúnte < 8m (25€)
    { id: 'd5376f3b-bc58-47aa-9f60-80783ec717c7', imagen_url: '/images/transient-mooring-8m.jpg', name: 'Atraque Transeúnte < 8m' },
    // #12 Atraque Transeúnte > 8m (35€)
    { id: 'bdd8c210-e0b2-4629-a873-956964cf7459', imagen_url: '/images/transient-mooring-gt8m.jpg', name: 'Atraque Transeúnte > 8m' },
];

async function run() {
    console.log('\n=== UPDATING imagen_url FOR NULL ITEMS ===\n');
    
    for (const item of updates) {
        const { data, error } = await supabase
            .from('servicios_alquiler')
            .update({ imagen_url: item.imagen_url })
            .eq('id', item.id)
            .select('id, nombre_es, imagen_url');

        if (error) {
            console.error(`❌ ${item.name}: ${error.message}`);
        } else {
            console.log(`✅ ${item.name} → ${item.imagen_url}`);
        }
    }
    
    console.log('\nDone! All items now have unique images.');
}

run();
