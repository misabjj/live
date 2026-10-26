import { SectionHeader } from '@/components/ui/application/section-headers/section-headers';

interface SettingsPageHeaderProps {
    title: string;
    description: string;
}

export function SettingsPageHeader({ title, description }: SettingsPageHeaderProps) {
    return (
        <SectionHeader.Root>
            <SectionHeader.Group>
                <div className="flex flex-1 flex-col justify-center gap-0.5 self-stretch">
                    <SectionHeader.Heading>{title}</SectionHeader.Heading>
                    <SectionHeader.Subheading>{description}</SectionHeader.Subheading>
                </div>
            </SectionHeader.Group>
        </SectionHeader.Root>
    );
}
