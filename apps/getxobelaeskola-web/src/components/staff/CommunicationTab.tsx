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
}

interface CommunicationTabProps {
    newsletters: Newsletter[];
    onSendMessage: (data: { title: string, content: string, scheduled_for?: string }) => Promise<void>;
    isSending: boolean;
    onRefreshNewsletters?: () => void;
}

export default function CommunicationTab({ newsletters = [], onSendMessage, isSending, onRefreshNewsletters }: CommunicationTabProps) {
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
            
            const isScheduled = msg.status === 'scheduled' || (!!msg.scheduled_for && new Date(msg.scheduled_for) > new Date() && msg.status !== 'sent');
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
            scheduled_for: scheduledFor || undefined
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
        // Format ISO date to datetime-local input string (YYYY-MM-DDTHH:mm)
        if (msg.scheduled_for) {
            const d = new Date(msg.scheduled_for);
            const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
            setEditScheduledFor(localIso);
        } else {
            setEditScheduledFor('');
        }
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
                    scheduled_for: editScheduledFor || null,
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
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <svg className="w-24 h-24 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
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
                            className="px-8 py-4 bg-white/5 border border-accent/30 text-accent text-[10px] uppercase tracking-[0.3em] font-black hover:bg-accent hover:text-nautical-black transition-all disabled:opacity-50 self-start shrink-0"
                        >
                            {isProcessingMarketing ? 'PROCESANDO...' : 'EJECUTAR MANUALMENTE'}
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
                            <label className="text-3xs uppercase tracking-[0.3em] text-white/30 font-bold">{t('communication.schedule')}</label>
                            <input
                                type="datetime-local"
                                value={scheduledFor}
                                onChange={e => setScheduledFor(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 p-5 text-white font-mono text-2xs outline-none focus:border-accent"
                            />
                            {scheduledFor && (
                                <p className="text-[10px] text-accent font-mono">
                                    ⏱️ El mensaje quedará programado y podrás editarlo o enviarlo en cualquier momento antes de la fecha.
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
                            const isScheduled = msg.status === 'scheduled' || (!!msg.scheduled_for && new Date(msg.scheduled_for) > new Date() && msg.status !== 'sent');
                            const recipientsCount = msg.recipients_count ?? 0;
                            const deliveredCount = msg.delivered_count ?? (msg.status === 'sent' ? Math.max(0, recipientsCount) : 0);
                            const deliveryRate = recipientsCount > 0 ? Math.round((deliveredCount / recipientsCount) * 100) : 100;

                            return (
                                <div 
                                    key={msg.id} 
                                    className={`p-8 border rounded-sm transition-all group relative ${isScheduled ? 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10' : 'border-white/5 hover:bg-white/5'}`}
                                >
                                    {/* Card Header */}
                                    <div className="flex justify-between items-start mb-4 gap-4">
                                        <div className="space-y-1 flex-1 cursor-pointer" onClick={() => setViewingMsg(msg)}>
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-lg font-display text-white italic group-hover:text-accent transition-colors">
                                                    {msg.title}
                                                </h4>
                                                {isScheduled ? (
                                                    <span className="px-2.5 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[9px] uppercase tracking-widest font-bold rounded-xs flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                                                        Programado
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-0.5 bg-green-500/20 border border-green-500/40 text-green-400 text-[9px] uppercase tracking-widest font-bold rounded-xs">
                                                        Enviado
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex items-center gap-2 shrink-0">
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
                                            <div className="flex items-center gap-2 text-red-400 font-bold bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-xs shadow-sm">
                                                <span>⏰ PROGRAMADO PARA:</span>
                                                <span className="underline decoration-red-400/50">
                                                    <ClientDate date={msg.scheduled_for || msg.created_at} format="short" />
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap items-center gap-3 text-white/60">
                                                <div className="flex items-center gap-2 text-green-400 font-bold bg-green-500/10 border border-green-500/30 px-3 py-1 rounded-xs">
                                                    <span>✅ ENVIADO:</span>
                                                    <span><ClientDate date={msg.sent_at || msg.created_at} format="short" /></span>
                                                </div>
                                                <span className="text-green-400/80 font-mono text-[9px]">
                                                    ({deliveredCount}/{recipientsCount} entregados - {deliveryRate}%)
                                                </span>
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
            >
                {viewingMsg && (
                    <div className="space-y-8 animate-premium-in">
                        {/* Header Status & Dates */}
                        <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-white/5 border border-white/10 rounded-sm">
                            <div className="space-y-1">
                                <span className="text-3xs uppercase tracking-[0.3em] text-white/40 block font-bold">Estado del Envío</span>
                                <div className="flex items-center gap-3">
                                    {viewingMsg.status === 'scheduled' || (!!viewingMsg.scheduled_for && new Date(viewingMsg.scheduled_for) > new Date() && viewingMsg.status !== 'sent') ? (
                                        <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                                            Programado para Envío Automático
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-400" />
                                            Enviado a Destinatarios
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="text-right font-mono text-2xs space-y-1">
                                <p className="text-white/40">Fecha de Creación: <span className="text-white"><ClientDate date={viewingMsg.created_at} format="full" /></span></p>
                                {viewingMsg.scheduled_for && (
                                    <p className="text-amber-300">Fecha Programada: <span className="font-bold"><ClientDate date={viewingMsg.scheduled_for} format="full" /></span></p>
                                )}
                                {viewingMsg.sent_at && (
                                    <p className="text-green-400">Fecha de Envío: <span className="font-bold"><ClientDate date={viewingMsg.sent_at} format="full" /></span></p>
                                )}
                            </div>
                        </div>

                        {/* Audience / Reach & Metrics Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-sm">
                                <span className="text-3xs uppercase tracking-widest text-white/40 block font-bold mb-2">Destinatarios Totales</span>
                                <span className="text-3xl font-display italic text-white">{viewingMsg.recipients_count ?? 0}</span>
                                <span className="text-[10px] text-white/30 block mt-1">Alumnos / Clientes en Lista</span>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-sm">
                                <span className="text-3xs uppercase tracking-widest text-white/40 block font-bold mb-2">Entregados con Éxito</span>
                                <span className="text-3xl font-display italic text-green-400">
                                    {viewingMsg.delivered_count ?? (viewingMsg.status === 'sent' ? (viewingMsg.recipients_count ?? 0) : 0)}
                                </span>
                                <span className="text-[10px] text-green-400/60 block mt-1">Llegaron a la bandeja correctamente</span>
                            </div>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-sm">
                                <span className="text-3xs uppercase tracking-widest text-white/40 block font-bold mb-2">Tasa de Efectividad</span>
                                <span className="text-3xl font-display italic text-accent">
                                    {viewingMsg.recipients_count ? Math.round(((viewingMsg.delivered_count ?? viewingMsg.recipients_count) / viewingMsg.recipients_count) * 100) : 100}%
                                </span>
                                <span className="text-[10px] text-accent/60 block mt-1">Confirmaciones recibidas</span>
                            </div>
                        </div>

                        {/* Message Subject and Body */}
                        <div className="space-y-4 bg-white/5 border border-white/10 p-8 rounded-sm">
                            <div className="border-b border-white/10 pb-4">
                                <span className="text-3xs uppercase tracking-[0.3em] text-accent font-bold block mb-1">Asunto</span>
                                <h3 className="text-2xl font-display text-white italic">{viewingMsg.title}</h3>
                            </div>
                            <div className="pt-2">
                                <span className="text-3xs uppercase tracking-[0.3em] text-white/30 font-bold block mb-3">Cuerpo del Mensaje</span>
                                <div className="text-sm text-white/80 font-mono italic leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto custom-scrollbar p-4 bg-black/20 border border-white/5 rounded-xs">
                                    {viewingMsg.content}
                                </div>
                            </div>
                        </div>

                        {/* Actions in Modal */}
                        <div className="flex justify-end items-center gap-4 pt-4 border-t border-white/10">
                            {(viewingMsg.status === 'scheduled' || (!!viewingMsg.scheduled_for && new Date(viewingMsg.scheduled_for) > new Date() && viewingMsg.status !== 'sent')) && (
                                <button
                                    onClick={() => {
                                        const target = viewingMsg;
                                        setViewingMsg(null);
                                        handleOpenEdit(target);
                                    }}
                                    className="px-6 py-4 bg-accent text-nautical-black text-xs uppercase tracking-widest font-black hover:bg-white transition-all shadow-lg"
                                >
                                    ✏️ Editar este mensaje programado
                                </button>
                            )}
                            <button
                                onClick={() => setViewingMsg(null)}
                                className="px-6 py-4 border border-white/20 text-white/70 hover:text-white text-xs uppercase tracking-widest font-bold transition-all"
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
