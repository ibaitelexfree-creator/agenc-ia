const { createClient } = require('@supabase/supabase-js');
const url = 'https://xbledhifomblirxurtyv.supabase.co';
const serviceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibGVkaGlmb21ibGlyeHVydHl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyMjE5NywiZXhwIjoyMDg2MTk4MTk3fQ.tynAhTsdBLSv_FI4CbGhWfHLjmfmsl8SJaeiTRDsd_A';

const supabase = createClient(url, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Using supabase client with admin permissions
const adminSupabase = createClient(url, serviceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function run() {
    console.log('Updating password for admin getxobelaeskola@gmail.com...');
    const { data: user, error: err } = await adminSupabase.auth.admin.updateUserById(
        '4eed0feb-eaf2-411f-a049-db895f39369e',
        { password: 'Jereministro1271!*' }
    );
    if (err) {
        console.error('Error updating admin:', err);
    } else {
        console.log('Admin password updated successfully');
    }

    console.log('Updating password for instructor mattcarleigh347@gmail.com...');
    const { data: user2, error: err2 } = await adminSupabase.auth.admin.updateUserById(
        '82c11fa3-d851-4171-ac41-3dd13f574d3e',
        { password: 'Jereministro1271!*' }
    );
    if (err2) {
        console.error('Error updating instructor:', err2);
    } else {
        console.log('Instructor password updated successfully');
    }
}

run();
