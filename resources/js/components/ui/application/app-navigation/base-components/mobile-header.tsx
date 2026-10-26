import { Avatar } from '@/components/ui/base/avatar/avatar';
import { useAppearance } from '@/hooks/use-appearance';
import { useLang } from '@/hooks/use-lang';
import { login, logout } from '@/routes';
import { toggleAcceptingDonations } from '@/routes/controls';
import { show as profile } from '@/routes/settings/profile';
import type { SharedData } from '@/types';
import { cx } from '@/utils/cx';
import { router, usePage } from '@inertiajs/react';
import { X as CloseIcon, LogOut01, Menu02, Monitor01, Moon01, Sun, User01 } from '@untitledui/icons';
import type { FC, PropsWithChildren } from 'react';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
    Button as AriaButton,
    Dialog as AriaDialog,
    DialogTrigger as AriaDialogTrigger,
    Modal as AriaModal,
    ModalOverlay as AriaModalOverlay,
    Popover as AriaPopover,
} from 'react-aria-components';

export interface MobileNavigationHeaderRef {
    closeModal: () => void;
}

export const MobileNavigationHeader = forwardRef<MobileNavigationHeaderRef, PropsWithChildren>(({ children }, ref) => {
    const closeModalRef = useRef<(() => void) | null>(null);
    const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
    const page = usePage<SharedData>();
    const { __ } = useLang();
    const user = page.props.auth?.user;
    const { appearance, updateAppearance } = useAppearance();

    const handleLogout = () => {
        setIsAvatarMenuOpen(false);
        router.post(logout(), {}, { preserveScroll: true });
    };

    const handleViewProfile = () => {
        setIsAvatarMenuOpen(false);
        router.visit(profile());
    };

    const handleToggleDonations = () => {
        setIsAvatarMenuOpen(false);
        router.post(
            toggleAcceptingDonations(),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    useImperativeHandle(ref, () => ({
        closeModal: () => closeModalRef.current?.(),
    }));

    // Get user initials from name
    const getUserInitials = (name?: string): string => {
        if (!name) return '';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <>
            <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-secondary bg-primary px-2 py-3 lg:hidden">
                {/* Left: Hamburger Menu */}
                <AriaDialogTrigger>
                    <AriaButton
                        aria-label={__('navigation.expand_menu')}
                        className="group flex items-center justify-center rounded-lg bg-primary p-2 text-fg-secondary outline-focus-ring hover:bg-primary_hover hover:text-fg-secondary_hover focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                        <Menu02 className="size-6 transition duration-200 ease-in-out group-aria-expanded:opacity-0" />
                        <CloseIcon className="absolute size-6 opacity-0 transition duration-200 ease-in-out group-aria-expanded:opacity-100" />
                    </AriaButton>

                    <AriaModalOverlay
                        isDismissable
                        className={({ isEntering, isExiting }) =>
                            cx(
                                'fixed inset-0 z-40 cursor-pointer bg-overlay/70 pr-16 backdrop-blur-md lg:hidden',
                                isEntering && 'duration-300 ease-in-out animate-in fade-in',
                                isExiting && 'duration-200 ease-in-out animate-out fade-out',
                            )
                        }
                    >
                        {({ state }) => {
                            closeModalRef.current = () => state.close();
                            return (
                                <>
                                    <AriaButton
                                        aria-label={__('navigation.close_menu')}
                                        onPress={() => state.close()}
                                        className="fixed top-3 right-2 flex cursor-pointer items-center justify-center rounded-lg p-2 text-fg-white/70 outline-focus-ring hover:bg-white/10 hover:text-fg-white focus-visible:outline-2 focus-visible:outline-offset-2"
                                    >
                                        <CloseIcon className="size-6" />
                                    </AriaButton>

                                    <AriaModal className="w-full cursor-auto will-change-transform">
                                        <AriaDialog className="min-h-dvh outline-hidden focus:outline-hidden">{children}</AriaDialog>
                                    </AriaModal>
                                </>
                            );
                        }}
                    </AriaModalOverlay>
                </AriaDialogTrigger>

                {/* Center: Logo */}
                <button
                    onClick={() => router.visit(login())}
                    className="absolute left-1/2 flex -translate-x-1/2 cursor-pointer items-center gap-x-3 transition-opacity hover:opacity-80"
                >
                    <p className="text-lg font-bold text-fg-primary">Live</p>
                </button>

                {/* Right: Avatar with Dropdown */}
                {user && (
                    <AriaDialogTrigger isOpen={isAvatarMenuOpen} onOpenChange={setIsAvatarMenuOpen}>
                        <AriaButton
                            aria-label={__('navigation.user_menu')}
                            className="flex items-center justify-center rounded-full outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                            <Avatar
                                size="md"
                                src={user.profile_photo}
                                alt={user.display_name}
                                initials={getUserInitials(user.display_name)}
                                contrastBorder={true}
                            />
                        </AriaButton>
                        <AriaPopover
                            placement="bottom right"
                            offset={8}
                            className={({ isEntering, isExiting }) =>
                                cx(
                                    'z-40 origin-(--trigger-anchor-point) will-change-transform',
                                    isEntering &&
                                        'duration-150 ease-out animate-in fade-in placement-right:slide-in-from-left-0.5 placement-top:slide-in-from-bottom-0.5 placement-bottom:slide-in-from-top-0.5',
                                    isExiting &&
                                        'duration-100 ease-in animate-out fade-out placement-right:slide-out-to-left-0.5 placement-top:slide-out-to-bottom-0.5 placement-bottom:slide-out-to-top-0.5',
                                )
                            }
                        >
                            <AriaDialog className="w-66 rounded-xl bg-secondary_alt shadow-lg ring ring-secondary_alt outline-hidden">
                                <div className="rounded-t-xl bg-primary ring-1 ring-secondary">
                                    <div className="flex flex-col gap-0.5 py-1.5">
                                        <MobileMenuItemButton label={__('navigation.view_profile')} icon={User01} onClick={handleViewProfile} />
                                        <MobileMenuItemButton
                                            showDot
                                            dotColor={user?.accepting_donations ? 'bg-fg-success-primary' : 'bg-fg-error-primary'}
                                            label={user?.accepting_donations ? __('navigation.accepting_donations') : __('navigation.not_accepting_donations')}
                                            onClick={handleToggleDonations}
                                        />
                                    </div>
                                </div>

                                <div className="pb-1">
                                    <div className="rounded-b-xl bg-primary px-1.5 py-1.5 ring-1 ring-secondary">
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => updateAppearance('light')}
                                                className={cx(
                                                    'flex flex-1 cursor-pointer items-center justify-center rounded-md p-2 text-fg-quaternary transition duration-100',
                                                    appearance === 'light' ? 'bg-primary_hover text-fg-secondary' : 'hover:bg-primary_hover',
                                                )}
                                                title={__('navigation.light_mode')}
                                            >
                                                <Sun className="size-4" />
                                            </button>
                                            <button
                                                onClick={() => updateAppearance('dark')}
                                                className={cx(
                                                    'flex flex-1 cursor-pointer items-center justify-center rounded-md p-2 text-fg-quaternary transition duration-100',
                                                    appearance === 'dark' ? 'bg-primary_hover text-fg-secondary' : 'hover:bg-primary_hover',
                                                )}
                                                title={__('navigation.dark_mode')}
                                            >
                                                <Moon01 className="size-4" />
                                            </button>
                                            <button
                                                onClick={() => updateAppearance('system')}
                                                className={cx(
                                                    'flex flex-1 cursor-pointer items-center justify-center rounded-md p-2 text-fg-quaternary transition duration-100',
                                                    appearance === 'system' ? 'bg-primary_hover text-fg-secondary' : 'hover:bg-primary_hover',
                                                )}
                                                title={__('navigation.system_theme')}
                                            >
                                                <Monitor01 className="size-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-1 pb-1.5">
                                    <MobileMenuItemButton label={__('navigation.logout')} icon={LogOut01} onClick={handleLogout} />
                                </div>
                            </AriaDialog>
                        </AriaPopover>
                    </AriaDialogTrigger>
                )}
            </header>
        </>
    );
});

const MobileMenuItemButton = ({
    icon: Icon,
    label,
    iconColor,
    showDot,
    dotColor,
    onClick,
}: {
    icon?: FC<{ className?: string }>;
    label: string;
    iconColor?: string;
    showDot?: boolean;
    dotColor?: string;
    onClick?: () => void;
}) => {
    return (
        <button onClick={onClick} className="group/item w-full cursor-pointer px-1.5 focus:outline-hidden">
            <div
                className={cx(
                    'flex w-full items-center justify-between gap-3 rounded-md p-2 group-hover/item:bg-primary_hover',
                    // Focus styles.
                    'outline-focus-ring group-focus-visible/item:outline-2 group-focus-visible/item:outline-offset-2',
                )}
            >
                <div className="flex gap-2 text-sm font-semibold text-secondary group-hover/item:text-secondary_hover">
                    {showDot ? (
                        <div className="flex size-5 items-center justify-center">
                            <div className={cx('size-2 rounded-full', dotColor)} />
                        </div>
                    ) : (
                        Icon && <Icon className={cx('size-5', iconColor || 'text-fg-quaternary')} />
                    )}{' '}
                    {label}
                </div>
            </div>
        </button>
    );
};
