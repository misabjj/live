import { ColorFormField, FormSection } from '@/components/form-fields';
import {
    SettingsFormContainer,
    SettingsFormContent,
    SettingsFormFooter,
    SettingsPageHeader,
    TwoColumnFormPreviewLayout,
} from '@/components/settings';
import { DonationAlertWidgetActions } from '@/components/widget-actions/donation-alert-widget-actions';
import { DonationAlert } from '@/components/widgets/donation-alert';
import { useLang } from '@/hooks/use-lang';
import PanelLayout from '@/layouts/panel-layout';
import { update } from '@/routes/settings/donation-alert';
import { useForm } from '@inertiajs/react';
import { FormEvent, ReactNode } from 'react';

interface AlertConfiguration {
    primary_color: string;
    secondary_color: string;
    message_color: string;
}

interface Widget {
    id: string;
    url: string;
}

interface Props {
    configuration: AlertConfiguration;
    widget?: Widget | null;
}

function Page({ configuration, widget }: Props) {
    const { __ } = useLang();
    const form = useForm({
        primary_color: configuration.primary_color,
        secondary_color: configuration.secondary_color,
        message_color: configuration.message_color,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        form.submit(update(), {
            preserveScroll: true,
        });
    };

    return (
        <TwoColumnFormPreviewLayout
            form={
                <SettingsFormContainer onSubmit={handleSubmit}>
                    <SettingsPageHeader
                        title={__('pages.settings.donation_alert.title')}
                        description={__('pages.settings.donation_alert.description')}
                    />

                    <SettingsFormContent>
                        <FormSection>
                            <ColorFormField
                                title={__('pages.settings.donation_alert.primary_color')}
                                value={form.data.primary_color}
                                onChange={(color) => form.setData('primary_color', color)}
                                error={form.errors.primary_color}
                            />
                        </FormSection>

                        <FormSection>
                            <ColorFormField
                                title={__('pages.settings.donation_alert.secondary_color')}
                                value={form.data.secondary_color}
                                onChange={(color) => form.setData('secondary_color', color)}
                                error={form.errors.secondary_color}
                            />
                        </FormSection>

                        <FormSection withDivider={false}>
                            <ColorFormField
                                title={__('pages.settings.donation_alert.message_color')}
                                value={form.data.message_color}
                                onChange={(color) => form.setData('message_color', color)}
                                error={form.errors.message_color}
                            />
                        </FormSection>
                    </SettingsFormContent>

                    <SettingsFormFooter
                        submitLabel={__('pages.settings.donation_alert.save')}
                        isDirty={form.isDirty}
                        isProcessing={form.processing}
                        actions={widget && <DonationAlertWidgetActions widgetId={widget.id} widgetUrl={widget.url} hidePersonalize />}
                    />
                </SettingsFormContainer>
            }
            preview={<DonationAlert donorName={__('pages.settings.donation_alert.preview_donor')} amount={25} currency="BRL" message={__('pages.settings.donation_alert.preview_message')} configuration={form.data} />}
        />
    );
}

Page.layout = (page: ReactNode) => <PanelLayout title="pages.settings.donation_alert.title" children={page} />;

export default Page;
