import { ReactNode } from 'react';

interface SettingsFormContentProps {
    children: ReactNode;
}

export function SettingsFormContent({ children }: SettingsFormContentProps) {
    return <div className="flex flex-col gap-5">{children}</div>;
}
