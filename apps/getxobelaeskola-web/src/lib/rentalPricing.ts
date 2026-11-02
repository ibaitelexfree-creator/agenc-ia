export interface RentalBoatPricing {
    tripulacion_minima: string;
    tripulacion_subtexto?: string;
    precios_lineas: string[]; // p.ej. ['250 € / 4h', '140 € / 2h']
    precio_estandar: number;
    fianza: number | null; // null means no fianza
    matricula?: number | null;
    precio_socio?: number;
    precio_socio_lineas?: string[];
    socio_nota?: string;
    detalle_adicional?: string;
}

// Configuración unificada de precios, tripulación, duración y fianzas de alquileres
export const RENTAL_PRICING_CONFIG: Record<string, RentalBoatPricing> = {
    // 1. J-80 con patrón: Tripulación 1, 250 € / 4h, 140 € / 2h, Sin fianza, Socio: 150 € / 4h
    'alquiler-j80-patron': {
        tripulacion_minima: '1',
        precios_lineas: ['250 € / 4h', '140 € / 2h'],
        precio_estandar: 250,
        fianza: null,
        precio_socio: 150,
        precio_socio_lineas: ['150 € / 4h'],
        socio_nota: '150 € barco completo (sin fianza)'
    },
    // J-80 sin patrón: Tripulación 2-3, 180 € / 4h (1 día suelto con socias 45€), Fianza 150 €, Socio: 100 € / 4h
    'alquiler-j80-sin-patron': {
        tripulacion_minima: '2-3',
        precios_lineas: ['180 € / 4h'],
        precio_estandar: 180,
        fianza: 150,
        precio_socio: 100,
        precio_socio_lineas: ['100 € / 4h'],
        socio_nota: '100 € barco completo (sin fianza) · Día suelto con socias: 45 €',
        detalle_adicional: '1 día suelto con socias: 45 €'
    },
    // Fallback genérico para J80 si viene con slug alquiler-j80
    'alquiler-j80': {
        tripulacion_minima: '2-3',
        precios_lineas: ['180 € / 4h'],
        precio_estandar: 180,
        fianza: 150,
        precio_socio: 100,
        precio_socio_lineas: ['100 € / 4h'],
        socio_nota: '100 € barco completo (sin fianza)',
        detalle_adicional: 'Sin patrón: 180 € / 4h | Con patrón: 250 € / 4h'
    },

    // Omega/Raquero con patrón: Tripulación 3, 200 € / 4h, 120 € / 2h, Sin fianza, Socio: 120 € / 4h
    'alquiler-omega-patron': {
        tripulacion_minima: '3',
        precios_lineas: ['200 € / 4h', '120 € / 2h'],
        precio_estandar: 200,
        fianza: null,
        precio_socio: 120,
        precio_socio_lineas: ['120 € / 4h'],
        socio_nota: '120 € barco completo (sin fianza)'
    },
    // Omega/Raquero sin patrón: Tripulación 3, 140 € / 4h, Fianza 100 €, Socio: 80 € / 4h
    'alquiler-omega-sin-patron': {
        tripulacion_minima: '3',
        precios_lineas: ['140 € / 4h'],
        precio_estandar: 140,
        fianza: 100,
        precio_socio: 80,
        precio_socio_lineas: ['80 € / 4h'],
        socio_nota: '80 € barco completo (sin fianza) · Día suelto con socias: 40 €',
        detalle_adicional: '1 día suelto con socias: 40 €'
    },
    // Fallback genérico para raquero si viene como alquiler-raquero o alquiler-raquero-omega
    'alquiler-raquero': {
        tripulacion_minima: '3',
        precios_lineas: ['140 € / 4h'],
        precio_estandar: 140,
        fianza: 100,
        precio_socio: 80,
        precio_socio_lineas: ['80 € / 4h'],
        socio_nota: '80 € barco completo (sin fianza)',
        detalle_adicional: 'Sin patrón: 140 € / 4h | Con patrón: 200 € / 4h'
    },
    'alquiler-raquero-omega': {
        tripulacion_minima: '3',
        precios_lineas: ['140 € / 4h'],
        precio_estandar: 140,
        fianza: 100,
        precio_socio: 80,
        precio_socio_lineas: ['80 € / 4h'],
        socio_nota: '80 € barco completo (sin fianza)',
        detalle_adicional: 'Sin patrón: 140 € / 4h | Con patrón: 200 € / 4h'
    },

    // 420: Tripulación 2, 80 € / 4h, Fianza 100 €
    'alquiler-420': {
        tripulacion_minima: '2',
        precios_lineas: ['80 € / 4h'],
        precio_estandar: 80,
        fianza: 100
    },
    'alquiler-420-pro': {
        tripulacion_minima: '2',
        precios_lineas: ['80 € / 4h'],
        precio_estandar: 80,
        fianza: 100
    },

    // Laser: Tripulación 1, 45 € / 4h, Fianza 100 €
    'alquiler-laser': {
        tripulacion_minima: '1',
        precios_lineas: ['45 € / 4h'],
        precio_estandar: 45,
        fianza: 100
    },
    'alquiler-laser-pro': {
        tripulacion_minima: '1',
        precios_lineas: ['45 € / 4h'],
        precio_estandar: 45,
        fianza: 100
    },

    // Optimist: Tripulación 1, 20 €
    'alquiler-optimist': {
        tripulacion_minima: '1',
        precios_lineas: ['20 €'],
        precio_estandar: 20,
        fianza: 50
    },

    // Tarpoon con patrón: Tripulación 1, 200 € / 2h, Fianza 100 €
    'alquiler-tarpon-patron': {
        tripulacion_minima: '1',
        precios_lineas: ['200 € / 2h'],
        precio_estandar: 200,
        fianza: 100
    },

    // Bono Vela Ligera, crucero y/o windsurf: Tripulación 1, Incluye 4 salidas (4h)
    'bono-vela-ligera': {
        tripulacion_minima: '1',
        tripulacion_subtexto: 'Incluye 4 salidas (4h)',
        precios_lineas: ['150 €'],
        precio_estandar: 150,
        fianza: null
    },

    // Bono de Windsurf: 110 €, 4 salidas (2,5h)
    'bono-windsurf': {
        tripulacion_minima: '1',
        tripulacion_subtexto: 'Incluye 4 salidas (2,5h)',
        precios_lineas: ['110 €'],
        precio_estandar: 110,
        fianza: null
    },

    // Windsurf: Tripulación 1, 40 € / 4h, Fianza 60 €
    'alquiler-windsurf': {
        tripulacion_minima: '1',
        precios_lineas: ['40 € / 4h'],
        precio_estandar: 40,
        fianza: 60
    },
    'alquiler-windsurf-pro': {
        tripulacion_minima: '1',
        precios_lineas: ['40 € / 4h'],
        precio_estandar: 40,
        fianza: 60
    },

    // Big SUP: Tripulación 4, 15€/persona x 2h (o 130€ en total), Fianza 100 €
    'alquiler-bigsub-group': {
        tripulacion_minima: '4',
        precios_lineas: ['15 €/pax (2h)', '130 € total'],
        precio_estandar: 130,
        fianza: 100,
        detalle_adicional: 'Mínimo 4 personas'
    },
    'cumple-bigsub': {
        tripulacion_minima: '12',
        precios_lineas: ['13 €/pax'],
        precio_estandar: 13,
        fianza: null
    },

    // Paddle Surf: 15€/persona x 1h | 20€/persona x 2h, Tripulación 1, Fianza 60 €
    'alquiler-paddlesurf': {
        tripulacion_minima: '1',
        precios_lineas: ['15 € / 1h', '20 € / 2h'],
        precio_estandar: 15,
        fianza: 60
    },

    // Kayak 1 Persona: Tripulación 1, Fianza 60 €
    'alquiler-kayak-1': {
        tripulacion_minima: '1',
        precios_lineas: ['15 € / 1h', '20 € / 2h'],
        precio_estandar: 15,
        fianza: 60
    },
    // Kayak 2 Personas: Tripulación 2, Fianza 60 €
    'alquiler-kayak-2': {
        tripulacion_minima: '2',
        precios_lineas: ['25 € / 1h', '35 € / 2h'],
        precio_estandar: 25,
        fianza: 60
    },

    // Piragua 1 Persona: 15€/persona x 1h, 20€/persona x 2h, Tripulación 1, Fianza 60 €
    'alquiler-piragua-1': {
        tripulacion_minima: '1',
        precios_lineas: ['15 € / 1h', '20 € / 2h'],
        precio_estandar: 15,
        fianza: 60
    },
    // Piragua 2 Personas: Tripulación 2, Fianza 60 €
    'alquiler-piragua-2': {
        tripulacion_minima: '2',
        precios_lineas: ['20 € / 2h'],
        precio_estandar: 20,
        fianza: 60
    },

    // Atraque Windsurf: 30 € / mes, Matrícula 50 €
    'atraque-windsurf': {
        tripulacion_minima: '1',
        matricula: 50,
        precios_lineas: ['30 € / mes'],
        precio_estandar: 30,
        fianza: null
    },

    // Atraque Velero: 50 € / mes, Matrícula 50 €
    'atraque-velero': {
        tripulacion_minima: '1',
        matricula: 50,
        precios_lineas: ['50 € / mes'],
        precio_estandar: 50,
        fianza: null
    },

    // Atraque Piragua Individual: Anual 25 € | Mensual 35 €, Matrícula 50 €
    'atraque-piragua': {
        tripulacion_minima: '1',
        matricula: 50,
        precios_lineas: ['Anual 25 €', 'Mensual 35 €'],
        precio_estandar: 25,
        fianza: null
    },

    // Atraque Piragua Doble: Anual 30 € | Mensual 40 €, Matrícula 50 €
    'atraque-piragua-doble': {
        tripulacion_minima: '2',
        matricula: 50,
        precios_lineas: ['Anual 30 €', 'Mensual 40 €'],
        precio_estandar: 30,
        fianza: null
    }
};

