import type { ComponentType } from 'react';

const pages = import.meta.glob<{ default: ComponentType }>('./pages/**/*.tsx');

export async function resolvePage(name: string): Promise<ComponentType> {
    const loadPage = pages[`./pages/${name}.tsx`];

    if (!loadPage) {
        throw new Error(`Inertia page not found: ${name}`);
    }

    return (await loadPage()).default;
}
