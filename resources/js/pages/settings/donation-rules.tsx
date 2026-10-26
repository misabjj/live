import { MoneyFormField, NumberFormField, SettingsContainer, SettingsSectionDivider, ToggleFormField } from '@/components/form-fields';
import { SettingsFormContainer, SettingsFormContent, SettingsFormFooter, SettingsPageHeader } from '@/components/settings';
import SettingsLayout from '@/layouts/settings-layout';
import { update } from '@/routes/settings/donation-rules';
import { useForm } from '@inertiajs/react';
import { FormEvent, ReactNode } from 'react';

interface DonationRules {
    accept_donor_audio: boolean;
    min_amount_text: string;
    min_amount_audio: string;
    max_characters_text: number;
    max_audio_duration: number;
}

interface Props {
    rules: DonationRules;
}

function Page({ rules }: Props) {
    const form = useForm({
        accept_donor_audio: rules.accept_donor_audio,
        min_amount_text: rules.min_amount_text,
        min_amount_audio: rules.min_amount_audio,
        max_characters_text: rules.max_characters_text,
        max_audio_duration: rules.max_audio_duration,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        form.submit(update(), {
            preserveScroll: true,
        });
    };

    return (
        <SettingsFormContainer onSubmit={handleSubmit}>
            <SettingsPageHeader title="Regras de doação" description="Configure como você recebe doações." />

            <SettingsFormContent>
                <SettingsContainer gap="lg">
                    <ToggleFormField
                        title="Áudio do doador"
                        description="Permite que doadores enviem mensagens com áudio gravado por eles"
                        value={form.data.accept_donor_audio}
                        onChange={(value) => form.setData('accept_donor_audio', value)}
                        error={form.errors.accept_donor_audio}
                    />

                    <SettingsSectionDivider />

                    <MoneyFormField
                        title="Valor mínimo para texto"
                        description="Configure o valor mínimo para doações em texto"
                        isRequired
                        name="min_amount_text"
                        value={form.data.min_amount_text}
                        onChange={(value) => form.setData('min_amount_text', value)}
                        error={form.errors.min_amount_text}
                    />

                    <MoneyFormField
                        title="Valor mínimo para áudio"
                        description="Configure o valor mínimo para doações com áudio gravado"
                        isRequired
                        name="min_amount_audio"
                        value={form.data.min_amount_audio}
                        onChange={(value) => form.setData('min_amount_audio', value)}
                        error={form.errors.min_amount_audio}
                    />

                    <SettingsSectionDivider />

                    <NumberFormField
                        title="Limite de caracteres para texto"
                        description="Configure o máximo de caracteres aceitos para mensagens de texto"
                        isRequired
                        name="max_characters_text"
                        value={form.data.max_characters_text}
                        onChange={(value) => form.setData('max_characters_text', value)}
                        error={form.errors.max_characters_text}
                        min={1}
                        max={400}
                    />

                    <NumberFormField
                        title="Duração máxima de áudio"
                        description="Duração máxima do áudio enviado pelo doador (em segundos)"
                        isRequired
                        name="max_audio_duration"
                        value={form.data.max_audio_duration}
                        onChange={(value) => form.setData('max_audio_duration', value)}
                        error={form.errors.max_audio_duration}
                        min={1}
                        max={60}
                    />
                </SettingsContainer>
            </SettingsFormContent>

            <SettingsFormFooter isDirty={form.isDirty} isProcessing={form.processing} />
        </SettingsFormContainer>
    );
}

Page.layout = (page: ReactNode) => <SettingsLayout children={page} />;

export default Page;
