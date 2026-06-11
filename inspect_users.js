const { createClient } = require('@supabase/supabase-js');
const url = 'https://xbledhifomblirxurtyv.supabase.co';
const serviceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibGVkaGlmb21ibGlyeHVydHl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyMjE5NywiZXhwIjoyMDg2MTk4MTk3fQ.tynAhTsdBLSv_FI4CbGhWfHLjmfmsl8SJaeiTRDsd_A';

const supabase = createClient(url, serviceRole);

async function inspect() {
    console.log('--- USER ROLES & EMAILS ---');
    // Get profiles with rol = 'instructor' or similar
    const { data: perfiles, error: perErr } = await supabase
        .from('profiles')
        .select('id, email, nombre, rol')
        .in('rol', ['admin', 'staff', 'instructor', 'superadmin'])
        .limit(20);
    
    if (perErr) {
        console.error(perErr);
    } else {
        console.log('Perfiles found:', perfiles);
    }
}

inspect();
