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
import { useLang } from '@/hooks/use-lang';
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
    const { __ } = useLang();
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
                    <SettingsPageHeader title={__('pages.settings.profile_qr_code.title')} description={__('pages.settings.profile_qr_code.description')} />

                    <SettingsFormContent>
                        {/* QR Code Colors Section */}
                        <FormSection>
                            <ColorFormField
                                title={__('pages.settings.profile_qr_code.primary_gradient')}
                                value={form.data.gradient_color_1}
                                onChange={(color) => form.setData('gradient_color_1', color)}
                                error={form.errors.gradient_color_1}
                            />
                        </FormSection>

                        <FormSection>
                            <ColorFormField
                                title={__('pages.settings.profile_qr_code.secondary_gradient')}
                                value={form.data.gradient_color_2}
                                onChange={(color) => form.setData('gradient_color_2', color)}
                                error={form.errors.gradient_color_2}
                            />
                        </FormSection>

                        <FormSection>
                            <SelectFormField
                                title={__('pages.settings.profile_qr_code.gradient_type')}
                                name="gradient_type"
                                value={form.data.gradient_type}
                                onChange={(value) => form.setData('gradient_type', value as 'linear' | 'radial')}
                                options={gradient_type_options}
                                error={form.errors.gradient_type}
                            />
                        </FormSection>

                        <FormSection>
                            <SelectFormField
                                title={__('pages.settings.profile_qr_code.dots_type')}
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
                                title={__('pages.settings.profile_qr_code.text_color')}
                                value={form.data.text_color}
                                onChange={(color) => form.setData('text_color', color)}
                                error={form.errors.text_color}
                            />
                        </FormSection>

                        <FormSection>
                            <ColorFormField
                                title={__('pages.settings.profile_qr_code.background_color')}
                                value={form.data.background_color}
                                onChange={(color) => form.setData('background_color', color)}
                                error={form.errors.background_color}
                            />
                        </FormSection>

                        <FormSection withDivider={false}>
                            <TextFormField
                                title={__('pages.settings.profile_qr_code.message')}
                                name="message"
                                description={__('pages.settings.profile_qr_code.message_description')}
                                value={form.data.message}
                                onChange={(value) => form.setData('message', value)}
                                error={form.errors.message}
                                placeholder={__('pages.settings.profile_qr_code.message_placeholder')}
                            />
                        </FormSection>
                    </SettingsFormContent>

                    <SettingsFormFooter
                        submitLabel={__('pages.settings.profile_qr_code.save')}
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

Page.layout = (page: ReactNode) => <PanelLayout title="pages.settings.profile_qr_code.title" children={page} />;

export default Page;
