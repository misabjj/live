import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

// Backend navigation structure (from Laravel)
export interface BackendNavigationItem {
    title: string;
    href?: string;
    url?: string;
    icon: string;
    external?: boolean;
    items?: BackendNavigationItem[];
}

export interface BackendNavigation {
    main?: BackendNavigationItem[];
}

// Page props with navigation
export interface PagePropsWithNavigation {
    navigation?: BackendNavigation;
    [key: string]: unknown;
}

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    notifications: Notification[];
    [key: string]: unknown;
}

export interface User {
    id: number;
    handle: string;
    display_name: string;
    email: string;
    profile_photo: string;
    accepting_donations: boolean;
    email_verified_at?: string | null;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Pagination<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links?: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
