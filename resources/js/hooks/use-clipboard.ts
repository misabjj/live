import { useCallback, useState } from 'react';

const DEFAULT_TIMEOUT = 2000;

type UseClipboardReturnType = {
    copied: boolean;
    copy: (text: string) => Promise<void>;
};

/**
 * Custom hook to copy text to the clipboard.
 *
 * @returns {UseClipboardReturnType} - An object containing the copied state and the copy function.
 */
export const useClipboard = (): UseClipboardReturnType => {
    const [copied, setCopied] = useState(false);

    const copy = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), DEFAULT_TIMEOUT);
        } catch {
            // Fallback for older browsers
            try {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'absolute';
                textArea.style.left = '-99999px';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                textArea.remove();

                setCopied(true);
                setTimeout(() => setCopied(false), DEFAULT_TIMEOUT);
            } catch {
                console.error('Failed to copy to clipboard');
            }
        }
    }, []);

    return { copied, copy };
};
