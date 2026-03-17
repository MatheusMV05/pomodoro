const KEY = 'spotify-tokens';

export interface SpotifyTokens {
    access_token: string;
    refresh_token: string;
    expires_at: number; // ms timestamp
}

export const tokenStore = {
    get(): SpotifyTokens | null {
        const raw = localStorage.getItem(KEY);
        return raw ? (JSON.parse(raw) as SpotifyTokens) : null;
    },
    set(tokens: SpotifyTokens): void {
        localStorage.setItem(KEY, JSON.stringify(tokens));
    },
    clear(): void {
        localStorage.removeItem(KEY);
    },
    isExpired(): boolean {
        const t = this.get();
        return !t || Date.now() >= t.expires_at - 60_000; // 60s buffer
    },
};
