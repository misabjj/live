import { OnboardingDialog } from '@/components/onboarding/onboarding-dialog';
import type { MobileNavigationHeaderRef } from '@/components/untitled-ui/application/app-navigation/base-components/mobile-header';
import type { NavItemType } from '@/components/untitled-ui/application/app-navigation/config';
import { SidebarNavigationSimple } from '@/components/untitled-ui/application/app-navigation/sidebar-navigation/sidebar-simple';
import { Head, usePage } from '@inertiajs/react';
import {
    BarChartSquare02,
    CoinsStacked01,
    Cursor01,
    Database03,
    GraduationHat02,
    MessageChatCircle,
    Microphone01,
    QrCode02,
    Settings01,
    SwitchHorizontal01,
    Target04,
} from '@untitledui/icons';
import type { FC, ReactNode } from 'react';
import { useRef } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

interface BackendNavigationItem {
    title: string;
    href?: string;
    url?: string;
    icon: string;
    external?: boolean;
    items: BackendNavigationItem[];
}

interface BackendNavigation {
    main: BackendNavigationItem[];
}

interface PagePropsWithNavigation {
    navigation: BackendNavigation;
    auth?: {
        user?: {
            id: number;
            email: string;
            created_at: string;
            [key: string]: unknown;
        };
    };
    [key: string]: unknown;
}

interface PanelLayoutProps {
    children: ReactNode;
    title?: string;
}

// Map icon names to components
const getIconComponent = (iconName: string): FC<{ className?: string }> => {
    const iconMap: Record<string, FC<{ className?: string }>> = {
        'bar-chart-square-02': BarChartSquare02,
        'message-chat-circle': MessageChatCircle,
        'settings-01': Settings01,
        microphone: Microphone01,
        'currency-dollar': CoinsStacked01,
        'circle-stack': Database03,
        'arrows-right-left': SwitchHorizontal01,
        'target-04': Target04,
        'cursor-01': Cursor01,
        'qr-code-02': QrCode02,
        'graduation-hat-02': GraduationHat02,
        whatsapp: FaWhatsapp,
    };
    return iconMap[iconName] || BarChartSquare02;
};

// Transform backend navigation to sidebar format
const transformNavigationItems = (items: BackendNavigationItem[]): NavItemType[] => {
    return items.map((item) => {
        // For internal links, extract path from full URL (backend sends full URLs like http://localhost/dashboard)
        // For external links (item.external), keep the full URL
        const url = item.href || item.url || '#';
        let href = url;

        if (!item.external && url.startsWith('http')) {
            try {
                href = new URL(url).pathname;
            } catch {
                href = url;
            }
        }

        return {
            label: item.title,
            href,
            icon: getIconComponent(item.icon),
            items: item.items.map((subItem) => ({
                label: subItem.title,
                href: subItem.href || subItem.url || '#',
                icon: getIconComponent(subItem.icon),
            })),
        };
    });
};

// Standard footer items for all pages
const getFooterItems = (): NavItemType[] => [
    {
        label: 'Suporte',
        href: 'https://wa.me/5571996992155?text=Olá,%20preciso%20de%20ajuda%20com%20o%20Live',
        icon: getIconComponent('whatsapp'),
        external: true,
    },
];

export default ({ children, title }: PanelLayoutProps) => {
    const page = usePage<PagePropsWithNavigation>();
    const sidebarItems = transformNavigationItems(page.props.navigation.main);
    const footerItems = getFooterItems();
    const currentUrl = page.url;
    const mobileNavigationRef = useRef<MobileNavigationHeaderRef>(null);

    const handleNavItemClick = () => {
        mobileNavigationRef.current?.closeModal();
    };

    return (
        <div className="flex flex-col bg-primary lg:flex-row">
            {title && <Head title={title} />}

            {/* Onboarding Dialog for new users */}
            <OnboardingDialog />

            <SidebarNavigationSimple
                ref={mobileNavigationRef}
                items={sidebarItems}
                footerItems={footerItems}
                activeUrl={currentUrl}
                onCloseModal={handleNavItemClick}
            />

            <div className="w-full px-4">
                <main className="mx-auto min-h-dvh w-full max-w-2xl min-w-0 flex-1 bg-primary pt-8 pb-12 xl:max-w-7xl">{children}</main>
            </div>
        </div>
    );
};
