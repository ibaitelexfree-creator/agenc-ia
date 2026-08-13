'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';

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

export function PremiumDatePicker({
    value,
    onChange,
    placeholder = 'DD/MM/AAAA',
    error,
    id,
    locale
}: {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    error?: boolean;
    id: string;
    locale: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');
    const [currentDate, setCurrentDate] = useState<Date>(() => {
        if (value) {
            const d = new Date(value);
            if (!isNaN(d.getTime())) return d;
        }
        const defaultDate = new Date();
        defaultDate.setFullYear(defaultDate.getFullYear() - 15);
        return defaultDate;
    });
    
    const [decadeStart, setDecadeStart] = useState(() => {
        const year = currentDate.getFullYear();
        return Math.floor(year / 10) * 10;
    });

    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getDisplayValue = () => {
        if (!value) return '';
        const parts = value.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return value;
    };

    const getDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        
        let startDayOfWeek = firstDayOfMonth.getDay();
        startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
        
        const dayArr = [];
        for (let i = 0; i < startDayOfWeek; i++) {
            dayArr.push(null);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            dayArr.push(new Date(year, month, day));
        }
        return dayArr;
    };

    const getMonthName = (monthIndex: number) => {
        try {
            const mName = new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2026, monthIndex, 1));
            return mName.charAt(0).toUpperCase() + mName.slice(1);
        } catch (e) {
            return (monthIndex + 1).toString().padStart(2, '0');
        }
    };

    const handlePrev = () => {
        if (viewMode === 'days') {
            const newDate = new Date(currentDate);
            newDate.setMonth(newDate.getMonth() - 1);
            setCurrentDate(newDate);
        } else if (viewMode === 'months') {
            const newDate = new Date(currentDate);
            newDate.setFullYear(newDate.getFullYear() - 1);
            setCurrentDate(newDate);
        } else if (viewMode === 'years') {
            setDecadeStart(prev => prev - 10);
        }
    };

    const handleNext = () => {
        if (viewMode === 'days') {
            const newDate = new Date(currentDate);
            newDate.setMonth(newDate.getMonth() + 1);
            setCurrentDate(newDate);
        } else if (viewMode === 'months') {
            const newDate = new Date(currentDate);
            newDate.setFullYear(newDate.getFullYear() + 1);
            setCurrentDate(newDate);
        } else if (viewMode === 'years') {
            setDecadeStart(prev => prev + 10);
        }
    };

    const handleSelectDay = (date: Date) => {
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        onChange(`${y}-${m}-${d}`);
        setIsOpen(false);
    };

    const handleSelectMonth = (monthIdx: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(monthIdx);
        setCurrentDate(newDate);
        setViewMode('days');
    };

    const handleSelectYear = (year: number) => {
        const newDate = new Date(currentDate);
        newDate.setFullYear(year);
        setCurrentDate(newDate);
        setViewMode('months');
    };

    const days = getDays();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const weekDays = locale === 'es' ? ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'] :
                     locale === 'eu' ? ['Al', 'As', 'Az', 'Og', 'Or', 'La', 'Ig'] :
                     locale === 'fr' ? ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'] :
                     ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    return (
        <div className="relative w-full" ref={popoverRef}>
            <input
                id={id}
                type="text"
                readOnly
                placeholder={placeholder}
                value={getDisplayValue()}
                onClick={() => {
                    setIsOpen(!isOpen);
                    setViewMode('days');
                }}
                className={`w-full bg-black/[0.02] border ${error ? 'border-red-500/50' : 'border-black/10'} p-4 text-slate-900 focus:border-accent outline-none text-sm cursor-pointer select-none transition-all`}
            />
            {isOpen && (
                <div className="absolute z-[999] mt-2 left-0 w-80 bg-white border border-black/10 p-4 shadow-2xl rounded-sm">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            ◀
                        </button>
                        
                        <div className="font-bold text-sm text-slate-900 select-none flex gap-1">
                            {viewMode === 'days' && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('months')}
                                        className="hover:text-accent hover:underline transition-all"
                                    >
                                        {getMonthName(currentMonth)}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDecadeStart(Math.floor(currentYear / 10) * 10);
                                            setViewMode('years');
                                        }}
                                        className="hover:text-accent hover:underline transition-all"
                                    >
                                        {currentYear}
                                    </button>
                                </>
                            )}
                            {viewMode === 'months' && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDecadeStart(Math.floor(currentYear / 10) * 10);
                                        setViewMode('years');
                                    }}
                                    className="hover:text-accent hover:underline transition-all"
                                >
                                    {currentYear}
                                </button>
                            )}
                            {viewMode === 'years' && (
                                <span>{decadeStart} - {decadeStart + 11}</span>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleNext}
                            className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            ▶
                        </button>
                    </div>

                    {viewMode === 'days' && (
                        <div>
                            <div className="grid grid-cols-7 gap-1 text-center text-3xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                                {weekDays.map(d => <div key={d}>{d}</div>)}
                            </div>
                            
                            <div className="grid grid-cols-7 gap-1 text-center">
                                {days.map((date, idx) => {
                                    if (!date) return <div key={`empty-${idx}`} />;
                                    
                                    const isSelected = value && 
                                        date.getFullYear() === new Date(value).getFullYear() &&
                                        date.getMonth() === new Date(value).getMonth() &&
                                        date.getDate() === new Date(value).getDate();
                                        
                                    return (
                                        <button
                                            key={date.toISOString()}
                                            type="button"
                                            onClick={() => handleSelectDay(date)}
                                            className={`py-2 text-xs transition-colors rounded-sm ${isSelected ? 'bg-accent text-slate-900 font-bold' : 'text-slate-700 hover:bg-black/5'}`}
                                        >
                                            {date.getDate()}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {viewMode === 'months' && (
                        <div className="grid grid-cols-3 gap-2">
                            {Array.from({ length: 12 }, (_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleSelectMonth(i)}
                                    className={`py-3 text-xs transition-colors rounded-sm ${currentMonth === i ? 'bg-accent text-slate-900 font-bold' : 'text-slate-700 hover:bg-black/5'}`}
                                >
                                    {getMonthName(i)}
                                </button>
                            ))}
                        </div>
                    )}

                    {viewMode === 'years' && (
                        <div className="grid grid-cols-3 gap-2">
                            {Array.from({ length: 12 }, (_, i) => {
                                const year = decadeStart + i;
                                const isCurrent = year === currentYear;
                                return (
                                    <button
                                        key={year}
                                        type="button"
                                        onClick={() => handleSelectYear(year)}
                                        className={`py-3 text-xs transition-colors rounded-sm ${isCurrent ? 'bg-accent text-slate-900 font-bold' : 'text-slate-700 hover:bg-black/5'}`}
                                    >
                                        {year}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

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
    const locale = useLocale();

    const handleInputChange = (field: string, value: any) => {
        onChange({ ...formData, [field]: value });
    };

    const handleDatePartChange = (fieldName: string, part: 'day' | 'month' | 'year', value: string) => {
        const current = parseDateString(formData[fieldName] || '');
        const newDate = { ...current, [part]: value };

        // Adjust day if selected day exceeds new month's days
        if (newDate.month && newDate.day) {
            const maxDays = getDaysInMonth(newDate.month, newDate.year);
            if (parseInt(newDate.day, 10) > maxDays) {
                newDate.day = maxDays.toString().padStart(2, '0');
            }
        }

        if (newDate.day && newDate.month && newDate.year) {
            const formattedDate = `${newDate.year}-${newDate.month.padStart(2, '0')}-${newDate.day.padStart(2, '0')}`;
            handleInputChange(fieldName, formattedDate);
        } else {
            handleInputChange(fieldName, '');
        }
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
        const isBirthDate = name.endsWith('fecha_nacimiento');
        const birthDateVal = formData[name];
        const age = isBirthDate && birthDateVal ? calculateAge(birthDateVal) : null;
        const isMinor = age !== null && age < 18;

        if (isBirthDate) {
            return (
                <div className="space-y-2">
                    <label className="text-3xs uppercase tracking-widest text-accent font-bold block">
                        {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    <PremiumDatePicker
                        id={name}
                        value={formData[name] || ''}
                        onChange={(val) => handleInputChange(name, val)}
                        locale={locale}
                        error={!!error}
                    />
                    {error && <p className="text-red-400 text-xs mt-1">⚠️ {error}</p>}
                    {isMinor && (
                        <div className="p-3 border border-red-500/30 bg-red-500/5 text-red-500 rounded-sm space-y-1 mt-2">
                            <p className="text-xs font-bold">⚠️ {t('underage_detected')}</p>
                            <p className="text-[10px] text-red-400 font-medium">
                                {t('tutor_required_notice')}
                            </p>
                        </div>
                    )}
                </div>
            );
        }

        const maxDate = undefined;

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
                        <option value="" className="bg-white text-slate-900">{t('select_option')}</option>
                        {options.map((opt) => (
                            <option key={opt} value={opt} className="bg-white text-slate-900">{opt}</option>
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
                        <span className="text-sm text-slate-700 font-medium">{placeholder}</span>
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
                        max={maxDate}
                        className={`w-full bg-black/[0.02] border ${error ? 'border-red-500/50' : 'border-black/10'} p-4 text-slate-900 focus:border-accent outline-none text-sm transition-all`}
                    />
                )}
                {error && <p className="text-red-500 text-xs mt-1">⚠️ {error}</p>}
                {isBirthDate && isMinor && (
                    <div className="p-3 border border-red-500/30 bg-red-500/5 text-red-500 rounded-sm space-y-1 mt-2">
                        <p className="text-xs font-bold">⚠️ {t('underage_detected')}</p>
                        <p className="text-[10px] text-red-500 font-medium">
                            {t('tutor_required_notice')}
                        </p>
                    </div>
                )}
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
                    className={`w-full bg-black/[0.02] border ${error ? 'border-red-500/50' : 'border-black/10'} p-4 text-slate-900 focus:border-accent outline-none text-sm transition-all`}
                />
                {error && <p className="text-red-500 text-xs mt-1">⚠️ {error}</p>}
            </div>
        );
    };

    const renderParticipantFields = (prefix = '') => {
        return (
            <div className="grid md:grid-cols-2 gap-6 p-6 border border-black/5 bg-black/[0.02] rounded-sm">
                <div className="col-span-full border-b border-black/5 pb-2">
                    <h4 className="text-xs uppercase tracking-widest text-slate-900 font-bold">
                        {prefix ? `${t('student_data_prefix')} ${prefix}` : t('student_data')}
                    </h4>
                </div>
                {prefix ? (
                    <>
                        {renderInput(t('name'), `${prefix}_nombre`, 'text', t('name_placeholder_prefix'))}
                        {renderInput(t('surnames'), `${prefix}_apellidos`, 'text', t('surnames_placeholder_prefix'))}
                        {renderInput(t('birth_date'), `${prefix}_fecha_nacimiento`, 'date')}
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
                                className="w-full bg-black/[0.02] border border-black/10 p-4 text-slate-900 focus:border-accent outline-none text-sm transition-all appearance-none cursor-pointer"
                            >
                                <option value="ES" className="bg-white text-slate-900">España (Spain)</option>
                                <option value="FR" className="bg-white text-slate-900">France</option>
                                <option value="GB" className="bg-white text-slate-900">United Kingdom</option>
                                <option value="DE" className="bg-white text-slate-900">Deutschland (Germany)</option>
                                <option value="IT" className="bg-white text-slate-900">Italia (Italy)</option>
                                <option value="PT" className="bg-white text-slate-900">Portugal</option>
                                <option value="AD" className="bg-white text-slate-900">Andorra</option>
                                <option value="US" className="bg-white text-slate-900">United States</option>
                                <option value="OTHER" className="bg-white text-slate-900">Otro / Other</option>
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
                    <h4 className="text-xs uppercase tracking-widest text-slate-900 font-bold">{title}</h4>
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
                    <h4 className="text-xs uppercase tracking-widest text-slate-900 font-bold">{t('bank_data')}</h4>
                    <p className="text-3xs text-slate-500 mt-1 uppercase">{t('bank_data_required')}</p>
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
                        <label className={`flex items-center gap-3 cursor-pointer p-4 border rounded-sm transition-all ${!isBank ? 'bg-accent/10 border-accent text-slate-900' : 'bg-black/[0.02] border-black/10 text-slate-700 hover:bg-black/5'}`}>
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
                        <label className={`flex items-center gap-3 cursor-pointer p-4 border rounded-sm transition-all ${isBank ? 'bg-accent/10 border-accent text-slate-900' : 'bg-black/[0.02] border-black/10 text-slate-700 hover:bg-black/5'}`}>
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
        case 'udalekus': {
            const isAnyStudentMinor = () => {
                const age1 = calculateAge(formData['Nº1_fecha_nacimiento']);
                if (age1 !== null && age1 < 18) return true;

                let idx = 2;
                while (formData[`add_alumno_${idx}`]) {
                    const age = calculateAge(formData[`Nº${idx}_fecha_nacimiento`]);
                    if (age !== null && age < 18) return true;
                    idx++;
                }
                return false;
            };

            const showTutors = isAnyStudentMinor();

            const renderStudentFlow = () => {
                const elements = [];
                let currentIdx = 2;
                let showNextCheckbox = true;

                // Student 1 is always rendered
                elements.push(<React.Fragment key="student-1">{renderParticipantFields('Nº1')}</React.Fragment>);

                while (showNextCheckbox) {
                    const prevChecked = currentIdx === 2 ? true : !!formData[`add_alumno_${currentIdx - 1}`];
                    
                    if (prevChecked) {
                        const currentChecked = !!formData[`add_alumno_${currentIdx}`];
                        const displayIndex = currentIdx;

                        // Create localized label for "Enroll a X Student"
                        let labelText = '';
                        if (locale === 'es') {
                            labelText = `Matricular a un ${displayIndex}º Alumno/a`;
                        } else if (locale === 'eu') {
                            labelText = `${displayIndex}. Ikaslea matrikulatu`;
                        } else if (locale === 'fr') {
                            labelText = `Inscrire un ${displayIndex}e élève`;
                        } else {
                            let suffix = 'th';
                            if (displayIndex % 10 === 2 && displayIndex % 100 !== 12) suffix = 'nd';
                            else if (displayIndex % 10 === 3 && displayIndex % 100 !== 13) suffix = 'rd';
                            labelText = `Enroll a ${displayIndex}${suffix} Student`;
                        }

                        elements.push(
                            <div key={`checkbox-wrapper-${displayIndex}`} className="p-4 border border-black/5 bg-black/[0.02]">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={currentChecked}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            const updatedData = { ...formData, [`add_alumno_${displayIndex}`]: isChecked };
                                            if (!isChecked) {
                                                let cleanIdx = displayIndex;
                                                while (formData[`add_alumno_${cleanIdx}`] !== undefined || updatedData[`add_alumno_${cleanIdx}`]) {
                                                    updatedData[`add_alumno_${cleanIdx}`] = false;
                                                    delete updatedData[`Nº${cleanIdx}_nombre`];
                                                    delete updatedData[`Nº${cleanIdx}_apellidos`];
                                                    delete updatedData[`Nº${cleanIdx}_fecha_nacimiento`];
                                                    delete updatedData[`Nº${cleanIdx}_dni`];
                                                    delete updatedData[`Nº${cleanIdx}_sabe_nadar`];
                                                    delete updatedData[`Nº${cleanIdx}_alergias`];
                                                    delete updatedData[`Nº${cleanIdx}_necesidades_especiales`];
                                                    cleanIdx++;
                                                }
                                            }
                                            onChange(updatedData);
                                        }}
                                        className="w-5 h-5 accent-accent"
                                    />
                                    <span className="text-sm font-bold text-slate-800">{labelText}</span>
                                </label>
                            </div>
                        );

                        if (currentChecked) {
                            elements.push(
                                <React.Fragment key={`student-${displayIndex}`}>
                                    {renderParticipantFields(`Nº${displayIndex}`)}
                                </React.Fragment>
                            );
                            currentIdx++;
                        } else {
                            showNextCheckbox = false;
                        }
                    } else {
                        showNextCheckbox = false;
                    }
                }
                return elements;
            };

            return (
                <div className="space-y-8">
                    <p className="text-xs text-slate-600">
                        {t('camp_notice')}
                    </p>
                    
                    {renderStudentFlow()}

                    {showTutors && (
                        <>
                            {renderTutorFields('tutor1', t('tutor_title_prefix') + ' Nº1')}
                            
                            <div className="p-4 border border-black/5 bg-black/[0.02]">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={!!formData.add_tutor_2}
                                        onChange={(e) => handleInputChange('add_tutor_2', e.target.checked)}
                                        className="w-5 h-5 accent-accent"
                                    />
                                    <span className="text-sm font-bold text-slate-800">{t('add_tutor_second')}</span>
                                </label>
                            </div>
                            {formData.add_tutor_2 && renderTutorFields('tutor2', t('tutor_title_prefix') + ' Nº2', true)}
                        </>
                    )}

                    <div className="grid md:grid-cols-2 gap-6 p-6 border border-black/5 bg-black/[0.02] rounded-sm">
                        <div className="col-span-full border-b border-black/5 pb-2">
                            <h4 className="text-xs uppercase tracking-widest text-slate-900 font-bold">{t('comments_title')}</h4>
                        </div>
                        {renderInput(t('week_label'), 'semana_solicitada', 'text', t('week_placeholder'), false)}
                        {renderInput(t('comments_label'), 'comentarios', 'text', t('comments_placeholder'), false)}
                    </div>
                </div>
            );
        }

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

        case 'training': {
            const age = calculateAge(formData.fecha_nacimiento);
            const isMinor = age !== null && age < 18;
            return (
                <div className="space-y-8">
                    {renderParticipantFields()}
                    {isMinor && (
                        <>
                            {renderTutorFields('tutor1', t('tutor_title_prefix') + ' Nº1', true)}
                            <div className="p-4 border border-black/5 bg-black/[0.02]">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={!!formData.add_tutor_2}
                                        onChange={(e) => handleInputChange('add_tutor_2', e.target.checked)}
                                        className="w-5 h-5 accent-accent"
                                    />
                                    <span className="text-sm font-bold text-slate-800">{t('add_tutor_second_training')}</span>
                                </label>
                            </div>
                            {formData.add_tutor_2 && renderTutorFields('tutor2', t('tutor_title_prefix') + ' Nº2', true)}
                        </>
                    )}
                    {renderPaymentAndBankFields()}
                </div>
            );
        }

        case 'course':
        default: {
            const age = calculateAge(formData.fecha_nacimiento);
            const isMinor = age !== null && age < 18;
            return (
                <div className="space-y-8">
                    {renderParticipantFields()}
                    {isMinor && (
                        <>
                            {renderTutorFields('tutor1', t('tutor_title_prefix') + ' Nº1', true)}
                            <div className="p-4 border border-black/5 bg-black/[0.02]">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={!!formData.add_tutor_2}
                                        onChange={(e) => handleInputChange('add_tutor_2', e.target.checked)}
                                        className="w-5 h-5 accent-accent"
                                    />
                                    <span className="text-sm font-bold text-slate-800">{t('add_tutor_second')}</span>
                                </label>
                            </div>
                            {formData.add_tutor_2 && renderTutorFields('tutor2', t('tutor_title_prefix') + ' Nº2', true)}
                        </>
                    )}
                    {renderPaymentAndBankFields()}
                </div>
            );
        }
    }
}
