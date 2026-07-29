
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Gauge, Navigation, Thermometer, Anchor, LifeBuoy, Map, Info, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface WeatherData {
    station: string;
    knots: number;
    kmh: number;
    direction: number;
    temp: number;
    timestamp: string;
    gusts?: number;
}

interface WeatherPremiumProps {
    refreshInterval?: number;
    showFleetMonitor?: boolean;
}

export default function WeatherPremium({ refreshInterval = 600000, showFleetMonitor = true }: WeatherPremiumProps) {
    const [data, setData] = useState<{
        weather: WeatherData;
        fleet: { agua: number; retorno: number; pendiente: number };
        alerts?: any[];
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchData = async () => {
        setIsRefreshing(true);
        try {
            const res = await fetch('/api/weather');
            const json = await res.json();
            if (json.weather) {
                setData(json);
                setError(false);
            } else {
                setError(true);
            }
        } catch (e) {
            setError(true);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, refreshInterval);
        return () => clearInterval(interval);
    }, [refreshInterval]);

    if (loading) {
        return (
            <div className="bg-transparent border border-white/5 rounded-sm p-4 animate-pulse h-64 flex items-center justify-center">
                <div className="text-accent/40 text-xs uppercase tracking-widest font-black animate-bounce flex items-center gap-3">
                    <RefreshCw className="animate-spin" size={14} />
                    Sincronizando Estación...
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="bg-transparent border border-red-500/20 rounded-sm p-8 text-center space-y-4">
                <Info className="text-red-500 mx-auto" size={32} />
                <p className="text-white/60 text-xs uppercase tracking-widest">Error de Sincronización Meteorológica</p>
                <button onClick={fetchData} className="px-4 py-2 bg-white/5 text-[10px] uppercase font-black tracking-widest hover:bg-white/10 transition-all rounded-full">Reintentar</button>
            </div>
        );
    }

    const { weather, fleet, alerts } = data;

    return (
        <div className="space-y-6 weather-widget-dark">
            {/* ALERTAS OFICIALES EUSKALMET */}
            <AnimatePresence>
                {alerts && alerts.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-red-500/10 border border-red-500/50 rounded-sm p-4 flex flex-col md:flex-row items-center gap-4 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 animate-pulse flex-shrink-0">
                                <Info size={20} />
                            </div>
                            <div className="flex-1">
                                <h5 className="text-red-500 text-[10px] uppercase font-black tracking-widest leading-none mb-1">Avisos Oficiales Euskalmet</h5>
                                <div className="flex flex-wrap gap-x-4">
                                    {alerts.map((alert, i) => (
                                        <p key={i} className="text-white text-xs font-medium">
                                            <span className="text-red-400 font-bold capitalize">{alert.level}:</span> {alert.phenomenon || 'Condiciones adversas'}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Link
                            href="https://www.euskalmet.euskadi.eus/avisos/avisos-meteorologicos-oficiales/"
                            target="_blank"
                            className="w-full md:w-auto text-center text-[9px] uppercase font-black tracking-widest py-2.5 px-6 bg-red-500 text-white rounded-sm hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                        >
                            Ver Detalles
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* STACKED HORIZONTAL ROWS LAYOUT */}
            <div className="space-y-4">
                {/* FILA 1: VIENTO HOY */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card border border-black/10 rounded-sm p-5 shadow-sm relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                        <Wind size={80} className="text-black" />
                    </div>
                    <header className="flex justify-between items-center mb-3">
                        <div>
                            <span className="text-accent uppercase tracking-[0.3em] text-[10px] font-black block">Viento Hoy</span>
                            <h4 className="text-black/60 text-[9px] uppercase tracking-widest flex items-center gap-1.5 mt-0.5 font-bold">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                {weather.station}
                            </h4>
                        </div>
                        <button onClick={fetchData} disabled={isRefreshing} className="p-1 hover:bg-black/5 rounded-full transition-colors">
                            <RefreshCw size={14} className={`text-black/40 hover:text-accent transition-colors ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </header>

                    <div className="flex items-center justify-between gap-4 py-1">
                        <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20 shrink-0">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="40" cy="40" r="35" fill="transparent" stroke="currentColor" strokeWidth="3" className="text-black/10" />
                                    <motion.circle
                                        cx="40"
                                        cy="40"
                                        r="35"
                                        fill="transparent"
                                        stroke="currentColor"
                                        strokeWidth="5"
                                        strokeDasharray={220}
                                        initial={{ strokeDashoffset: 220 }}
                                        animate={{ strokeDashoffset: 220 - (220 * Math.min(weather.knots, 40)) / 40 }}
                                        className="text-accent transition-all duration-1000"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-display text-black italic tracking-tighter font-bold">{weather.knots}</span>
                                    <span className="text-[8px] uppercase tracking-widest text-accent font-black">NUDOS</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-lg text-black font-display italic font-bold">{weather.kmh} <span className="text-black/60 text-xs font-normal">km/h</span></p>
                                <p className="text-[10px] text-black/60 font-mono mt-0.5">Estación Getxo</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5 items-end border-l border-black/10 pl-4">
                            <span className="flex items-center gap-1.5 text-brass-gold text-[10px] font-black uppercase tracking-widest">
                                <Navigation size={12} style={{ transform: `rotate(${weather.direction}deg)` }} />
                                {weather.direction}°
                            </span>
                            <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                <Thermometer size={12} />
                                {weather.temp}°C
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* FILA 2: MONITOR FLOTA */}
                {showFleetMonitor && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card border border-black/10 rounded-sm p-5 shadow-sm relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                            <LifeBuoy size={80} className="text-black" />
                        </div>
                        <header className="flex justify-between items-center mb-3">
                            <div>
                                <span className="text-accent uppercase tracking-[0.3em] text-[10px] font-black block">Monitor Flota</span>
                                <p className="text-black/60 text-[9px] font-medium">Estado operacional en tiempo real</p>
                            </div>
                            <Link href="/staff/activity" className="text-[9px] uppercase tracking-widest text-accent font-black hover:underline underline-offset-4">
                                Gestionar →
                            </Link>
                        </header>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="flex items-center justify-between p-2 bg-black/5 border border-black/10 rounded-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                        <Anchor size={11} />
                                    </div>
                                    <span className="text-[9px] uppercase tracking-wider font-bold text-black/70">Agua</span>
                                </div>
                                <span className="text-base font-display text-black italic font-bold">{fleet.agua}</span>
                            </div>

                            <div className="flex items-center justify-between p-2 bg-black/5 border border-black/10 rounded-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-brass-gold/10 flex items-center justify-center text-brass-gold">
                                        <RefreshCw size={11} />
                                    </div>
                                    <span className="text-[9px] uppercase tracking-wider font-bold text-black/70">Retorno</span>
                                </div>
                                <span className="text-base font-display text-black italic font-bold">{fleet.retorno}</span>
                            </div>

                            <div className="flex items-center justify-between p-2 bg-black/5 border border-accent/40 rounded-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent animate-pulse">
                                        <Gauge size={11} />
                                    </div>
                                    <span className="text-[9px] uppercase tracking-wider font-black text-accent">Pend.</span>
                                </div>
                                <span className="text-base font-display text-accent italic font-bold">{fleet.pendiente}</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* FILA 3: NOTA METEOROLÓGICA Y RADAR */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card border border-black/10 rounded-sm p-5 shadow-sm relative overflow-hidden group"
                >
                    <div className="absolute bottom-0 right-0 p-2 opacity-5 pointer-events-none">
                        <Map size={80} className="text-black" />
                    </div>
                    <header className="mb-2">
                        <span className="text-accent uppercase tracking-[0.3em] text-[10px] font-black block">Nota Meteorológica</span>
                    </header>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        <div className="bg-black/5 border border-black/10 p-2.5 rounded-sm flex-1">
                            <p className="text-[9px] font-black uppercase text-accent mb-1 tracking-widest">
                                {alerts && alerts.length > 0 ? 'AVISOS ACTIVOS' : 'CONDICIONES ACTUALES'}
                            </p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                                {alerts && alerts.length > 0 ? (
                                    alerts.map((alert: any, i: number) => (
                                        <span key={i} className="text-[10px] text-red-600 font-mono tracking-tight flex items-center gap-1.5 font-bold">
                                            <span className="w-1 h-1 bg-red-600 rounded-full" />
                                            {alert.level?.toUpperCase()}: {alert.phenomenon || 'Meteorología adversa'}
                                        </span>
                                    ))
                                ) : (
                                    <>
                                        <span className="text-[10px] text-black/80 font-mono tracking-tight flex items-center gap-1.5">
                                            <span className="w-1 h-1 bg-accent/80 rounded-full" />
                                            Viento: {weather.knots} kts ({weather.station})
                                        </span>
                                        <span className="text-[10px] text-black/80 font-mono tracking-tight flex items-center gap-1.5">
                                            <span className="w-1 h-1 bg-accent/80 rounded-full" />
                                            Rafagas: {weather.gusts || 0} kts
                                        </span>
                                        <span className="text-[10px] text-black/80 font-mono tracking-tight flex items-center gap-1.5">
                                            <span className="w-1 h-1 bg-accent/80 rounded-full" />
                                            Temp: {weather.temp}°C
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <button className="flex items-center justify-between gap-3 p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-sm group hover:bg-emerald-500/20 transition-all shrink-0">
                            <div className="flex items-center gap-2">
                                <Map className="text-emerald-700 group-hover:scale-110 transition-transform" size={14} />
                                <span className="text-[10px] uppercase tracking-widest font-black text-emerald-700 whitespace-nowrap">Radar Marítimo</span>
                            </div>
                            <Navigation size={12} className="text-emerald-700 rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
