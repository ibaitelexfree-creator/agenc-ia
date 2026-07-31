'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {
    Gauge,
    Ruler,
    Thermometer,
    Wind,
    ArrowRightLeft,
    History,
    Trash2
} from 'lucide-react';
import {
    convertSpeed,
    convertDistance,
    convertTemperature,
    convertPressure,
    SpeedUnit,
    DistanceUnit,
    TemperatureUnit,
    PressureUnit
} from '@/lib/utils/unit-converter';

type ConversionType = 'speed' | 'distance' | 'temperature' | 'pressure';

interface HistoryItem {
    id: number;
    type: ConversionType;
    inputValue: number;
    inputUnit: string;
    outputValue: number;
    outputUnit: string;
    timestamp: number;
}

export default function NauticalConverter() {
    const t = useTranslations('nautical_converter');

    const [activeTab, setActiveTab] = useState<ConversionType>('speed');
    const [inputValue, setInputValue] = useState<string>('');
    const [result, setResult] = useState<number | null>(null);

    // Unit states
    const [speedInput, setSpeedInput] = useState<SpeedUnit>('knots');
    const [speedOutput, setSpeedOutput] = useState<SpeedUnit>('kmh');

    const [distInput, setDistInput] = useState<DistanceUnit>('nautical_miles');
    const [distOutput, setDistOutput] = useState<DistanceUnit>('km');

    const [tempInput, setTempInput] = useState<TemperatureUnit>('celsius');
    const [tempOutput, setTempOutput] = useState<TemperatureUnit>('fahrenheit');

    const [pressInput, setPressInput] = useState<PressureUnit>('hpa');
    const [pressOutput, setPressOutput] = useState<PressureUnit>('inhg');

    const [history, setHistory] = useState<HistoryItem[]>([]);

    // Load history from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('nautical_converter_history');
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load history', e);
            }
        }
    }, []);

    // Save history
    const addToHistory = (val: number, res: number, iUnit: string, oUnit: string) => {
        const newItem: HistoryItem = {
            id: Date.now(),
            type: activeTab,
            inputValue: val,
            inputUnit: iUnit,
            outputValue: res,
            outputUnit: oUnit,
            timestamp: Date.now()
        };
        const newHistory = [newItem, ...history].slice(0, 10);
        setHistory(newHistory);
        localStorage.setItem('nautical_converter_history', JSON.stringify(newHistory));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('nautical_converter_history');
    };

    const handleSwap = () => {
        switch (activeTab) {
            case 'speed':
                setSpeedInput(speedOutput);
                setSpeedOutput(speedInput);
                break;
            case 'distance':
                setDistInput(distOutput);
                setDistOutput(distInput);
                break;
            case 'temperature':
                setTempInput(tempOutput);
                setTempOutput(tempInput);
                break;
            case 'pressure':
                setPressInput(pressOutput);
                setPressOutput(pressInput);
                break;
        }
    };

    const handleConvert = () => {
        const val = parseFloat(inputValue);
        if (isNaN(val)) {
            setResult(null);
            return;
        }

        let res = 0;
        let iUnit = '';
        let oUnit = '';

        switch (activeTab) {
            case 'speed':
                res = convertSpeed(val, speedInput, speedOutput);
                iUnit = t(speedInput);
                oUnit = t(speedOutput);
                break;
            case 'distance':
                res = convertDistance(val, distInput, distOutput);
                iUnit = t(distInput);
                oUnit = t(distOutput);
                break;
            case 'temperature':
                res = convertTemperature(val, tempInput, tempOutput);
                iUnit = t(tempInput);
                oUnit = t(tempOutput);
                break;
            case 'pressure':
                res = convertPressure(val, pressInput, pressOutput);
                iUnit = t(pressInput);
                oUnit = t(pressOutput);
                break;
        }

        setResult(res);
        addToHistory(val, res, iUnit, oUnit);
    };

    // Auto convert when inputs change, but don't add to history automatically
    useEffect(() => {
        const val = parseFloat(inputValue);
        if (isNaN(val)) {
            setResult(null);
            return;
        }

        let res = 0;
        switch (activeTab) {
            case 'speed': res = convertSpeed(val, speedInput, speedOutput); break;
            case 'distance': res = convertDistance(val, distInput, distOutput); break;
            case 'temperature': res = convertTemperature(val, tempInput, tempOutput); break;
            case 'pressure': res = convertPressure(val, pressInput, pressOutput); break;
        }
        setResult(res);
    }, [inputValue, activeTab, speedInput, speedOutput, distInput, distOutput, tempInput, tempOutput, pressInput, pressOutput]);


    const tabs = [
        { id: 'speed', label: t('speed'), icon: Wind },
        { id: 'distance', label: t('distance'), icon: Ruler },
        { id: 'temperature', label: t('temperature'), icon: Thermometer },
        { id: 'pressure', label: t('pressure'), icon: Gauge },
    ];

    return (
        <div className="w-full max-w-full md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto bg-slate-100/95 backdrop-blur-2xl rounded-2xl md:rounded-3xl border-2 border-slate-400 overflow-hidden shadow-2xl shadow-slate-900/10 text-slate-900">
            {/* 1. Tool Header */}
            <div className="bg-slate-200/90 p-3 sm:p-4 lg:p-5 border-b border-slate-300 flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-2.5 bg-amber-400/20 rounded-xl border border-amber-500/40 text-amber-700 shrink-0">
                    <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="text-base sm:text-lg lg:text-xl font-display italic font-extrabold text-slate-900 tracking-tight truncate">{t('title')}</h2>
                    <p className="text-slate-700 font-semibold text-[11px] sm:text-xs mt-0.5 line-clamp-1">{t('subtitle')}</p>
                </div>
            </div>

            {/* 2. Category Navigation Tabs */}
            <div className="flex border-b border-slate-300 bg-slate-200/60 overflow-x-auto scrollbar-hide p-1 gap-1 sm:gap-1.5">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id as ConversionType);
                                setInputValue('');
                                setResult(null);
                            }}
                            className={`flex-1 min-w-[90px] sm:min-w-[110px] flex items-center justify-center gap-1.5 py-2 px-2.5 sm:px-4 rounded-lg text-[10px] sm:text-xs uppercase tracking-wider font-extrabold transition-all whitespace-nowrap
                                ${isActive
                                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                                    : 'text-slate-800 bg-slate-50 hover:bg-white hover:text-black border border-slate-300'}`}
                        >
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-700'}`} />
                            <span className="truncate">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* 3. Main Calculator Area & History */}
            <div className="p-3.5 sm:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
                {/* Calculator Interactive Form */}
                <div className="lg:col-span-7 xl:col-span-7 space-y-3.5 sm:space-y-4 flex flex-col justify-between">
                    {/* Input Field & Unit Select */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] uppercase tracking-widest font-black text-slate-900 flex items-center gap-1.5">
                            <span className="text-amber-600 font-extrabold">1.</span> {t('input')}
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5">
                            <input
                                type="number"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="0.00"
                                className="flex-1 min-w-0 w-full bg-white border-2 border-slate-300 rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5 text-lg sm:text-xl font-mono font-extrabold text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all shadow-inner"
                            />
                            <div className="w-full sm:w-2/5 min-w-[110px]">
                                {activeTab === 'speed' && (
                                    <select
                                        value={speedInput}
                                        onChange={(e) => setSpeedInput(e.target.value as SpeedUnit)}
                                        className="w-full h-10 sm:h-full bg-white border-2 border-slate-300 rounded-xl px-2.5 text-xs font-black text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all cursor-pointer truncate"
                                    >
                                        <option value="knots">{t('knots')}</option>
                                        <option value="kmh">{t('kmh')}</option>
                                        <option value="ms">{t('ms')}</option>
                                    </select>
                                )}
                                {activeTab === 'distance' && (
                                    <select
                                        value={distInput}
                                        onChange={(e) => setDistInput(e.target.value as DistanceUnit)}
                                        className="w-full h-10 sm:h-full bg-white border-2 border-slate-300 rounded-xl px-2.5 text-xs font-black text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all cursor-pointer truncate"
                                    >
                                        <option value="nautical_miles">{t('nautical_miles')}</option>
                                        <option value="km">{t('km')}</option>
                                        <option value="meters">{t('meters')}</option>
                                        <option value="feet">{t('feet')}</option>
                                        <option value="fathoms">{t('fathoms')}</option>
                                    </select>
                                )}
                                {activeTab === 'temperature' && (
                                    <select
                                        value={tempInput}
                                        onChange={(e) => setTempInput(e.target.value as TemperatureUnit)}
                                        className="w-full h-10 sm:h-full bg-white border-2 border-slate-300 rounded-xl px-2.5 text-xs font-black text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all cursor-pointer truncate"
                                    >
                                        <option value="celsius">{t('celsius')}</option>
                                        <option value="fahrenheit">{t('fahrenheit')}</option>
                                    </select>
                                )}
                                {activeTab === 'pressure' && (
                                    <select
                                        value={pressInput}
                                        onChange={(e) => setPressInput(e.target.value as PressureUnit)}
                                        className="w-full h-10 sm:h-full bg-white border-2 border-slate-300 rounded-xl px-2.5 text-xs font-black text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all cursor-pointer truncate"
                                    >
                                        <option value="hpa">{t('hpa')}</option>
                                        <option value="mb">{t('mb')}</option>
                                        <option value="inhg">{t('inhg')}</option>
                                    </select>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Unit Swap Action */}
                    <div className="flex justify-center py-0.5">
                        <button
                            onClick={handleSwap}
                            className="p-1.5 sm:p-2 bg-amber-400 text-slate-950 border-2 border-amber-300 rounded-full hover:bg-amber-300 transition-all active:scale-90 shadow-md flex items-center gap-1.5 group"
                            title={t('swap')}
                        >
                            <ArrowRightLeft className="w-3.5 h-3.5 rotate-90 group-hover:rotate-[270deg] transition-transform duration-300" />
                            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider pr-1">{t('swap')}</span>
                        </button>
                    </div>

                    {/* Output Converted Result Display */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] uppercase tracking-widest font-black text-slate-900 flex items-center gap-1.5">
                            <span className="text-amber-600 font-extrabold">2.</span> {t('output')}
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5">
                            <div className="flex-1 min-w-0 w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2 sm:py-2.5 flex items-center shadow-inner overflow-hidden min-h-[40px]">
                                <span className={`text-lg sm:text-xl font-mono font-black truncate ${result !== null ? 'text-slate-950' : 'text-slate-400'}`}>
                                    {result !== null ? result.toLocaleString('en-US', { maximumFractionDigits: 4 }) : '---'}
                                </span>
                            </div>
                            <div className="w-full sm:w-2/5 min-w-[110px]">
                                {activeTab === 'speed' && (
                                    <select
                                        value={speedOutput}
                                        onChange={(e) => setSpeedOutput(e.target.value as SpeedUnit)}
                                        className="w-full h-10 sm:h-full bg-white border-2 border-slate-300 rounded-xl px-2.5 text-xs font-black text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all cursor-pointer truncate"
                                    >
                                        <option value="knots">{t('knots')}</option>
                                        <option value="kmh">{t('kmh')}</option>
                                        <option value="ms">{t('ms')}</option>
                                    </select>
                                )}
                                {activeTab === 'distance' && (
                                    <select
                                        value={distOutput}
                                        onChange={(e) => setDistOutput(e.target.value as DistanceUnit)}
                                        className="w-full h-10 sm:h-full bg-white border-2 border-slate-300 rounded-xl px-2.5 text-xs font-black text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all cursor-pointer truncate"
                                    >
                                        <option value="nautical_miles">{t('nautical_miles')}</option>
                                        <option value="km">{t('km')}</option>
                                        <option value="meters">{t('meters')}</option>
                                        <option value="feet">{t('feet')}</option>
                                        <option value="fathoms">{t('fathoms')}</option>
                                    </select>
                                )}
                                {activeTab === 'temperature' && (
                                    <select
                                        value={tempOutput}
                                        onChange={(e) => setTempOutput(e.target.value as TemperatureUnit)}
                                        className="w-full h-10 sm:h-full bg-white border-2 border-slate-300 rounded-xl px-2.5 text-xs font-black text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all cursor-pointer truncate"
                                    >
                                        <option value="celsius">{t('celsius')}</option>
                                        <option value="fahrenheit">{t('fahrenheit')}</option>
                                    </select>
                                )}
                                {activeTab === 'pressure' && (
                                    <select
                                        value={pressOutput}
                                        onChange={(e) => setPressOutput(e.target.value as PressureUnit)}
                                        className="w-full h-10 sm:h-full bg-white border-2 border-slate-300 rounded-xl px-2.5 text-xs font-black text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all cursor-pointer truncate"
                                    >
                                        <option value="hpa">{t('hpa')}</option>
                                        <option value="mb">{t('mb')}</option>
                                        <option value="inhg">{t('inhg')}</option>
                                    </select>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Convert Action Button */}
                    <button
                        onClick={handleConvert}
                        disabled={!inputValue}
                        className="w-full py-3 sm:py-3.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-xl shadow-amber-400/20 active:scale-[0.98] border-2 border-amber-300 flex items-center justify-center gap-2 mt-2"
                    >
                        <span>{t('convert_btn')}</span>
                    </button>
                </div>

                {/* Recent Conversions History Log */}
                <div className="lg:col-span-5 xl:col-span-5 bg-white/80 rounded-xl p-3.5 sm:p-5 border border-slate-300 flex flex-col h-full max-h-[300px] sm:max-h-[360px] min-h-[220px] sm:min-h-[280px] overflow-hidden">
                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-200 shrink-0">
                        <div className="flex items-center gap-1.5 text-slate-900">
                            <History className="w-4 h-4 text-amber-600" />
                            <span className="text-[11px] uppercase tracking-widest font-black text-slate-900">{t('history')}</span>
                        </div>
                        {history.length > 0 && (
                            <button
                                onClick={clearHistory}
                                className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-slate-100"
                                title={t('clear_history')}
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pt-2.5 pr-1">
                        {history.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2 py-3 my-auto">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-slate-300 shadow-md relative group shrink-0">
                                    <Image
                                        src="/images/nautical_history_empty.jpg"
                                        alt="Nautical History Empty"
                                        fill
                                        sizes="(max-width: 768px) 96px, 128px"
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent pointer-events-none" />
                                </div>
                                <span className="text-[11px] sm:text-xs font-bold text-slate-700 tracking-wide text-center">{t('no_history')}</span>
                            </div>
                        ) : (
                            history.map((item) => (
                                <div key={item.id} className="bg-slate-50 rounded-lg p-2.5 border border-slate-300 hover:border-slate-400 transition-colors shadow-sm">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[9px] uppercase text-amber-800 font-extrabold tracking-wider bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">{t(item.type)}</span>
                                        <span className="text-[9px] text-slate-500 font-mono font-bold">
                                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between font-mono text-xs pt-0.5">
                                        <div className="text-slate-950 truncate max-w-[40%]">
                                            <span className="font-black text-xs sm:text-sm">{item.inputValue.toLocaleString()}</span>
                                            <span className="text-[9px] sm:text-[10px] ml-1 font-bold text-slate-600">{item.inputUnit}</span>
                                        </div>
                                        <ArrowRightLeft className="w-3 h-3 text-amber-500 shrink-0 mx-1" />
                                        <div className="text-slate-950 text-right truncate max-w-[40%]">
                                            <span className="font-black text-xs sm:text-sm text-amber-700">{item.outputValue.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                                            <span className="text-[9px] sm:text-[10px] ml-1 font-bold text-slate-600">{item.outputUnit}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
