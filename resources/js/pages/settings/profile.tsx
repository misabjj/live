import { AvatarFormField, ColorFormField, FormSection, ImageFormField, TextFormField } from '@/components/form-fields';
import { SettingsFormContainer, SettingsFormContent, SettingsFormFooter, SettingsPageHeader } from '@/components/settings';
import { Button } from '@/components/untitled-ui/base/buttons/button';
import SettingsLayout from '@/layouts/settings-layout';
import { getInitials } from '@/lib/utils';
import { show as showDonationPage } from '@/routes/donate';
import { destroy as destroyBackgroundImage, store as storeBackgroundImage } from '@/routes/settings/background-image';
import { update } from '@/routes/settings/profile';
import { destroy as destroyProfilePhoto, store as storeProfilePhoto } from '@/routes/settings/profile-photo';
import { router, useForm } from '@inertiajs/react';
import { FormEvent, ReactNode } from 'react';

interface User {
    display_name: string;
    email: string;
    handle: string;
    profile_photo: string | null;
    background_image: string | null;
    background_color: string;
    profile_url: string;
}

interface Props {
    user: User;
}

function Page({ user }: Props) {
    const form = useForm({
        display_name: user.display_name,
        handle: user.handle,
        profile_photo: null as File | null,
        background_image: null as File | null,
        background_color: user.background_color as string | null,
    });

    const handleAvatarUpload = (files: FileList | null) => {
        const file = files?.[0];
        if (!file) return;

        router.post(storeProfilePhoto(), { photo: file }, { preserveScroll: true });
    };

    const handleBackgroundUpload = (files: FileList | null) => {
        const file = files?.[0];
        if (!file) return;

        router.post(storeBackgroundImage(), { photo: file }, { preserveScroll: true });
    };

    const handleDeleteAvatar = () => {
        router.delete(destroyProfilePhoto(), { preserveScroll: true });
    };

    const handleDeleteBackground = () => {
        router.delete(destroyBackgroundImage(), { preserveScroll: true });
    };

    const handleDeleteBackgroundColor = () => {
        form.setData('background_color', null);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        form.submit(update(), {
            preserveScroll: true,
        });
    };

    return (
        <SettingsFormContainer onSubmit={handleSubmit}>
            <SettingsPageHeader title="Perfil" description="Atualize seu perfil aqui." />

            <SettingsFormContent>
                <FormSection>
                    <TextFormField
                        title="Nome de exibição"
                        isRequired
                        name="display_name"
                        value={form.data.display_name}
                        onChange={(value) => form.setData('display_name', value)}
                        error={form.errors.display_name}
                    />
                </FormSection>

                <FormSection>
                    <TextFormField
                        title="Handle"
                        description="Seu nome de usuário único (@handle)"
                        isRequired
                        name="handle"
                        value={form.data.handle}
                        onChange={(value) => form.setData('handle', value)}
                        error={form.errors.handle}
                        addonComponents={
                            <>
                                <Button
                                    type="button"
                                    color="link-color"
                                    size="sm"
                                    onClick={() => window.open(showDonationPage.url(user.handle), '_blank')}
                                >
                                    Ver perfil
                                </Button>
                            </>
                        }
                    />
                </FormSection>

                <FormSection>
                    <AvatarFormField
                        title="Foto de perfil"
                        description="Esta será exibida no seu perfil."
                        isRequired
                        src={user.profile_photo}
                        initials={getInitials(user.display_name)}
                        onUpload={handleAvatarUpload}
                        onDelete={handleDeleteAvatar}
                        error={form.errors.profile_photo}
                        uploadButtonText="Atualizar"
                        deleteButtonText="Deletar"
                    />
                </FormSection>

                <FormSection>
                    <ImageFormField
                        title="Imagem de fundo"
                        description="Esta será exibida no fundo do seu perfil."
                        src={user.background_image}
                        onUpload={handleBackgroundUpload}
                        onDelete={handleDeleteBackground}
                        error={form.errors.background_image}
                        uploadButtonText="Atualizar"
                        deleteButtonText="Deletar"
                        previewAlt="Prévia do fundo"
                    />
                </FormSection>

                <FormSection withDivider={false}>
                    <ColorFormField
                        title="Cor de fundo"
                        description="Selecione ou personalize sua cor de fundo."
                        value={form.data.background_color ?? '#ffffff'}
                        onChange={(color) => form.setData('background_color', color)}
                        onDelete={handleDeleteBackgroundColor}
                        deleteButtonText="Remover"
                        error={form.errors.background_color}
                    />
                </FormSection>
            </SettingsFormContent>

            <SettingsFormFooter isDirty={form.isDirty} isProcessing={form.processing} />
        </SettingsFormContainer>
    );
}

Page.layout = (page: ReactNode) => <SettingsLayout children={page} />;

export default Page;
