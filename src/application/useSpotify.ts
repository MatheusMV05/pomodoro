import { useState, useCallback, useRef } from 'react';
import { useSpotifyAuth } from './useSpotifyAuth';
import { useNowPlaying } from './useNowPlaying';
import {
    pausePlayback, resumePlayback,
    skipToNext, skipToPrevious,
    searchTracks,
    type SearchTrack,
} from '@/infrastructure/spotify/spotifyApi';
import type { NowPlayingTrack } from './useNowPlaying';

export type { NowPlayingTrack, SearchTrack };

export function useSpotify() {
    const { isAuthenticated, isLoading, error, login, logout } = useSpotifyAuth();
    const { track } = useNowPlaying(isAuthenticated);

    const [searchResults, setSearchResults] = useState<SearchTrack[]>([]);
    const [isSearching, setIsSearching]     = useState(false);

    const trackRef     = useRef<NowPlayingTrack | null>(null);
    trackRef.current   = track;

    const toggle = useCallback(async () => {
        try {
            if (trackRef.current?.isPlaying) await pausePlayback();
            else await resumePlayback();
        } catch { /* Premium required */ }
    }, []);

    const next = useCallback(async () => {
        try { await skipToNext(); } catch {}
    }, []);

    const prev = useCallback(async () => {
        try { await skipToPrevious(); } catch {}
    }, []);

    const search = useCallback(async (query: string) => {
        if (!query.trim()) { setSearchResults([]); return; }
        setIsSearching(true);
        try {
            setSearchResults(await searchTracks(query));
        } catch {
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);

    return {
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        track,
        toggle,
        next,
        prev,
        search,
        searchResults,
        isSearching,
    };
}
