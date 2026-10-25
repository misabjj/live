import { usePage } from '@inertiajs/react';

export interface AuthUser {
    id: string;
    display_name: string;
    email: string;
    handle: string;
    profile_photo: string | null;
    background_image: string | null;
    background_color: string;
    accepting_donations: boolean;
    created_at: string;
}

export interface Auth {
    user: AuthUser | null;
}

/**
 * Custom hook to access the auth object from Inertia props.
 *
 * @returns {Auth} - The auth object containing user information.
 */
export const useAuth = (): Auth => {
    const { auth } = usePage().props as unknown as { auth: Auth };
    return auth || { user: null };
};
