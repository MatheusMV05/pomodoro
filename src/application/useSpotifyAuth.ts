import { useState, useEffect, useCallback } from 'react';
import { generateCodeVerifier, generateCodeChallenge } from '@/infrastructure/spotify/pkce';
import { tokenStore } from '@/infrastructure/spotify/tokenStore';
import { CLIENT_ID, REDIRECT_URI } from '@/infrastructure/spotify/client';

const AUTH_URL = 'https://accounts.spotify.com/authorize';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SCOPES = 'user-read-playback-state user-read-currently-playing user-modify-playback-state';

function isCurrentlyAuthenticated() {
    return !!tokenStore.get() && !tokenStore.isExpired();
}

export function useSpotifyAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(isCurrentlyAuthenticated);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle OAuth callback on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const errorParam = params.get('error');
        const state = params.get('state');

        if (errorParam) {
            setError(`Spotify negou o acesso: ${errorParam}`);
            window.history.replaceState({}, '', window.location.pathname);
            return;
        }

        if (!code) return;

        const storedState = sessionStorage.getItem('spotify-auth-state');
        const verifier = sessionStorage.getItem('spotify-code-verifier');

        if (!verifier || state !== storedState) {
            setError('Falha de segurança na autenticação (state mismatch).');
            window.history.replaceState({}, '', window.location.pathname);
            return;
        }

        // Clean URL before async work
        window.history.replaceState({}, '', window.location.pathname);
        sessionStorage.removeItem('spotify-code-verifier');
        sessionStorage.removeItem('spotify-auth-state');

        setIsLoading(true);

        fetch(TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: REDIRECT_URI,
                client_id: CLIENT_ID,
                code_verifier: verifier,
            }),
        })
            .then(r => r.json())
            .then((data: { error?: string; error_description?: string; access_token: string; refresh_token: string; expires_in: number }) => {
                if (data.error) throw new Error(data.error_description ?? data.error);
                tokenStore.set({
                    access_token: data.access_token,
                    refresh_token: data.refresh_token,
                    expires_at: Date.now() + data.expires_in * 1000,
                });
                setIsAuthenticated(true);
            })
            .catch((e: Error) => setError(e.message))
            .finally(() => setIsLoading(false));
    }, []);

    const login = useCallback(async () => {
        const verifier = generateCodeVerifier();
        const challenge = await generateCodeChallenge(verifier);
        const state = crypto.randomUUID();

        sessionStorage.setItem('spotify-code-verifier', verifier);
        sessionStorage.setItem('spotify-auth-state', state);

        const url = new URL(AUTH_URL);
        url.searchParams.set('client_id', CLIENT_ID);
        url.searchParams.set('response_type', 'code');
        url.searchParams.set('redirect_uri', REDIRECT_URI);
        url.searchParams.set('scope', SCOPES);
        url.searchParams.set('code_challenge_method', 'S256');
        url.searchParams.set('code_challenge', challenge);
        url.searchParams.set('state', state);

        window.location.href = url.toString();
    }, []);

    const logout = useCallback(() => {
        tokenStore.clear();
        setIsAuthenticated(false);
    }, []);

    return { isAuthenticated, isLoading, error, login, logout };
}
