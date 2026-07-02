import { requireAuth } from '@/lib/auth-guard';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { Course, CourseEdition, Inscription } from '@/types/courses';

function getPublicOrigin(request: Request) {
    const forwardedHost = request.headers.get('x-forwarded-host');
    const host = request.headers.get('host');
    const originHeader = request.headers.get('origin');
    
    if (originHeader && !originHeader.includes('localhost') && !originHeader.includes('127.0.0.1')) {
        return originHeader;
    }
    
    let resolvedHost = forwardedHost || host || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 
                     (resolvedHost.includes('localhost') || resolvedHost.includes('127.0.0.1') ? 'http' : 'https');
                     
    if (process.env.NODE_ENV === 'production' && (resolvedHost.includes('localhost') || resolvedHost.includes('127.0.0.1'))) {
        return 'https://getxobelaeskola.cloud';
    }
    
    return `${protocol}://${resolvedHost}`;
}

export async function POST(request: Request) {
    if (!stripe) {
        return NextResponse.json({ error: 'Stripe configuration missing' }, { status: 503 });
    }
    try {
        const { editionId, courseId, locale = 'es', startDate, endDate, legalName, legalDni, registrationDetails, isMember } = await request.json();

        if (!courseId) {
            return NextResponse.json({ error: 'Falta el ID del curso' }, { status: 400 });
        }

        const { user, supabase, error: authError } = await requireAuth();
        if (authError || !user) return authError || NextResponse.json({ error: 'No autorizado' }, { status: 401 });

        const { data: profile } = await supabase.from('profiles').select('nombre, apellidos, status_socio, avatar_url, dni').eq('id', user.id).single();

        // --- SAVE REGISTRATION DETAILS BACK TO PROFILE / CHILDREN LIST ---
        if (registrationDetails) {
            const partNombre = (registrationDetails?.nombre || '').trim().toLowerCase();
            const partApellidos = (registrationDetails?.apellidos || '').trim().toLowerCase();
            const partDni = (registrationDetails?.dni || '').trim().toUpperCase();

            const parentNombre = (profile?.nombre || '').trim().toLowerCase();
            const parentApellidos = (profile?.apellidos || '').trim().toLowerCase();
            const parentDni = (profile?.dni || '').trim().toUpperCase();

            // Check if the participant is the parent
            const isParentParticipant = 
                (partNombre && parentNombre && partNombre === parentNombre) ||
                (partDni && parentDni && partDni === parentDni);

            if (isParentParticipant) {
                // Update parent profile with latest details
                await supabase.from('profiles').update({
                    dni: registrationDetails.dni || profile?.dni,
                    telefono: registrationDetails.telefono || profile?.telefono,
                    domicilio: registrationDetails.domicilio || profile?.domicilio,
                    localidad: registrationDetails.localidad || profile?.localidad,
                    codigo_postal: registrationDetails.codigo_postal || profile?.codigo_postal,
                    fecha_nacimiento: registrationDetails.fecha_nacimiento || profile?.fecha_nacimiento
                }).eq('id', user.id);
            } else {
                // Update child profile in avatar_url list
                if (profile?.avatar_url && profile.avatar_url.startsWith('children_json:')) {
                    try {
                        const children = JSON.parse(profile.avatar_url.replace('children_json:', ''));
                        let updated = false;
                        const nextChildren = children.map((c: any) => {
                            const cNombre = (c.nombre || '').trim().toLowerCase();
                            const cApellidos = (c.apellidos || '').trim().toLowerCase();
                            const cDni = (c.dni || '').trim().toUpperCase();

                            const match = (cNombre && partNombre && cNombre === partNombre) || (cDni && partDni && cDni === partDni);
                            if (match) {
                                updated = true;
                                return {
                                    ...c,
                                    dni: registrationDetails.dni || c.dni,
                                    fecha_nacimiento: registrationDetails.fecha_nacimiento || c.fecha_nacimiento,
                                    sabe_nadar: registrationDetails.sabe_nadar || c.sabe_nadar,
                                    necesidades_especiales: registrationDetails.necesidades_especiales || c.necesidades_especiales
                                };
                            }
                            return c;
                        });

                        if (updated) {
                            await supabase.from('profiles').update({
                                avatar_url: 'children_json:' + JSON.stringify(nextChildren)
                            }).eq('id', user.id);
                        }
                    } catch (e) {
                        console.error('Error updating child details on checkout:', e);
                    }
                }
            }
        }

        const origin = getPublicOrigin(request);

        let course: Course | null = null;
        let edition: CourseEdition | null = null;

        // 1. Fetch Course Data
        if (editionId && !editionId.startsWith('ext_')) {
            const { data: ed, error: edError } = await supabase
                .from('ediciones_curso')
                .select('*, cursos(*)')
                .eq('id', editionId)
                .single();

            if (edError || !ed) {
                return NextResponse.json({ error: 'Edición no encontrada' }, { status: 404 });
            }
            edition = ed as unknown as CourseEdition;
            course = edition.cursos || null;
        } else if (courseId) {
            // Handle external calendar event or direct course booking
            const { data: c, error: cError } = await supabase
                .from('cursos')
                .select('*')
                .eq('id', courseId)
                .single();

            if (cError || !c) {
                return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
            }
            course = c as unknown as Course;
            // edition remains null
        } else {
            return NextResponse.json({ error: 'Faltan datos (editionId o courseId)' }, { status: 400 });
        }

        if (!course) {
            return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
        }

        // --- ENROLLMENT CHECK (Gating) ---
        const { data: alreadyEnrolled } = await supabase
            .from('inscripciones')
            .select('id')
            .eq('perfil_id', user.id)
            .eq('curso_id', course.id)
            .eq('edicion_id', editionId || null)
            .eq('estado_pago', 'pagado')
            .maybeSingle();

        if (alreadyEnrolled) {
            return NextResponse.json({ error: 'Ya estás inscrito en este curso o edición' }, { status: 400 });
        }

        const itemName = locale === 'es' ? course.nombre_es : course.nombre_eu;
        let imageUrl = course.imagen_url;
        if (imageUrl && imageUrl.startsWith('/')) imageUrl = `${origin}${imageUrl}`;

        // --- ZERO PRICE BYPASS (Updated for Online Courses) ---
        if (course.precio === 0) {

            const inscriptionData: Partial<Inscription> = {
                perfil_id: user.id,
                curso_id: course.id,
                estado_pago: 'pagado',
                monto_total: 0,
                stripe_session_id: `FREE_${Date.now()}`,
                metadata: {
                    start_date: startDate || new Date().toISOString(),
                    end_date: endDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
                    registration: registrationDetails || null
                }
            };

            if (editionId && editionId !== '' && !editionId.startsWith('test-') && !editionId.startsWith('ext_')) {
                inscriptionData.edicion_id = editionId;
            } else {
                // Try to find ANY edition to link (for internal tracking if possible)
                const { data: latestEd } = await supabase.from('ediciones_curso')
                    .select('id')
                    .eq('curso_id', course.id)
                    .gt('fecha_fin', new Date().toISOString())
                    .limit(1)
                    .single();

                if (latestEd) {
                    inscriptionData.edicion_id = latestEd.id;
                } else {
                    inscriptionData.edicion_id = null;
                }
            }

            const { error: insError } = await supabase
                .from('inscripciones')
                .insert(inscriptionData);

            if (insError) {
                console.error('Free Course Enrollment Error:', insError);
                return NextResponse.json({ error: 'Error al inscribirse: ' + insError.message }, { status: 500 });
            }

            // Update occupancy if edition exists
            const targetEditionId = editionId || inscriptionData.edicion_id;
            if (targetEditionId) {
                // Try simple update first as it is safer than assuming RPC exists
                const { error: updateError } = await supabase.rpc('increment_occupancy', { edition_id: targetEditionId });
                if (updateError) {
                    // manual fallback
                    if (edition) {
                        await supabase
                            .from('ediciones_curso')
                            .update({ plazas_ocupadas: (edition.plazas_ocupadas || 0) + 1 })
                            .eq('id', edition.id);
                    }
                }
            }

            return NextResponse.json({ url: `${origin}/${locale}/student/dashboard?success=true` });
        }
        // --- MEMBERSHIP VERIFICATION (Strict validation) ---
        if (isMember) {
            const partNombre = (registrationDetails?.nombre || '').trim().toLowerCase();
            const partApellidos = (registrationDetails?.apellidos || '').trim().toLowerCase();
            const partDni = (registrationDetails?.dni || '').trim().toUpperCase();

            const parentNombre = (profile?.nombre || '').trim().toLowerCase();
            const parentApellidos = (profile?.apellidos || '').trim().toLowerCase();
            const parentDni = (profile?.dni || '').trim().toUpperCase();

            // Check if the participant is the parent
            const isParentParticipant = 
                (partNombre && parentNombre && partNombre === parentNombre) ||
                (partDni && parentDni && partDni === parentDni);

            if (isParentParticipant) {
                if (profile?.status_socio !== 'activo') {
                    return NextResponse.json({ error: 'El participante seleccionado (tú) no tiene una membresía de socio activa.' }, { status: 400 });
                }
            } else {
                // If not the parent, check the children list
                let childMatch = null;
                if (profile?.avatar_url && profile.avatar_url.startsWith('children_json:')) {
                    try {
                        const children = JSON.parse(profile.avatar_url.replace('children_json:', ''));
                        childMatch = children.find((c: any) => {
                            const cNombre = (c.nombre || '').trim().toLowerCase();
                            const cApellidos = (c.apellidos || '').trim().toLowerCase();
                            const cDni = (c.dni || '').trim().toUpperCase();
                            return (cNombre && partNombre && cNombre === partNombre) || (cDni && partDni && cDni === partDni);
                        });
                    } catch (e) {
                        console.error('Error parsing children list in checkout verification:', e);
                    }
                }

                if (!childMatch) {
                    return NextResponse.json({ error: 'No se pudo verificar la identidad del participante en tu ficha de familiares.' }, { status: 400 });
                }

                if (!childMatch.is_member) {
                    return NextResponse.json({ error: `El participante ${childMatch.nombre} no tiene una membresía de socio activa.` }, { status: 400 });
                }
            }
        }

        // --- STRIPE CHECKOUT (Price > 0) ---

        // Validation: Edition is mandatory for paid courses usually, but if not we need description
        // For now assume all paid courses use editions or we fall back to generic desc

        const description = edition
            ? `Edición del ${new Date(edition.fecha_inicio).toLocaleDateString()}`
            : 'Curso Online / Acceso Completo';

        const finalPrice = isMember ? Math.round(course.precio / 2) : course.precio;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            tax_id_collection: { enabled: true },
            allow_promotion_codes: true,
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: itemName,
                            description: description + (isMember ? ' (Descuento Socio 50%)' : ''),
                            images: imageUrl ? [imageUrl] : [],
                        },
                        unit_amount: Math.round(finalPrice * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/${locale}/student/payment-success?session_id={CHECKOUT_SESSION_ID}&type=course`,
            cancel_url: `${origin}/${locale}/courses/${course.slug}?canceled=true`,
            customer_email: user.email,
            metadata: {
                edition_id: (editionId as string) || '', // Stripe metadata doesn't like null
                user_id: user.id as string,
                course_id: course.id as string,
                stripe_product_id: course.stripe_product_id as string || '',
                item_name: itemName as string,
                user_name: profile?.nombre ? `${profile.nombre} ${profile.apellidos || ''}` : (user.email as string),
                start_date: (startDate as string) || '',
                end_date: (endDate as string) || '',
                legal_name: (legalName as string) || '',
                legal_dni: (legalDni as string) || '',
                locale: (locale as string) || 'es',
                mode: 'course',
                is_member: isMember ? 'true' : 'false',
                reg_data_1: registrationDetails ? JSON.stringify(registrationDetails).slice(0, 450) : '{}',
                reg_data_2: registrationDetails ? JSON.stringify(registrationDetails).slice(450, 900) : ''
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (err: unknown) {
        console.error('Stripe Error:', err);
        return NextResponse.json({ error: (err as Error).message }, { status: 500 });
    }
}
