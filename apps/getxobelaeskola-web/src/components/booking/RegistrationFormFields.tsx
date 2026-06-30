'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export type ActivityType = 'course' | 'rental' | 'udalekus' | 'membership' | 'training';

interface RegistrationFormFieldsProps {
    activityType: ActivityType;
    formData: any;
    onChange: (data: any) => void;
    errors: Record<string, string>;
}

export default function RegistrationFormFields({
    activityType,
    formData,
    onChange,
    errors
}: RegistrationFormFieldsProps) {
    const t = useTranslations('registration_form');

    const handleInputChange = (field: string, value: any) => {
        onChange({ ...formData, [field]: value });
    };

    const handleNestedChange = (parent: string, field: string, value: any) => {
        const parentData = formData[parent] || {};
        onChange({
            ...formData,
            [parent]: { ...parentData, [field]: value }
        });
    };

    const getAutoCompleteValue = (fieldName: string) => {
        const baseName = fieldName.split('_').pop() || fieldName;
        switch (baseName) {
            case 'nombre':
                return 'given-name';
            case 'apellidos':
                return 'family-name';
            case 'email':
                return 'email';
            case 'domicilio':
                return 'street-address';
            case 'localidad':
                return 'address-level2';
            case 'codigo_postal':
                return 'postal-code';
            case 'telefono':
                return 'tel';
            case 'fecha_nacimiento':
                return 'bday';
            default:
                return undefined;
        }
    };

    const renderInput = (
        label: string,
        name: string,
        type = 'text',
        placeholder = '',
        required = true,
        options?: string[]
    ) => {
        const error = errors[name];
        return (
            <div className="space-y-2">
                <label className="text-3xs uppercase tracking-widest text-accent font-bold block">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                {type === 'select' && options ? (
                    <select
                        id={name}
                        name={name}
                        autoComplete={getAutoCompleteValue(name)}
                        required={required}
                        value={formData[name] || ''}
                        onChange={(e) => handleInputChange(name, e.target.value)}
                        className={`w-full bg-black/[0.02] border ${error ? 'border-red-500/50' : 'border-black/10'} p-4 text-sea-foam focus:border-accent outline-none text-sm transition-all appearance-none cursor-pointer`}
                    >
                        <option value="" className="bg-nautical-black text-sea-foam">{t('select_option')}</option>
                        {options.map((opt) => (
                            <option key={opt} value={opt} className="bg-nautical-black text-sea-foam">{opt}</option>
                        ))}
                    </select>
                ) : type === 'checkbox' ? (
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-black/[0.02] border border-black/10 rounded-sm">
                        <input
                            id={name}
                            name={name}
                            type="checkbox"
                            checked={!!formData[name]}
                            onChange={(e) => handleInputChange(name, e.target.checked)}
                            className="w-5 h-5 accent-accent"
                        />
                        <span className="text-sm text-sea-foam/80">{placeholder}</span>
                    </label>
                ) : (
                    <input
                        id={name}
                        name={name}
                        autoComplete={getAutoCompleteValue(name)}
                        required={required}
                        type={type}
                        placeholder={placeholder}
                        value={formData[name] || ''}
                        onChange={(e) => handleInputChange(name, e.target.value)}
                        className={`w-full bg-black/[0.02] border ${error ? 'border-red-500/50' : 'border-black/10'} p-4 text-sea-foam focus:border-accent outline-none text-sm transition-all`}
                    />
                )}
                {error && <p className="text-red-400 text-xs mt-1">⚠️ {error}</p>}
            </div>
        );
    };

    const renderNestedInput = (
        parent: string,
        label: string,
        name: string,
        type = 'text',
        placeholder = '',
        required = true
    ) => {
        const errorKey = `${parent}.${name}`;
        const error = errors[errorKey];
        const val = formData[parent]?.[name] || '';
        const idName = `${parent}_${name}`;

        return (
            <div className="space-y-2">
                <label className="text-3xs uppercase tracking-widest text-accent font-bold block">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                    id={idName}
                    name={idName}
                    autoComplete={getAutoCompleteValue(name)}
                    required={required}
                    type={type}
                    placeholder={placeholder}
                    value={val}
                    onChange={(e) => handleNestedChange(parent, name, e.target.value)}
                    className={`w-full bg-black/[0.02] border ${error ? 'border-red-500/50' : 'border-black/10'} p-4 text-sea-foam focus:border-accent outline-none text-sm transition-all`}
                />
                {error && <p className="text-red-400 text-xs mt-1">⚠️ {error}</p>}
            </div>
        );
    };

    const renderParticipantFields = (prefix = '') => {
        return (
            <div className="grid md:grid-cols-2 gap-6 p-6 border border-black/5 bg-black/[0.02] rounded-sm">
                <div className="col-span-full border-b border-black/5 pb-2">
                    <h4 className="text-xs uppercase tracking-widest text-sea-foam font-bold">
                        {prefix ? `${t('student_data_prefix')} ${prefix}` : t('student_data')}
                    </h4>
                </div>
                {prefix ? (
                    <>
                        {renderInput(t('name'), `${prefix}_nombre`, 'text', t('name_placeholder_prefix'))}
                        {renderInput(t('surnames'), `${prefix}_apellidos`, 'text', t('surnames_placeholder_prefix'))}
                        {renderInput(t('age_birth_date'), `${prefix}_edad`, 'text', t('age_placeholder_prefix'))}
                        {renderInput(t('id_doc'), `${prefix}_dni`, 'text', t('id_placeholder_prefix'), false)}
                        {renderInput(t('swim_question'), `${prefix}_sabe_nadar`, 'select', '', true, [t('yes'), t('no')].map(String))}
                        {renderInput(t('allergies'), `${prefix}_alergias`, 'text', t('allergies_placeholder'), false)}
                        <div className="col-span-full">
                            {renderInput(t('special_needs'), `${prefix}_necesidades_especiales`, 'text', t('special_needs_placeholder_prefix'), false)}
                        </div>
                    </>
                ) : (
                    <>
                        {renderInput(t('name'), 'nombre', 'text', t('name_placeholder'))}
                        {renderInput(t('surnames'), 'apellidos', 'text', t('surnames_placeholder'))}
                        {renderInput(t('birth_date'), 'fecha_nacimiento', 'date')}
                        <div className="space-y-2">
                            <label className="text-3xs uppercase tracking-widest text-accent font-bold block">
                                {t('country_label')} <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                value={formData.countryCode || 'ES'}
                                onChange={(e) => handleInputChange('countryCode', e.target.value)}
                                className="w-full bg-black/[0.02] border border-black/10 p-4 text-sea-foam focus:border-accent outline-none text-sm transition-all appearance-none cursor-pointer"
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
                        {renderInput(t('id_doc'), 'dni', 'text', t('id_placeholder_prefix'))}
                        {renderInput(t('address'), 'domicilio', 'text', t('address_placeholder'))}
                        {renderInput(t('locality'), 'localidad', 'text', t('locality_placeholder'))}
                        {renderInput(t('postal_code'), 'codigo_postal', 'text', t('postal_code_placeholder'))}
                        {renderInput(t('swim_question'), 'sabe_nadar', 'select', '', true, [t('yes'), t('no')].map(String))}
                        <div className="col-span-full">
                            {renderInput(t('special_needs'), 'necesidades_especiales', 'text', t('special_needs_placeholder'), false)}
                        </div>
                    </>
                )}
            </div>
        );
    };

    const renderTutorFields = (parentName: string, title: string, required = true) => {
        return (
            <div className="grid md:grid-cols-2 gap-6 p-6 border border-black/5 bg-black/[0.02] rounded-sm">
                <div className="col-span-full border-b border-black/5 pb-2">
                    <h4 className="text-xs uppercase tracking-widest text-sea-foam font-bold">{title}</h4>
                </div>
                {renderNestedInput(parentName, t('name'), 'nombre', 'text', t('tutor_name_placeholder'), required)}
                {renderNestedInput(parentName, t('surnames'), 'apellidos', 'text', t('surnames_placeholder_prefix'), required)}
                {renderNestedInput(parentName, t('id_doc'), 'dni', 'text', t('id_placeholder_prefix'), required)}
                {renderNestedInput(parentName, t('tutor_phone'), 'telefono', 'tel', t('tutor_phone_placeholder'), required)}
                {renderNestedInput(parentName, t('tutor_email'), 'email', 'email', t('tutor_email_placeholder'), required)}
            </div>
        );
    };

    const renderBankFields = () => {
        return (
            <div className="grid md:grid-cols-2 gap-6 p-6 border border-black/5 bg-black/[0.02] rounded-sm">
                <div className="col-span-full border-b border-black/5 pb-2">
                    <h4 className="text-xs uppercase tracking-widest text-sea-foam font-bold">{t('bank_data')}</h4>
                    <p className="text-3xs text-sea-foam/50 mt-1 uppercase">{t('bank_data_required')}</p>
                </div>
                {renderInput(t('iban'), 'iban', 'text', 'ES00 0000 0000 0000 0000 0000')}
                {renderInput(t('titular'), 'titular_cuenta', 'text', t('titular_placeholder'))}
            </div>
        );
    };

    const renderPaymentAndBankFields = () => {
        const isBank = formData.payment_method === 'bank';
        return (
            <div className="space-y-6">
                <div className="space-y-4 p-6 border border-black/5 bg-black/[0.02] rounded-sm">
                    <label className="text-3xs uppercase tracking-widest text-accent font-bold block">
                        {t('payment_method_label')} <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <label className={`flex items-center gap-3 cursor-pointer p-4 border rounded-sm transition-all ${!isBank ? 'bg-accent/10 border-accent text-sea-foam' : 'bg-black/[0.02] border-black/10 text-sea-foam/60 hover:bg-black/5'}`}>
                            <input
                                type="radio"
                                name="payment_method"
                                value="card"
                                checked={!isBank}
                                onChange={() => handleInputChange('payment_method', 'card')}
                                className="w-4 h-4 accent-accent"
                            />
                            <span className="text-sm font-bold">💳 {t('pay_with_card')}</span>
                        </label>
                        <label className={`flex items-center gap-3 cursor-pointer p-4 border rounded-sm transition-all ${isBank ? 'bg-accent/10 border-accent text-sea-foam' : 'bg-black/[0.02] border-black/10 text-sea-foam/60 hover:bg-black/5'}`}>
                            <input
                                type="radio"
                                name="payment_method"
                                value="bank"
                                checked={isBank}
                                onChange={() => handleInputChange('payment_method', 'bank')}
                                className="w-4 h-4 accent-accent"
                            />
                            <span className="text-sm font-bold">🏦 {t('pay_with_bank')}</span>
                        </label>
                    </div>
                </div>
                {isBank && renderBankFields()}
            </div>
        );
    };

    switch (activityType) {
        case 'udalekus':
            return (
                <div className="space-y-8">
                    <p className="text-xs text-sea-foam/60">
                        {t('camp_notice')}
                    </p>
                    {renderParticipantFields('Nº1')}
                    
                    <div className="p-4 border border-black/5 bg-black/[0.02]">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={!!formData.add_alumno_2}
                                onChange={(e) => handleInputChange('add_alumno_2', e.target.checked)}
                                className="w-5 h-5 accent-accent"
                            />
                            <span className="text-sm font-bold text-sea-foam/80">{t('enroll_second')}</span>
                        </label>
                    </div>
                    {formData.add_alumno_2 && renderParticipantFields('Nº2')}

                    <div className="p-4 border border-black/5 bg-black/[0.02]">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={!!formData.add_alumno_3}
                                onChange={(e) => handleInputChange('add_alumno_3', e.target.checked)}
                                className="w-5 h-5 accent-accent"
                            />
                            <span className="text-sm font-bold text-sea-foam/80">{t('enroll_third')}</span>
                        </label>
                    </div>
                    {formData.add_alumno_3 && renderParticipantFields('Nº3')}

                    {renderTutorFields('tutor1', t('tutor_title_prefix') + ' Nº1')}
                    
                    <div className="p-4 border border-black/5 bg-black/[0.02]">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={!!formData.add_tutor_2}
                                onChange={(e) => handleInputChange('add_tutor_2', e.target.checked)}
                                className="w-5 h-5 accent-accent"
                            />
                            <span className="text-sm font-bold text-sea-foam/80">{t('add_tutor_second')}</span>
                        </label>
                    </div>
                    {formData.add_tutor_2 && renderTutorFields('tutor2', t('tutor_title_prefix') + ' Nº2', true)}

                    <div className="grid md:grid-cols-2 gap-6 p-6 border border-black/5 bg-black/[0.02] rounded-sm">
                        <div className="col-span-full border-b border-black/5 pb-2">
                            <h4 className="text-xs uppercase tracking-widest text-sea-foam font-bold">{t('comments_title')}</h4>
                        </div>
                        {renderInput(t('week_label'), 'semana_solicitada', 'text', t('week_placeholder'))}
                        {renderInput(t('comments_label'), 'comentarios', 'text', t('comments_placeholder'), false)}
                    </div>
                </div>
            );

        case 'membership':
            return (
                <div className="space-y-8">
                    {renderParticipantFields()}
                    {renderInput(t('membership_mode'), 'modalidad_socia', 'select', '', true, [
                        'Socia básica (630€/año) -> 30 salidas',
                        'Socia entrenamientos (1000€/año) -> 3 entrenamientos mes, 10 meses',
                        'Socia Premium (1000€/año) -> Salidas ilimitadas',
                        'Socia Premium + (1200€/año) -> 3 entrenamientos + salidas ilimitadas'
                    ])}
                    {renderPaymentAndBankFields()}
                </div>
            );

        case 'training':
            return (
                <div className="space-y-8">
                    {renderParticipantFields()}
                    {renderTutorFields('tutor1', t('tutor_title_prefix') + ' Nº1')}
                    <div className="p-4 border border-black/5 bg-black/[0.02]">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={!!formData.add_tutor_2}
                                onChange={(e) => handleInputChange('add_tutor_2', e.target.checked)}
                                className="w-5 h-5 accent-accent"
                            />
                            <span className="text-sm font-bold text-sea-foam/80">{t('add_tutor_second_training')}</span>
                        </label>
                    </div>
                    {formData.add_tutor_2 && renderTutorFields('tutor2', t('tutor_title_prefix') + ' Nº2', true)}
                    {renderInput(t('training_mode'), 'modalidad_entrenamiento', 'select', '', true, [
                        'Equipo de Optimist',
                        'Equipo de Láser y 420'
                    ])}
                    {renderPaymentAndBankFields()}
                </div>
            );

        case 'course':
        default:
            return (
                <div className="space-y-8">
                    {renderParticipantFields()}
                    <div className="p-4 border border-black/5 bg-black/[0.02]">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={!!formData.is_minor}
                                onChange={(e) => handleInputChange('is_minor', e.target.checked)}
                                className="w-5 h-5 accent-accent"
                            />
                            <span className="text-sm font-bold text-sea-foam/80">{t('is_minor')}</span>
                        </label>
                    </div>
                    {formData.is_minor && renderTutorFields('tutor1', t('tutor_title'))}
                    {renderPaymentAndBankFields()}
                </div>
            );
    }
}
