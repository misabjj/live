import { Toaster } from '@/components/ui/application/notifications/toaster';
import { createInertiaApp } from '@inertiajs/react';
import { configureEcho } from '@laravel/echo-react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { resolvePage } from './resolve-page';

const reverbScheme = import.meta.env.VITE_REVERB_SCHEME ?? 'https';
const reverbPort = Number(import.meta.env.VITE_REVERB_PORT ?? (reverbScheme === 'https' ? 443 : 80));

configureEcho({
    broadcaster: import.meta.env.VITE_BROADCAST_CONNECTION,
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: reverbPort,
    wssPort: reverbPort,
    forceTLS: reverbScheme === 'https',
    enabledTransports: ['ws', 'wss'],
});

const appName = import.meta.env.VITE_APP_NAME;

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: resolvePage,
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <Toaster />
            </>,
        );
    },
    progress: {
        color: '#4b0082',
    },
});

initializeTheme();
