import { Button } from '@/components/ui/base/buttons/button';
import { Toggle } from '@/components/ui/base/toggle/toggle';
import { ReactNode } from 'react';
import { FormSection, SettingsSection, SettingsSectionDivider } from './form-field';

/**
 * Props for SettingsSwitchSection
 */
export interface SettingsSwitchSectionProps {
    title: string;
    description?: string;
    isRequired?: boolean;
    value: boolean;
    onChange: (value: boolean) => void;
    toggleSize?: 'sm' | 'md';
    withDivider?: boolean;
}

/**
 * Simple toggle switch section with automatic label and description.
 * No need to remember classes or structure - just pass title, description, and the toggle handler.
 *
 * @example
 * <SettingsSwitchSection
 *   title="Dark Mode"
 *   description="Enable dark theme"
 *   value={isDarkMode}
 *   onChange={setIsDarkMode}
 * />
 */
export function SettingsSwitchSection({
    title,
    description,
    isRequired = false,
    value,
    onChange,
    toggleSize = 'md',
    withDivider = true,
}: SettingsSwitchSectionProps) {
    return (
        <FormSection withDivider={withDivider}>
            <SettingsSection title={title} description={description} isRequired={isRequired}>
                <Toggle isSelected={value} onChange={onChange} size={toggleSize} />
            </SettingsSection>
        </FormSection>
    );
}

/**
 * Props for SettingsButtonSection
 */
export interface SettingsButtonSectionProps {
    title: string;
    description?: string;
    isRequired?: boolean;
    buttonText: string;
    onClick: () => void;
    buttonColor?: 'primary' | 'secondary' | 'primary-destructive' | 'link-color' | 'link-gray';
    buttonSize?: 'sm' | 'md' | 'lg';
    withDivider?: boolean;
}

/**
 * Simple button section with automatic label and description.
 * Useful for settings that trigger an action (like export, delete, etc.)
 *
 * @example
 * <SettingsButtonSection
 *   title="Export Data"
 *   description="Download your settings as JSON"
 *   buttonText="Export"
 *   onClick={handleExport}
 * />
 */
export function SettingsButtonSection({
    title,
    description,
    isRequired = false,
    buttonText,
    onClick,
    buttonColor = 'primary',
    buttonSize = 'md',
    withDivider = true,
}: SettingsButtonSectionProps) {
    return (
        <FormSection withDivider={withDivider}>
            <SettingsSection title={title} description={description} isRequired={isRequired}>
                <div className="self-start">
                    <Button color={buttonColor} size={buttonSize} onClick={onClick}>
                        {buttonText}
                    </Button>
                </div>
            </SettingsSection>
        </FormSection>
    );
}

/**
 * Props for SettingsContainer
 */
export interface SettingsContainerProps {
    children: ReactNode;
    className?: string;
    gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const GAP_MAP = {
    xs: 'gap-3',
    sm: 'gap-4',
    md: 'gap-5',
    lg: 'gap-6',
    xl: 'gap-8',
} as const;

/**
 * Container wrapper for settings sections.
 * Provides consistent spacing and structure for groups of settings.
 * Default layout is flex column with md (gap-5) spacing.
 *
 * @example
 * <SettingsContainer>
 *   <SettingsSwitchSection ... />
 *   <SettingsSwitchSection ... />
 *   <SettingsButtonSection ... />
 * </SettingsContainer>
 *
 * @example With custom gap
 * <SettingsContainer gap="lg">
 *   ...
 * </SettingsContainer>
 */
export function SettingsContainer({ children, className, gap = 'md' }: SettingsContainerProps) {
    const gapClass = GAP_MAP[gap];
    return <div className={`flex flex-col ${gapClass} ${className || ''}`}>{children}</div>;
}

/**
 * Props for SettingsCustomSection
 */
export interface SettingsCustomSectionProps {
    title: string;
    description?: string;
    isRequired?: boolean;
    children: ReactNode;
    withDivider?: boolean;
    row?: boolean;
}

/**
 * Custom settings section for arbitrary content.
 * Use when SettingsSwitchSection or SettingsButtonSection don't fit your needs.
 *
 * @example
 * <SettingsCustomSection title="Colors" description="Choose your theme colors">
 *   <ColorPicker ... />
 * </SettingsCustomSection>
 */
export function SettingsCustomSection({
    title,
    description,
    isRequired = false,
    children,
    withDivider = true,
    row = false,
}: SettingsCustomSectionProps) {
    return (
        <FormSection withDivider={withDivider}>
            <SettingsSection title={title} description={description} isRequired={isRequired} row={row}>
                {children}
            </SettingsSection>
        </FormSection>
    );
}

/**
 * Export divider for use between sections
 */
export { SettingsSectionDivider };
