import { Button } from '@/components/untitled-ui/base/buttons/button';
import { cx } from '@/utils/cx';
import { ChevronDown, Moon01, Sun } from '@untitledui/icons';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Button as AriaButton, Dialog as AriaDialog, DialogTrigger as AriaDialogTrigger, Popover as AriaPopover } from 'react-aria-components';

type HeaderNavItem = {
    label: string;
    href?: string;
    menu?: ReactNode;
};

const headerNavItems: HeaderNavItem[] = [
    { label: 'Funcionalidades', href: '#funcionalidades' },
    { label: 'Nossas vozes', href: '#nossas-vozes' },
];

interface HeaderProps {
    items?: HeaderNavItem[];
    isFullWidth?: boolean;
    isFloating?: boolean;
    className?: string;
}

export function ThemeToggleButton() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const root = document.documentElement;

        if (root.classList.contains('dark-mode')) {
            setIsDark(true);
            return;
        }

        const saved = localStorage.getItem('theme');
        if (saved === 'dark') {
            root.classList.add('dark-mode');
            setIsDark(true);
        }
    }, []);

    const toggle = () => {
        const root = document.documentElement;
        const newDark = !isDark;

        if (newDark) {
            root.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }

        setIsDark(newDark);
    };

    return <Button onClick={toggle} color="tertiary" size="lg" iconLeading={isDark ? Sun : Moon01}></Button>;
}

export const Header = ({ items = headerNavItems, isFullWidth, isFloating, className }: HeaderProps) => {
    const headerRef = useRef<HTMLElement>(null);

    return (
        <header
            ref={headerRef}
            className={cx(
                'relative flex h-18 w-full items-center justify-center md:h-20',
                isFloating && 'h-16 md:h-19 md:pt-3',
                isFullWidth && !isFloating ? 'has-aria-expanded:bg-primary' : 'max-md:has-aria-expanded:bg-primary',
                className,
            )}
        >
            <div className="flex size-full max-w-container flex-1 items-center pr-3 pl-4 md:px-8">
                <div
                    className={cx(
                        'flex w-full justify-between gap-4',
                        isFloating && 'ring-secondary_alt md:rounded-2xl md:bg-primary md:py-3 md:pr-3 md:pl-4 md:shadow-xs md:ring-1',
                    )}
                >
                    <div className="flex flex-1 items-center gap-5">
                        <a className="flex items-center gap-3 font-bold text-primary" href="/">
                            <p className="text-xl text-brand-primary select-none">Live</p>
                        </a>

                        {/* Desktop navigation */}
                        <nav className="max-md:hidden">
                            <ul className="flex items-center gap-0.5">
                                {items.map((navItem) => (
                                    <li key={navItem.label}>
                                        {navItem.menu ? (
                                            <AriaDialogTrigger>
                                                <AriaButton className="flex cursor-pointer items-center gap-0.5 rounded-lg px-1.5 py-1 text-md font-semibold text-secondary outline-focus-ring transition duration-100 ease-linear hover:text-secondary_hover focus-visible:outline-2 focus-visible:outline-offset-2">
                                                    <span className="px-0.5">{navItem.label}</span>

                                                    <ChevronDown className="size-4 rotate-0 stroke-[2.625px] text-fg-quaternary transition duration-100 ease-linear in-aria-expanded:-rotate-180" />
                                                </AriaButton>

                                                <AriaPopover
                                                    className={({ isEntering, isExiting }) =>
                                                        cx(
                                                            'hidden origin-top will-change-transform md:block',
                                                            isFullWidth && 'w-full',
                                                            isEntering && 'duration-200 ease-out animate-in fade-in slide-in-from-top-1',
                                                            isExiting && 'duration-150 ease-in animate-out fade-out slide-out-to-top-1',
                                                        )
                                                    }
                                                    offset={isFloating || isFullWidth ? 0 : 8}
                                                    containerPadding={0}
                                                    triggerRef={(isFloating && isFullWidth) || isFullWidth ? headerRef : undefined}
                                                >
                                                    {({ isEntering, isExiting }) => (
                                                        <AriaDialog
                                                            className={cx(
                                                                'mx-auto origin-top outline-hidden',
                                                                isFloating && 'max-w-7xl px-8 pt-3',
                                                                // Have to use the scale animation inside the popover to avoid
                                                                // miscalculating the popover's position when opening.
                                                                isEntering && !isFullWidth && 'duration-200 ease-out animate-in zoom-in-95',
                                                                isExiting && !isFullWidth && 'duration-150 ease-in animate-out zoom-out-95',
                                                            )}
                                                        >
                                                            {navItem.menu}
                                                        </AriaDialog>
                                                    )}
                                                </AriaPopover>
                                            </AriaDialogTrigger>
                                        ) : (
                                            <a
                                                href={navItem.href}
                                                className="flex cursor-pointer items-center gap-0.5 rounded-lg px-1.5 py-1 text-md font-semibold text-secondary outline-focus-ring transition duration-100 ease-linear hover:text-secondary_hover focus:outline-offset-2 focus-visible:outline-2"
                                            >
                                                <span className="px-0.5">{navItem.label}</span>
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    <div className="items-center">
                        <ThemeToggleButton></ThemeToggleButton>
                    </div>

                    {/*Mobile*/}
                    <div className="items-center gap-3 md:hidden">
                        <Button color="primary" size={isFloating ? 'md' : 'lg'} href="/register">
                            Fazer login
                        </Button>
                    </div>

                    {/*Desktop*/}
                    <div className="hidden items-center gap-3 md:flex">
                        <Button color="tertiary" size={isFloating ? 'md' : 'lg'} href="/login">
                            Entrar
                        </Button>
                    </div>
                    <div className="hidden items-center gap-3 md:flex">
                        <Button
                            color="primary"
                            size={isFloating ? 'md' : 'lg'}
                            href="/register"
                        >
                            Criar conta
                        </Button>
                    </div>
                    <div className="hidden items-center gap-3 md:flex">
                    </div>
                </div>
            </div>
        </header>
    );
};
