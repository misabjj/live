import '../css/app.css';

import { Toaster } from '@/components/untitled-ui/application/notifications/toaster';
import { createInertiaApp } from '@inertiajs/react';
import { configureEcho } from '@laravel/echo-react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { resolvePage } from './resolve-page';

configureEcho({
    broadcaster: import.meta.env.VITE_BROADCAST_CONNECTION || 'reverb',
    ...(import.meta.env.VITE_BROADCAST_CONNECTION === 'ably'
        ? { key: import.meta.env.VITE_ABLY_PUBLIC_KEY }
        : {}),
});

const appName = import.meta.env.VITE_APP_NAME || '';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: resolvePage,
    setup({ el, App, props }) {
        if (!el) {
            throw new Error('Inertia root element was not found.');
        }

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

// This will set light / dark mode on load...
initializeTheme();
