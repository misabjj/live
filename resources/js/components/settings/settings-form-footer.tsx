import { SectionFooter } from '@/components/ui/application/section-footers/section-footer';
import { Button } from '@/components/ui/base/buttons/button';
import { useLang } from '@/hooks/use-lang';
import { ReactNode } from 'react';

interface SettingsFormFooterProps {
    submitLabel?: string;
    isDirty?: boolean;
    isProcessing?: boolean;
    actions?: ReactNode;
}

export function SettingsFormFooter({ submitLabel, isDirty = true, isProcessing = false, actions }: SettingsFormFooterProps) {
    const { __ } = useLang();
    return (
        <SectionFooter.Root className="-mt-1 lg:mt-0">
            <SectionFooter.Actions className="flex items-center justify-end gap-2">
                {actions}
                <Button type="submit" color="primary" size="md" isDisabled={!isDirty || isProcessing}>
                    {submitLabel ?? __('pages.settings.save')}
                </Button>
            </SectionFooter.Actions>
        </SectionFooter.Root>
    );
}
