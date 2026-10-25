import { SectionFooter } from '@/components/untitled-ui/application/section-footers/section-footer';
import { Button } from '@/components/untitled-ui/base/buttons/button';
import { ReactNode } from 'react';

interface SettingsFormFooterProps {
    submitLabel?: string;
    isDirty?: boolean;
    isProcessing?: boolean;
    actions?: ReactNode;
}

export function SettingsFormFooter({ submitLabel = 'Salvar', isDirty = true, isProcessing = false, actions }: SettingsFormFooterProps) {
    return (
        <SectionFooter.Root className="-mt-1 lg:mt-0">
            <SectionFooter.Actions className="flex items-center justify-end gap-2">
                {actions}
                <Button type="submit" color="primary" size="md" isDisabled={!isDirty || isProcessing}>
                    {submitLabel}
                </Button>
            </SectionFooter.Actions>
        </SectionFooter.Root>
    );
}
