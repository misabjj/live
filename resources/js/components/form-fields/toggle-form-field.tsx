import { Toggle } from '@/components/untitled-ui/base/toggle/toggle';
import { FormField, FormFieldProps, LabelPosition } from './form-field';

export interface ToggleFormFieldProps extends Omit<FormFieldProps, 'children'> {
    value: boolean;
    onChange: (value: boolean) => void;
    toggleSize?: 'sm' | 'md';
    /** Label position: 'side' for side-by-side (desktop), 'over' for label above (always stacked) */
    labelPosition?: LabelPosition;
}

/**
 * Toggle switch form field with consistent styling and error handling.
 * Displays a toggle switch with label and optional description.
 */
export function ToggleFormField({
    title,
    description,
    isRequired = false,
    error,
    value,
    onChange,
    toggleSize = 'md',
    className,
    hideDesktopLabel,
    hideMobileLabel,
    labelPosition,
}: ToggleFormFieldProps) {
    return (
        <FormField
            title={title}
            description={description}
            isRequired={isRequired}
            error={error}
            className={className}
            hideDesktopLabel={hideDesktopLabel}
            hideMobileLabel={hideMobileLabel}
            labelPosition={labelPosition}
        >
            <div className="flex items-center justify-start">
                <Toggle isSelected={value} onChange={onChange} size={toggleSize} aria-label={title} />
            </div>
        </FormField>
    );
}
