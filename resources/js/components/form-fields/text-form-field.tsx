import { InputBase, TextField } from '@/components/untitled-ui/base/input/input';
import { ReactNode } from 'react';
import { FormField, FormFieldProps, LabelPosition } from './form-field';

export interface TextFormFieldProps extends Omit<FormFieldProps, 'children'> {
    name: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    inputSize?: 'sm' | 'md';
    type?: 'text' | 'email' | 'password' | 'url' | 'tel';
    autoComplete?: string;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    addonComponents?: ReactNode;
    /** Label position: 'side' for side-by-side (desktop), 'over' for label above (always stacked) */
    labelPosition?: LabelPosition;
}

/**
 * Text input form field with consistent styling and error handling.
 * Supports various input types and validation.
 */
export function TextFormField({
    title,
    description,
    isRequired = false,
    error,
    name,
    value,
    onChange,
    placeholder,
    inputSize = 'md',
    type = 'text',
    autoComplete,
    maxLength,
    minLength,
    pattern,
    className,
    hideDesktopLabel,
    hideMobileLabel,
    labelPosition,
    addonComponents,
}: TextFormFieldProps) {
    const textField = (
        <TextField
            isRequired={isRequired}
            name={name}
            value={value}
            onChange={onChange}
            isInvalid={!!error}
            type={type}
            autoComplete={autoComplete}
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
            aria-label={title}
        >
            <InputBase size={inputSize} placeholder={placeholder} />
        </TextField>
    );

    const content = addonComponents ? (
        <div className="flex items-center gap-2">
            <div className="flex-1">{textField}</div>
            {addonComponents}
        </div>
    ) : (
        textField
    );

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
            {content}
        </FormField>
    );
}
