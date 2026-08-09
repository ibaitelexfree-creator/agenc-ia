const { createClient } = require('@supabase/supabase-js');

const url = 'https://xbledhifomblirxurtyv.supabase.co';
const serviceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibGVkaGlmb21ibGlyeHVydHl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyMjE5NywiZXhwIjoyMDg2MTk4MTk3fQ.tynAhTsdBLSv_FI4CbGhWfHLjmfmsl8SJaeiTRDsd_A';

const supabase = createClient(url, serviceRole);

async function run() {
    // #23 Omega/Raquero sin patrón (140€) → use course-raquero-students.webp (Raquero on the water, not J80!)
    const { error } = await supabase
        .from('servicios_alquiler')
        .update({ imagen_url: '/images/alquiler-raquero.jpg' })
        .eq('id', '173df7e4-dbbb-4fcc-94d2-e657e6933232');

    if (error) console.error('❌ Error:', error.message);
    else console.log('✅ #23 Omega/Raquero sin patrón → /images/alquiler-raquero.jpg');
}

run();
