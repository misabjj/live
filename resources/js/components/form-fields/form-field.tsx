import { SectionLabel } from '@/components/untitled-ui/application/section-headers/section-label';
import { HintText } from '@/components/untitled-ui/base/input/hint-text';
import { Label } from '@/components/untitled-ui/base/input/label';
import { cx } from '@/utils/cx';
import { ReactNode } from 'react';

export type LabelPosition = 'side' | 'over';

export interface FormFieldProps {
    title: string;
    description?: string;
    isRequired?: boolean;
    error?: string;
    children: ReactNode;
    className?: string;
    hideDesktopLabel?: boolean;
    hideMobileLabel?: boolean;
    /** Label position: 'side' for side-by-side (desktop), 'over' for label above input (always stacked) */
    labelPosition?: LabelPosition;
}

export interface SettingsSectionLabelProps {
    title: string;
    description?: string;
    isRequired?: boolean;
    children?: ReactNode;
}

export interface SettingsSectionContentProps {
    children: ReactNode;
}

export interface SettingsSectionProps extends SettingsSectionLabelProps {
    children: ReactNode;
    /** Use flex row layout instead of flex column */
    row?: boolean;
    /** Label position: 'side' for side-by-side (desktop), 'over' for label above (always stacked) */
    labelPosition?: LabelPosition;
}

/**
 * Base form field component that provides consistent layout, labels, and error handling.
 *
 * @param labelPosition - 'side': Desktop has label on left, mobile on top (default). 'over': Label always on top (stacked)
 */
export function FormField({
    title,
    description,
    isRequired = false,
    error,
    children,
    className,
    hideDesktopLabel = false,
    hideMobileLabel = false,
    labelPosition = 'side',
}: FormFieldProps) {
    // For 'over' layout, always stack vertically
    if (labelPosition === 'over') {
        return (
            <div className={cx('flex flex-col gap-2', className)}>
                {!hideDesktopLabel && (
                    <div className="flex flex-col gap-1">
                        <Label>{title}</Label>
                        {description && <HintText>{description}</HintText>}
                    </div>
                )}
                {children}
                {error && <HintText isInvalid>{error}</HintText>}
            </div>
        );
    }

    // Default 'side' layout: label on left (desktop) or top (mobile)
    return (
        <div className={cx('grid grid-cols-1 lg:grid-cols-[minmax(200px,280px)_minmax(0,512px)] lg:gap-8', className)}>
            {!hideDesktopLabel && (
                <SectionLabel.Root isRequired={isRequired} size="sm" title={title} description={description} className="max-lg:hidden" />
            )}

            <div className="flex flex-col gap-2">
                {!hideMobileLabel && (
                    <div className="flex flex-col gap-1 lg:hidden">
                        <Label>{title}</Label>
                        {description && <HintText>{description}</HintText>}
                    </div>
                )}
                {children}
                {error && <HintText isInvalid>{error}</HintText>}
            </div>
        </div>
    );
}

export interface FormSectionProps {
    children: ReactNode;
    withDivider?: boolean;
}

/**
 * Wrapper for form sections with optional divider
 */
export function FormSection({ children, withDivider = true }: FormSectionProps) {
    return (
        <>
            {children}
            {withDivider && <hr className="h-px w-full border-none bg-border-secondary" />}
        </>
    );
}

/**
 * Container for a settings section with responsive two-column layout.
 * Alias for FormField without error handling, useful for non-form settings.
 *
 * Desktop: Label on left (280px), content on right (512px)
 * Mobile: Stacked vertically
 *
 * @example
 * <SettingsSection title="..." description="...">
 *   <Toggle ... />
 * </SettingsSection>
 *
 * @example With row layout
 * <SettingsSection title="..." description="..." row>
 *   <Input ... />
 *   <Button ... />
 * </SettingsSection>
 */
export function SettingsSection({ title, description, isRequired = false, row = false, labelPosition = 'side', children }: SettingsSectionProps) {
    return (
        <FormField
            title={title}
            description={description}
            isRequired={isRequired}
            hideDesktopLabel={false}
            hideMobileLabel={false}
            labelPosition={labelPosition}
        >
            {row ? <div className="flex items-center gap-2">{children}</div> : children}
        </FormField>
    );
}

/**
 * Label/title for a settings section.
 * This is automatically included in SettingsSection, but can be used standalone.
 *
 * Desktop: Displays using SectionLabel component on the left
 * Mobile: Displays as simple heading/text on top
 *
 * @example
 * <SettingsSectionLabel
 *   title="Autoplay"
 *   description="Control automatic playback"
 * />
 */
export function SettingsSectionLabel({ title, description, isRequired = false, children }: SettingsSectionLabelProps) {
    return (
        <>
            {/* Desktop Label */}
            <SectionLabel.Root size="sm" title={title} description={description} isRequired={isRequired} className="max-lg:hidden">
                {children}
            </SectionLabel.Root>

            {/* Mobile Label */}
            <div className="lg:hidden">
                <h3 className="text-sm font-semibold text-primary">{title}</h3>
                {description && <p className="text-sm text-secondary">{description}</p>}
                {children}
            </div>
        </>
    );
}

/**
 * Content area for a settings section.
 * Contains the actual controls (toggles, buttons, inputs, etc.)
 *
 * @example
 * <SettingsSectionContent>
 *   <Toggle isSelected={value} onChange={handler} />
 * </SettingsSectionContent>
 */
export function SettingsSectionContent({ children }: SettingsSectionContentProps) {
    return <div className="flex flex-col gap-2">{children}</div>;
}

/**
 * Horizontal divider between settings sections.
 * Alias for the divider in FormSection.
 *
 * @example
 * <SettingsSection>...</SettingsSection>
 * <SettingsSectionDivider />
 * <SettingsSection>...</SettingsSection>
 */
export function SettingsSectionDivider() {
    return <hr className="h-px w-full border-none bg-border-secondary" />;
}
