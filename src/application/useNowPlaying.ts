import { useState, useEffect, useRef } from 'react';
import { spotifyFetch } from '@/infrastructure/spotify/client';

export interface NowPlayingTrack {
    id: string;
    name: string;
    artists: string[];
    albumName: string;
    albumArt: string;
    isPlaying: boolean;
    progressMs: number;
    durationMs: number;
    spotifyUrl: string;
}

const POLL_INTERVAL_MS = 5000;

export function useNowPlaying(enabled: boolean) {
    const [track, setTrack] = useState<NowPlayingTrack | null>(null);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!enabled) {
            setTrack(null);
            return;
        }

        async function poll() {
            try {
                const res = await spotifyFetch('/me/player/currently-playing');

                // 204: nothing playing; 202: not active
                if (res.status === 204 || res.status === 202) {
                    setTrack(null);
                    return;
                }

                if (!res.ok) {
                    const body = await res.json().catch(() => ({})) as { error?: { message?: string } };
                    setError(body?.error?.message ?? `Erro HTTP ${res.status}`);
                    return;
                }

                const data = await res.json() as {
                    is_playing: boolean;
                    progress_ms: number;
                    item: {
                        type: string;
                        id: string;
                        name: string;
                        duration_ms: number;
                        artists: { name: string }[];
                        album: { name: string; images: { url: string }[] };
                        external_urls: { spotify: string };
                    } | null;
                };

                if (!data.item || data.item.type !== 'track') {
                    setTrack(null);
                    return;
                }

                setTrack({
                    id: data.item.id,
                    name: data.item.name,
                    artists: data.item.artists.map(a => a.name),
                    albumName: data.item.album.name,
                    albumArt: data.item.album.images[0]?.url ?? '',
                    isPlaying: data.is_playing,
                    progressMs: data.progress_ms,
                    durationMs: data.item.duration_ms,
                    spotifyUrl: data.item.external_urls.spotify,
                });
                setError(null);
            } catch (e) {
                if (e instanceof Error && e.message !== 'Not authenticated') {
                    setError(e.message);
                }
            }
        }

        poll();
        intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [enabled]);

    return { track, error };
}
