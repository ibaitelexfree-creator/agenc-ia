const { createClient } = require('@supabase/supabase-js');

const url = 'https://xbledhifomblirxurtyv.supabase.co';
const serviceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibGVkaGlmb21ibGlyeHVydHl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyMjE5NywiZXhwIjoyMDg2MTk4MTk3fQ.tynAhTsdBLSv_FI4CbGhWfHLjmfmsl8SJaeiTRDsd_A';

const supabase = createClient(url, serviceRole);

async function run() {
    console.log('\n=== REVERTING unauthorized image changes ===\n');

    // Revert #26 Omega con patrón → back to null (was null before)
    const r1 = await supabase
        .from('servicios_alquiler')
        .update({ imagen_url: null })
        .eq('id', '7bb96eda-6fd4-49c8-912a-7ce7cf9e4356');
    console.log(r1.error ? `❌ #26: ${r1.error.message}` : '✅ #26 Omega con patrón → null (reverted)');

    // Revert #27 Tarpon con patrón → back to null (was null before)
    const r2 = await supabase
        .from('servicios_alquiler')
        .update({ imagen_url: null })
        .eq('id', '3a212620-3580-4ba1-8dbf-f0f591247019');
    console.log(r2.error ? `❌ #27: ${r2.error.message}` : '✅ #27 Tarpon con patrón → null (reverted)');

    console.log('\nDone! Items 26 & 27 reverted to original state (null → code fallback)');
}

run();
