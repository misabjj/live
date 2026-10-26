import { Form } from '@/components/ui/base/form/form';
import { FormEvent, ReactNode } from 'react';

interface SettingsFormContainerProps {
    children: ReactNode;
    onSubmit: (e: FormEvent) => void;
}

export function SettingsFormContainer({ children, onSubmit }: SettingsFormContainerProps) {
    return (
        <Form className="flex flex-col gap-6" onSubmit={onSubmit}>
            {children}
        </Form>
    );
}
