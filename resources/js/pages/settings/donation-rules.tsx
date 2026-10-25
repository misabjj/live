import { MoneyFormField, NumberFormField, SettingsContainer, SettingsSectionDivider, ToggleFormField } from '@/components/form-fields';
import { SettingsFormContainer, SettingsFormContent, SettingsFormFooter, SettingsPageHeader } from '@/components/settings';
import SettingsLayout from '@/layouts/settings-layout';
import { update } from '@/routes/settings/donation-rules';
import { useForm } from '@inertiajs/react';
import { FormEvent, ReactNode } from 'react';

interface DonationRules {
    accept_ai_audio: boolean;
    accept_donor_audio: boolean;
    min_amount_text: string;
    min_amount_text_to_speech: string;
    min_amount_audio: string;
    max_characters_text: number;
    max_characters_text_to_speech: number;
    max_audio_duration: number;
}

interface Props {
    rules: DonationRules;
}

function Page({ rules }: Props) {
    const form = useForm({
        accept_ai_audio: rules.accept_ai_audio,
        accept_donor_audio: rules.accept_donor_audio,
        min_amount_text: rules.min_amount_text,
        min_amount_text_to_speech: rules.min_amount_text_to_speech,
        min_amount_audio: rules.min_amount_audio,
        max_characters_text: rules.max_characters_text,
        max_characters_text_to_speech: rules.max_characters_text_to_speech,
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
                        title="Áudio gerado por IA"
                        description="Permite que doadores enviem mensagens com voz gerada por IA"
                        value={form.data.accept_ai_audio}
                        onChange={(value) => form.setData('accept_ai_audio', value)}
                        error={form.errors.accept_ai_audio}
                    />

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
                        title="Valor mínimo para texto com voz (IA)"
                        description="Configure o valor mínimo para doações em texto convertido para voz por IA"
                        isRequired
                        name="min_amount_text_to_speech"
                        value={form.data.min_amount_text_to_speech}
                        onChange={(value) => form.setData('min_amount_text_to_speech', value)}
                        error={form.errors.min_amount_text_to_speech}
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
                        title="Limite de caracteres para texto com voz (IA)"
                        description="Configure o máximo de caracteres aceitos para texto convertido para voz"
                        isRequired
                        name="max_characters_text_to_speech"
                        value={form.data.max_characters_text_to_speech}
                        onChange={(value) => form.setData('max_characters_text_to_speech', value)}
                        error={form.errors.max_characters_text_to_speech}
                        min={1}
                        max={200}
                    />

                    <SettingsSectionDivider />

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
