import { DatePicker } from '@/components/ui/application/date-picker/date-picker';
import { parseDate } from '@internationalized/date';
import { useMemo } from 'react';
import type { DateValue } from 'react-aria-components';
import { FormField, FormFieldProps, LabelPosition } from './form-field';

export interface DateFormFieldProps extends Omit<FormFieldProps, 'children'> {
    /**
     * Date value in ISO string format (e.g., "2024-01-15T00:00" or "2024-01-15")
     */
    value: string;
    /**
     * Callback when date changes, receives ISO string format (e.g., "2024-01-15T00:00")
     * Receives empty string when date is cleared
     */
    onChange: (value: string) => void;
    ariaLabel?: string;
    /** Label position: 'side' for side-by-side (desktop), 'over' for label above (always stacked) */
    labelPosition?: LabelPosition;
}

/**
 * Date picker form field with consistent styling and error handling.
 * Uses the DatePicker component for date selection.
 *
 * Accepts and returns date values as ISO strings (e.g., "2024-01-15T00:00"),
 * handling the conversion to/from DateValue internally.
 */
export function DateFormField({
    title,
    description,
    isRequired = false,
    error,
    value,
    onChange,
    ariaLabel,
    className,
    hideDesktopLabel,
    hideMobileLabel,
    labelPosition,
}: DateFormFieldProps) {
    // Convert string value to DateValue for the DatePicker
    const dateValue = useMemo<DateValue | null>(() => {
        if (!value) return null;
        try {
            // Extract just the date part (YYYY-MM-DD) from the ISO string
            const datePart = value.split('T')[0];
            return parseDate(datePart);
        } catch {
            return null;
        }
    }, [value]);

    // Handle date changes from the DatePicker
    const handleDateChange = (newValue: DateValue | null) => {
        if (newValue) {
            // Convert DateValue to ISO string format
            const dateString = `${newValue.year}-${String(newValue.month).padStart(2, '0')}-${String(newValue.day).padStart(2, '0')}T00:00`;
            onChange(dateString);
        } else {
            onChange('');
        }
    };

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
            <DatePicker aria-label={ariaLabel || title} value={dateValue} onChange={handleDateChange} />
        </FormField>
    );
}
