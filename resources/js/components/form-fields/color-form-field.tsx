import { Button } from '@/components/untitled-ui/base/buttons/button';
import { cx } from '@/utils/cx';
import { useId } from 'react';
import { FormField, FormFieldProps, LabelPosition } from './form-field';

export interface ColorFormFieldProps extends Omit<FormFieldProps, 'children'> {
    value: string;
    onChange: (color: string) => void;
    onDelete?: () => void;
    deleteButtonText?: string;
    /** Label position: 'side' for side-by-side (desktop), 'over' for label above (always stacked) */
    labelPosition?: LabelPosition;
}

/**
 * Native HTML color picker form field.
 */
export function ColorFormField({
    title,
    description,
    isRequired = false,
    error,
    value,
    onChange,
    onDelete,
    deleteButtonText = 'Deletar',
    className,
    hideDesktopLabel,
    hideMobileLabel,
    labelPosition,
}: ColorFormFieldProps) {
    const colorInputId = useId();

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
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
            <div className="flex items-center gap-3">
                <label
                    htmlFor={colorInputId}
                    className="group relative inline-block max-w-max cursor-pointer transition-transform duration-200 active:scale-95"
                    aria-label={title}
                >
                    <div
                        className={cx(
                            'size-10 shrink-0 rounded-full shadow-xs ring-1 ring-primary ring-inset',
                            'transition-shadow duration-100 ease-linear',
                            'group-hover:shadow-sm',
                            'group-focus-within:ring-2 group-focus-within:ring-brand',
                        )}
                        style={{ backgroundColor: value }}
                    />
                    <input
                        id={colorInputId}
                        type="color"
                        value={value}
                        onChange={handleColorChange}
                        className="pointer-events-none absolute h-0 w-0 opacity-0"
                    />
                </label>
                {onDelete && (
                    <Button type="button" color="link-color" size="sm" onClick={onDelete}>
                        {deleteButtonText}
                    </Button>
                )}
            </div>
        </FormField>
    );
}
