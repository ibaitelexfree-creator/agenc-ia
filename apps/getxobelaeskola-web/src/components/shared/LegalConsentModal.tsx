'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { validateIdentityDocument, validateEmail, DocumentType } from '@/lib/utils/validators';
import { useTranslations } from 'next-intl';
import RegistrationFormFields from '../booking/RegistrationFormFields';

const calculateAge = (birthDateString: string) => {
    if (!birthDateString) return null;
    const today = new Date();
    const birthDate = new Date(birthDateString);
    if (isNaN(birthDate.getTime())) return null;
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export type ActivityType = 'course' | 'rental' | 'udalekus' | 'membership' | 'training';

interface LegalConsentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { 
        fullName: string; 
        email: string; 
        dni: string; 
        registrationDetails?: any;
    }) => void;
    activityType: ActivityType;
    legalText: string;
    initialData?: {
        fullName?: string;
        email?: string;
        dni?: string;
        nombre?: string;
        apellidos?: string;
        telefono?: string;
        domicilio?: string;
        localidad?: string;
        codigo_postal?: string;
        fecha_nacimiento?: string;
    };
}

export default function LegalConsentModal({
    isOpen,
    onClose,
    onConfirm,
    activityType,
    legalText,
    initialData
}: LegalConsentModalProps) {
    const t = useTranslations('legal_modal');
    const tV = useTranslations('validation');
    const tReg = useTranslations('registration_form');
    
    // Portal mount tracking
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Step state: 0 = Documents & Instructions, 1 = Form Fields, 2 = Signature & Submit
    const [step, setStep] = useState(0);
    
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [dni, setDni] = useState('');
    const [documentType, setDocumentType] = useState<DocumentType>('DNI');
    const [countryCode, setCountryCode] = useState('ES');
    const [dniError, setDniError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [accepted, setAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [viewingDoc, setViewingDoc] = useState<string | null>(null);

    // Dynamic registration form state
    const [registrationDetails, setRegistrationDetails] = useState<any>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Initial data hydration
    React.useEffect(() => {
        if (isOpen) {
            setStep(0);
            setAccepted(false);
            if (initialData) {
                if (initialData.fullName) setFullName(initialData.fullName);
                if (initialData.email) setEmail(initialData.email);
                if (initialData.dni) setDni(initialData.dni);
                
                // Hydrate registrationDetails form fields from database profile fields
                setRegistrationDetails({
                    nombre: initialData.nombre || '',
                    apellidos: initialData.apellidos || '',
                    email: initialData.email || '',
                    dni: initialData.dni || '',
                    telefono: initialData.telefono || '',
                    domicilio: initialData.domicilio || '',
                    localidad: initialData.localidad || '',
                    codigo_postal: initialData.codigo_postal || '',
                    fecha_nacimiento: initialData.fecha_nacimiento || ''
                });
            }
        }
    }, [isOpen, initialData]);

    const documents = React.useMemo(() => {
        const allDocs = [
            { id: 'course', name: 'Formulario Inscripción a cursos', path: '/Documentos/Formularios%20inscripcion%2C%20LOPD%20y%20normas%20a%20firmar%20al%20contratar%20servicioos/Formulario_Inscripcion_a_cursos.pdf' },
            { id: 'membership', name: 'Formulario Inscripción Socios', path: '/Documentos/Formularios%20inscripcion%2C%20LOPD%20y%20normas%20a%20firmar%20al%20contratar%20servicioos/Formulario_Inscripcion_Socias.pdf' },
            { id: 'training', name: 'Formulario Inscripción Equipos', path: '/Documentos/Formularios%20inscripcion%2C%20LOPD%20y%20normas%20a%20firmar%20al%20contratar%20servicioos/Formulario_Inscripcion_Equipos_de_entrenamiento.pdf' },
            { id: 'udalekus', name: 'Normas y LOPD Udalekus', path: '/Documentos/Formularios%20inscripcion%2C%20LOPD%20y%20normas%20a%20firmar%20al%20contratar%20servicioos/Formulario_Inscripcion_Udalekus.pdf' },
        ];

        switch (activityType) {
            case 'udalekus':
                return allDocs.filter(d => d.id === 'udalekus' || d.id === 'course');
            case 'membership':
                return allDocs.filter(d => d.id === 'membership');
            case 'training':
                return allDocs.filter(d => d.id === 'training');
            case 'rental':
            case 'course':
            default:
                return allDocs.filter(d => d.id === 'course');
        }
    }, [activityType]);

    if (!isOpen || !mounted) return null;

    // Validate current step
    const handleNextStep = () => {
        if (step === 0) {
            setStep(1);
        } else if (step === 1) {
            // Basic required validation for step 1
            const errors: Record<string, string> = {};
            
            // Check common fields depending on activityType
            if (activityType === 'udalekus') {
                if (!registrationDetails.N1_nombre) errors.N1_nombre = tV('name_required');
                if (!registrationDetails.N1_apellidos) errors.N1_apellidos = tV('surnames_required');
                if (!registrationDetails.N1_edad) errors.N1_edad = tV('age_required');
                if (!registrationDetails.N1_sabe_nadar) errors.N1_sabe_nadar = tV('swim_required');
                if (!registrationDetails.tutor1?.nombre) errors['tutor1.nombre'] = tV('tutor_name_required');
                if (!registrationDetails.tutor1?.apellidos) errors['tutor1.apellidos'] = tV('tutor_surnames_required');
                if (!registrationDetails.tutor1?.dni) errors['tutor1.dni'] = tV('tutor_dni_required');
                if (!registrationDetails.tutor1?.telefono) errors['tutor1.telefono'] = tV('tutor_phone_required');
                if (!registrationDetails.tutor1?.email) errors['tutor1.email'] = tV('tutor_email_required');
                if (!registrationDetails.semana_solicitada) errors.semana_solicitada = tV('week_required');
            } else {
                // Course, Membership, Training
                if (!registrationDetails.nombre) errors.nombre = tV('name_required');
                if (!registrationDetails.apellidos) errors.apellidos = tV('surnames_required');
                
                if (activityType === 'course') {
                    if (!registrationDetails.fecha_nacimiento) errors.fecha_nacimiento = tV('birth_date_required');
                    if (!registrationDetails.dni) {
                        errors.dni = tV('dni_required');
                    } else {
                        const validation = validateIdentityDocument(registrationDetails.dni, undefined, registrationDetails.countryCode || 'ES');
                        if (!validation.isValid) {
                            errors.dni = tV('invalid_identity_document');
                        }
                    }
                    if (!registrationDetails.domicilio) errors.domicilio = tV('address_required');
                    if (!registrationDetails.localidad) errors.localidad = tV('locality_required');
                    if (!registrationDetails.codigo_postal) errors.codigo_postal = tV('postal_code_required');
                    if (!registrationDetails.sabe_nadar) errors.sabe_nadar = tV('swim_required');
                    
                    if (registrationDetails.payment_method === 'bank') {
                        if (!registrationDetails.iban) errors.iban = tV('iban_required');
                        if (!registrationDetails.titular_cuenta) errors.titular_cuenta = tV('titular_required');
                    }

                    const age = calculateAge(registrationDetails.fecha_nacimiento);
                    const isMinor = age !== null && age < 18;

                    if (isMinor) {
                        if (!registrationDetails.tutor1?.nombre) errors['tutor1.nombre'] = tV('tutor_name_required');
                        if (!registrationDetails.tutor1?.apellidos) errors['tutor1.apellidos'] = tV('tutor_surnames_required');
                        if (!registrationDetails.tutor1?.dni) {
                            errors['tutor1.dni'] = tV('tutor_dni_required');
                        } else {
                            const validation = validateIdentityDocument(registrationDetails.tutor1.dni, undefined, registrationDetails.countryCode || 'ES');
                            if (!validation.isValid) {
                                errors['tutor1.dni'] = tV('invalid_identity_document');
                            }
                        }
                        if (!registrationDetails.tutor1?.telefono) errors['tutor1.telefono'] = tV('tutor_phone_required');
                        if (!registrationDetails.tutor1?.email) errors['tutor1.email'] = tV('tutor_email_required');
                    }
                } else if (activityType === 'membership') {
                    if (!registrationDetails.fecha_nacimiento) errors.fecha_nacimiento = tV('birth_date_required');
                    if (!registrationDetails.dni) {
                        errors.dni = tV('dni_required');
                    } else {
                        const validation = validateIdentityDocument(registrationDetails.dni, undefined, registrationDetails.countryCode || 'ES');
                        if (!validation.isValid) {
                            errors.dni = tV('invalid_identity_document');
                        }
                    }
                    if (!registrationDetails.domicilio) errors.domicilio = tV('address_required');
                    if (!registrationDetails.localidad) errors.localidad = tV('locality_required');
                    if (!registrationDetails.codigo_postal) errors.codigo_postal = tV('postal_code_required');
                    if (!registrationDetails.sabe_nadar) errors.sabe_nadar = tV('swim_required');
                    if (!registrationDetails.modalidad_socia) errors.modalidad_socia = tV('mode_required');
                    
                    if (registrationDetails.payment_method === 'bank') {
                        if (!registrationDetails.iban) errors.iban = tV('iban_required');
                        if (!registrationDetails.titular_cuenta) errors.titular_cuenta = tV('titular_required');
                    }
                } else if (activityType === 'training') {
                    if (!registrationDetails.fecha_nacimiento) errors.fecha_nacimiento = tV('birth_date_required');
                    if (!registrationDetails.dni) {
                        errors.dni = tV('dni_required');
                    } else {
                        const validation = validateIdentityDocument(registrationDetails.dni, undefined, registrationDetails.countryCode || 'ES');
                        if (!validation.isValid) {
                            errors.dni = tV('invalid_identity_document');
                        }
                    }
                    if (!registrationDetails.domicilio) errors.domicilio = tV('address_required');
                    if (!registrationDetails.localidad) errors.localidad = tV('locality_required');
                    if (!registrationDetails.codigo_postal) errors.codigo_postal = tV('postal_code_required');
                    if (!registrationDetails.sabe_nadar) errors.sabe_nadar = tV('swim_required');
                    
                    if (registrationDetails.payment_method === 'bank') {
                        if (!registrationDetails.iban) errors.iban = tV('iban_required');
                        if (!registrationDetails.titular_cuenta) errors.titular_cuenta = tV('titular_required');
                    }
                    
                    if (!registrationDetails.tutor1?.nombre) errors['tutor1.nombre'] = tV('tutor_name_required');
                    if (!registrationDetails.tutor1?.apellidos) errors['tutor1.apellidos'] = tV('tutor_surnames_required');
                    if (!registrationDetails.tutor1?.dni) {
                        errors['tutor1.dni'] = tV('tutor_dni_required');
                    } else {
                        const validation = validateIdentityDocument(registrationDetails.tutor1.dni, undefined, registrationDetails.countryCode || 'ES');
                        if (!validation.isValid) {
                            errors['tutor1.dni'] = tV('invalid_identity_document');
                        }
                    }
                    if (!registrationDetails.tutor1?.telefono) errors['tutor1.telefono'] = tV('tutor_phone_required');
                    if (!registrationDetails.tutor1?.email) errors['tutor1.email'] = tV('tutor_email_required');
                }
            }

            console.log('--- Step 1 Validation Result ---');
            console.log('registrationDetails:', registrationDetails);
            console.log('validationErrors:', errors);

            if (Object.keys(errors).length > 0) {
                setFormErrors(errors);
                // Scroll to top of form
                const container = document.getElementById('modal-scroll-container');
                if (container) container.scrollTop = 0;
            } else {
                setFormErrors({});
                setStep(2);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accepted) return;

        // Validate DNI/NIE/Passport with country Code
        const validation = validateIdentityDocument(dni, documentType, countryCode);
        if (!validation.isValid) {
            setDniError(tV('invalid_identity_document'));
            return;
        }

        // Validate Email
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            setEmailError(emailValidation.message || tV('email_invalid'));
            return;
        }

        setLoading(true);
        onConfirm({
            fullName,
            email,
            dni: dni.toUpperCase().trim(),
            registrationDetails
        });
    };

    const progressPercentage = ((step + 1) / 3) * 100;

    return createPortal(
        <div className="fixed inset-0 z-[100001] flex items-center justify-center p-4 bg-nautical-black/90 backdrop-blur-sm">
            <div className="bg-nautical-black border border-black/10 w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh] shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-black/10 flex justify-between items-center bg-black/[0.02]">
                    <div>
                        <h2 className="text-xl font-display text-sea-foam uppercase tracking-widest">
                            {viewingDoc ? t('viewing_doc') : (activityType === 'rental' ? t('rental_title') : t('terms_title'))}
                        </h2>
                        {!viewingDoc && (
                            <p className="text-3xs uppercase tracking-widest text-sea-foam/60 mt-1">
                                {t('step_prefix')} {step + 1} {t('step_of')} 3: {step === 0 ? t('step_doc') : step === 1 ? t('step_form') : t('step_sign')}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={viewingDoc ? () => setViewingDoc(null) : onClose}
                        className="text-sea-foam/60 hover:text-sea-foam transition-colors flex items-center gap-2 text-xs uppercase tracking-widest"
                    >
                        {viewingDoc ? `← ${t('back')}` : '✕'}
                    </button>
                </div>

                {/* Progress Bar */}
                {!viewingDoc && (
                    <div className="w-full h-1 bg-black/[0.05]">
                        <div 
                            className="h-full bg-accent transition-all duration-500" 
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                )}

                {/* Body */}
                <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden h-full">
                    <div id="modal-scroll-container" className="p-8 overflow-y-auto space-y-8 custom-scrollbar flex-1">
                        {viewingDoc ? (
                            <div className="h-full min-h-[50vh] border border-black/10">
                                <iframe
                                    src={viewingDoc}
                                    className="w-full h-full"
                                    title="Document Viewer"
                                />
                            </div>
                        ) : (
                            <>
                                {/* STEP 0: Read and accept documents */}
                                {step === 0 && (
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <p className="text-xs uppercase tracking-widest text-accent font-bold">{t('mandatory_docs')}</p>
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                {documents.map((doc, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => setViewingDoc(doc.path)}
                                                        className="group p-4 bg-black/[0.02] border border-black/10 hover:border-accent transition-all text-left flex justify-between items-center"
                                                    >
                                                        <span className="text-sm text-sea-foam/80 group-hover:text-sea-foam">{doc.name}</span>
                                                        <span className="text-accent">📄</span>
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-sea-foam/50 italic">{t('click_to_read')}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-xs uppercase tracking-widest text-accent font-bold">{t('summary_title')}</p>
                                            <div className="bg-black/[0.02] p-6 rounded-sm text-sm text-sea-foam/70 font-light leading-relaxed max-h-48 overflow-y-auto border border-black/5 italic custom-scrollbar block whitespace-pre-line">
                                                {legalText}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 1: Integrated Form Fields */}
                                {step === 1 && (
                                    <div className="space-y-6">
                                        <RegistrationFormFields
                                            activityType={activityType}
                                            formData={registrationDetails}
                                            onChange={setRegistrationDetails}
                                            errors={formErrors}
                                        />
                                    </div>
                                )}

                                {/* STEP 2: Electronic Signature Submission */}
                                {step === 2 && (
                                    <div className="space-y-6">
                                        <div className="p-6 border border-accent/20 bg-accent/5 rounded-sm space-y-4">
                                            <h4 className="text-xs uppercase tracking-widest text-accent font-bold">{t('digital_signature_title')}</h4>
                                            <p className="text-xs text-sea-foam/70 leading-relaxed font-light">
                                                {t('digital_signature_desc')}
                                            </p>
                                            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-black/5">
                                             <div className="space-y-2">
                                                 <label className="text-3xs uppercase tracking-widest text-accent font-bold">{t('full_name')}</label>
                                                 <input
                                                     required
                                                     type="text"
                                                     value={fullName}
                                                     onChange={(e) => setFullName(e.target.value)}
                                                     className="w-full bg-black/[0.02] border border-black/10 p-4 text-sea-foam focus:border-accent outline-none text-sm transition-all"
                                                     placeholder="Juan Pérez"
                                                     readOnly={!!initialData?.fullName}
                                                 />
                                             </div>

                                             <div className="space-y-2">
                                                 <label className="text-3xs uppercase tracking-widest text-accent font-bold">{t('country_label')}</label>
                                                 <select
                                                     value={countryCode}
                                                     onChange={(e) => {
                                                         const newCountry = e.target.value;
                                                         setCountryCode(newCountry);
                                                         if (dni) {
                                                             const validation = validateIdentityDocument(dni, documentType, newCountry);
                                                             setDniError(validation.isValid ? null : tV('invalid_identity_document'));
                                                         }
                                                     }}
                                                     className="w-full bg-black/[0.02] border border-black/10 p-4 text-sea-foam focus:border-accent outline-none text-sm transition-all appearance-none cursor-pointer hover:bg-black/5"
                                                 >
                                                     <option value="ES" className="bg-nautical-black">España (Spain)</option>
                                                     <option value="FR" className="bg-nautical-black">France</option>
                                                     <option value="GB" className="bg-nautical-black">United Kingdom</option>
                                                     <option value="DE" className="bg-nautical-black">Deutschland (Germany)</option>
                                                     <option value="IT" className="bg-nautical-black">Italia (Italy)</option>
                                                     <option value="PT" className="bg-nautical-black">Portugal</option>
                                                     <option value="AD" className="bg-nautical-black">Andorra</option>
                                                     <option value="US" className="bg-nautical-black">United States</option>
                                                     <option value="OTHER" className="bg-nautical-black">Otro / Other</option>
                                                 </select>
                                             </div>

                                             <div className="space-y-2">
                                                 <label className="text-3xs uppercase tracking-widest text-accent font-bold">{t('identity_doc')}</label>
                                                 <div className="flex gap-2">
                                                     <select
                                                         value={documentType}
                                                         onChange={(e) => {
                                                             const newType = e.target.value as DocumentType;
                                                             setDocumentType(newType);
                                                             if (dni) {
                                                                 const validation = validateIdentityDocument(dni, newType, countryCode);
                                                                 setDniError(validation.isValid ? null : tV('invalid_identity_document'));
                                                             }
                                                         }}
                                                         className="w-20 md:w-24 flex-shrink-0 bg-black/[0.02] border border-black/10 p-3 text-sea-foam focus:border-accent outline-none text-sm transition-all appearance-none cursor-pointer hover:bg-black/5"
                                                     >
                                                         <option value="DNI" className="bg-nautical-black">{tReg('doc_dni') || "DNI"}</option>
                                                         <option value="NIE" className="bg-nautical-black">{tReg('doc_nie') || "NIE"}</option>
                                                         <option value="PASPORT" className="bg-nautical-black">{tReg('doc_passport') || "Pasaporte"}</option>
                                                     </select>
                                                     <input
                                                         required
                                                         type="text"
                                                         value={dni}
                                                         onChange={(e) => {
                                                             setDni(e.target.value);
                                                             if (dniError) setDniError(null);
                                                         }}
                                                         onBlur={() => {
                                                             if (dni) {
                                                                 const validation = validateIdentityDocument(dni, documentType, countryCode);
                                                                 if (!validation.isValid) {
                                                                     setDniError(tV('invalid_identity_document'));
                                                                 }
                                                             }
                                                         }}
                                                         className={`flex-1 min-w-0 bg-black/[0.02] border ${dniError ? 'border-red-500/50' : 'border-black/10'} p-4 text-sea-foam focus:border-accent outline-none text-sm transition-all`}
                                                         placeholder={documentType === 'DNI' ? '12345678Z' : documentType === 'NIE' ? 'X1234567L' : 'Pasaporte N123456'}
                                                         readOnly={!!initialData?.dni}
                                                     />
                                                 </div>
                                                 {dniError && (
                                                     <p className="text-red-400 text-[10px] mt-1 pl-1 flex items-center gap-1">
                                                         <span>⚠️</span> {dniError}
                                                     </p>
                                                 )}
                                             </div>

                                             <div className="space-y-2">
                                                 <label className="text-3xs uppercase tracking-widest text-accent font-bold">{t('email_label')}</label>
                                                 <input
                                                     required
                                                     type="email"
                                                     value={email}
                                                     onChange={(e) => {
                                                         setEmail(e.target.value);
                                                         if (emailError) setEmailError(null);
                                                     }}
                                                     onBlur={() => {
                                                         if (email) {
                                                             const validation = validateEmail(email);
                                                             if (!validation.isValid) {
                                                                 setEmailError(validation.message || tV('email_invalid'));
                                                             }
                                                         }
                                                     }}
                                                     className={`w-full bg-black/[0.02] border ${emailError ? 'border-red-500/50' : 'border-black/10'} p-4 text-sea-foam focus:border-accent outline-none text-sm transition-all`}
                                                     placeholder="juan@ejemplo.com"
                                                     readOnly={!!initialData?.email}
                                                 />
                                                 {emailError && (
                                                     <p className="text-red-400 text-xs mt-1 pl-1 flex items-center gap-1">
                                                         <span>⚠️</span> {emailError}
                                                     </p>
                                                 )}
                                             </div>
                                         </div>
                                        </div>

                                        <label className="flex items-start gap-4 cursor-pointer group p-4 border border-accent/20 bg-accent/5 rounded-sm transition-all hover:bg-accent/10">
                                            <input
                                                type="checkbox"
                                                checked={accepted}
                                                onChange={(e) => setAccepted(e.target.checked)}
                                                className="mt-1 w-5 h-5 accent-accent"
                                                required
                                            />
                                            <span className="text-xs text-sea-foam/80 group-hover:text-sea-foam transition-colors leading-relaxed">
                                                {t('confirmation_checkbox')}
                                            </span>
                                        </label>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer buttons */}
                    {!viewingDoc && (
                        <div className="p-8 border-t border-black/10 bg-black/[0.02] flex gap-4">
                            {step > 0 ? (
                                <button
                                    type="button"
                                    onClick={() => setStep(step - 1)}
                                    className="flex-1 py-5 border border-black/10 text-3xs uppercase tracking-widest font-bold text-sea-foam/60 hover:text-sea-foam hover:bg-black/5 transition-all"
                                >
                                    {t('back')}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-5 border border-black/10 text-3xs uppercase tracking-widest font-bold text-sea-foam/60 hover:text-sea-foam hover:bg-black/5 transition-all"
                                >
                                    {t('cancel')}
                                </button>
                            )}

                            {step < 2 ? (
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="flex-[2] py-5 bg-accent text-nautical-black text-3xs uppercase tracking-widest font-bold hover:scale-[1.02] shadow-xl shadow-accent/20 transition-all"
                                >
                                    {t('next')}
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={!accepted || loading}
                                    className={`flex-[2] py-5 bg-accent text-nautical-black text-3xs uppercase tracking-widest font-bold transition-all ${!accepted ? 'opacity-30 grayscale' : 'hover:scale-[1.02] shadow-xl shadow-accent/20'}`}
                                >
                                    {loading ? t('processing') : t('sign_and_continue')}
                                </button>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </div>,
        document.body
    );
}
