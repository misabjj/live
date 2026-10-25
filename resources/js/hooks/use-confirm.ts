import { useCallback, useState } from 'react';

export interface ConfirmOptions {
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'default' | 'danger';
}

interface ConfirmState {
    isOpen: boolean;
    options: ConfirmOptions | null;
    resolve: ((value: boolean) => void) | null;
}

export function useConfirm() {
    const [state, setState] = useState<ConfirmState>({
        isOpen: false,
        options: null,
        resolve: null,
    });

    const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setState({
                isOpen: true,
                options,
                resolve,
            });
        });
    }, []);

    const handleConfirm = useCallback(() => {
        if (state.resolve) {
            state.resolve(true);
        }
        setState({
            isOpen: false,
            options: null,
            resolve: null,
        });
    }, [state.resolve]);

    const handleCancel = useCallback(() => {
        if (state.resolve) {
            state.resolve(false);
        }
        setState({
            isOpen: false,
            options: null,
            resolve: null,
        });
    }, [state.resolve]);

    return {
        isOpen: state.isOpen,
        options: state.options,
        confirm,
        handleConfirm,
        handleCancel,
    };
}
