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
                        title="Personalizar alertas"
                        description="Configure a aparência dos alertas de doação que aparecerão na sua live."
                    />

                    <SettingsFormContent>
                        <FormSection>
                            <ColorFormField
                                title="Cor principal do gradiente"
                                value={form.data.primary_color}
                                onChange={(color) => form.setData('primary_color', color)}
                                error={form.errors.primary_color}
                            />
                        </FormSection>

                        <FormSection>
                            <ColorFormField
                                title="Cor secundária do gradiente"
                                value={form.data.secondary_color}
                                onChange={(color) => form.setData('secondary_color', color)}
                                error={form.errors.secondary_color}
                            />
                        </FormSection>

                        <FormSection withDivider={false}>
                            <ColorFormField
                                title="Cor da mensagem"
                                value={form.data.message_color}
                                onChange={(color) => form.setData('message_color', color)}
                                error={form.errors.message_color}
                            />
                        </FormSection>
                    </SettingsFormContent>

                    <SettingsFormFooter
                        submitLabel="Salvar"
                        isDirty={form.isDirty}
                        isProcessing={form.processing}
                        actions={widget && <DonationAlertWidgetActions widgetId={widget.id} widgetUrl={widget.url} hidePersonalize />}
                    />
                </SettingsFormContainer>
            }
            preview={<DonationAlert donorName="João" amount={25} currency="BRL" message="Parabéns pela live!" configuration={form.data} />}
        />
    );
}

Page.layout = (page: ReactNode) => <PanelLayout title="Personalizar alertas" children={page} />;

export default Page;
