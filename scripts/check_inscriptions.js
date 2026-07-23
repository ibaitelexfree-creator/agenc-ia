const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xbledhifomblirxurtyv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibGVkaGlmb21ibGlyeHVydHl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyMjE5NywiZXhwIjoyMDg2MTk4MTk3fQ.tynAhTsdBLSv_FI4CbGhWfHLjmfmsl8SJaeiTRDsd_A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserInscriptions() {
  const { data, error } = await supabase
    .from('inscripciones')
    .select('*')
    .eq('perfil_id', '143b50ac-eac3-4b28-a2c5-90a10f0447d4')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching inscriptions:', error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

checkUserInscriptions();
