const { createClient } = require('@supabase/supabase-js');
const url = 'https://xbledhifomblirxurtyv.supabase.co';
const serviceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibGVkaGlmb21ibGlyeHVydHl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyMjE5NywiZXhwIjoyMDg2MTk4MTk3fQ.tynAhTsdBLSv_FI4CbGhWfHLjmfmsl8SJaeiTRDsd_A';

const supabase = createClient(url, serviceRole);

async function inspect() {
    console.log('--- DESAFIOS DIARIOS ---');
    const { data, error } = await supabase.from('desafios_diarios').select('*');
    if (error) console.error(error);
    else console.log(JSON.stringify(data, null, 2));
}

inspect();
