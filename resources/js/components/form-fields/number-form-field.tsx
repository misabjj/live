import { InputBase, TextField } from '@/components/untitled-ui/base/input/input';
import { FormField, FormFieldProps, LabelPosition } from './form-field';

export interface NumberFormFieldProps extends Omit<FormFieldProps, 'children'> {
    title: string; // Explicitly require title from FormFieldProps
    name: string;
    value: number;
    onChange: (value: number) => void;
    placeholder?: string;
    inputSize?: 'sm' | 'md';
    min?: number;
    max?: number;
    step?: number;
    /** Label position: 'side' for side-by-side (desktop), 'over' for label above (always stacked) */
    labelPosition?: LabelPosition;
}

/**
 * Number input form field with consistent styling and error handling.
 * Supports min, max, and step validation.
 */
export function NumberFormField({
    title,
    description,
    isRequired = false,
    error,
    name,
    value,
    onChange,
    placeholder,
    inputSize = 'md',
    min,
    max,
    step,
    className,
    hideDesktopLabel,
    hideMobileLabel,
    labelPosition,
}: NumberFormFieldProps) {
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
            <TextField
                isRequired={isRequired}
                name={name}
                type="number"
                inputMode="numeric"
                value={value.toString()}
                onChange={(val) => onChange(parseInt(val) || 0)}
                isInvalid={!!error}
                aria-label={title}
            >
                <InputBase size={inputSize} placeholder={placeholder} min={min} max={max} step={step} aria-label={title} />
            </TextField>
        </FormField>
    );
}
