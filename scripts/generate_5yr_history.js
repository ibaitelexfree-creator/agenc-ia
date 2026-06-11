const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = "https://xbledhifomblirxurtyv.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhibGVkaGlmb21ibGlyeHVydHl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyMjE5NywiZXhwIjoyMDg2MTk4MTk3fQ.tynAhTsdBLSv_FI4CbGhWfHLjmfmsl8SJaeiTRDsd_A";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

function getRandomHourAndMinutes() {
    const hours = [10, 11, 12, 13, 14, 15, 16, 17, 18];
    const hour = hours[Math.floor(Math.random() * hours.length)];
    const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
}

async function run() {
    console.log('--- FETCHING DEPENDENCIES ---');
    const { data: profiles } = await supabase.from('profiles').select('id, rol');
    const { data: services } = await supabase.from('servicios_alquiler').select('id, precio_base');
    const { data: courses } = await supabase.from('cursos').select('id, precio');
    const { data: editions } = await supabase.from('ediciones_curso').select('id, curso_id');
    const { data: boats } = await supabase.from('embarcaciones').select('id');

    if (!profiles || !services || !courses || !editions || !boats) {
        console.error('Failed to fetch dependencies');
        return;
    }

    const staffProfile = profiles.find(p => p.rol === 'admin' || p.rol === 'instructor') || profiles[0];

    // Clean up existing data to prevent massive duplicates and ensure clean graphs
    console.log('Cleaning up existing data...');
    await supabase.from('reservas_alquiler').delete().gte('fecha_reserva', '2021-01-01');
    await supabase.from('inscripciones').delete().gte('created_at', '2021-01-01T00:00:00Z');
    await supabase.from('mantenimiento_logs').delete().gte('fecha_inicio', '2021-01-01');

    const rentals = [];
    const inscriptions = [];
    const maintenance = [];

    const startYear = 2021;
    const endYear = 2026;
    const currentDate = new Date();

    console.log('Generating 5-year seasonal distribution...');

    for (let year = startYear; year <= endYear; year++) {
        for (let month = 0; month < 12; month++) {
            // If it's 2026 and we exceed current month, break
            if (year === endYear && month > currentDate.getMonth()) break;

            // Define seasonal scale:
            // Jan (0): 0.3, Feb (1): 0.4, Mar (2): 0.6, Apr (3): 0.8, May (4): 0.9 (Winter/Spring rise)
            // Jun (5): 2.5, Jul (6): 3.5, Aug (7): 3.8, Sep (8): 2.2 (Summer Peak)
            // Oct (9): 0.5, Nov (10): 0.2, Dec (11): 0.25 (Autumn/Winter drop)
            let seasonalMultiplier = 1.0;
            if (month === 0) seasonalMultiplier = 0.35;
            else if (month === 1) seasonalMultiplier = 0.5;
            else if (month === 2) seasonalMultiplier = 0.7;
            else if (month === 3) seasonalMultiplier = 0.9;
            else if (month === 4) seasonalMultiplier = 1.2;
            else if (month === 5) seasonalMultiplier = 2.8;
            else if (month === 6) seasonalMultiplier = 3.8;
            else if (month === 7) seasonalMultiplier = 4.0;
            else if (month === 8) seasonalMultiplier = 2.6;
            else if (month === 9) seasonalMultiplier = 0.6;
            else if (month === 10) seasonalMultiplier = 0.3;
            else if (month === 11) seasonalMultiplier = 0.35;

            // Base count of rentals/inscriptions per month
            const baseRentals = 15;
            const baseInscriptions = 10;
            const baseMtto = 3;

            const rentalCount = Math.floor(baseRentals * seasonalMultiplier * (0.85 + Math.random() * 0.3));
            const insCount = Math.floor(baseInscriptions * seasonalMultiplier * (0.85 + Math.random() * 0.3));
            const mttoCount = Math.floor(baseMtto * (0.7 + Math.random() * 0.6));

            // Generate rentals for this month
            for (let r = 0; r < rentalCount; r++) {
                const day = Math.floor(Math.random() * 28) + 1;
                const date = new Date(year, month, day, 12, 0, 0, 0);
                if (date > currentDate) continue;

                const p = profiles[Math.floor(Math.random() * profiles.length)];
                const s = services[Math.floor(Math.random() * services.length)];
                const price = s.precio_base || 60;

                rentals.push({
                    perfil_id: p.id,
                    servicio_id: s.id,
                    fecha_reserva: date.toISOString().split('T')[0],
                    hora_inicio: getRandomHourAndMinutes(),
                    duracion_horas: Math.floor(Math.random() * 3) + 2,
                    monto_total: price,
                    estado_pago: 'pagado',
                    created_at: date.toISOString(),
                    fecha_pago: date.toISOString(),
                    estado_entrega: 'devuelto',
                    cupon_usado: Math.random() < 0.12
                });
            }

            // Generate inscriptions for this month
            for (let ins = 0; ins < insCount; ins++) {
                const day = Math.floor(Math.random() * 28) + 1;
                const date = new Date(year, month, day, 12, 0, 0, 0);
                if (date > currentDate) continue;

                const p = profiles[Math.floor(Math.random() * profiles.length)];
                const ed = editions[Math.floor(Math.random() * editions.length)];
                const c = courses.find(course => course.id === ed.curso_id) || courses[0];
                const price = c.precio || 180;

                inscriptions.push({
                    perfil_id: p.id,
                    edicion_id: ed.id,
                    curso_id: c.id,
                    estado_pago: 'pagado',
                    monto_total: price,
                    created_at: date.toISOString(),
                    cupon_usado: Math.random() < 0.08
                });
            }

            // Generate maintenance for this month
            for (let m = 0; m < mttoCount; m++) {
                const day = Math.floor(Math.random() * 28) + 1;
                const date = new Date(year, month, day, 12, 0, 0, 0);
                if (date > currentDate) continue;

                const b = boats[Math.floor(Math.random() * boats.length)];
                const endMtto = new Date(date);
                endMtto.setDate(endMtto.getDate() + Math.floor(Math.random() * 2) + 1);

                maintenance.push({
                    embarcacion_id: b.id,
                    tipo: Math.random() < 0.7 ? 'preventivo' : 'correctivo',
                    descripcion: 'Revisión técnica de temporada',
                    coste: Math.floor(Math.random() * 200) + 40,
                    estado: 'completado',
                    fecha_inicio: date.toISOString().split('T')[0],
                    fecha_fin: endMtto.toISOString().split('T')[0],
                    realizado_por: staffProfile.id,
                    notas: 'Mantenimiento preventivo completado satisfactoriamente.'
                });
            }
        }
    }

    console.log(`Generated: ${rentals.length} rentals, ${inscriptions.length} inscriptions, ${maintenance.length} maintenance records`);

    // Chunk insert to avoid request payload limits
    console.log('Inserting rentals...');
    const rentalChunks = chunkArray(rentals, 100);
    for (const chunk of rentalChunks) {
        await supabase.from('reservas_alquiler').insert(chunk);
    }

    console.log('Inserting inscriptions...');
    const inscriptionChunks = chunkArray(inscriptions, 100);
    for (const chunk of inscriptionChunks) {
        await supabase.from('inscripciones').insert(chunk);
    }

    console.log('Inserting maintenance...');
    const mttoChunks = chunkArray(maintenance, 100);
    for (const chunk of mttoChunks) {
        await supabase.from('mantenimiento_logs').insert(chunk);
    }

    console.log('--- 5 YEARS SEASONAL DATA GENERATED SUCCESSFULLY ---');
}

function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

run();
