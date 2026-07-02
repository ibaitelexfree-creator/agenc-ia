'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { apiUrl } from '@/lib/api';
import { Profile } from '@/types/student';

const parseDateString = (dateStr: string) => {
    if (!dateStr) return { day: '', month: '', year: '' };
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return {
            year: parts[0],
            month: parts[1],
            day: parts[2]
        };
    }
    return { day: '', month: '', year: '' };
};

const getDaysInMonth = (monthStr: string, yearStr: string) => {
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    if (!month) return 31;
    if ([4, 6, 9, 11].includes(month)) return 30;
    if (month === 2) {
        if (year && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) {
            return 29;
        }
        return 28;
    }
    return 31;
};

interface Child {
    id: string;
    nombre: string;
    apellidos: string;
    fecha_nacimiento: string;
    dni: string;
    sabe_nadar: string;
    necesidades_especiales?: string;
    is_member: boolean;
}

interface ChildrenManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: Profile;
    onProfileUpdate: (updatedProfile: Profile) => void;
}

export default function ChildrenManagementModal({
    isOpen,
    onClose,
    profile,
    onProfileUpdate
}: ChildrenManagementModalProps) {
    const locale = useLocale();
    const [children, setChildren] = useState<Child[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingChildId, setEditingChildId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Form fields
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [dni, setDni] = useState('');
    const [sabeNadar, setSabeNadar] = useState('Sí');
    const [necesidadesEspeciales, setNecesidadesEspeciales] = useState('');
    const [isMember, setIsMember] = useState(false);

    const handleDatePartChange = (part: 'day' | 'month' | 'year', value: string) => {
        const current = parseDateString(fechaNacimiento || '');
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
            setFechaNacimiento(formattedDate);
        } else {
            setFechaNacimiento('');
        }
    };

    // Load children from profile.avatar_url
    useEffect(() => {
        if (isOpen && profile) {
            const avatarUrl = (profile as any).avatar_url || '';
            if (avatarUrl.startsWith('children_json:')) {
                try {
                    const parsed = JSON.parse(avatarUrl.replace('children_json:', ''));
                    if (Array.isArray(parsed)) {
                        setChildren(parsed);
                    }
                } catch (e) {
                    console.error('Error parsing children json:', e);
                }
            } else {
                setChildren([]);
            }
            setIsFormOpen(false);
            setEditingChildId(null);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, profile]);

    const handleOpenAddForm = () => {
        setNombre('');
        setApellidos(profile.apellidos || '');
        setFechaNacimiento('');
        setDni('');
        setSabeNadar('Sí');
        setNecesidadesEspeciales('');
        setIsMember(false);
        setEditingChildId(null);
        setIsFormOpen(true);
    };

    const handleOpenEditForm = (child: Child) => {
        setNombre(child.nombre);
        setApellidos(child.apellidos);
        setFechaNacimiento(child.fecha_nacimiento);
        setDni(child.dni);
        setSabeNadar(child.sabe_nadar);
        setNecesidadesEspeciales(child.necesidades_especiales || '');
        setIsMember(child.is_member);
        setEditingChildId(child.id);
        setIsFormOpen(true);
    };

    const handleDeleteChild = async (childId: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este familiar?')) return;
        const updated = children.filter(c => c.id !== childId);
        await saveChildrenList(updated);
    };

    const handleSaveChild = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre || !apellidos || !fechaNacimiento) {
            alert('Por favor, rellene los campos obligatorios.');
            return;
        }

        let updated: Child[];
        if (editingChildId) {
            updated = children.map(c => c.id === editingChildId ? {
                id: editingChildId,
                nombre,
                apellidos,
                fecha_nacimiento: fechaNacimiento,
                dni,
                sabe_nadar: sabeNadar,
                necesidades_especiales: necesidadesEspeciales,
                is_member: isMember
            } : c);
        } else {
            const newChild: Child = {
                id: `child-${Date.now()}`,
                nombre,
                apellidos,
                fecha_nacimiento: fechaNacimiento,
                dni,
                sabe_nadar: sabeNadar,
                necesidades_especiales: necesidadesEspeciales,
                is_member: isMember
            };
            updated = [...children, newChild];
        }

        await saveChildrenList(updated);
        setIsFormOpen(false);
        setEditingChildId(null);
    };

    const saveChildrenList = async (list: Child[]) => {
        setLoading(true);
        try {
            const payload = {
                nombre: profile.nombre || '',
                apellidos: profile.apellidos || '',
                telefono: profile.telefono || '',
                avatar_url: list.length > 0 ? 'children_json:' + JSON.stringify(list) : null
            };

            const res = await fetch(apiUrl('/api/student/update-profile'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (res.ok) {
                setChildren(list);
                onProfileUpdate(data.profile);
            } else {
                alert(data.error || 'Error al guardar los datos.');
            }
        } catch (err) {
            console.error('Error saving children list:', err);
            alert('Error de conexión.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-nautical-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-card border border-black/10 p-8 rounded-sm w-full max-w-lg shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-black/20 hover:text-black transition-colors"
                >
                    ✕
                </button>

                <header>
                    <h3 className="text-2xl font-display text-black italic">Mis Hijos / Familiares</h3>
                    <p className="text-2xs text-black/40 mt-1">Registra a tus hijos para poder inscribirlos en los cursos escolares y campamentos.</p>
                </header>

                {isFormOpen ? (
                    <form onSubmit={handleSaveChild} className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest text-accent font-bold">Nombre *</label>
                                <input
                                    type="text"
                                    required
                                    value={nombre}
                                    onChange={e => setNombre(e.target.value)}
                                    className="w-full bg-black/5 border border-black/10 p-3 text-black text-sm focus:border-accent outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest text-accent font-bold">Apellidos *</label>
                                <input
                                    type="text"
                                    required
                                    value={apellidos}
                                    onChange={e => setApellidos(e.target.value)}
                                    className="w-full bg-black/5 border border-black/10 p-3 text-black text-sm focus:border-accent outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest text-accent font-bold">F. Nacimiento *</label>
                            {(() => {
                                const { day, month, year } = parseDateString(fechaNacimiento);
                                const daysInMonth = getDaysInMonth(month, year);
                                const days = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, '0'));
                                
                                const months = Array.from({ length: 12 }, (_, i) => {
                                    const mNum = (i + 1).toString().padStart(2, '0');
                                    let mName = '';
                                    try {
                                        mName = new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2026, i, 1));
                                        mName = mName.charAt(0).toUpperCase() + mName.slice(1);
                                    } catch (e) {
                                        mName = mNum;
                                    }
                                    return { value: mNum, label: `${mNum} - ${mName}` };
                                });

                                const currentYear = new Date().getFullYear();
                                const maxYear = currentYear - 3;
                                const minYear = 1900;
                                const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => (maxYear - i).toString());

                                return (
                                    <div className="grid grid-cols-3 gap-3">
                                        {/* Day Selector */}
                                        <div className="relative">
                                            <select
                                                id="child_birth_day"
                                                value={day}
                                                onChange={(e) => handleDatePartChange('day', e.target.value)}
                                                className="w-full bg-black/5 border border-black/10 p-3 pr-8 text-black text-sm focus:border-accent outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-white text-black/50">DD</option>
                                                {days.map((d) => (
                                                    <option key={d} value={d} className="bg-white text-black">
                                                        {d}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-black/40">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Month Selector */}
                                        <div className="relative">
                                            <select
                                                id="child_birth_month"
                                                value={month}
                                                onChange={(e) => handleDatePartChange('month', e.target.value)}
                                                className="w-full bg-black/5 border border-black/10 p-3 pr-8 text-black text-sm focus:border-accent outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-white text-black/50">MM</option>
                                                {months.map((m) => (
                                                    <option key={m.value} value={m.value} className="bg-white text-black">
                                                        {m.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-black/40">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Year Selector */}
                                        <div className="relative">
                                            <select
                                                id="child_birth_year"
                                                value={year}
                                                onChange={(e) => handleDatePartChange('year', e.target.value)}
                                                className="w-full bg-black/5 border border-black/10 p-3 pr-8 text-black text-sm focus:border-accent outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-white text-black/50">AAAA</option>
                                                {years.map((y) => (
                                                    <option key={y} value={y} className="bg-white text-black">
                                                        {y}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-black/40">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest text-accent font-bold">DNI / NIE / Pasaporte</label>
                                <input
                                    type="text"
                                    value={dni}
                                    onChange={e => setDni(e.target.value)}
                                    className="w-full bg-black/5 border border-black/10 p-3 text-black text-sm focus:border-accent outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest text-accent font-bold">¿Sabe Nadar? *</label>
                                <select
                                    required
                                    value={sabeNadar}
                                    onChange={e => setSabeNadar(e.target.value)}
                                    className="w-full bg-black/5 border border-black/10 p-3 text-black text-sm focus:border-accent outline-none"
                                >
                                    <option value="Sí" className="bg-white text-black">Sí</option>
                                    <option value="No" className="bg-white text-black">No</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest text-accent font-bold">Necesidades Especiales / Alergias</label>
                            <input
                                type="text"
                                value={necesidadesEspeciales}
                                onChange={e => setNecesidadesEspeciales(e.target.value)}
                                className="w-full bg-black/5 border border-black/10 p-3 text-black text-sm focus:border-accent outline-none"
                                placeholder="Ninguna"
                            />
                        </div>

                        <div className="pt-2">
                            <label className="flex items-center gap-3 cursor-pointer p-4 bg-black/5 border border-black/10 rounded-sm">
                                <input
                                    type="checkbox"
                                    checked={isMember}
                                    onChange={e => setIsMember(e.target.checked)}
                                    className="w-5 h-5 accent-accent"
                                />
                                <div>
                                    <span className="text-sm font-bold text-black block">Es Socio del Club</span>
                                    <span className="text-[10px] text-black/40 block">Marcar si paga suscripción mensual de socio en Stripe</span>
                                </div>
                            </label>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 bg-brass-gold text-nautical-black font-bold uppercase tracking-wider text-xs hover:bg-white transition-colors"
                            >
                                Guardar familiar
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                className="px-6 py-3 border border-black/10 text-black font-bold uppercase tracking-wider text-xs hover:bg-black/5 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        {children.length === 0 ? (
                            <div className="p-8 border border-dashed border-black/10 text-center text-black/40 italic text-sm">
                                No tienes familiares registrados todavía.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {children.map((child) => (
                                    <div key={child.id} className="p-4 bg-black/5 border border-black/10 flex justify-between items-center rounded-sm">
                                        <div>
                                            <p className="text-sm font-bold text-black flex items-center gap-2">
                                                {child.nombre} {child.apellidos}
                                                {child.is_member && (
                                                    <span className="px-2 py-0.5 bg-accent/20 border border-accent/30 text-accent text-[9px] uppercase font-bold tracking-wider rounded">Socio</span>
                                                )}
                                            </p>
                                            <p className="text-3xs text-black/40 mt-1 uppercase">
                                                Nacido/a: {child.fecha_nacimiento} {child.dni ? `— DNI: ${child.dni}` : ''}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleOpenEditForm(child)}
                                                className="px-3 py-1.5 bg-black/5 hover:bg-black/10 border border-black/10 text-black text-xs uppercase tracking-wider transition-colors"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDeleteChild(child.id)}
                                                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs uppercase tracking-wider transition-colors"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={handleOpenAddForm}
                                className="flex-1 py-3 bg-brass-gold text-nautical-black font-bold uppercase tracking-wider text-xs hover:bg-white transition-colors"
                            >
                                + Añadir Hijo/a
                            </button>
                            <button
                                onClick={onClose}
                                className="px-6 py-3 border border-black/10 text-black font-bold uppercase tracking-wider text-xs hover:bg-black/5 transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
