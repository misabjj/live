import { ColorFormField, DateFormField, FormSection, MoneyFormField, TextFormField, ToggleFormField } from '@/components/form-fields';
import {
    SettingsFormContainer,
    SettingsFormContent,
    SettingsFormFooter,
    SettingsPageHeader,
    TwoColumnFormPreviewLayout,
} from '@/components/settings';
import { Goal } from '@/components/widgets/goal';
import { useAuth } from '@/hooks/use-auth';
import PanelLayout from '@/layouts/panel-layout';
import { store } from '@/routes/goals';
import { useForm } from '@inertiajs/react';
import { FormEvent, ReactNode } from 'react';

interface Props {
    defaults: {
        background_color: string;
        progress_bar_color: string;
        text_color: string;
        show_profile_link: boolean;
    };
}

function Page({ defaults }: Props) {
    const { user } = useAuth();

    const form = useForm({
        title: '',
        target_amount: '',
        raised_amount: '',
        closes_at: '',
        background_color: defaults.background_color,
        progress_bar_color: defaults.progress_bar_color,
        text_color: defaults.text_color,
        show_profile_link: defaults.show_profile_link,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        form.submit(store(), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <TwoColumnFormPreviewLayout
            form={
                <SettingsFormContainer onSubmit={handleSubmit}>
                    <SettingsPageHeader title="Nova meta" description="Crie uma nova meta de arrecadação." />

                    <SettingsFormContent>
                        <FormSection>
                            <TextFormField
                                title="Título da meta"
                                isRequired
                                name="title"
                                value={form.data.title}
                                onChange={(value) => form.setData('title', value)}
                                error={form.errors.title}
                            />
                        </FormSection>

                        <FormSection>
                            <MoneyFormField
                                title="Valor meta"
                                isRequired
                                name="target_amount"
                                value={form.data.target_amount}
                                onChange={(value) => form.setData('target_amount', value)}
                                error={form.errors.target_amount}
                            />
                        </FormSection>

                        <FormSection>
                            <MoneyFormField
                                title="Valor inicial (opcional)"
                                name="raised_amount"
                                value={form.data.raised_amount}
                                onChange={(value) => form.setData('raised_amount', value)}
                                error={form.errors.raised_amount}
                            />
                        </FormSection>

                        <FormSection>
                            <DateFormField
                                title="Data de encerramento"
                                isRequired
                                value={form.data.closes_at}
                                onChange={(value) => form.setData('closes_at', value)}
                                error={form.errors.closes_at}
                                ariaLabel="Selecionar data"
                            />
                        </FormSection>

                        <FormSection>
                            <ColorFormField
                                title="Cor de fundo"
                                description="Cor de fundo da barra (aparece por baixo da barra de progresso)"
                                value={form.data.background_color}
                                onChange={(color) => form.setData('background_color', color)}
                                error={form.errors.background_color}
                            />
                        </FormSection>

                        <FormSection>
                            <ColorFormField
                                title="Cor da barra de progresso"
                                description="Cor da barra de progresso da meta"
                                value={form.data.progress_bar_color}
                                onChange={(color) => form.setData('progress_bar_color', color)}
                                error={form.errors.progress_bar_color}
                            />
                        </FormSection>

                        <FormSection>
                            <ColorFormField
                                title="Cor do texto"
                                description="Cor do texto principal"
                                value={form.data.text_color}
                                onChange={(color) => form.setData('text_color', color)}
                                error={form.errors.text_color}
                            />
                        </FormSection>

                        <FormSection withDivider={false}>
                            <ToggleFormField
                                title="Exibir link do perfil"
                                description="Mostrar link para o seu perfil na meta"
                                value={form.data.show_profile_link}
                                onChange={(value) => form.setData('show_profile_link', value)}
                                toggleSize="md"
                            />
                        </FormSection>
                    </SettingsFormContent>

                    <SettingsFormFooter submitLabel="Criar" isDirty={form.isDirty} isProcessing={form.processing} />
                </SettingsFormContainer>
            }
            preview={
                <Goal
                    className="max-w-xl"
                    title={form.data.title}
                    targetAmount={form.data.target_amount || 0}
                    raisedAmount={form.data.raised_amount || 0}
                    backgroundColor={form.data.background_color}
                    progressBarColor={form.data.progress_bar_color}
                    textColor={form.data.text_color}
                    showProfileLink={form.data.show_profile_link}
                    userHandle={user!.handle}
                    closesAt={form.data.closes_at}
                />
            }
        />
    );
}

Page.layout = (page: ReactNode) => <PanelLayout children={page} title="Criar meta" />;

export default Page;
