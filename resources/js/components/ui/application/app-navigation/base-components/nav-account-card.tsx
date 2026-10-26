import { AvatarLabelGroup } from '@/components/ui/base/avatar/avatar-label-group';
import { useAppearance } from '@/hooks/use-appearance';
import { useAuth } from '@/hooks/use-auth';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { getInitials } from '@/lib/utils';
import { logout } from '@/routes';
import { toggleAcceptingDonations } from '@/routes/controls';
import { show as profile } from '@/routes/settings/profile';
import { cx } from '@/utils/cx';
import { router } from '@inertiajs/react';
import { ChevronSelectorVertical, LogOut01, Monitor01, Moon01, Sun, User01 } from '@untitledui/icons';
import type { FC, HTMLAttributes } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusManager } from 'react-aria';
import type { DialogProps as AriaDialogProps, Placement } from 'react-aria-components';
import { Button as AriaButton, Dialog as AriaDialog, DialogTrigger as AriaDialogTrigger, Popover as AriaPopover } from 'react-aria-components';

type NavAccountType = {
    /** Name of the account holder. */
    name: string;
    /** Email address of the account holder. */
    email: string;
    /** Avatar image URL. */
    avatar: string | null;
    /** Online status of the account holder. This is used to display the online status indicator. */
    status: 'online' | 'offline';
};

export const NavAccountMenu = ({ className, onClose, ...dialogProps }: AriaDialogProps & { className?: string; onClose?: () => void }) => {
    const { user } = useAuth();
    const { appearance, updateAppearance } = useAppearance();
    const focusManager = useFocusManager();
    const dialogRef = useRef<HTMLDivElement>(null);

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowDown':
                    focusManager?.focusNext({ tabbable: true, wrap: true });
                    break;
                case 'ArrowUp':
                    focusManager?.focusPrevious({ tabbable: true, wrap: true });
                    break;
            }
        },
        [focusManager],
    );

    useEffect(() => {
        const element = dialogRef.current;
        if (element) {
            element.addEventListener('keydown', onKeyDown);
        }

        return () => {
            if (element) {
                element.removeEventListener('keydown', onKeyDown);
            }
        };
    }, [onKeyDown]);

    return (
        <AriaDialog
            {...dialogProps}
            ref={dialogRef}
            className={cx('w-66 rounded-xl bg-secondary_alt shadow-lg ring ring-secondary_alt outline-hidden', className)}
        >
            <div className="rounded-t-xl bg-primary ring-1 ring-secondary">
                <div className="flex flex-col gap-0.5 py-1.5">
                    <NavAccountCardMenuItem label="Ver perfil" icon={User01} onClick={() => (window.location.href = profile.url())} />
                    <NavAccountCardMenuItem
                        showDot
                        dotColor={user?.accepting_donations ? 'bg-fg-success-primary' : 'bg-fg-error-primary'}
                        label={user?.accepting_donations ? 'Recebendo doações' : 'Não recebendo doações'}
                        onClick={() => {
                            onClose?.();
                            router.post(
                                toggleAcceptingDonations(),
                                {},
                                {
                                    preserveScroll: true,
                                    preserveState: true,
                                },
                            );
                        }}
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
                            title="Light mode"
                        >
                            <Sun className="size-4" />
                        </button>
                        <button
                            onClick={() => updateAppearance('dark')}
                            className={cx(
                                'flex flex-1 cursor-pointer items-center justify-center rounded-md p-2 text-fg-quaternary transition duration-100',
                                appearance === 'dark' ? 'bg-primary_hover text-fg-secondary' : 'hover:bg-primary_hover',
                            )}
                            title="Dark mode"
                        >
                            <Moon01 className="size-4" />
                        </button>
                        <button
                            onClick={() => updateAppearance('system')}
                            className={cx(
                                'flex flex-1 cursor-pointer items-center justify-center rounded-md p-2 text-fg-quaternary transition duration-100',
                                appearance === 'system' ? 'bg-primary_hover text-fg-secondary' : 'hover:bg-primary_hover',
                            )}
                            title="System theme"
                        >
                            <Monitor01 className="size-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="pt-1 pb-1.5">
                <NavAccountCardMenuItem
                    label="Sair"
                    icon={LogOut01}
                    onClick={() => {
                        onClose?.();
                        router.post(logout(), {}, { preserveScroll: true });
                    }}
                />
            </div>
        </AriaDialog>
    );
};

const NavAccountCardMenuItem = ({
    icon: Icon,
    label,
    shortcut,
    iconColor,
    showDot,
    dotColor,
    ...buttonProps
}: {
    icon?: FC<{ className?: string }>;
    label: string;
    shortcut?: string;
    iconColor?: string;
    showDot?: boolean;
    dotColor?: string;
} & HTMLAttributes<HTMLButtonElement>) => {
    return (
        <button {...buttonProps} className={cx('group/item w-full cursor-pointer px-1.5 focus:outline-hidden', buttonProps.className)}>
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

                {shortcut && (
                    <kbd className="flex rounded px-1 py-px font-body text-xs font-medium text-tertiary ring-1 ring-secondary ring-inset">
                        {shortcut}
                    </kbd>
                )}
            </div>
        </button>
    );
};

export const NavAccountCard = ({ popoverPlacement }: { popoverPlacement?: Placement }) => {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const isDesktop = useBreakpoint('lg');
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const currentUserAccount: NavAccountType = {
        name: user!.display_name,
        email: user!.email,
        avatar: user!.profile_photo,
        status: user!.accepting_donations ? 'online' : 'offline',
    };

    return (
        <AriaDialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
            <AriaButton
                ref={triggerRef}
                className="relative flex w-full cursor-pointer items-center gap-3 rounded-xl p-3 text-left ring-1 ring-secondary outline-focus-ring transition duration-100 ease-linear ring-inset hover:bg-primary_hover focus-visible:outline-2 focus-visible:outline-offset-2 pressed:bg-primary_hover"
            >
                <AvatarLabelGroup
                    size="md"
                    src={currentUserAccount.avatar}
                    initials={getInitials(currentUserAccount.name)}
                    title={currentUserAccount.name}
                    subtitle={currentUserAccount.email}
                    status={currentUserAccount.status}
                />

                <div className="absolute top-1.5 right-1.5">
                    <div className="flex cursor-pointer items-center justify-center rounded-md p-1.5 text-fg-quaternary transition duration-100 ease-linear">
                        <ChevronSelectorVertical className="size-4 shrink-0" />
                    </div>
                </div>
            </AriaButton>
            <AriaPopover
                placement={popoverPlacement ?? (isDesktop ? 'right bottom' : 'top right')}
                triggerRef={triggerRef}
                offset={8}
                className={({ isEntering, isExiting }) =>
                    cx(
                        'origin-(--trigger-anchor-point) will-change-transform',
                        isEntering &&
                            'duration-150 ease-out animate-in fade-in placement-right:slide-in-from-left-0.5 placement-top:slide-in-from-bottom-0.5 placement-bottom:slide-in-from-top-0.5',
                        isExiting &&
                            'duration-100 ease-in animate-out fade-out placement-right:slide-out-to-left-0.5 placement-top:slide-out-to-bottom-0.5 placement-bottom:slide-out-to-top-0.5',
                    )
                }
            >
                <NavAccountMenu onClose={() => setIsOpen(false)} />
            </AriaPopover>
        </AriaDialogTrigger>
    );
};
