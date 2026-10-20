import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Anchor, Trophy, Users, Sparkles, Compass, Play, Plus, Loader2 } from 'lucide-react';

interface MultiplayerLobbyProps {
    onJoin: (matchId: string) => void;
    userId: string;
}

export const MultiplayerLobby = ({ onJoin, userId }: MultiplayerLobbyProps) => {
    const supabase = createClient();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreate = async () => {
        setLoading(true);
        setError(null);
        // Generate random 6 char code
        const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const { data, error } = await supabase
            .from('regatta_matches')
            .insert({
                code: newCode,
                host_id: userId,
                status: 'waiting',
                config: {}
            })
            .select()
            .single();

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        // Auto join
        await handleJoin(data.code);
    };

    const handleJoin = async (inputCode: string) => {
        setLoading(true);
        setError(null);

        // Find match
        const { data: match, error: matchError } = await supabase
            .from('regatta_matches')
            .select('id, status')
            .eq('code', inputCode)
            .single();

        if (matchError || !match) {
            setError('Partida no encontrada');
            setLoading(false);
            return;
        }

        if (match.status !== 'waiting') {
            setError('Partida ya comenzada o finalizada');
            setLoading(false);
            return;
        }

        // Fetch user profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('nombre, apellidos')
            .eq('id', userId)
            .single();

        const fullName = profile ? `${profile.nombre || ''} ${profile.apellidos || ''}`.trim() : '';
        const username = fullName || `Navegante ${userId.substring(0, 4)}`;

        // Add participant
        const { error: joinError } = await supabase
            .from('regatta_participants')
            .insert({
                match_id: match.id,
                user_id: userId,
                username,
                score: 0
            });

        // Ignore unique constraint error (user re-joining)
        if (joinError && !joinError.message.includes('unique constraint') && joinError.code !== '23505') {
             setError(joinError.message);
             setLoading(false);
             return;
        }

        onJoin(match.id);
        setLoading(false);
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-nautical-black text-sea-foam p-4 sm:p-8 w-full overflow-hidden">
            {/* Ambient Background Lighting */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-brass-gold/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 bg-maps opacity-10 pointer-events-none" />

            <div className="relative z-10 w-full max-w-xl flex flex-col items-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black tracking-[0.25em] uppercase mb-6 shadow-lg shadow-accent/10">
                    <Trophy className="w-3.5 h-3.5 text-accent" />
                    SIMULADOR EN TIEMPO REAL
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-5xl font-display text-sea-foam text-center leading-tight uppercase tracking-tight mb-3">
                    Regata <span className="italic font-light text-brass-gold">Multijugador</span>
                </h1>
                <p className="text-sea-foam/60 font-light text-xs sm:text-sm text-center max-w-md mb-8 leading-relaxed">
                    Compite en tiempo real contra otros navegantes. Crea una sala privada o únete con un código de partida.
                </p>

                {/* Main Card */}
                <div className="w-full bg-nautical-deep/90 backdrop-blur-2xl border border-sea-foam/15 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />

                    {/* Join Section */}
                    <div className="mb-8 space-y-3">
                        <label className="block text-xs uppercase tracking-[0.2em] font-bold text-sea-foam/70">
                            Unirse a Partida Existente
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Compass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sea-foam/40" />
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    placeholder="CÓDIGO DE SALA"
                                    className="w-full bg-sea-foam/[0.04] border border-sea-foam/15 rounded-2xl px-4 py-3.5 pl-11 text-sea-foam font-mono tracking-widest text-sm focus:outline-none focus:border-accent/60 focus:bg-sea-foam/[0.08] transition-all uppercase placeholder:font-sans placeholder:tracking-normal placeholder:text-sea-foam/30"
                                />
                            </div>
                            <button
                                onClick={() => handleJoin(code)}
                                disabled={loading || !code}
                                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 disabled:opacity-40 text-nautical-black px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-accent/20 shrink-0 cursor-pointer"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Play className="w-3.5 h-3.5 fill-current" />
                                        Unirse
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="relative flex py-3 items-center">
                        <div className="flex-grow border-t border-sea-foam/10"></div>
                        <span className="flex-shrink-0 mx-4 text-[10px] uppercase tracking-widest text-sea-foam/30 font-bold">o</span>
                        <div className="flex-grow border-t border-sea-foam/10"></div>
                    </div>

                    {/* Create Section */}
                    <div className="pt-2">
                        <button
                            onClick={handleCreate}
                            disabled={loading}
                            className="w-full inline-flex items-center justify-center gap-2.5 bg-sea-foam/[0.05] hover:bg-sea-foam/10 border border-sea-foam/20 hover:border-brass-gold/50 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-sea-foam hover:text-brass-gold transition-all duration-300 shadow-md group cursor-pointer"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 text-brass-gold transition-transform group-hover:rotate-90" />
                                    Crear Nueva Sala
                                </>
                            )}
                        </button>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-300 text-xs text-center font-medium animate-fade-in">
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer status features */}
                <div className="mt-8 flex items-center justify-center gap-6 text-[10px] uppercase tracking-widest text-sea-foam/40 font-semibold">
                    <span className="flex items-center gap-1.5"><Users className="w-3 h-3 text-accent" /> Multijugador Real</span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5"><Anchor className="w-3 h-3 text-brass-gold" /> Getxo Bela Eskola</span>
                </div>
            </div>
        </div>
    );
};

