const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xbledhifomblirxurtyv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibGVkaGlmb21ibGlyeHVydHl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyMjE5NywiZXhwIjoyMDg2MTk4MTk3fQ.tynAhTsdBLSv_FI4CbGhWfHLjmfmsl8SJaeiTRDsd_A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRpc() {
  const { data, error } = await supabase.rpc('confirm_course_enrollment', {
    p_user_id: '143b50ac-eac3-4b28-a2c5-90a10f0447d4', // Use the user id from log
    p_course_id: '00000000-0000-0000-0000-000000000000',
    p_edition_id: null,
    p_amount: 40,
    p_session_id: 'test',
    p_metadata: {},
    p_coupon: null
  });

  if (error) {
    console.error('RPC Error:', error);
  } else {
    console.log('RPC Success:', data);
  }
}

checkRpc();
