import { NativeSelect } from '@/components/untitled-ui/base/select/select-native';
import { FormField, FormFieldProps, LabelPosition } from './form-field';

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectFormFieldProps extends Omit<FormFieldProps, 'children'> {
    name: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    /** Label position: 'side' for side-by-side (desktop), 'over' for label above (always stacked) */
    labelPosition?: LabelPosition;
}

/**
 * Select form field with consistent styling and error handling.
 * Wraps NativeSelect with FormField for a cohesive experience.
 */
export function SelectFormField({
    title,
    description,
    isRequired = false,
    error,
    name,
    value,
    onChange,
    options,
    className,
    hideDesktopLabel,
    hideMobileLabel,
    labelPosition,
}: SelectFormFieldProps) {
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
            <NativeSelect name={name} value={value} onChange={(e) => onChange(e.target.value)} options={options} aria-label={title} />
        </FormField>
    );
}
