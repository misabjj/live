import { Label } from '@/components/ui/base/input/label';
import { useLang } from '@/hooks/use-lang';
import { ReactNode } from 'react';

interface TwoColumnFormPreviewLayoutProps {
    /**
     * The main form content (left column on desktop)
     */
    form: ReactNode;

    /**
     * The preview/sidebar content (right column on desktop, bottom on mobile)
     * This will be automatically wrapped with the preview label and styling
     */
    preview: ReactNode;
}

/**
 * A two-column responsive layout for forms with live preview.
 * Automatically wraps the preview with label and container styling.
 *
 * On desktop (lg breakpoint and above):
 * - Displays content in two columns side by side
 * - Preview column is sticky and stays in view while scrolling
 *
 * On mobile:
 * - Stacks content vertically
 * - Form appears first, preview appears below
 */
export function TwoColumnFormPreviewLayout({ form, preview }: TwoColumnFormPreviewLayoutProps) {
    const { __ } = useLang();
    const wrappedPreview = (
        <>
            <Label className="mb-3 block text-sm font-semibold text-secondary">{__('pages.settings.preview')}</Label>
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg bg-secondary p-6">{preview}</div>
        </>
    );

    return (
        <div className="flex flex-col gap-8">
            {/* Desktop Layout: Two columns side by side */}
            <div className="grid gap-8 xl:grid-cols-2">
                {/* Left column: Form */}
                {form}

                {/* Right column: Preview (sticky on desktop, hidden on mobile) */}
                <div className="max-xl:hidden">
                    <div className="sticky top-6">{wrappedPreview}</div>
                </div>
            </div>

            {/* Mobile Layout: Preview shown at bottom */}
            <div className="xl:hidden">{wrappedPreview}</div>
        </div>
    );
}
