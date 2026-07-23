const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xbledhifomblirxurtyv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibGVkaGlmb21ibGlyeHVydHl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyMjE5NywiZXhwIjoyMDg2MTk4MTk3fQ.tynAhTsdBLSv_FI4CbGhWfHLjmfmsl8SJaeiTRDsd_A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEvents() {
  const { data, error } = await supabase
    .from('processed_webhook_events')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching processed_webhook_events:', error);
  } else {
    console.log('processed_webhook_events EXISTS');
  }

  const { data: logData, error: logError } = await supabase
    .from('stripe_events_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
    
  if (logError) {
    console.error('Error fetching stripe_events_log:', logError);
  } else {
    console.log('stripe_events_log:', JSON.stringify(logData, null, 2));
  }
}

checkEvents();
