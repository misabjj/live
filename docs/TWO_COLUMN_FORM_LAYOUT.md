# TwoColumnFormLayout Component

## Overview

`TwoColumnFormLayout` is a reusable React component that provides a responsive two-column layout for forms with live preview functionality. It's designed to create a consistent user experience across different pages where forms need to display real-time previews of user input.

## Location

```
resources/js/components/settings/two-column-form-layout.tsx
```

## Features

- **Responsive Design**: Automatically adapts between desktop and mobile layouts
- **Sticky Preview**: On desktop, the preview column stays in view while scrolling
- **Mobile-Friendly**: On mobile devices, the form and preview stack vertically
- **Reusable**: Can be used across any page that needs a form + preview layout

## Layout Behavior

### Desktop (lg breakpoint and above)
- Displays content in two equal columns side by side
- Left column: Form content
- Right column: Preview content (sticky positioned, stays in viewport while scrolling)

### Mobile
- Stacks content vertically
- Form appears first
- Preview appears below the form

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `form` | `ReactNode` | Yes | The main form content (typically wrapped in `SettingsFormContainer`) |
| `preview` | `ReactNode` | Yes | The preview/sidebar content to display |

## Usage Example

### Basic Implementation

```tsx
import { TwoColumnFormLayout } from '@/components/settings';
import { SettingsFormContainer, SettingsFormContent, SettingsFormFooter, SettingsPageHeader } from '@/components/settings';
import { Label } from '@/components/ui/base/input/label';

function MyFormPage() {
    const form = useForm({
        // your form data
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // handle form submission
    };

    return (
        <TwoColumnFormLayout
            form={
                <SettingsFormContainer onSubmit={handleSubmit}>
                    <SettingsPageHeader
                        title="Page Title"
                        description="Page description"
                    />

                    <SettingsFormContent>
                        {/* Your form fields here */}
                    </SettingsFormContent>

                    <SettingsFormFooter
                        submitLabel="Save"
                        isDirty={form.isDirty}
                        isProcessing={form.processing}
                    />
                </SettingsFormContainer>
            }
            preview={
                <>
                    <Label className="mb-3 block text-sm font-semibold text-secondary">
                        Preview
                    </Label>
                    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg bg-secondary">
                        {/* Your preview component here */}
                    </div>
                </>
            }
        />
    );
}
```

### Real-World Example (Goals Create Page)

```tsx
import { TwoColumnFormLayout } from '@/components/settings';
import { Goal } from '@/components/widgets/goal';

function CreateGoalPage() {
    const { user } = useAuth();
    const form = useForm({
        title: '',
        target_amount: '',
        background_color: '#10002B',
        // ... other fields
    });

    return (
        <TwoColumnFormLayout
            form={
                <SettingsFormContainer onSubmit={handleSubmit}>
                    <SettingsPageHeader
                        title="Nova meta"
                        description="Crie uma nova meta de arrecadação."
                    />
                    <SettingsFormContent>
                        <FormSection>
                            <TextFormField
                                title="Título da meta"
                                value={form.data.title}
                                onChange={(value) => form.setData('title', value)}
                            />
                        </FormSection>
                        {/* More form fields */}
                    </SettingsFormContent>
                    <SettingsFormFooter
                        submitLabel="Criar"
                        isDirty={form.isDirty}
                        isProcessing={form.processing}
                    />
                </SettingsFormContainer>
            }
            preview={
                <>
                    <Label className="mb-3 block text-sm font-semibold text-secondary">
                        Visualização
                    </Label>
                    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg bg-secondary">
                        <Goal
                            title={form.data.title}
                            targetAmount={form.data.target_amount}
                            backgroundColor={form.data.background_color}
                            // ... other props
                        />
                    </div>
                </>
            }
        />
    );
}
```

## Use Cases

This component is ideal for:

1. **Settings Pages**: User profile editing with avatar preview
2. **Content Creation**: Forms for creating content with live preview (articles, posts, etc.)
3. **Design Customization**: Color/theme editors with real-time visual feedback
4. **Configuration Pages**: Any form where users benefit from seeing changes in real-time

## Related Components

- `SettingsFormContainer`: Wrapper for form elements
- `SettingsPageHeader`: Standard header for settings pages
- `SettingsFormContent`: Container for form fields
- `SettingsFormFooter`: Footer with submit button and form state
- `FormSection`: Individual form field sections

## Styling Notes

- The component uses Tailwind CSS utility classes
- The preview is positioned with `sticky top-6` on desktop, keeping it 24px from the top of the viewport
- The gap between columns is 32px (`gap-8`)
- The mobile preview has the same gap of 32px from the form

## Implementation Details

The component handles responsive behavior through Tailwind's responsive utilities:
- `lg:grid-cols-2`: Creates two columns on large screens
- `max-lg:hidden`: Hides desktop preview on mobile
- `lg:hidden`: Hides mobile preview on desktop

This ensures that only one preview is rendered in the DOM at a time, preventing unnecessary re-renders.

## Migration Guide

If you have an existing form page with a two-column layout, here's how to migrate:

### Before
```tsx
return (
    <div className="flex flex-col gap-8">
        <div className="grid gap-8 lg:grid-cols-2">
            <SettingsFormContainer>
                {/* form content */}
            </SettingsFormContainer>

            <div className="max-lg:hidden">
                <div className="sticky top-6">
                    {/* preview content */}
                </div>
            </div>
        </div>

        <div className="lg:hidden">
            {/* preview content again */}
        </div>
    </div>
);
```

### After
```tsx
import { TwoColumnFormLayout } from '@/components/settings';

return (
    <TwoColumnFormLayout
        form={
            <SettingsFormContainer>
                {/* form content */}
            </SettingsFormContainer>
        }
        preview={
            {/* preview content (only once!) */}
        }
    />
);
```

## Benefits

1. **DRY Principle**: Eliminates duplicate preview rendering code
2. **Consistency**: Ensures consistent layout behavior across pages
3. **Maintainability**: Layout changes only need to be made in one place
4. **Type Safety**: TypeScript ensures correct prop usage
5. **Accessibility**: Maintains proper semantic structure for screen readers
