import { spotifyFetch, spotifyCommand } from './client';

// ── Playback controls ─────────────────────────────────────────────────────────

export async function pausePlayback():  Promise<void> { await spotifyCommand('/me/player/pause',    'PUT');  }
export async function resumePlayback(): Promise<void> { await spotifyCommand('/me/player/play',     'PUT');  }
export async function skipToNext():     Promise<void> { await spotifyCommand('/me/player/next',     'POST'); }
export async function skipToPrevious(): Promise<void> { await spotifyCommand('/me/player/previous', 'POST'); }

// ── Search ────────────────────────────────────────────────────────────────────

export interface SearchTrack {
    id:         string;
    name:       string;
    artists:    string[];
    album:      string;
    albumCover: string;
    durationMs: number;
    spotifyUrl: string;
}

export async function searchTracks(query: string): Promise<SearchTrack[]> {
    const params = new URLSearchParams({ q: query, type: 'track', limit: '10' });
    const res = await spotifyFetch(`/search?${params}`);
    if (!res.ok) return [];
    const data = await res.json() as { tracks?: { items: SpotifyTrackItem[] } };
    return (data.tracks?.items ?? []).map(mapSearch);
}

// ── Internal types ────────────────────────────────────────────────────────────

interface SpotifyTrackItem {
    id:            string;
    name:          string;
    duration_ms:   number;
    artists:       { name: string }[];
    album:         { name: string; images: { url: string }[] };
    external_urls: { spotify: string };
}

function mapSearch(item: SpotifyTrackItem): SearchTrack {
    return {
        id:         item.id,
        name:       item.name,
        artists:    item.artists.map(a => a.name),
        album:      item.album.name,
        albumCover: item.album.images[1]?.url ?? item.album.images[0]?.url ?? '',
        durationMs: item.duration_ms,
        spotifyUrl: item.external_urls.spotify,
    };
}
