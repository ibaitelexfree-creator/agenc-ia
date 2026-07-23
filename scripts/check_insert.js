const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xbledhifomblirxurtyv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibGVkaGlmb21ibGlyeHVydHl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyMjE5NywiZXhwIjoyMDg2MTk4MTk3fQ.tynAhTsdBLSv_FI4CbGhWfHLjmfmsl8SJaeiTRDsd_A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInsert() {
  const { data: insData, error: insError } = await supabase.from('inscripciones').insert({
      perfil_id: '143b50ac-eac3-4b28-a2c5-90a10f0447d4',
      curso_id: '00000000-0000-0000-0000-000000000000', // Need an actual course ID from the db... wait, let's get a real course id first
      edicion_id: null,
      estado_pago: 'pagado',
      monto_total: 40,
      stripe_session_id: 'test_session',
      metadata: {},
      cupon_usado: null
  }).select('*').limit(1);

  if (insError) {
    console.error('Insert Error:', insError);
  } else {
    console.log('Insert Success:', insData);
  }
}

async function getCourseIdAndCheckInsert() {
    const { data: course } = await supabase.from('cursos').select('id').limit(1).single();
    if (course) {
        const { data: insData, error: insError } = await supabase.from('inscripciones').insert({
            perfil_id: '143b50ac-eac3-4b28-a2c5-90a10f0447d4',
            curso_id: course.id,
            edicion_id: null,
            estado_pago: 'pagado',
            monto_total: 40,
            stripe_session_id: 'test_session_id_123',
            metadata: {},
            cupon_usado: null
        });
        if (insError) {
          console.error('Insert Error:', insError);
        } else {
          console.log('Insert Success!');
        }
    }
}

getCourseIdAndCheckInsert();
