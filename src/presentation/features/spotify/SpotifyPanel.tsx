import { useState, useEffect } from 'react';
import { ExternalLink, LogOut, Music, Search, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { cn } from '@/lib/utils';
import type { NowPlayingTrack, SearchTrack } from '@/application/useSpotify';

interface Props {
    isAuthenticated: boolean;
    isLoading:       boolean;
    error:           string | null;
    login:           () => void;
    logout:          () => void;
    track:           NowPlayingTrack | null;
    toggle:          () => Promise<void>;
    next:            () => Promise<void>;
    prev:            () => Promise<void>;
    search:          (query: string) => Promise<void>;
    searchResults:   SearchTrack[];
    isSearching:     boolean;
}

function SpotifyLogo({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-label="Spotify">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
    );
}

function ProgressBar({ progressMs, durationMs }: { progressMs: number; durationMs: number }) {
    const pct = durationMs > 0 ? (progressMs / durationMs) * 100 : 0;
    const fmt = (ms: number) => {
        const s = Math.floor(ms / 1000);
        return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    };
    return (
        <div className="w-full">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#1DB954] rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between mt-1.5 text-xs text-muted-foreground/50">
                <span>{fmt(progressMs)}</span>
                <span>{fmt(durationMs)}</span>
            </div>
        </div>
    );
}

export function SpotifyPanel({
    isAuthenticated, isLoading, error, login, logout,
    track, toggle, next, prev, search, searchResults, isSearching,
}: Props) {
    const [query, setQuery] = useState('');

    useEffect(() => {
        const id = setTimeout(() => search(query), 400);
        return () => clearTimeout(id);
    }, [query, search]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <SpotifyLogo className="w-8 h-8 text-[#1DB954] animate-pulse" />
                    <span className="text-sm">Conectando ao Spotify…</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center h-full animate-fade-in-up">
                <div className="flex flex-col items-center gap-8 max-w-sm text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-[#1DB954]/10 border border-[#1DB954]/20 flex items-center justify-center">
                            <SpotifyLogo className="w-8 h-8 text-[#1DB954]" />
                        </div>
                        <h2 className="text-xl font-bold">Conectar ao Spotify</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Veja e controle o que está tocando enquanto você foca.
                        </p>
                    </div>

                    {error && (
                        <div className="w-full px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                            {error}
                        </div>
                    )}

                    <Button
                        onClick={login}
                        className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold px-8 gap-2 hover:scale-105 transition-transform"
                    >
                        <SpotifyLogo className="w-4 h-4" />
                        Entrar com Spotify
                    </Button>

                    <p className="text-xs text-muted-foreground/60">
                        OAuth 2.0 PKCE — nenhuma senha armazenada.{' '}
                        <span className="block mt-0.5">Controles requerem conta Premium.</span>
                    </p>
                </div>
            </div>
        );
    }

    const showResults = query.trim().length > 0;

    return (
        <div className="flex flex-col h-full p-8 gap-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <SpotifyLogo className="w-5 h-5 text-[#1DB954]" />
                    <span className="font-bold text-lg">Spotify</span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground gap-2 hover:text-destructive">
                    <LogOut size={14} />
                    Desconectar
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
                <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Buscar músicas…"
                    className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary transition"
                />
                {isSearching && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground animate-pulse">
                        buscando…
                    </span>
                )}
            </div>

            {showResults ? (
                /* ── Search results ── */
                <div className="flex-1 overflow-y-auto space-y-0.5">
                    {searchResults.length === 0 && !isSearching && (
                        <p className="text-sm text-muted-foreground text-center mt-8">Nenhum resultado</p>
                    )}
                    {searchResults.map(t => (
                        <a
                            key={t.id}
                            href={t.spotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                        >
                            {t.albumCover
                                ? <img src={t.albumCover} alt={t.album} className="w-10 h-10 rounded-md object-cover shrink-0" />
                                : <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0"><Music size={16} className="text-muted-foreground" /></div>
                            }
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">{t.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{t.artists.join(', ')}</p>
                            </div>
                            <ExternalLink size={12} className="shrink-0 text-muted-foreground/50" />
                        </a>
                    ))}
                </div>
            ) : (
                /* ── Now playing ── */
                <div className="flex-1 flex flex-col items-center justify-center gap-6">
                    {track ? (
                        <>
                            {/* Album art */}
                            <div className="relative group">
                                <img
                                    src={track.albumArt}
                                    alt={`Capa de ${track.albumName}`}
                                    className={cn(
                                        "w-56 h-56 rounded-2xl shadow-2xl object-cover transition-all duration-500",
                                        track.isPlaying ? "shadow-[#1DB954]/20" : "opacity-60 grayscale"
                                    )}
                                />
                                {track.isPlaying && (
                                    <div className="absolute bottom-3 right-3 flex items-end gap-0.5 h-4">
                                        {[1, 2, 3, 4].map(i => (
                                            <span
                                                key={i}
                                                className="w-1 bg-[#1DB954] rounded-full animate-[equalizer_0.8s_ease-in-out_infinite_alternate]"
                                                style={{ animationDelay: `${i * 0.15}s`, height: `${40 + i * 15}%` }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Track info */}
                            <div className="flex flex-col items-center gap-1 text-center max-w-xs w-full">
                                <a
                                    href={track.spotifyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold text-xl hover:text-[#1DB954] transition-colors flex items-center gap-1.5 group"
                                >
                                    {track.name}
                                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                                <span className="text-muted-foreground text-sm">{track.artists.join(', ')}</span>
                                <span className="text-muted-foreground/50 text-xs mt-0.5">{track.albumName}</span>

                                <div className="w-full mt-4">
                                    <ProgressBar progressMs={track.progressMs} durationMs={track.durationMs} />
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={prev}
                                    className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent"
                                >
                                    <SkipBack size={22} />
                                </button>
                                <button
                                    onClick={toggle}
                                    className="w-13 h-13 p-3.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black transition-colors shadow-lg hover:scale-105 transition-transform"
                                >
                                    {track.isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
                                </button>
                                <button
                                    onClick={next}
                                    className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent"
                                >
                                    <SkipForward size={22} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                            <Music size={40} className="opacity-20" />
                            <p className="text-sm">Nenhuma música tocando no momento.</p>
                            <p className="text-xs opacity-60">Abra o Spotify e comece a tocar algo.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Attribution */}
            <div className="flex items-center justify-center gap-1.5 opacity-30">
                <SpotifyLogo className="w-3 h-3" />
                <span className="text-xs">Conteúdo fornecido pelo Spotify</span>
            </div>
        </div>
    );
}