/**
 * Helper to get rental pricing and specifications
 */
export function getRentalPricingInfo(service: { slug: string; nombre_es?: string; precio_base?: number }, isSocio: boolean) {
    const slug = service.slug?.toLowerCase() || '';
    const name = (service.nombre_es || '').toLowerCase();

    // 1. Exact match by slug
    let config = RENTAL_PRICING_CONFIG[slug];

    // 2. Fuzzy match if slug variant
    if (!config) {
        if (slug.includes('j80') || name.includes('j80')) {
            if (name.includes('con patr') || slug.includes('patron')) {
                config = RENTAL_PRICING_CONFIG['alquiler-j80-patron'];
            } else {
                config = RENTAL_PRICING_CONFIG['alquiler-j80-sin-patron'];
            }
        } else if (slug.includes('raquero') || slug.includes('omega') || name.includes('raquero') || name.includes('omega')) {
            if (name.includes('con patr') || slug.includes('patron')) {
                config = RENTAL_PRICING_CONFIG['alquiler-omega-patron'];
            } else {
                config = RENTAL_PRICING_CONFIG['alquiler-omega-sin-patron'];
            }
        } else if (slug.includes('420') || name.includes('420')) {
            config = RENTAL_PRICING_CONFIG['alquiler-420'];
        } else if (slug.includes('laser') || name.includes('laser')) {
            config = RENTAL_PRICING_CONFIG['alquiler-laser'];
        } else if (slug.includes('optimist') || name.includes('optimist')) {
            config = RENTAL_PRICING_CONFIG['alquiler-optimist'];
        } else if (slug.includes('tarpon') || name.includes('tarpon') || slug.includes('tarpoon') || name.includes('tarpoon')) {
            config = RENTAL_PRICING_CONFIG['alquiler-tarpon-patron'];
        } else if (slug.includes('bono-windsurf') || name.includes('bono windsurf')) {
            config = RENTAL_PRICING_CONFIG['bono-windsurf'];
        } else if (slug.includes('bono-vela') || name.includes('bono vela')) {
            config = RENTAL_PRICING_CONFIG['bono-vela-ligera'];
        } else if (slug.includes('windsurf') || name.includes('windsurf')) {
            config = RENTAL_PRICING_CONFIG['alquiler-windsurf'];
        } else if (slug.includes('bigsub') || name.includes('bigsub') || slug.includes('bigsup') || name.includes('bigsup')) {
            config = RENTAL_PRICING_CONFIG['alquiler-bigsub-group'];
        } else if (slug.includes('kayak-2') || name.includes('kayak (2')) {
            config = RENTAL_PRICING_CONFIG['alquiler-kayak-2'];
        } else if (slug.includes('kayak') || name.includes('kayak')) {
            config = RENTAL_PRICING_CONFIG['alquiler-kayak-1'];
        } else if (slug.includes('piragua-2') || name.includes('piragua (2')) {
            config = RENTAL_PRICING_CONFIG['alquiler-piragua-2'];
        } else if (slug.includes('piragua') || name.includes('piragua')) {
            config = RENTAL_PRICING_CONFIG['alquiler-piragua-1'];
        } else if (slug.includes('atraque-windsurf') || name.includes('atraque windsurf')) {
            config = RENTAL_PRICING_CONFIG['atraque-windsurf'];
        } else if (slug.includes('atraque-velero') || name.includes('atraque velero')) {
            config = RENTAL_PRICING_CONFIG['atraque-velero'];
        } else if (slug.includes('atraque-piragua-doble') || (name.includes('atraque') && name.includes('doble'))) {
            config = RENTAL_PRICING_CONFIG['atraque-piragua-doble'];
        } else if (slug.includes('atraque-piragua') || name.includes('atraque piragua')) {
            config = RENTAL_PRICING_CONFIG['atraque-piragua'];
        } else if (slug.includes('paddlesurf') || name.includes('paddle')) {
            config = RENTAL_PRICING_CONFIG['alquiler-paddlesurf'];
        }
    }

    const defaultPrice = service.precio_base || 0;
    const finalStandardPrice = config?.precio_estandar ?? defaultPrice;
    
    // Si es socio y este barco tiene tarifa especial para socios:
    const hasSocioDiscount = isSocio && config?.precio_socio !== undefined;
    const activePrice = hasSocioDiscount ? config!.precio_socio! : finalStandardPrice;
    const activeFianza = isSocio ? 0 : (config?.fianza ?? null);

    const preciosLineas = hasSocioDiscount && config?.precio_socio_lineas
        ? config.precio_socio_lineas
        : (config?.precios_lineas ?? [`${finalStandardPrice} €`]);

    return {
        tripulacion_minima: config?.tripulacion_minima || '1',
        tripulacion_subtexto: config?.tripulacion_subtexto,
        precios_lineas: preciosLineas,
        precio_numerico: activePrice,
        fianza: activeFianza,
        hasFianza: activeFianza !== null && activeFianza > 0,
        matricula: config?.matricula ?? null,
        hasMatricula: config?.matricula !== undefined && config?.matricula !== null,
        isSocio,
        hasSocioDiscount,
        socio_precio: config?.precio_socio,
        socio_nota: config?.socio_nota,
        detalle_adicional: config?.detalle_adicional
    };
}
