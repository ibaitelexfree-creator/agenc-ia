
/**
 * Tipos de documentos de identidad soportados.
 */
export type DocumentType = 'DNI' | 'NIE' | 'PASPORT';

/**
 * Valida un documento de identidad según su tipo.
 */
export function validateIdentityDocument(document: string | undefined | null, type?: DocumentType, countryCode = 'ES'): { isValid: boolean; message?: string; type: DocumentType } {
    let docType = type || 'DNI';
    if (!document) {
        return { isValid: false, message: 'El campo es obligatorio.', type: docType };
    }

    const value = document.replace(/[\s-]/g, '').toUpperCase();
    
    if (!type) {
        if (/^[XYZ][0-9]{7}[A-Z]$/.test(value)) {
            docType = 'NIE';
        } else if (/^[0-9]{7,8}[A-Z]$/.test(value)) {
            docType = 'DNI';
        } else {
            docType = (countryCode === 'ES' && /^[0-9]/.test(value)) ? 'DNI' : 'PASPORT';
        }
    }

    // 1. ESPAÑA (ES)
    if (countryCode === 'ES') {
        if (docType === 'DNI') {
            if (/^[0-9]{7,8}[A-Z]$/.test(value)) {
                return isValidDNI(value)
                    ? { isValid: true, type: 'DNI' }
                    : { isValid: false, message: 'La letra del DNI no es válida.', type: 'DNI' };
            }
            return { isValid: false, message: 'Formato de DNI inválido (ej: 12345678Z).', type: 'DNI' };
        }

        if (docType === 'NIE') {
            if (/^[XYZ][0-9]{7}[A-Z]$/.test(value)) {
                return isValidNIE(value)
                    ? { isValid: true, type: 'NIE' }
                    : { isValid: false, message: 'La letra del NIE no es válida.', type: 'NIE' };
            }
            return { isValid: false, message: 'Formato de NIE inválido (ej: X1234567L).', type: 'NIE' };
        }

        if (docType === 'PASPORT') {
            if (/^[A-Z0-9]{9}$/.test(value)) {
                return { isValid: true, type: 'PASPORT' };
            }
            return { isValid: false, message: 'Pasaporte español inválido (9 caracteres).', type: 'PASPORT' };
        }
    }

    // 2. FRANCIA (FR)
    if (countryCode === 'FR') {
        if (docType === 'DNI') {
            if (/^([0-9]{12}|[A-Z0-9]{9})$/.test(value)) {
                return { isValid: true, type: 'DNI' };
            }
            return { isValid: false, message: 'ID francés inválido (9 o 12 caracteres).', type: 'DNI' };
        }
        if (docType === 'PASPORT') {
            if (/^[0-9]{2}[A-Z]{2}[0-9]{5}$/.test(value)) {
                return { isValid: true, type: 'PASPORT' };
            }
            return { isValid: false, message: 'Pasaporte francés inválido (ej: 12AA34567).', type: 'PASPORT' };
        }
    }

    // 3. ALEMANIA (DE)
    if (countryCode === 'DE') {
        if (docType === 'DNI') {
            if (/^[A-Z0-9]{9}$/.test(value)) {
                return { isValid: true, type: 'DNI' };
            }
            return { isValid: false, message: 'ID alemán inválido (9 caracteres).', type: 'DNI' };
        }
        if (docType === 'PASPORT') {
            if (/^[A-Z0-9]{9}$/.test(value)) {
                return { isValid: true, type: 'PASPORT' };
            }
            return { isValid: false, message: 'Pasaporte alemán inválido (9 caracteres).', type: 'PASPORT' };
        }
    }

    // 4. REINO UNIDO (GB)
    if (countryCode === 'GB') {
        if (docType === 'PASPORT') {
            if (/^[0-9]{9}$/.test(value)) {
                return { isValid: true, type: 'PASPORT' };
            }
            return { isValid: false, message: 'Pasaporte británico inválido (9 dígitos).', type: 'PASPORT' };
        }
    }

    // 5. ITALIA (IT)
    if (countryCode === 'IT') {
        if (docType === 'DNI') {
            if (/^[A-Z]{2}[0-9]{5}[A-Z]{2}$/.test(value)) {
                return { isValid: true, type: 'DNI' };
            }
            return { isValid: false, message: 'ID italiano inválido (ej: CA12345AA).', type: 'DNI' };
        }
        if (docType === 'PASPORT') {
            if (/^[A-Z]{2}[0-9]{7}$/.test(value)) {
                return { isValid: true, type: 'PASPORT' };
            }
            return { isValid: false, message: 'Pasaporte italiano inválido (ej: AA1234567).', type: 'PASPORT' };
        }
    }

    // 6. PORTUGAL (PT)
    if (countryCode === 'PT') {
        if (docType === 'DNI') {
            if (/^[0-9]{8,9}[A-Z0-9]{3,4}$/.test(value)) {
                return { isValid: true, type: 'DNI' };
            }
            return { isValid: false, message: 'ID portugués inválido (12 caracteres).', type: 'DNI' };
        }
        if (docType === 'PASPORT') {
            if (/^[A-Z]{2}[0-9]{6}$/.test(value)) {
                return { isValid: true, type: 'PASPORT' };
            }
            return { isValid: false, message: 'Pasaporte portugués inválido (ej: AA123456).', type: 'PASPORT' };
        }
    }

    // 7. ANDORRA (AD)
    if (countryCode === 'AD') {
        if (docType === 'DNI') {
            if (/^[0-9]{6}[A-Z]$/.test(value)) {
                return { isValid: true, type: 'DNI' };
            }
            return { isValid: false, message: 'ID andorrano inválido (ej: 123456Z).', type: 'DNI' };
        }
        if (docType === 'PASPORT') {
            if (/^[A-Z]{2}[0-9]{6}$/.test(value)) {
                return { isValid: true, type: 'PASPORT' };
            }
            return { isValid: false, message: 'Pasaporte andorrano inválido (ej: AD123456).', type: 'PASPORT' };
        }
    }

    // 8. ESTADOS UNIDOS (US)
    if (countryCode === 'US') {
        if (docType === 'PASPORT') {
            if (/^([0-9]{9}|[A-Z][0-9]{8})$/.test(value)) {
                return { isValid: true, type: 'PASPORT' };
            }
            return { isValid: false, message: 'Pasaporte de EE.UU. inválido (9 caracteres).', type: 'PASPORT' };
        }
    }

    // Formato genérico
    if (docType === 'DNI' || docType === 'NIE') {
        if (/^[A-Z0-9-]{5,20}$/.test(value)) {
            return { isValid: true, type: docType };
        }
        return { isValid: false, message: 'Documento de identidad no válido.', type: docType };
    }

    if (docType === 'PASPORT') {
        if (/^[A-Z0-9]{6,20}$/.test(value)) {
            return { isValid: true, type: 'PASPORT' };
        }
        return { isValid: false, message: 'Pasaporte no válido.', type: 'PASPORT' };
    }

    return { isValid: false, message: 'Documento no reconocido.', type: docType };
}

