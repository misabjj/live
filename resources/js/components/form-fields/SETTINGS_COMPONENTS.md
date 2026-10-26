# Settings Components Guide

A collection of reusable components for building consistent settings pages without needing to remember classes or structure.

## Components Overview

### SettingsContainer

Wrapper component that provides flex column layout with configurable gaps.

**Props:**

- `children` (ReactNode, required): Content to wrap
- `gap` ('xs' | 'sm' | 'md' | 'lg' | 'xl', optional): Gap between children - default: 'md'
- `className` (string, optional): Additional CSS classes

**Gap Mapping:**

- `xs` → gap-3 (12px)
- `sm` → gap-4 (16px)
- `md` → gap-5 (20px) - default
- `lg` → gap-6 (24px)
- `xl` → gap-8 (32px)

**Example:**

```tsx
import { SettingsContainer, SettingsSwitchSection } from '@/components/form-fields';

<SettingsContainer gap="lg">
    <SettingsSwitchSection title="Dark Mode" description="Enable dark theme" value={isDarkMode} onChange={setIsDarkMode} />
</SettingsContainer>;
```

---

### SettingsSwitchSection

Toggle switch section with automatic label and description. Perfect for boolean settings.

**Props:**

- `title` (string, required): Section title
- `description` (string, optional): Helper text
- `value` (boolean, required): Toggle state
- `onChange` ((value: boolean) => void, required): Change handler
- `isRequired` (boolean, optional): Mark as required - default: false
- `toggleSize` ('sm' | 'md', optional): Toggle size - default: 'md'
- `withDivider` (boolean, optional): Show divider below - default: true

**Example:**

```tsx
<SettingsSwitchSection
    title="Enable Notifications"
    description="Receive email notifications for updates"
    value={notificationsEnabled}
    onChange={setNotificationsEnabled}
/>
```

**Example without divider:**

```tsx
<SettingsSwitchSection
    title="Newsletter"
    description="Subscribe to our weekly newsletter"
    value={subscribed}
    onChange={setSubscribed}
    withDivider={false}
/>
```

---

### SettingsButtonSection

Action button section with automatic label and description. Use for settings that trigger actions.

**Props:**

- `title` (string, required): Section title
- `description` (string, optional): Helper text
- `buttonText` (string, required): Button label
- `onClick` (() => void, required): Click handler
- `isRequired` (boolean, optional): Mark as required - default: false
- `buttonColor` ('primary' | 'secondary' | 'danger' | 'success' | 'link-color' | 'link-gray', optional): Button color - default: 'primary'
- `buttonSize` ('sm' | 'md' | 'lg', optional): Button size - default: 'md'
- `withDivider` (boolean, optional): Show divider below - default: true

**Example:**

```tsx
<SettingsButtonSection title="Export Data" description="Download all your data as JSON" buttonText="Export" onClick={handleExport} buttonSize="md" />
```

**Example with danger color:**

```tsx
<SettingsButtonSection
    title="Delete Account"
    description="Permanently delete your account and all data"
    buttonText="Delete"
    onClick={handleDeleteAccount}
    buttonColor="danger"
    withDivider={false}
/>
```

---

### SettingsCustomSection

Flexible section for arbitrary content that doesn't fit other patterns.

**Props:**

- `title` (string, required): Section title
- `description` (string, optional): Helper text
- `children` (ReactNode, required): Custom content
- `isRequired` (boolean, optional): Mark as required - default: false
- `withDivider` (boolean, optional): Show divider below - default: true
- `row` (boolean, optional): Display children horizontally - default: false

**Example - Single input:**

```tsx
<SettingsCustomSection title="API Key" description="Your API key">
    <input type="password" value={apiKey} readOnly />
</SettingsCustomSection>
```

**Example - Row layout:**

```tsx
import { Input } from '@/components/ui/base/input/input';
import { Button } from '@/components/ui/base/buttons/button';

<SettingsCustomSection title="Profile URL" description="Share your profile" row>
    <Input value={profileUrl} isDisabled />
    <Button onClick={handleCopy} iconLeading={CopyIcon} />
</SettingsCustomSection>;
```

---

## Complete Example

```tsx
import { SettingsContainer, SettingsSwitchSection, SettingsButtonSection, SettingsCustomSection } from '@/components/form-fields';
import { Input } from '@/components/ui/base/input/input';
import { Button } from '@/components/ui/base/buttons/button';
import { Copy01 } from '@untitledui/icons';

export default function SettingsPage() {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const profileUrl = 'https://example.com/profile';

    return (
        <SettingsContainer gap="lg">
            {/* Header */}
            <div>
                <h1>Settings</h1>
                <p>Manage your preferences</p>
            </div>

            {/* Settings Group */}
            <SettingsContainer gap="md">
                <SettingsSwitchSection title="Dark Mode" description="Enable dark theme" value={darkMode} onChange={setDarkMode} />

                <SettingsSwitchSection
                    title="Notifications"
                    description="Receive email notifications"
                    value={notifications}
                    onChange={setNotifications}
                />

                <SettingsCustomSection title="Profile URL" description="Share your profile" row withDivider={false}>
                    <Input value={profileUrl} isDisabled />
                    <Button onClick={() => navigator.clipboard.writeText(profileUrl)} iconLeading={Copy01} />
                </SettingsCustomSection>

                <SettingsButtonSection title="Export Data" buttonText="Export" onClick={handleExport} withDivider={false} />
            </SettingsContainer>
        </SettingsContainer>
    );
}
```

---

## Benefits

✅ **No class memory** - No need to remember flex, gap, and styling classes
✅ **Consistent styling** - All settings look and behave the same
✅ **Type-safe** - Full TypeScript support
✅ **DX friendly** - Simple, intuitive API
✅ **Accessible** - Built-in accessibility features
✅ **Flexible** - Customizable gaps and sizes

---

## Migration from Manual Components

**Before:**

```tsx
<div className="flex flex-col gap-5">
    <div className="border-b pb-5">
        <div className="flex items-center justify-between">
            <div>
                <h3>Dark Mode</h3>
                <p className="text-sm text-secondary">Enable dark theme</p>
            </div>
            <Toggle isSelected={darkMode} onChange={setDarkMode} />
        </div>
    </div>

    <div className="flex flex-col gap-1">
        <h3>Export Data</h3>
        <p className="text-sm text-secondary">Download your data</p>
        <div className="self-start">
            <Button onClick={handleExport}>Export</Button>
        </div>
    </div>
</div>
```

**After:**

```tsx
<SettingsContainer gap="md">
    <SettingsSwitchSection title="Dark Mode" description="Enable dark theme" value={darkMode} onChange={setDarkMode} />

    <SettingsButtonSection title="Export Data" description="Download your data" buttonText="Export" onClick={handleExport} withDivider={false} />
</SettingsContainer>
```

**Result:** 50% less code, 100% clearer intent!
