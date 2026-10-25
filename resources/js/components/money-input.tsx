import { InputBase, InputBaseProps, TextFieldContext } from '@/components/untitled-ui/base/input/input';
import { forwardRef, useContext } from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

interface MoneyInputProps extends Omit<
    NumericFormatProps,
    'customInput' | 'onValueChange' | 'value' | 'onChange' | 'size' | 'autoComplete' | 'spellCheck'
> {
    value?: string | number;
    onChange?: (value: string) => void;
    decimalScale?: number;
    allowNegative?: boolean;
    size?: InputBaseProps['size'];
    autoComplete?: InputBaseProps['autoComplete'];
}

/**
 * Headless money input component that integrates with Untitled UI Input.
 * Uses react-number-format for decimal formatting with BRL conventions (comma as decimal separator).
 *
 * @example
 * With TextField (Settings page):
 * ```tsx
 * <TextField
 *   isRequired
 *   name="min_amount"
 *   value={form.data.min_amount}
 *   onChange={(value) => form.setData('min_amount', value)}
 * >
 *   <Label>Valor mínimo</Label>
 *   <MoneyInput size="md" />
 *   <HintText>Hint text</HintText>
 * </TextField>
 * ```
 *
 * Standalone (Profile page):
 * ```tsx
 * <MoneyInput
 *   value={form.data.amount}
 *   onChange={(value) => form.setData('amount', value)}
 *   size="md"
 * />
 * ```
 */
export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
    ({ value: valueProp, onChange: onChangeProp, decimalScale = 2, allowNegative = false, ...props }, ref) => {
        // Get value and onChange from TextField context (when used inside TextField)
        const textFieldContext = useContext(TextFieldContext);

        // Use prop values if provided, otherwise use context values
        const value = valueProp !== undefined ? valueProp : (textFieldContext?.value ?? '');
        const onChange = onChangeProp || textFieldContext?.onChange;
        return (
            <NumericFormat
                {...props}
                getInputRef={ref}
                value={value}
                onValueChange={(values) => {
                    const floatStr = values.floatValue !== undefined ? values.floatValue.toString() : '';
                    onChange?.(floatStr);
                }}
                customInput={InputBase}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={decimalScale}
                allowNegative={allowNegative}
                displayType="input"
            />
        );
    },
);

MoneyInput.displayName = 'MoneyInput';
