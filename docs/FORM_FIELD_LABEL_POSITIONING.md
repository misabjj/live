# Form Field Label Positioning Guide

This guide explains how to use the label positioning feature in form fields to control whether labels appear beside inputs/selects or above them.

## Overview

Form fields now support two label positioning modes:
- **`'side'`** (default): Desktop shows label on the left, mobile shows label on top
- **`'over'`**: Label always appears above the input (stacked vertically on all screen sizes)

## Components with Label Positioning

All the following components support the `labelPosition` prop:

- `FormField`
- `SettingsSection`
- `TextFormField`
- `SelectFormField`

## Usage

### Default (Side-by-Side on Desktop)

This is the default behavior. Labels appear on the left on desktop and on top on mobile.

```tsx
import { TextFormField } from '@/components/form-fields';

<TextFormField
    title="Email"
    value={email}
    onChange={setEmail}
    placeholder="Enter your email"
/>
```

**Layout:**
- Desktop: Label on left | Input on right
- Mobile: Label on top, Input below

### Over (Stacked Label)

Use `labelPosition="over"` to always stack the label above the input.

```tsx
import { TextFormField } from '@/components/form-fields';

<TextFormField
    title="Email"
    value={email}
    onChange={setEmail}
    placeholder="Enter your email"
    labelPosition="over"
/>
```

**Layout:**
- Desktop: Label on top, Input below
- Mobile: Label on top, Input below

## Examples

### TextFormField with Different Positions

```tsx
import { TextFormField } from '@/components/form-fields';

function RegistrationForm() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');

    return (
        <div className="space-y-6">
            {/* Side-by-side on desktop (default) */}
            <TextFormField
                title="Email"
                description="Your email address for account recovery"
                value={email}
                onChange={setEmail}
                placeholder="example@domain.com"
                isRequired
            />

            {/* Always stacked */}
            <TextFormField
                title="Username"
                description="Choose your public display name"
                value={username}
                onChange={setUsername}
                placeholder="your_username"
                labelPosition="over"
            />
        </div>
    );
}
```

### SelectFormField with Label Positioning

```tsx
import { SelectFormField } from '@/components/form-fields';

function PaymentSettings() {
    const [currency, setCurrency] = useState('usd');
    const [timezone, setTimezone] = useState('utc');

    return (
        <div className="space-y-6">
            {/* Default: side-by-side on desktop */}
            <SelectFormField
                title="Currency"
                description="Select your preferred currency"
                value={currency}
                onChange={setCurrency}
                options={[
                    { value: 'usd', label: 'US Dollar' },
                    { value: 'eur', label: 'Euro' },
                    { value: 'gbp', label: 'British Pound' },
                ]}
            />

            {/* Over: always stacked */}
            <SelectFormField
                title="Timezone"
                description="Select your timezone"
                value={timezone}
                onChange={setTimezone}
                labelPosition="over"
                options={[
                    { value: 'utc', label: 'UTC' },
                    { value: 'est', label: 'Eastern Time' },
                    { value: 'pst', label: 'Pacific Time' },
                ]}
            />
        </div>
    );
}
```

### SettingsSection with Label Positioning

```tsx
import { SettingsSection } from '@/components/form-fields';
import { Toggle } from '@/components/untitled-ui/base/toggle';

function PreferencesPage() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div className="space-y-6">
            {/* Default: side-by-side layout */}
            <SettingsSection
                title="Notifications"
                description="Receive email notifications"
            >
                <Toggle
                    isSelected={notifications}
                    onChange={setNotifications}
                />
            </SettingsSection>

            {/* Over: stacked layout */}
            <SettingsSection
                title="Dark Mode"
                description="Enable dark theme"
                labelPosition="over"
            >
                <Toggle
                    isSelected={darkMode}
                    onChange={setDarkMode}
                />
            </SettingsSection>
        </div>
    );
}
```

### Raw FormField Component

For custom form fields, use the `FormField` component directly:

```tsx
import { FormField } from '@/components/form-fields';
import { CustomInput } from '@/components/custom-input';

<FormField
    title="Advanced Setting"
    description="Configure advanced options"
    labelPosition="over"
>
    <CustomInput value={value} onChange={setValue} />
</FormField>
```

## Responsive Behavior

### `labelPosition="side"` (Default)

```
DESKTOP:
┌──────────────────────────────────────────┐
│ Label (280px) │ Input (512px)            │
└──────────────────────────────────────────┘

MOBILE:
┌──────────────────┐
│ Label            │
│ Input (full)     │
└──────────────────┘
```

### `labelPosition="over"`

```
DESKTOP:
┌──────────────────────┐
│ Label                │
│ Input (full width)   │
└──────────────────────┘

MOBILE:
┌──────────────────┐
│ Label            │
│ Input (full)     │
└──────────────────┘
```

## When to Use Each Position

### Use `'side'` (default) when:
- You have a settings/dashboard page with multiple fields
- Desktop space is available and you want to use it efficiently
- Labels are short and inputs are grouped together
- Following the "Settings Sections" pattern with multiple controls

### Use `'over'` when:
- Creating a form where you want consistent vertical flow
- Space is limited or you prefer a stacked layout
- The form is the main focus of the page
- You want consistent appearance across all screen sizes
- Labels are long and may wrap on desktop

## API Reference

### FormFieldProps

```typescript
export type LabelPosition = 'side' | 'over';

export interface FormFieldProps {
    title: string;
    description?: string;
    isRequired?: boolean;
    error?: string;
    children: ReactNode;
    className?: string;
    hideDesktopLabel?: boolean;
    hideMobileLabel?: boolean;
    /** Label position: 'side' for side-by-side (desktop), 'over' for label above (always stacked) */
    labelPosition?: LabelPosition;
}
```

### TextFormFieldProps

```typescript
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
```

### SelectFormFieldProps

```typescript
export interface SelectFormFieldProps extends Omit<FormFieldProps, 'children'> {
    name: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    /** Label position: 'side' for side-by-side (desktop), 'over' for label above (always stacked) */
    labelPosition?: LabelPosition;
}
```

### SettingsSectionProps

```typescript
export interface SettingsSectionProps extends SettingsSectionLabelProps {
    children: ReactNode;
    /** Use flex row layout instead of flex column */
    row?: boolean;
    /** Label position: 'side' for side-by-side (desktop), 'over' for label above (always stacked) */
    labelPosition?: LabelPosition;
}
```

## Migration from Existing Forms

If you have existing forms and want to change label positioning:

### Before (Default Behavior)
```tsx
<TextFormField title="Email" value={email} onChange={setEmail} />
```

### After (Change to Over)
```tsx
<TextFormField
    title="Email"
    value={email}
    onChange={setEmail}
    labelPosition="over"
/>
```

## Notes

- The default behavior (`labelPosition="side"`) maintains backward compatibility with existing forms
- All form field components automatically inherit the label positioning behavior
- Label positioning works seamlessly with validation errors and descriptions
- The `hideDesktopLabel` and `hideMobileLabel` props still work as before and interact with label positioning

## Related Documentation

- [Settings Sections Guide](./SETTINGS_SECTIONS_GUIDE.md) - For more complex settings layouts
- [Two Column Form Layout](./TWO_COLUMN_FORM_LAYOUT.md) - For forms with preview
- [Settings Page Guide](./SETTINGS_PAGE_GUIDE.md) - For form-based settings pages
