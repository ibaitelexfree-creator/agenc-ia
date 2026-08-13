'use client';
import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ClientDate } from './StaffShared';
import CampaignManager from './marketing/CampaignManager';
import AccessibleModal from '../shared/AccessibleModal';
import { apiUrl } from '@/lib/api';

export interface Newsletter {
    id: string;
    title: string;
    content: string;
    status: string; // 'sent' | 'scheduled' | 'draft' | 'cancelled'
    created_at: string;
    scheduled_for?: string;
    sent_at?: string;
    recipients_count?: number;
    delivered_count?: number;
    failed_count?: number;
    delivery_logs?: Array<{ email: string; status: 'delivered' | 'failed'; timestamp: string; error?: string }>;
}

function spainLocalToIso(datetimeLocalStr?: string): string | undefined {
    if (!datetimeLocalStr) return undefined;
    const [datePart, timePart] = datetimeLocalStr.split('T');
    if (!datePart || !timePart) return new Date(datetimeLocalStr).toISOString();

    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);

    const utcGuess = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Madrid',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    });

    const parts = formatter.formatToParts(utcGuess);
    const m: Record<string, number> = {};
    parts.forEach(p => { if (p.type !== 'literal') m[p.type] = Number(p.value); });

    const madridHours = m.hour === 24 ? 0 : m.hour;
    const madridDate = new Date(Date.UTC(m.year, m.month - 1, m.day, madridHours, m.minute, m.second));
    const offsetMs = madridDate.getTime() - utcGuess.getTime();

    const finalUtc = new Date(utcGuess.getTime() - offsetMs);
    return finalUtc.toISOString();
}

function isoToSpainDatetimeLocal(isoStr?: string): string {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return '';

    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Madrid',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    const formatted = formatter.format(d);
    return formatted.replace(', ', 'T').replace(' ', 'T');
}

function getSpainNowDatetimeLocal(addMinutes: number = 30): string {
    const d = new Date(Date.now() + addMinutes * 60 * 1000);
    return isoToSpainDatetimeLocal(d.toISOString());
}

