import { cx } from '@/utils/cx';
import { useEffect, useState } from 'react';
import type { NavItemDividerType, NavItemType } from '../config';
import { NavItemBase } from './nav-item';

interface NavListProps {
    /** URL of the currently active item. */
    activeUrl?: string;
    /** Additional CSS classes to apply to the list. */
    className?: string;
    /** List of items to display. */
    items: (NavItemType | NavItemDividerType)[];
    /** Callback to close the mobile navigation modal. */
    onCloseModal?: () => void;
}

// Utility functions for localStorage
const getExpandedSections = (): Set<string> => {
    if (typeof window === 'undefined') return new Set();
    try {
        const stored = localStorage.getItem('nav-expanded-sections');
        return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
        return new Set();
    }
};

const setExpandedSections = (sections: Set<string>) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem('nav-expanded-sections', JSON.stringify([...sections]));
    } catch {
        // Ignore localStorage errors
    }
};

// Helper function to check if a URL matches, supporting wildcards and query strings
const isUrlMatch = (itemHref: string | undefined, currentUrl: string): boolean => {
    if (!itemHref) return false;
    // Strip query strings from both URLs for comparison
    const cleanItemHref = itemHref.split('?')[0];
    const cleanCurrentUrl = currentUrl.split('?')[0];

    // Exact match (ignoring query strings)
    if (cleanItemHref === cleanCurrentUrl) {
        return true;
    }

    // Check if current URL starts with the item's base path
    // e.g., /settings/profile matches /settings/* pattern
    const pathParts = cleanItemHref.split('/').filter(Boolean);
    const currentParts = cleanCurrentUrl.split('/').filter(Boolean);

    if (pathParts.length > 0 && currentParts.length > 0) {
        // If the first segment matches, consider it active
        // This makes /settings/profile active when item is /settings/any-page
        if (pathParts[0] === currentParts[0]) {
            return true;
        }
    }

    return false;
};

export const NavList = ({ activeUrl, items, className, onCloseModal }: NavListProps) => {
    const [open, setOpen] = useState(false);
    const activeItem = items.find(
        (item) => isUrlMatch(item.href, activeUrl || '') || item.items?.some((subItem) => isUrlMatch(subItem.href, activeUrl || '')),
    );
    const [currentItem, setCurrentItem] = useState(activeItem);
    const [expandedSections, setExpandedSectionsState] = useState<Set<string>>(new Set());

    // Load expanded sections from localStorage on mount
    useEffect(() => {
        setExpandedSectionsState(getExpandedSections());
    }, []);

    const toggleSection = (sectionLabel: string, isOpen: boolean) => {
        const newExpanded = new Set(expandedSections);
        if (isOpen) {
            newExpanded.add(sectionLabel);
        } else {
            newExpanded.delete(sectionLabel);
        }
        setExpandedSectionsState(newExpanded);
        setExpandedSections(newExpanded);
    };

    return (
        <ul className={cx('mt-4 flex flex-col px-2 lg:px-4', className)}>
            {items.map((item, index) => {
                if (item.divider) {
                    return (
                        <li key={index} className="w-full px-0.5 py-2">
                            <hr className="h-px w-full border-none bg-border-secondary" />
                        </li>
                    );
                }

                if (item.items?.length) {
                    const isExpanded = expandedSections.has(item.label);

                    return (
                        <details
                            key={item.label}
                            open={isExpanded}
                            className="appearance-none py-0.5"
                            onToggle={(e) => {
                                const isOpen = e.currentTarget.open;
                                setOpen(isOpen);
                                setCurrentItem(item);
                                toggleSection(item.label, isOpen);
                            }}
                        >
                            <NavItemBase href={item.href} badge={item.badge} icon={item.icon} type="collapsible">
                                {item.label}
                            </NavItemBase>

                            <dd>
                                <ul className="py-0.5">
                                    {item.items.map((childItem) => (
                                        <li key={childItem.label} className="py-0.5">
                                            <NavItemBase
                                                href={childItem.href}
                                                badge={childItem.badge}
                                                type="collapsible-child"
                                                current={isUrlMatch(childItem.href, activeUrl || '')}
                                                onClick={onCloseModal}
                                            >
                                                {childItem.label}
                                            </NavItemBase>
                                        </li>
                                    ))}
                                </ul>
                            </dd>
                        </details>
                    );
                }

                return (
                    <li key={item.label} className="py-0.5">
                        <NavItemBase
                            type="link"
                            badge={item.badge}
                            icon={item.icon}
                            href={item.href}
                            current={isUrlMatch(item.href, activeUrl || '')}
                            open={open && currentItem?.href === item.href}
                            onClick={onCloseModal}
                        >
                            {item.label}
                        </NavItemBase>
                    </li>
                );
            })}
        </ul>
    );
};
