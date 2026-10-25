import { MoneyInput } from '@/components/money-input';
import { TextField } from '@/components/untitled-ui/base/input/input';
import { FormField, FormFieldProps, LabelPosition } from './form-field';

export interface MoneyFormFieldProps extends Omit<FormFieldProps, 'children'> {
    name: string;
    value: string;
    onChange: (value: string) => void;
    inputSize?: 'sm' | 'md';
    /** Label position: 'side' for side-by-side (desktop), 'over' for label above (always stacked) */
    labelPosition?: LabelPosition;
}

/**
 * Money input form field with consistent styling and error handling.
 * Uses the MoneyInput component for proper currency formatting.
 */
export function MoneyFormField({
    title,
    description,
    isRequired = false,
    error,
    name,
    value,
    onChange,
    inputSize = 'md',
    className,
    hideDesktopLabel,
    hideMobileLabel,
    labelPosition,
}: MoneyFormFieldProps) {
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
            <TextField isRequired={isRequired} name={name} value={value} onChange={onChange} isInvalid={!!error} aria-label={title}>
                <MoneyInput size={inputSize} placeholder="0,00" />
            </TextField>
        </FormField>
    );
}
