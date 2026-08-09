const { createClient } = require('@supabase/supabase-js');

const url = 'https://xbledhifomblirxurtyv.supabase.co';
const serviceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibGVkaGlmb21ibGlyeHVydHl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyMjE5NywiZXhwIjoyMDg2MTk4MTk3fQ.tynAhTsdBLSv_FI4CbGhWfHLjmfmsl8SJaeiTRDsd_A';

const supabase = createClient(url, serviceRole);

const updates = [
    { id: 'a02c05ce-103a-4bf5-a1b6-0e87608d09b4', imagen_url: '/images/kayak-1-person.webp', name: 'Piragua (1 Persona)' },
    { id: '22dba463-410b-45f4-861b-d41e8a5ccb91', imagen_url: '/images/kayak-1-person.webp', name: 'Kayak (1 Persona)' },
    { id: 'f396460a-2058-401e-a429-8c579a8915f6', imagen_url: '/images/paddle-surf.webp', name: 'Paddle Surf' },
    { id: '40b84701-8dc8-41b7-afba-a68c4cc666d5', imagen_url: '/images/kayak-1-person.webp', name: 'Piragua (2 Personas)' },
    { id: '15828cc3-1250-4fd2-b25c-6ff68fd87842', imagen_url: '/images/kayak-1-person.webp', name: 'Kayak (2 Personas)' },
    { id: '7e63962c-1833-4ff7-93d9-919ada3fcc2c', imagen_url: '/images/rental-optimist.webp', name: 'Optimist' },
];

async function run() {
    console.log('\n=== FIXING home-hero images ===\n');
    for (const item of updates) {
        const { error } = await supabase
            .from('servicios_alquiler')
            .update({ imagen_url: item.imagen_url })
            .eq('id', item.id);
        if (error) console.error(`❌ ${item.name}: ${error.message}`);
        else console.log(`✅ ${item.name} → ${item.imagen_url}`);
    }
    console.log('\nDone!');
}

run();
