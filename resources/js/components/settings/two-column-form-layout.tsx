import { ReactNode } from 'react';

interface TwoColumnFormLayoutProps {
    /**
     * The main form content (left column on desktop)
     */
    form: ReactNode;

    /**
     * The preview/sidebar content (right column on desktop, bottom on mobile)
     */
    preview: ReactNode;
}

/**
 * A two-column responsive layout for forms with live preview.
 *
 * On desktop (md breakpoint and above):
 * - Displays content in two columns side by side
 * - Preview column is sticky and stays in view while scrolling
 *
 * On mobile:
 * - Stacks content vertically
 * - Form appears first, preview appears below
 *
 * @example
 * ```tsx
 * <TwoColumnFormLayout
 *   form={
 *     <SettingsFormContainer onSubmit={handleSubmit}>
 *       <SettingsPageHeader title="..." description="..." />
 *       <SettingsFormContent>
 *         // Form fields here
 *       </SettingsFormContent>
 *       <SettingsFormFooter />
 *     </SettingsFormContainer>
 *   }
 *   preview={
 *     <>
 *       <Label>Preview</Label>
 *       <div className="...">
 *         // Preview component here
 *       </div>
 *     </>
 *   }
 * />
 * ```
 */
export function TwoColumnFormLayout({ form, preview }: TwoColumnFormLayoutProps) {
    return (
        <div className="flex flex-col gap-8">
            {/* Desktop Layout: Two columns side by side */}
            <div className="grid gap-8 xl:grid-cols-2">
                {/* Left column: Form */}
                {form}

                {/* Right column: Preview (sticky on desktop, hidden on mobile) */}
                <div className="max-xl:hidden">
                    <div className="sticky top-6">{preview}</div>
                </div>
            </div>

            {/* Mobile Layout: Preview shown at bottom */}
            <div className="xl:hidden">{preview}</div>
        </div>
    );
}
