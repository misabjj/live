import { TextArea } from '@/components/ui/base/textarea/textarea';
import { ReactNode } from 'react';
import { FormField, FormFieldProps, LabelPosition } from './form-field';

export interface TextAreaFormFieldProps extends Omit<FormFieldProps, 'children'> {
    name: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    cols?: number;
    maxLength?: number;
    addonComponents?: ReactNode;
    /** Label position: 'side' for side-by-side (desktop), 'over' for label above (always stacked) */
    labelPosition?: LabelPosition;
}

/**
 * Textarea form field with consistent styling and error handling.
 * Supports textarea-specific properties like rows, cols, and maxLength.
 */
export function TextAreaFormField({
    title,
    description,
    isRequired = false,
    error,
    name,
    value,
    onChange,
    placeholder,
    rows = 3,
    cols,
    maxLength,
    className,
    hideDesktopLabel,
    hideMobileLabel,
    labelPosition,
    addonComponents,
}: TextAreaFormFieldProps) {
    const textArea = (
        <TextArea
            isRequired={isRequired}
            name={name}
            value={value}
            onChange={onChange}
            isInvalid={!!error}
            placeholder={placeholder}
            rows={rows}
            cols={cols}
            maxLength={maxLength}
            aria-label={title}
        />
    );

    const content = addonComponents ? (
        <div className="flex items-center gap-2">
            <div className="flex-1">{textArea}</div>
            {addonComponents}
        </div>
    ) : (
        textArea
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
