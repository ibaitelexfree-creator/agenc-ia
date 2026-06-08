const { createClient } = require('@supabase/supabase-js');
const url = 'https://xbledhifomblirxurtyv.supabase.co';
const serviceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibGVkaGlmb21ibGlyeHVydHl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyMjE5NywiZXhwIjoyMDg2MTk4MTk3fQ.tynAhTsdBLSv_FI4CbGhWfHLjmfmsl8SJaeiTRDsd_A';

const supabase = createClient(url, serviceRole);

async function inspect() {
    console.log('--- EDICIONES CURSO ---');
    const { data: ed, error: edErr } = await supabase.from('ediciones_curso').select('*').limit(1);
    if (edErr) console.error(edErr);
    else console.log(ed[0]);

    console.log('--- CURSOS ---');
    const { data: cur, error: curErr } = await supabase.from('cursos').select('*').limit(1);
    if (curErr) console.error(curErr);
    else console.log(cur[0]);
}

inspect();
