'use client';

import React from 'react';
import { Play, Pause, FastForward, Rewind, Clock } from 'lucide-react';

interface TideControlsProps {
    currentTime: Date;
    onTimeChange: (time: Date) => void;
    isPlaying: boolean;
    onPlayPause: () => void;
    speed: number;
    onSpeedChange: (speed: number) => void;
}

export const TideControls: React.FC<TideControlsProps> = ({
    currentTime,
    onTimeChange,
    isPlaying,
    onPlayPause,
    speed,
    onSpeedChange
}) => {
    // Calculate minutes from start of day
    const minutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMinutes = parseInt(e.target.value);
        const newTime = new Date(currentTime);
        newTime.setHours(Math.floor(newMinutes / 60));
        newTime.setMinutes(newMinutes % 60);
        onTimeChange(newTime);
    };

    return (
        <div className="bg-slate-900/80 p-3 sm:p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm shadow-xl flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="p-1.5 sm:p-2 bg-slate-800 rounded-lg shrink-0">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-200">Control Temporal</span>
                </div>

                <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1 shrink-0">
                    {[1, 60, 300].map((s) => (
                        <button
                            key={s}
                            onClick={() => onSpeedChange(s)}
                            className={`px-1.5 sm:px-2 py-1 text-[9px] sm:text-[10px] font-bold rounded-md transition-all ${
                                speed === s
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                        >
                            {s === 1 ? 'REAL' : `${s}x`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                <button
                    onClick={onPlayPause}
                    className={`p-2.5 sm:p-3 rounded-full flex items-center justify-center transition-all shrink-0 ${
                        isPlaying
                            ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-900/20'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-900/20'
                    }`}
                >
                    {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />}
                </button>

                <div className="flex-1 min-w-0">
                    <input
                        type="range"
                        min="0"
                        max="1439"
                        value={minutes}
                        onChange={handleSliderChange}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                    />
                    <div className="flex justify-between mt-1">
                        <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono">00:00</span>
                        <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono">12:00</span>
                        <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono">23:59</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
