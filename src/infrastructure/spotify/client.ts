import { tokenStore } from './tokenStore';

const BASE = 'https://api.spotify.com/v1';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
const REDIRECT_URI = (import.meta.env.VITE_SPOTIFY_REDIRECT_URI as string) ?? 'http://127.0.0.1:5173/';

async function refreshAccessToken(): Promise<string | null> {
    const tokens = tokenStore.get();
    if (!tokens) return null;

    const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: tokens.refresh_token,
            client_id: CLIENT_ID,
        }),
    });

    if (!res.ok) {
        tokenStore.clear();
        return null;
    }

    const data = await res.json() as {
        access_token: string;
        refresh_token?: string;
        expires_in: number;
    };

    tokenStore.set({
        access_token: data.access_token,
        refresh_token: data.refresh_token ?? tokens.refresh_token,
        expires_at: Date.now() + data.expires_in * 1000,
    });

    return data.access_token;
}

async function getAccessToken(): Promise<string | null> {
    if (tokenStore.isExpired()) return refreshAccessToken();
    return tokenStore.get()?.access_token ?? null;
}

/** GET request — returns raw Response for caller to inspect status */
export async function spotifyFetch(path: string): Promise<Response> {
    const token = await getAccessToken();
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${BASE}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get('Retry-After') ?? '2', 10);
        await new Promise(r => setTimeout(r, retryAfter * 1000));
        const token2 = await getAccessToken();
        if (!token2) throw new Error('Not authenticated');
        return fetch(`${BASE}${path}`, { headers: { Authorization: `Bearer ${token2}` } });
    }

    return res;
}

/** PUT / POST command for playback control (204 = success) */
export async function spotifyCommand(
    path: string,
    method: 'PUT' | 'POST',
    body?: Record<string, unknown>,
): Promise<void> {
    const token = await getAccessToken();
    if (!token) throw new Error('Not authenticated');

    await fetch(`${BASE}${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    });
}

export { CLIENT_ID, REDIRECT_URI };