function CountdownBadge({ targetDate, className = '', theme = 'dark', onClick }: { targetDate?: string; className?: string; theme?: 'dark' | 'light'; onClick?: () => void }) {
    const [now, setNow] = React.useState(() => Date.now());

    React.useEffect(() => {
        if (!targetDate) return;
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    if (!targetDate) return null;

    const diff = new Date(targetDate).getTime() - now;
    if (diff <= 0) {
        return (
            <span 
                onClick={onClick}
                className={`px-2.5 py-1 text-2xs font-mono font-black rounded-xs animate-pulse flex items-center gap-1.5 ${onClick ? 'cursor-pointer hover:scale-105 transition-all' : ''} bg-amber-400 text-nautical-black border border-amber-500 ${className}`}
                title={onClick ? '📅 Haz clic para editar la fecha y hora de programación' : undefined}
            >
                ⏳ Enviando ahora...
            </span>
        );
    }

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    parts.push(`${hours.toString().padStart(2, '0')}h`);
    parts.push(`${minutes.toString().padStart(2, '0')}m`);
    parts.push(`${seconds.toString().padStart(2, '0')}s`);

    const titleTooltip = onClick 
        ? '📅 Haz clic para editar la fecha y hora de programación'
        : `Tiempo restante: ${days > 0 ? `${days} días, ` : ''}${hours}h ${minutes}m ${seconds}s`;

    if (theme === 'light') {
        return (
            <span 
                onClick={onClick}
                className={`px-2.5 py-1 bg-amber-400 text-nautical-black border border-amber-500 text-2xs font-mono font-black rounded-xs flex items-center gap-1.5 shadow-xs ${onClick ? 'cursor-pointer hover:scale-105 hover:bg-amber-300 transition-all' : ''} ${className}`} 
                title={titleTooltip}
            >
                <span className="animate-pulse">⏳</span>
                <span>Faltan: <strong className="font-black text-nautical-black">{parts.join(' ')}</strong></span>
            </span>
        );
    }

    return (
        <span 
            onClick={onClick}
            className={`px-2.5 py-1 bg-amber-400 text-nautical-black border border-amber-500 text-2xs font-mono font-black rounded-xs flex items-center gap-1.5 shadow-sm ${onClick ? 'cursor-pointer hover:scale-105 hover:bg-amber-300 transition-all' : ''} ${className}`} 
            title={titleTooltip}
        >
            <span className="animate-pulse">⏳</span>
            <span>Faltan: <strong className="font-black text-nautical-black">{parts.join(' ')}</strong></span>
        </span>
    );
}


interface CommunicationTabProps {
    newsletters: Newsletter[];
    onSendMessage: (data: { title: string, content: string, scheduled_for?: string }) => Promise<void>;
    isSending: boolean;
    onRefreshNewsletters?: () => void;
    subscribersCount?: number;
}

export default function CommunicationTab({ newsletters = [], onSendMessage, isSending, onRefreshNewsletters, subscribersCount = 0 }: CommunicationTabProps) {
    const t = useTranslations('staff_panel');
    
    // New Message Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [scheduledFor, setScheduledFor] = useState('');

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'scheduled'>('all');

    // Modal States
    const [viewingMsg, setViewingMsg] = useState<Newsletter | null>(null);
    const [editingMsg, setEditingMsg] = useState<Newsletter | null>(null);
    
    // Edit Form State inside Modal
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editScheduledFor, setEditScheduledFor] = useState('');
    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // Marketing Automation State
    const [isProcessingMarketing, setIsProcessingMarketing] = useState(false);
    const [marketingResult, setMarketingResult] = useState<{ success: boolean, totalSent?: number, error?: string } | null>(null);

    // Filtered Newsletters List
    const filteredNewsletters = useMemo(() => {
        return newsletters.filter(msg => {
            const matchesSearch = searchQuery === '' || 
                msg.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                msg.content.toLowerCase().includes(searchQuery.toLowerCase());
            
            const isScheduled = msg.status === 'scheduled' || (!!msg.scheduled_for && new Date(msg.scheduled_for).getTime() > Date.now() && msg.status !== 'sent');
            const isSent = msg.status === 'sent' || (!isScheduled && msg.status !== 'cancelled');

            if (statusFilter === 'sent') return matchesSearch && isSent;
            if (statusFilter === 'scheduled') return matchesSearch && isScheduled;
            return matchesSearch;
        });
    }, [newsletters, searchQuery, statusFilter]);

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            alert('Por favor rellena el título y contenido del mensaje');
            return;
        }
        await onSendMessage({
            title,
            content,
            scheduled_for: spainLocalToIso(scheduledFor)
        });
        setTitle('');
        setContent('');
        setScheduledFor('');
        if (onRefreshNewsletters) onRefreshNewsletters();
    };

    const handleOpenEdit = (msg: Newsletter) => {
        setEditingMsg(msg);
        setEditTitle(msg.title);
        setEditContent(msg.content);
        setEditScheduledFor(isoToSpainDatetimeLocal(msg.scheduled_for));
    };

    const handleSaveEdit = async (sendNow: boolean = false) => {
        if (!editingMsg) return;
        if (!editTitle.trim() || !editContent.trim()) {
            alert('El título y contenido no pueden estar vacíos');
            return;
        }

        setIsSavingEdit(true);
        try {
            const res = await fetch(apiUrl('/api/admin/newsletters/update'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingMsg.id,
                    title: editTitle,
                    content: editContent,
                    scheduled_for: spainLocalToIso(editScheduledFor) || null,
                    send_now: sendNow
                })
            });

            const data = await res.json();
            if (res.ok) {
                alert(sendNow ? '🚀 Mensaje enviado inmediatamente con éxito.' : '✅ Comunicación actualizada correctamente.');
                setEditingMsg(null);
                if (onRefreshNewsletters) onRefreshNewsletters();
            } else {
                alert(`Error al actualizar: ${data.error || 'Error desconocido'}`);
            }
        } catch (err) {
            alert('Error de conexión al actualizar el mensaje');
        } finally {
            setIsSavingEdit(false);
        }
    };

    const handleDelete = async (msgId: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este mensaje? Esta acción no se puede deshacer.')) return;
        
        setIsDeleting(msgId);
        try {
            const res = await fetch(apiUrl('/api/admin/newsletters/delete'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: msgId })
            });

            if (res.ok) {
                if (viewingMsg?.id === msgId) setViewingMsg(null);
                if (editingMsg?.id === msgId) setEditingMsg(null);
                if (onRefreshNewsletters) onRefreshNewsletters();
            } else {
                const data = await res.json();
                alert(`Error al eliminar: ${data.error}`);
            }
        } catch (err) {
            alert('Error de conexión al eliminar el mensaje');
        } finally {
            setIsDeleting(null);
        }
    };

    const handleRunMarketing = async () => {
        if (!confirm('¿Deseas ejecutar las automatizaciones de marketing ahora? Esto enviará correos a los alumnos que cumplan los criterios.')) return;

        setIsProcessingMarketing(true);
        setMarketingResult(null);
        try {
            const res = await fetch(apiUrl('/api/admin/marketing/process'), { method: 'POST' });
            const data = await res.json();
            setMarketingResult({
                success: data.success,
                totalSent: data.totalSent,
                error: data.error
            });
            if (onRefreshNewsletters) onRefreshNewsletters();
        } catch (err) {
            setMarketingResult({ success: false, error: 'Error de red' });
        } finally {
            setIsProcessingMarketing(false);
        }
    };

    return (
        <div className="space-y-12 animate-premium-in">
            <header className="flex justify-between items-end border-b border-white/10 pb-12">
                <div className="space-y-2">
                    <span className="text-accent uppercase tracking-[0.4em] text-3xs font-bold block">Central de Operaciones</span>
                    <h2 className="text-6xl font-display text-white italic">{t('communication.title')}</h2>
                    <p className="text-technical text-white/40 tracking-[0.2em] uppercase">{t('communication.subtitle')}</p>
                </div>
            </header>

            {/* MARKETING AUTOMATION PANEL */}
            <div className="glass-panel p-12 border-l-4 border-accent relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                    <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-6">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-display text-white italic">Estrategia de Marketing Automatizado</h3>
                            <p className="text-sm text-white/40 max-w-2xl font-mono">
                                El sistema revisa automáticamente qué alumnos no han vuelto en 3 meses desde su último curso de &quot;Iniciación&quot;
                                y les envía un cupón de descuento personalizado para el curso de &quot;Perfeccionamiento&quot;.
                            </p>
                        </div>
                        <button
                            onClick={handleRunMarketing}
                            disabled={isProcessingMarketing}
                            className="group px-6 py-4 bg-white/5 border border-accent/30 text-accent text-[10px] uppercase tracking-[0.3em] font-black hover:bg-accent hover:text-nautical-black transition-all disabled:opacity-50 self-start shrink-0 flex items-center gap-3"
                        >
                            <span>{isProcessingMarketing ? 'PROCESANDO...' : 'EJECUTAR MANUALMENTE'}</span>
                            <svg className="w-4 h-4 text-accent group-hover:text-nautical-black transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </button>
                    </div>

                    {marketingResult && (
                        <div className={`p-6 border ${marketingResult.success ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'} rounded-sm animate-premium-in`}>
                            <div className="flex items-center gap-4">
                                <span className={`w-2 h-2 rounded-full ${marketingResult.success ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                <span className="text-2xs uppercase tracking-widest font-bold text-white/80">
                                    {marketingResult.success
                                        ? `Automatización completada con éxito. Se han enviado ${marketingResult.totalSent} correos.`
                                        : `Error en el proceso: ${marketingResult.error || 'Desconocido'}`}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MANUAL NEWSLETTER DISPATCH PANEL */}
            <div className="glass-panel p-8 border-l-4 border-emerald-500 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h3 className="text-xl font-display text-white italic">Procesador Manual de Boletines Pendientes</h3>
                        <p className="text-xs text-white/40 font-mono mt-1">
                            Fuerza el envío inmediato de cualquier comunicado en estado &quot;Programado&quot; a la lista de suscriptores sin esperar a la tarea cron diaria.
                        </p>
                    </div>
                    <button
                        onClick={async () => {
                            if (!confirm('¿Deseas procesar y enviar ahora todos los boletines pendientes a los suscriptores?')) return;
                            try {
                                const res = await fetch(apiUrl('/api/cron/process-newsletters'), { method: 'POST' });
                                const data = await res.json();
                                if (res.ok) {
                                    alert(`✅ Envíos procesados. Enviados con éxito: ${data.totalSent || 0}, Fallidos: ${data.totalFailed || 0}`);
                                    if (onRefreshNewsletters) onRefreshNewsletters();
                                } else {
                                    alert(`Error: ${data.error || 'Error al procesar boletines'}`);
                                }
                            } catch (e) {
                                alert('Error de conexión al procesar boletines.');
                            }
                        }}
                        className="px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] uppercase tracking-[0.3em] font-black transition-all shrink-0 rounded-xs shadow-lg"
                    >
                        🚀 PROCESAR ENVÍOS PENDIENTES AHORA
                    </button>
                </div>
            </div>


            {/* CAMPAIGN MANAGEMENT UI */}
            <CampaignManager />

            {/* MAIN TWO-COLUMN SECTION */}
            <div className="grid lg:grid-cols-2 gap-16">
                
                {/* NEW MESSAGE FORM */}
                <div className="space-y-8 glass-panel p-12 relative overflow-hidden">
                    <h3 className="text-2xl font-display text-white italic border-b border-white/5 pb-6">
                        {t('communication.new_message')}
                    </h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-3xs uppercase tracking-[0.3em] text-white/30 font-bold">{t('communication.subject')}</label>
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Escribe el asunto del correo..."
                                className="w-full bg-white/5 border border-white/10 p-5 text-white font-display italic outline-none focus:border-accent"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-3xs uppercase tracking-[0.3em] text-white/30 font-bold">{t('communication.content')}</label>
                            <textarea
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder="Redacta el mensaje completo..."
                                className="w-full h-64 bg-white/5 border border-white/10 p-5 text-white italic outline-none focus:border-accent resize-none custom-scrollbar"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-3xs uppercase tracking-[0.3em] text-white/30 font-bold">{t('communication.schedule')}</label>
                                <button
                                    type="button"
                                    onClick={() => setScheduledFor(getSpainNowDatetimeLocal(30))}
                                    className="text-[10px] text-accent hover:underline font-mono uppercase font-bold"
                                    title="Sugerir hora oficial de España (Madrid) en +30 min"
                                >
                                    🇪🇸 Usar Hora España (+30m)
                                </button>
                            </div>
                            <input
                                type="datetime-local"
                                value={scheduledFor}
                                onChange={e => setScheduledFor(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 p-5 text-white font-mono text-2xs outline-none focus:border-accent"
                            />
                            {scheduledFor && (
                                <p className="text-[10px] text-accent font-mono">
                                    ⏱️ El mensaje quedará programado en horario peninsular (España / Madrid) y podrás editarlo antes de la fecha.
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={isSending}
                            className="w-full py-6 bg-accent text-nautical-black text-2xs uppercase tracking-[0.5em] font-black hover:bg-white transition-all shadow-xl shadow-accent/20 disabled:opacity-50"
                        >
                            {isSending ? 'PROCESANDO...' : (scheduledFor ? t('communication.save_schedule') : 'ENVIAR AHORA')}
                        </button>
                    </div>
                </div>

                {/* HISTORIAL Y GESTIÓN DE COMUNICACIONES */}
                <div className="space-y-8">
                    <div className="border-b border-white/5 pb-6 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <h3 className="text-2xl font-display text-white italic">
                                {t('communication.history')}
                            </h3>
                            
                            {/* Filter Tabs */}
                            <div className="flex items-center gap-1 bg-white/5 p-1 border border-white/10 rounded-sm">
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className={`px-4 py-2 text-3xs font-bold uppercase tracking-wider transition-all ${statusFilter === 'all' ? 'bg-accent text-nautical-black' : 'text-white/40 hover:text-white'}`}
                                >
                                    Todos ({newsletters.length})
                                </button>
                                <button
                                    onClick={() => setStatusFilter('sent')}
                                    className={`px-4 py-2 text-3xs font-bold uppercase tracking-wider transition-all ${statusFilter === 'sent' ? 'bg-accent text-nautical-black' : 'text-white/40 hover:text-white'}`}
                                >
                                    Enviados
                                </button>
                                <button
                                    onClick={() => setStatusFilter('scheduled')}
                                    className={`px-4 py-2 text-3xs font-bold uppercase tracking-wider transition-all ${statusFilter === 'scheduled' ? 'bg-accent text-nautical-black' : 'text-white/40 hover:text-white'}`}
                                >
                                    Programados
                                </button>
                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="🔍 Buscar por asunto o contenido del mensaje..."
                                className="w-full bg-white/5 border border-white/10 px-5 py-3 text-xs text-white placeholder-white/20 outline-none focus:border-accent font-mono"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    {/* NEWSLETTER LIST CARDS */}
                    <div className="space-y-6">
                        {filteredNewsletters.length > 0 ? filteredNewsletters.map((msg) => {
                            const isScheduled = msg.status === 'scheduled' || (!!msg.scheduled_for && new Date(msg.scheduled_for).getTime() > Date.now() && msg.status !== 'sent');
                            const recipientsCount = (msg.recipients_count && msg.recipients_count > 0) ? msg.recipients_count : subscribersCount;
                            const deliveredCount = msg.delivered_count ?? (msg.status === 'sent' ? Math.max(0, recipientsCount) : 0);
                            const deliveryRate = recipientsCount > 0 ? Math.round((deliveredCount / recipientsCount) * 100) : 100;

                            return (
                                <div 
                                    key={msg.id} 
                                    className={`p-8 border rounded-sm transition-all group relative ${isScheduled ? 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10' : 'border-white/5 hover:bg-white/5'}`}
                                >
                                    {/* Card Header */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                                        <div className="space-y-1 flex-1 cursor-pointer" onClick={() => setViewingMsg(msg)}>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h4 className="text-lg font-display text-white italic group-hover:text-accent transition-colors">
                                                    {msg.title}
                                                </h4>
                                                {isScheduled ? (
                                                    <span 
                                                        onClick={(e) => { e.stopPropagation(); handleOpenEdit(msg); }}
                                                        className="px-2.5 py-0.5 bg-amber-400 hover:bg-amber-300 border border-amber-500 text-nautical-black text-[9px] uppercase tracking-widest font-black rounded-xs flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
                                                        title="📅 Haz clic para editar la fecha y hora de programación"
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-nautical-black animate-ping" />
                                                        Programado ✏️
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-0.5 bg-green-500/20 border border-green-500/40 text-green-400 text-[9px] uppercase tracking-widest font-bold rounded-xs">
                                                        Enviado
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                                            {isScheduled && (
                                                <CountdownBadge 
                                                    targetDate={msg.scheduled_for} 
                                                    theme="dark" 
                                                    onClick={() => handleOpenEdit(msg)} 
                                                />
                                            )}
                                            {isScheduled && (
                                                <button
                                                    onClick={() => handleOpenEdit(msg)}
                                                    className="px-3 py-1.5 bg-white/10 hover:bg-accent hover:text-nautical-black text-white text-3xs font-black uppercase tracking-wider transition-all border border-white/10"
                                                    title="Editar hora, fecha o texto antes de enviar"
                                                >
                                                    ✏️ Editar
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setViewingMsg(msg)}
                                                className="px-3 py-1.5 bg-white/5 hover:bg-white/20 text-white/70 hover:text-white text-3xs font-bold uppercase tracking-wider transition-all border border-white/10"
                                                title="Ver mensaje completo"
                                            >
                                                👁️ Ver
                                            </button>
                                            <button
                                                onClick={() => handleDelete(msg.id)}
                                                disabled={isDeleting === msg.id}
                                                className="px-2 py-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 text-3xs transition-all border border-transparent hover:border-red-500/20"
                                                title="Eliminar registro"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>

                                    {/* Snippet Content */}
                                    <p 
                                        onClick={() => setViewingMsg(msg)}
                                        className="text-sm text-white/50 font-mono mb-6 italic truncate cursor-pointer hover:text-white/80 transition-colors"
                                    >
                                        &quot;{msg.content}&quot;
                                    </p>

                                    {/* Audience & Delivery Metrics Badge Section */}
                                    <div className="pt-4 border-t border-white/5 flex flex-wrap justify-between items-center text-[10px] font-mono gap-4">
                                        <div className="text-white/40 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                                            <span>✍️ Escrito el:</span>
                                            <span className="text-white font-bold"><ClientDate date={msg.created_at} format="short" /></span>
                                        </div>

                                        {isScheduled ? (
                                            <div 
                                                onClick={(e) => { e.stopPropagation(); handleOpenEdit(msg); }}
                                                className="flex items-center gap-2 text-red-400 font-bold bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-400 px-3 py-1 rounded-xs shadow-sm cursor-pointer transition-all hover:scale-105"
                                                title="📅 Haz clic para editar la fecha y hora de programación"
                                            >
                                                <span>⏰ PROGRAMADO PARA:</span>
                                                <span className="underline decoration-red-400/50">
                                                    <ClientDate date={msg.scheduled_for || msg.created_at} format="short" />
                                                </span>
                                                <span className="text-[10px] text-white font-black ml-1 bg-white/20 hover:bg-white/30 px-1.5 py-0.5 rounded-xs border border-white/30 transition-colors">✏️ Editar</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap items-center gap-3 text-white/60">
                                                <div className="flex items-center gap-2 text-green-400 font-bold bg-green-500/10 border border-green-500/30 px-3 py-1 rounded-xs">
                                                    <span>✅ ENVIADO:</span>
                                                    <span><ClientDate date={msg.sent_at || msg.created_at} format="short" /></span>
                                                </div>
                                                <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold rounded-xs shadow-sm">
                                                    <span>📊 {deliveredCount}/{recipientsCount} entregados</span>
                                                    <span className="text-accent font-black">({deliveryRate}%)</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="p-24 border border-dashed border-white/5 text-center italic text-white/20 font-display text-xl">
                                {searchQuery ? 'No se encontraron correos que coincidan con la búsqueda.' : t('communication.no_messages')}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL 1: VIEW FULL MESSAGE & DETAILED METRICS */}
            <AccessibleModal
                isOpen={!!viewingMsg}
                onClose={() => setViewingMsg(null)}
                title={viewingMsg?.title || 'Detalle del Correo'}
                maxWidth="max-w-3xl"
                theme="light"
            >
                {viewingMsg && (
                    <div className="space-y-8 animate-premium-in text-slate-900">
                        {/* Header Status & Dates */}
                        <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-slate-50 border border-slate-200 rounded-sm">
                            <div className="space-y-1">
                                <span className="text-3xs uppercase tracking-[0.3em] text-slate-500 block font-bold">Estado del Envío</span>
                                <div className="flex flex-wrap items-center gap-3">
                                    {viewingMsg.status === 'scheduled' || (!!viewingMsg.scheduled_for && new Date(viewingMsg.scheduled_for).getTime() > Date.now() && viewingMsg.status !== 'sent') ? (
                                        <>
                                            <span 
                                                onClick={() => { const target = viewingMsg; setViewingMsg(null); handleOpenEdit(target); }}
                                                className="px-3 py-1 bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
                                                title="📅 Haz clic para editar la fecha y hora"
                                            >
                                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                                                Programado para Envío Automático ✏️
                                            </span>
                                            <CountdownBadge 
                                                targetDate={viewingMsg.scheduled_for} 
                                                theme="light" 
                                                onClick={() => { const target = viewingMsg; setViewingMsg(null); handleOpenEdit(target); }} 
                                            />
                                        </>
                                    ) : (
                                        <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                                            Enviado a Destinatarios
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="text-right font-mono text-2xs space-y-1">
                                <p className="text-slate-600">Fecha de Creación: <span className="text-slate-900 font-bold"><ClientDate date={viewingMsg.created_at} format="full" /></span></p>
                                {viewingMsg.scheduled_for && (
                                    <p className="text-amber-700">Fecha Programada: <span className="font-bold"><ClientDate date={viewingMsg.scheduled_for} format="full" /></span></p>
                                )}
                                {viewingMsg.sent_at && (
                                    <p className="text-emerald-700">Fecha de Envío: <span className="font-bold"><ClientDate date={viewingMsg.sent_at} format="full" /></span></p>
                                )}
                            </div>
                        </div>

                        {/* Audience / Reach & Metrics Summary */}
                        {(() => {
                            const viewingRecipientsCount = (viewingMsg.recipients_count && viewingMsg.recipients_count > 0) ? viewingMsg.recipients_count : subscribersCount;
                            const viewingDeliveredCount = viewingMsg.delivered_count ?? (viewingMsg.status === 'sent' ? viewingRecipientsCount : 0);
                            const viewingDeliveryRate = viewingRecipientsCount > 0 ? Math.round((viewingDeliveredCount / viewingRecipientsCount) * 100) : 100;

                            return (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-sm">
                                        <span className="text-3xs uppercase tracking-widest text-slate-500 block font-bold mb-2">Destinatarios Totales</span>
                                        <span className="text-3xl font-display italic text-slate-900 font-bold">{viewingRecipientsCount}</span>
                                        <span className="text-[10px] text-slate-500 block mt-1">Alumnos / Clientes en Lista (newsletter_subscriptions)</span>
                                    </div>
                                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-sm">
                                        <span className="text-3xs uppercase tracking-widest text-slate-500 block font-bold mb-2">Entregados con Éxito</span>
                                        <span className="text-3xl font-display italic text-emerald-600 font-bold">
                                            {viewingDeliveredCount}
                                        </span>
                                        <span className="text-[10px] text-emerald-700 block mt-1 font-semibold">Llegaron a la bandeja correctamente</span>
                                    </div>
                                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-sm">
                                        <span className="text-3xs uppercase tracking-widest text-slate-500 block font-bold mb-2">Tasa de Efectividad</span>
                                        <span className="text-3xl font-display italic text-red-600 font-bold">
                                            {viewingDeliveryRate}%
                                        </span>
                                        <span className="text-[10px] text-red-700 block mt-1 font-semibold">Confirmaciones recibidas</span>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Message Subject and Body */}
                        <div className="space-y-4 bg-slate-50 border border-slate-200 p-8 rounded-sm">
                            <div className="border-b border-slate-200 pb-4">
                                <span className="text-3xs uppercase tracking-[0.3em] text-red-600 font-bold block mb-1">Asunto</span>
                                <h3 className="text-2xl font-display text-slate-900 italic font-bold">{viewingMsg.title}</h3>
                            </div>
                            <div className="pt-2">
                                <span className="text-3xs uppercase tracking-[0.3em] text-slate-500 font-bold block mb-3">Cuerpo del Mensaje</span>
                                <div className="text-sm text-slate-900 font-mono italic leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto custom-scrollbar p-4 bg-white border border-slate-300 rounded-xs shadow-inner">
                                    {viewingMsg.content}
                                </div>
                            </div>
                        </div>

                        {/* Detailed Delivery Logs by Recipient */}
                        {viewingMsg.delivery_logs && viewingMsg.delivery_logs.length > 0 && (
                            <div className="space-y-3 bg-slate-50 border border-slate-200 p-6 rounded-sm">
                                <span className="text-3xs uppercase tracking-[0.3em] text-slate-500 font-bold block">Desglose de Entregas por Destinatario ({viewingMsg.delivery_logs.length})</span>
                                <div className="max-h-60 overflow-y-auto custom-scrollbar border border-slate-200 rounded-xs bg-white">
                                    <table className="w-full text-xs text-left font-mono">
                                        <thead className="bg-slate-100 text-slate-600 uppercase text-[9px] tracking-wider border-b border-slate-200 sticky top-0">
                                            <tr>
                                                <th className="p-3">Destinatario</th>
                                                <th className="p-3">Estado</th>
                                                <th className="p-3">Fecha/Hora</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {viewingMsg.delivery_logs.map((log, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50">
                                                    <td className="p-3 font-semibold text-slate-800">{log.email}</td>
                                                    <td className="p-3">
                                                        {log.status === 'delivered' ? (
                                                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-xs text-[10px]">
                                                                ENTREGADO
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold rounded-xs text-[10px]" title={log.error}>
                                                                FALLIDO {log.error ? `(${log.error})` : ''}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-slate-500 text-[11px]">
                                                        <ClientDate date={log.timestamp} format="short" />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}


                        {/* Actions in Modal */}
                        <div className="flex justify-end items-center gap-4 pt-4 border-t border-slate-200">
                            {(viewingMsg.status === 'scheduled' || (!!viewingMsg.scheduled_for && new Date(viewingMsg.scheduled_for) > new Date() && viewingMsg.status !== 'sent')) && (
                                <button
                                    onClick={() => {
                                        const target = viewingMsg;
                                        setViewingMsg(null);
                                        handleOpenEdit(target);
                                    }}
                                    className="px-6 py-4 bg-red-600 text-white text-xs uppercase tracking-widest font-black hover:bg-red-700 transition-all shadow-lg"
                                >
                                    ✏️ Editar este mensaje programado
                                </button>
                            )}
                            <button
                                onClick={() => setViewingMsg(null)}
                                className="px-6 py-4 border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs uppercase tracking-widest font-bold transition-all rounded-xs"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </AccessibleModal>

            {/* MODAL 2: EDIT SCHEDULED MESSAGE */}
            <AccessibleModal
                isOpen={!!editingMsg}
                onClose={() => setEditingMsg(null)}
                title="Editar Correo Programado"
                maxWidth="max-w-2xl"
            >
                {editingMsg && (
                    <div className="space-y-6 animate-premium-in">
                        <div className="p-4 bg-red-500/10 border-l-4 border-red-500 text-red-300 text-xs font-mono rounded-xs">
                            💡 Puedes corregir el título, redactar cambios en el contenido o reprogramar la fecha y hora de entrega.
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-[0.2em] text-red-400 font-black">Asunto del Correo</label>
                            <input
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                                className="w-full bg-white text-slate-900 placeholder-slate-400 border-2 border-slate-300 p-5 font-sans font-bold text-base outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-sm shadow-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-[0.2em] text-red-400 font-black">Contenido del Mensaje</label>
                            <textarea
                                value={editContent}
                                onChange={e => setEditContent(e.target.value)}
                                className="w-full h-64 bg-white text-slate-900 placeholder-slate-400 border-2 border-slate-300 p-5 font-sans font-semibold text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 resize-none custom-scrollbar rounded-sm shadow-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-[0.2em] text-red-400 font-black">Programar Envío (Fecha y Hora)</label>
                            <input
                                type="datetime-local"
                                value={editScheduledFor}
                                onChange={e => setEditScheduledFor(e.target.value)}
                                className="w-full bg-white text-slate-900 border-2 border-slate-300 p-5 font-mono text-sm font-bold outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-sm shadow-sm [color-scheme:light]"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                            <button
                                onClick={() => handleSaveEdit(false)}
                                disabled={isSavingEdit}
                                className="flex-1 py-5 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-[0.2em] font-black transition-all shadow-xl shadow-red-600/20 disabled:opacity-50 rounded-xs"
                            >
                                {isSavingEdit ? 'GUARDANDO...' : '💾 GUARDAR CAMBIOS'}
                            </button>
                            <button
                                onClick={() => {
                                    if (confirm('¿Deseas enviar este mensaje inmediatamente a todos los destinatarios?')) {
                                        handleSaveEdit(true);
                                    }
                                }}
                                disabled={isSavingEdit}
                                className="px-6 py-5 bg-green-600 hover:bg-green-700 text-white text-xs uppercase tracking-[0.15em] font-black transition-all disabled:opacity-50 rounded-xs shadow-lg"
                            >
                                🚀 ENVIAR AHORA
                            </button>
                            <button
                                onClick={() => setEditingMsg(null)}
                                className="px-6 py-5 bg-slate-800 hover:bg-slate-700 text-white text-xs uppercase font-bold tracking-widest transition-all rounded-xs border border-white/10"
                            >
                                Descartar
                            </button>
                        </div>
                    </div>
                )}
            </AccessibleModal>
        </div>
    );
}