/**
 * Valida el dígito de control del DNI español.
 */
function isValidDNI(dni: string): boolean {
    const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
    const numberPart = parseInt(dni.substring(0, dni.length - 1), 10);
    const letterPart = dni.substring(dni.length - 1);

    return letters.charAt(numberPart % 23) === letterPart;
}

/**
 * Valida el dígito de control del NIE español.
 */
function isValidNIE(nie: string): boolean {
    const niePrefix = nie.charAt(0);
    const numberPartStr = nie.substring(1, nie.length - 1);
    const letterPart = nie.substring(nie.length - 1);

    let prefixValue = '';
    if (niePrefix === 'X') prefixValue = '0';
    else if (niePrefix === 'Y') prefixValue = '1';
    else if (niePrefix === 'Z') prefixValue = '2';
    else return false;

    const numberPart = parseInt(prefixValue + numberPartStr, 10);
    const letters = "TRWAGMYFPDXBNJZSQVHLCKE";

    return letters.charAt(numberPart % 23) === letterPart;
}

/**
 * Valida una dirección de correo electrónico.
 */
export function validateEmail(email: string): { isValid: boolean; message?: string } {
    const value = email.trim();

    if (!value) {
        return { isValid: false, message: 'El campo es obligatorio.' };
    }

    // Regla robusta de email:
    // 1. Debe tener una sola @
    // 2. No debe tener espacios
    // 3. Después de la @ debe haber al menos un punto
    // 4. El TLD debe tener al menos 2 caracteres
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(value)) {
        return {
            isValid: false,
            message: 'El correo electrónico no tiene un formato válido (ejemplo: usuario@dominio.com).'
        };
    }

    return { isValid: true };
}
