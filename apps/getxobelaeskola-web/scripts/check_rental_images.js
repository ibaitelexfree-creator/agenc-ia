const { createClient } = require('@supabase/supabase-js');

const url = 'https://xbledhifomblirxurtyv.supabase.co';
const serviceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibGVkaGlmb21ibGlyeHVydHl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyMjE5NywiZXhwIjoyMDg2MTk4MTk3fQ.tynAhTsdBLSv_FI4CbGhWfHLjmfmsl8SJaeiTRDsd_A';

const supabase = createClient(url, serviceRole);

async function run() {
    const { data, error } = await supabase
        .from('servicios_alquiler')
        .select('*')
        .eq('activo', true)
        .order('precio_base', { ascending: true });

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('\n=== ALL ACTIVE RENTAL SERVICES ===\n');
    data.forEach((item, i) => {
        const name = item.nombre_es || item.slug;
        console.log(`#${String(i + 1).padStart(2, '0')} | id:${String(item.id).padStart(3)} | ${name.padEnd(45)} | ${String(item.precio_base).padStart(4)}e | img: ${item.imagen_url}`);
    });
}

run();
