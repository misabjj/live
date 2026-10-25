import { IconNotification } from '@/components/untitled-ui/application/notifications/notifications';
import { toast as sonnerToast } from 'sonner';

export const useToast = () => {
    const success = (title: string, description: string = '', confirmLabel: string | null = '') => {
        sonnerToast.custom((t) => (
            <IconNotification
                title={title}
                description={description}
                confirmLabel={confirmLabel ?? undefined}
                hideDismissLabel={confirmLabel === null}
                color="success"
                onClose={() => sonnerToast.dismiss(t)}
                onConfirm={() => sonnerToast.dismiss(t)}
            />
        ));
    };

    const error = (title: string, description: string = '', confirmLabel: string | null = '') => {
        sonnerToast.custom((t) => (
            <IconNotification
                title={title}
                description={description}
                confirmLabel={confirmLabel ?? undefined}
                hideDismissLabel={confirmLabel === null}
                color="error"
                onClose={() => sonnerToast.dismiss(t)}
                onConfirm={() => sonnerToast.dismiss(t)}
            />
        ));
    };

    const warning = (title: string, description: string = '', confirmLabel: string | null = '') => {
        sonnerToast.custom((t) => (
            <IconNotification
                title={title}
                description={description}
                confirmLabel={confirmLabel ?? undefined}
                hideDismissLabel={confirmLabel === null}
                color="warning"
                onClose={() => sonnerToast.dismiss(t)}
                onConfirm={() => sonnerToast.dismiss(t)}
            />
        ));
    };

    const info = (title: string, description: string = '', confirmLabel: string | null = '') => {
        sonnerToast.custom((t) => (
            <IconNotification
                title={title}
                description={description}
                confirmLabel={confirmLabel ?? undefined}
                hideDismissLabel={confirmLabel === null}
                color="default"
                onClose={() => sonnerToast.dismiss(t)}
                onConfirm={() => sonnerToast.dismiss(t)}
            />
        ));
    };

    return {
        success,
        error,
        warning,
        info,
    };
};

// Export a default toast object for backward compatibility
export const toast = {
    success: (title: string, description: string = '', confirmLabel: string | null = '') => {
        sonnerToast.custom((t) => (
            <IconNotification
                title={title}
                description={description}
                confirmLabel={confirmLabel ?? undefined}
                hideDismissLabel={confirmLabel === null}
                color="success"
                onClose={() => sonnerToast.dismiss(t)}
                onConfirm={() => sonnerToast.dismiss(t)}
            />
        ));
    },

    error: (title: string, description: string = '', confirmLabel: string | null = '') => {
        sonnerToast.custom((t) => (
            <IconNotification
                title={title}
                description={description}
                confirmLabel={confirmLabel ?? undefined}
                hideDismissLabel={confirmLabel === null}
                color="error"
                onClose={() => sonnerToast.dismiss(t)}
                onConfirm={() => sonnerToast.dismiss(t)}
            />
        ));
    },

    warning: (title: string, description: string = '', confirmLabel: string | null = '') => {
        sonnerToast.custom((t) => (
            <IconNotification
                title={title}
                description={description}
                confirmLabel={confirmLabel ?? undefined}
                hideDismissLabel={confirmLabel === null}
                color="warning"
                onClose={() => sonnerToast.dismiss(t)}
                onConfirm={() => sonnerToast.dismiss(t)}
            />
        ));
    },

    info: (title: string, description: string = '', confirmLabel: string | null = '') => {
        sonnerToast.custom((t) => (
            <IconNotification
                title={title}
                description={description}
                confirmLabel={confirmLabel ?? undefined}
                hideDismissLabel={confirmLabel === null}
                color="default"
                onClose={() => sonnerToast.dismiss(t)}
                onConfirm={() => sonnerToast.dismiss(t)}
            />
        ));
    },
};
