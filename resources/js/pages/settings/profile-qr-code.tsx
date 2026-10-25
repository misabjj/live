import { ColorFormField, FormSection, SelectFormField, TextFormField } from '@/components/form-fields';
import {
    SettingsFormContainer,
    SettingsFormContent,
    SettingsFormFooter,
    SettingsPageHeader,
    TwoColumnFormPreviewLayout,
} from '@/components/settings';
import { ProfileQrCodeWidgetActions } from '@/components/widget-actions/profile-qr-code-widget-actions';
import { ProfileQrCode as ProfileQrCodeComponent } from '@/components/widgets/profile-qr-code';
import PanelLayout from '@/layouts/panel-layout';
import { store } from '@/routes/settings/profile-qr-code';
import { useForm } from '@inertiajs/react';
import { FormEvent, ReactNode } from 'react';

interface User {
    id: string;
    handle: string;
}

interface ProfileQrCode {
    gradient_color_1: string;
    gradient_color_2: string;
    gradient_type: 'linear' | 'radial';
    gradient_rotation: number;
    dots_type: string;
    text_color: string;
    background_color: string;
    message?: string;
}

interface Widget {
    id: string;
    url: string;
}

interface Option {
    value: string;
    label: string;
}

interface Props {
    user: User & { profile_url: string };
    profile_qr_code: ProfileQrCode;
    gradient_type_options: Option[];
    dot_type_options: Option[];
    widget?: Widget | null;
}

function Page({ user, profile_qr_code, gradient_type_options, dot_type_options, widget }: Props) {
    const form = useForm({
        gradient_color_1: profile_qr_code.gradient_color_1,
        gradient_color_2: profile_qr_code.gradient_color_2,
        gradient_type: profile_qr_code.gradient_type,
        gradient_rotation: profile_qr_code.gradient_rotation,
        dots_type: profile_qr_code.dots_type,
        text_color: profile_qr_code.text_color,
        background_color: profile_qr_code.background_color,
        message: profile_qr_code.message || '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        form.submit(store(), {
            preserveScroll: true,
        });
    };

    return (
        <TwoColumnFormPreviewLayout
            form={
                <SettingsFormContainer onSubmit={handleSubmit}>
                    <SettingsPageHeader title="QR code de doação" description="Crie e personalize seu QR code para facilitar as doações." />

                    <SettingsFormContent>
                        {/* QR Code Colors Section */}
                        <FormSection>
                            <ColorFormField
                                title="Cor principal do gradiente"
                                value={form.data.gradient_color_1}
                                onChange={(color) => form.setData('gradient_color_1', color)}
                                error={form.errors.gradient_color_1}
                            />
                        </FormSection>

                        <FormSection>
                            <ColorFormField
                                title="Cor secundária do gradiente"
                                value={form.data.gradient_color_2}
                                onChange={(color) => form.setData('gradient_color_2', color)}
                                error={form.errors.gradient_color_2}
                            />
                        </FormSection>

                        <FormSection>
                            <SelectFormField
                                title="Tipo de gradiente"
                                name="gradient_type"
                                value={form.data.gradient_type}
                                onChange={(value) => form.setData('gradient_type', value as 'linear' | 'radial')}
                                options={gradient_type_options}
                                error={form.errors.gradient_type}
                            />
                        </FormSection>

                        <FormSection>
                            <SelectFormField
                                title="Estilo dos pontos"
                                name="dots_type"
                                value={form.data.dots_type}
                                onChange={(value) => form.setData('dots_type', value)}
                                options={dot_type_options}
                                error={form.errors.dots_type}
                            />
                        </FormSection>

                        {/* Card Styling Section */}
                        <FormSection>
                            <ColorFormField
                                title="Cor do texto"
                                value={form.data.text_color}
                                onChange={(color) => form.setData('text_color', color)}
                                error={form.errors.text_color}
                            />
                        </FormSection>

                        <FormSection>
                            <ColorFormField
                                title="Cor de fundo"
                                value={form.data.background_color}
                                onChange={(color) => form.setData('background_color', color)}
                                error={form.errors.background_color}
                            />
                        </FormSection>

                        <FormSection withDivider={false}>
                            <TextFormField
                                title="Mensagem"
                                name="message"
                                description="Mensagem opcional para exibir abaixo do código QR"
                                value={form.data.message}
                                onChange={(value) => form.setData('message', value)}
                                error={form.errors.message}
                                placeholder="Digite sua mensagem..."
                            />
                        </FormSection>
                    </SettingsFormContent>

                    <SettingsFormFooter
                        submitLabel="Salvar"
                        isDirty={form.isDirty}
                        isProcessing={form.processing}
                        actions={widget && <ProfileQrCodeWidgetActions widgetId={widget.id} widgetUrl={widget.url} hidePersonalize />}
                    />
                </SettingsFormContainer>
            }
            preview={
                <ProfileQrCodeComponent
                    profileUrl={user.profile_url}
                    gradientColor1={form.data.gradient_color_1}
                    gradientColor2={form.data.gradient_color_2}
                    gradientType={form.data.gradient_type}
                    gradientRotation={form.data.gradient_rotation}
                    dotsType={form.data.dots_type}
                    message={form.data.message || null}
                    textColor={form.data.text_color}
                    backgroundColor={form.data.background_color}
                />
            }
        />
    );
}

Page.layout = (page: ReactNode) => <PanelLayout title="QR code" children={page} />;

export default Page;
