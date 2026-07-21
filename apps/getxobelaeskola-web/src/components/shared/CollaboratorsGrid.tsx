'use client';

import React from 'react';
import Image from 'next/image';
import collaboratorsData from '@/data/collaborators.json';

export default function CollaboratorsGrid() {
    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-6xl mb-12">
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-sea-foam/30">
                Colaboradores ({collaboratorsData.length})
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl w-full border border-white/10 shadow-xl shadow-black/10">
                {collaboratorsData.map((collab) => (
                    <div
                        key={collab.id}
                        className="group flex flex-col items-center justify-center p-3 rounded-xl bg-white hover:bg-sea-foam/5 border border-transparent hover:border-accent/20 shadow-sm hover:shadow-md transition-all duration-300"
                        title={collab.name}
                    >
                        <div className="relative w-full h-16 sm:h-20 flex items-center justify-center">
                            <Image
                                src={collab.svgFile}
                                alt={collab.name}
                                width={160}
                                height={80}
                                className="object-contain max-h-full w-auto transition-all duration-300 group-hover:scale-105"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
