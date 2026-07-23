const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xbledhifomblirxurtyv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibGVkaGlmb21ibGlyeHVydHl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyMjE5NywiZXhwIjoyMDg2MTk4MTk3fQ.tynAhTsdBLSv_FI4CbGhWfHLjmfmsl8SJaeiTRDsd_A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMissingTableInsert() {
    try {
        console.log('Testing insert on missing table...');
        const result = await supabase.from('table_does_not_exist').insert({
            some_col: 'test'
        });
        console.log('Result:', result);
    } catch (e) {
        console.error('CAUGHT EXCEPTION:', e);
    }
}

testMissingTableInsert();
