import { MercadoPagoIcon } from '@/components/icons/mercado-pago-icon';
import { FileUpload } from '@/components/untitled-ui/application/file-upload/file-upload-base';
import { Dialog, Modal, ModalOverlay } from '@/components/untitled-ui/application/modals/modal';
import { SectionFooter } from '@/components/untitled-ui/application/section-footers/section-footer';
import { SectionHeader } from '@/components/untitled-ui/application/section-headers/section-headers';
import { Button } from '@/components/untitled-ui/base/buttons/button';
import { CloseButton } from '@/components/untitled-ui/base/buttons/close-button';
import { Form } from '@/components/untitled-ui/base/form/form';
import { Input } from '@/components/untitled-ui/base/input/input';
import { Toggle } from '@/components/untitled-ui/base/toggle/toggle';
import { BackgroundPattern } from '@/components/untitled-ui/shared-assets/background-patterns';
import SettingsLayout from '@/layouts/settings-layout';
import { store, toggleStatus } from '@/routes/settings/payment-processors';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from 'react-aria-components';

type ProcessorStatus = {
    is_active: boolean;
};

type PageProps = {
    processors: {
        stripe: ProcessorStatus | null;
        efi_bank: ProcessorStatus | null;
        mercado_pago: ProcessorStatus | null;
    };
};

type UploadedFile = {
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    progress: number;
    failed?: boolean;
};

const EfiBankIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="149px"
        height="57px"
        viewBox="0 0 148 57"
        version="1.1"
        className={className}
    >
        <g id="surface1">
            <path
                style={{ stroke: 'none', fillRule: 'nonzero', fill: 'rgb(95.294118%,43.921569%,12.941177%)', fillOpacity: 1 }}
                d="M 76.417969 13.628906 C 76.417969 15.425781 78.144531 16.808594 80.351562 15.980469 L 92.152344 11.621094 L 92.152344 0 L 77.867188 11.207031 C 76.96875 11.898438 76.417969 12.589844 76.417969 13.628906 Z M 76.417969 13.628906 "
            />
            <path
                style={{ stroke: 'none', fillRule: 'nonzero', fill: 'rgb(95.294118%,43.921569%,12.941177%)', fillOpacity: 1 }}
                d="M 76.417969 19.644531 L 84.011719 19.644531 L 84.011719 56.308594 L 76.417969 56.308594 Z M 76.417969 19.644531 "
            />
            <path
                style={{ stroke: 'none', fillRule: 'nonzero', fill: 'rgb(95.294118%,43.921569%,12.941177%)', fillOpacity: 1 }}
                d="M 18.304688 18.953125 C 8.089844 18.953125 0.0859375 26.632812 0.0859375 37.699219 C 0.0859375 48.765625 8.160156 57 19.066406 57 C 25.828125 57 31.28125 53.75 34.871094 48.976562 L 29.558594 44.617188 C 26.933594 48.074219 23.34375 49.875 18.859375 49.875 C 12.921875 49.875 8.917969 46.484375 7.816406 41.019531 L 32.226562 41.019531 C 34.570312 41.019531 35.972656 39.914062 35.972656 37.214844 C 35.972656 28.777344 29.902344 18.953125 18.304688 18.953125 Z M 7.816406 34.101562 C 8.917969 29.121094 12.855469 26.078125 18.304688 26.078125 C 23.757812 26.078125 27.484375 29.121094 28.175781 34.101562 Z M 7.816406 34.101562 "
            />
            <path
                style={{ stroke: 'none', fillRule: 'nonzero', fill: 'rgb(95.294118%,43.921569%,12.941177%)', fillOpacity: 1 }}
                d="M 58.613281 26.078125 C 61.511719 26.078125 63.996094 27.117188 65.859375 28.429688 L 70.691406 22.964844 C 67.167969 20.335938 63.375 18.953125 58.820312 18.953125 C 48.8125 18.953125 41.980469 25.59375 41.980469 35.277344 L 41.980469 56.308594 L 49.570312 56.308594 L 49.570312 42.195312 L 68.550781 42.195312 L 68.550781 35.277344 L 49.570312 35.277344 C 49.433594 29.539062 53.296875 26.078125 58.613281 26.078125 Z M 58.613281 26.078125 "
            />
            <path
                style={{ stroke: 'none', fillRule: 'nonzero', fill: 'rgb(95.294118%,43.921569%,12.941177%)', fillOpacity: 1 }}
                d="M 142.285156 50.175781 L 147.871094 44.085938 L 145.296875 44.085938 L 140.6875 49.199219 C 140.109375 49.863281 140.066406 50.53125 140.6875 51.199219 L 145.386719 56.308594 L 147.914062 56.308594 L 142.28125 50.175781 Z M 142.285156 50.175781 "
            />
            <path
                style={{ stroke: 'none', fillRule: 'nonzero', fill: 'rgb(95.294118%,43.921569%,12.941177%)', fillOpacity: 1 }}
                d="M 137.226562 44.085938 L 139.222656 44.085938 L 139.222656 56.308594 L 137.226562 56.308594 Z M 137.226562 44.085938 "
            />
            <path
                style={{ stroke: 'none', fillRule: 'nonzero', fill: 'rgb(95.294118%,43.921569%,12.941177%)', fillOpacity: 1 }}
                d="M 114.128906 44.085938 C 113.375 44.085938 112.84375 44.488281 112.53125 45.199219 L 107.789062 56.308594 L 109.917969 56.308594 L 110.921875 53.863281 L 117.25 53.863281 L 118.25 56.308594 L 120.421875 56.308594 L 115.679688 45.199219 C 115.414062 44.574219 114.96875 44.085938 114.128906 44.085938 Z M 111.652344 52.085938 L 114.085938 46.15625 L 116.519531 52.085938 Z M 111.652344 52.085938 "
            />
            <path
                style={{ stroke: 'none', fillRule: 'nonzero', fill: 'rgb(95.294118%,43.921569%,12.941177%)', fillOpacity: 1 }}
                d="M 104.289062 49.859375 C 105.15625 49.246094 105.707031 48.28125 105.707031 47.152344 C 105.707031 45.285156 104.242188 44.085938 102.027344 44.085938 L 95.953125 44.085938 L 95.953125 56.308594 L 101.980469 56.308594 C 104.683594 56.308594 106.191406 54.976562 106.191406 52.929688 C 106.191406 51.492188 105.394531 50.449219 104.289062 49.859375 Z M 101.757812 45.867188 C 102.867188 45.867188 103.621094 46.488281 103.621094 47.511719 C 103.621094 48.53125 102.910156 49.289062 101.9375 49.289062 L 97.945312 49.289062 L 97.945312 45.867188 Z M 101.804688 54.53125 L 97.945312 54.53125 L 97.945312 51.0625 L 102.203125 51.0625 C 103.3125 51.0625 104.0625 51.640625 104.0625 52.664062 C 104.0625 53.820312 103.132812 54.53125 101.804688 54.53125 Z M 101.804688 54.53125 "
            />
            <path
                style={{ stroke: 'none', fillRule: 'nonzero', fill: 'rgb(95.294118%,43.921569%,12.941177%)', fillOpacity: 1 }}
                d="M 131.226562 53.210938 L 125.257812 44.933594 C 124.855469 44.402344 124.503906 44.085938 123.882812 44.085938 C 123.21875 44.085938 122.6875 44.664062 122.6875 45.421875 L 122.6875 56.308594 L 124.679688 56.308594 L 124.605469 47.183594 L 130.578125 55.464844 C 130.976562 56.042969 131.507812 56.308594 131.996094 56.308594 C 132.660156 56.308594 133.148438 55.730469 133.148438 54.976562 L 133.148438 44.085938 L 131.152344 44.085938 Z M 131.226562 53.210938 "
            />
        </g>
    </svg>
);

const uploadFile = (file: File, onProgress: (progress: number) => void) => {
    if (file.size === 0) {
        onProgress(0);

        return;
    }

    let progress = 0;
    const interval = setInterval(() => {
        onProgress(++progress);
        if (progress === 100) {
            clearInterval(interval);
        }
    }, 100);
};

function Page({ processors }: PageProps) {
    const [activeIntegration, setActiveIntegration] = useState<string | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

    const allIntegrations = [
        {
            name: 'Efi Bank',
            type: 'efi_bank',
            description: 'Receba pagamentos via PIX.',
            logo: <EfiBankIcon />,
            processor: processors.efi_bank,
            tutorialLink: 'https://youtu.be/e5MAcbZ7CQI?si=vwQwSruphVDRFqY4',
        },
        {
            name: 'Mercado Pago',
            type: 'mercado_pago',
            description: 'Aceite pagamentos via PIX com split automático.',
            logo: <MercadoPagoIcon className="h-12 w-12" />,
            processor: processors.mercado_pago,
            tutorialLink: null,
        },
        // TODO: Enable Stripe integration
        // {
        //     name: 'Stripe',
        //     type: 'stripe',
        //     description: 'Processe pagamentos com cartão de crédito e débito de forma segura.',
        //     logo: <StripeIcon className="h-12 w-12" />,
        //     processor: processors.stripe,
        // },
    ];

    const integrations = allIntegrations.filter((integration) => ['efi_bank'].includes(integration.type));

    const stripeForm = useForm({
        processor: 'stripe',
        secret_key: '',
    });

    const efiBankForm = useForm({
        processor: 'efi_bank',
        client_id: '',
        client_secret: '',
        certificate: null as File | null,
    });

    const mercadoPagoForm = useForm({
        processor: 'mercado_pago',
        access_token: '',
        platform_fee_percentage: 3.0,
    });

    const handleOpenSlideout = (integrationName: string) => {
        setActiveIntegration(integrationName);
    };

    const handleCloseSlideout = () => {
        setActiveIntegration(null);
        stripeForm.reset();
        efiBankForm.reset();
        mercadoPagoForm.reset();
        setUploadedFiles([]);
    };

    const handleSubmitEfiBank = (e: React.FormEvent) => {
        e.preventDefault();
        efiBankForm.submit(store(), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => handleCloseSlideout(),
        });
    };

    const handleSubmitMercadoPago = (e: React.FormEvent) => {
        e.preventDefault();
        mercadoPagoForm.submit(store(), {
            preserveScroll: true,
            onSuccess: () => handleCloseSlideout(),
        });
    };

    const handleToggleStatus = (processor: string) => {
        router.post(
            toggleStatus(processor),
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const handleDropFiles = (files: FileList) => {
        const file = files[0];
        if (file) {
            efiBankForm.setData('certificate', file);

            const newFile = {
                id: Math.random().toString(),
                file,
                name: file.name,
                size: file.size,
                type: file.type,
                progress: 0,
            };

            setUploadedFiles([newFile]);

            uploadFile(file, (progress) => {
                setUploadedFiles((prev) =>
                    prev.map((uploadedFile) => (uploadedFile.id === newFile.id ? { ...uploadedFile, progress } : uploadedFile)),
                );
            });
        }
    };

    const handleDeleteFile = (id: string) => {
        setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
        efiBankForm.setData('certificate', null);
    };

    const handleRetryFile = (id: string) => {
        const file = uploadedFiles.find((file) => file.id === id);
        if (!file) {
            return;
        }

        uploadFile(file.file, (progress) => {
            setUploadedFiles((prev) =>
                prev.map((uploadedFile) => (uploadedFile.id === id ? { ...uploadedFile, progress, failed: false } : uploadedFile)),
            );
        });
    };

    return (
        <>
            <div className="flex flex-col gap-6">
                <SectionHeader.Root className="border-none pb-0">
                    <SectionHeader.Group>
                        <div className="flex flex-1 flex-col justify-center gap-0.5">
                            <SectionHeader.Heading>Intermediadores de pagamento</SectionHeader.Heading>
                            <SectionHeader.Subheading>
                                Configure pelo menos um processador de pagamento para começar a receber doação!
                            </SectionHeader.Subheading>
                        </div>
                    </SectionHeader.Group>
                </SectionHeader.Root>

                <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
                    {integrations.map((integration) => (
                        <li key={integration.name}>
                            <div className="w-full flex-1 rounded-xl bg-primary_alt shadow-xs ring-1 ring-secondary ring-inset">
                                <div className="flex flex-col gap-6 px-4 py-5 lg:px-5">
                                    <div className="flex gap-2">
                                        <div className="flex flex-1 items-center gap-3">
                                            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white p-2 shadow-xs ring-1 ring-secondary ring-inset">
                                                {integration.logo}
                                            </div>
                                            <p className="text-md font-medium text-primary lg:text-md lg:font-semibold">{integration.name}</p>
                                        </div>
                                        {integration.processor && (
                                            <Toggle
                                                isSelected={integration.processor.is_active}
                                                size="sm"
                                                onChange={() => handleToggleStatus(integration.type)}
                                            />
                                        )}
                                    </div>
                                    <p className="text-sm text-tertiary">{integration.description}</p>
                                </div>
                                <SectionFooter.Root isCard className="px-6 py-4">
                                    <SectionFooter.Actions className="flex w-full items-center justify-between">
                                        {/* New Tutorial Button */}
                                        <Button
                                            color="link-color"
                                            size="md"
                                            onClick={() => integration.tutorialLink && window.open(integration.tutorialLink, '_blank')}
                                            isDisabled={!integration.tutorialLink}
                                        >
                                            <span className="flex items-center gap-1">Tutorial</span>
                                        </Button>
                                        <Button color="secondary" size="md" onClick={() => handleOpenSlideout(integration.name)}>
                                            {integration.processor ? 'Reconfigurar' : 'Configurar'}
                                        </Button>
                                    </SectionFooter.Actions>
                                </SectionFooter.Root>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* TODO: Stripe Modal - Enable when Stripe integration is ready */}
            {/*
            <AriaDialogTrigger isOpen={activeIntegration === 'Stripe'} onOpenChange={(open) => !open && handleCloseSlideout()}>
                <ModalOverlay isDismissable>
                    <Modal>
                        <Dialog>
                            <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-120">
                                <CloseButton onClick={handleCloseSlideout} theme="light" size="lg" className="absolute top-3 right-3 z-10" />
                                <div className="flex flex-col gap-4 px-4 pt-5 pb-6 sm:px-6 sm:pt-6">
                                    <div className="relative flex size-14 items-center justify-center">
                                        <StripeIcon className="z-10 h-14 w-14" />
                                        <BackgroundPattern
                                            pattern="circle"
                                            size="sm"
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                        />
                                    </div>
                                    <div className="z-10 flex flex-col gap-0.5">
                                        <AriaHeading slot="title" className="text-md font-semibold text-primary">
                                            Stripe
                                        </AriaHeading>
                                        <p className="text-sm text-tertiary">Configure sua integração com Stripe.</p>
                                    </div>
                                </div>
                                <Form onSubmit={handleSubmitStripe}>
                                    <div className="flex flex-col gap-4 px-4 pb-6 sm:px-6">
                                        <Input
                                            type="text"
                                            size="md"
                                            isRequired
                                            placeholder="sk_live_..."
                                            label="Chave Secreta"
                                            hint={stripeForm.errors.secret_key || 'Sua chave secreta da API do Stripe'}
                                            value={stripeForm.data.secret_key}
                                            onChange={(value) => stripeForm.setData('secret_key', value)}
                                            isInvalid={!!stripeForm.errors.secret_key}
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col-reverse gap-3 p-4 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pb-6">
                                        <Button type="button" color="secondary" size="lg" onClick={handleCloseSlideout}>
                                            Cancelar
                                        </Button>
                                        <Button type="submit" color="primary" size="lg" isDisabled={stripeForm.processing}>
                                            Salvar
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </Dialog>
                    </Modal>
                </ModalOverlay>
            </AriaDialogTrigger>
            */}

            {/* Mercado Pago Modal */}
            <AriaDialogTrigger isOpen={activeIntegration === 'Mercado Pago'} onOpenChange={(open) => !open && handleCloseSlideout()}>
                <ModalOverlay isDismissable>
                    <Modal>
                        <Dialog>
                            <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-120">
                                <CloseButton onClick={handleCloseSlideout} theme="light" size="lg" className="absolute top-3 right-3 z-10" />
                                <div className="flex flex-col gap-4 px-4 pt-5 pb-6 sm:px-6 sm:pt-6">
                                    <div className="relative flex size-14 items-center justify-center">
                                        <MercadoPagoIcon className="z-10 h-12 w-12" />
                                        <BackgroundPattern
                                            pattern="circle"
                                            size="sm"
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                        />
                                    </div>
                                    <div className="z-10 flex flex-col gap-0.5">
                                        <AriaHeading slot="title" className="text-md font-semibold text-primary">
                                            Mercado Pago
                                        </AriaHeading>
                                        <p className="text-sm text-tertiary">Configure sua integração com Mercado Pago e split de pagamentos.</p>
                                    </div>
                                </div>
                                <Form onSubmit={handleSubmitMercadoPago}>
                                    <div className="flex flex-col gap-4 px-4 pb-6 sm:px-6">
                                        <Input
                                            type="text"
                                            size="md"
                                            isRequired
                                            placeholder="APP_USR-..."
                                            label="Access Token"
                                            hint={mercadoPagoForm.errors.access_token || 'Seu token de acesso da API do Mercado Pago'}
                                            value={mercadoPagoForm.data.access_token}
                                            onChange={(value) => mercadoPagoForm.setData('access_token', value)}
                                            isInvalid={!!mercadoPagoForm.errors.access_token}
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col-reverse gap-3 p-4 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pb-6">
                                        <Button type="button" color="secondary" size="lg" onClick={handleCloseSlideout}>
                                            Cancelar
                                        </Button>
                                        <Button type="submit" color="primary" size="lg" isDisabled={mercadoPagoForm.processing}>
                                            Salvar
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </Dialog>
                    </Modal>
                </ModalOverlay>
            </AriaDialogTrigger>

            {/* Efi Bank Modal */}
            <AriaDialogTrigger isOpen={activeIntegration === 'Efi Bank'} onOpenChange={(open) => !open && handleCloseSlideout()}>
                <ModalOverlay isDismissable>
                    <Modal>
                        <Dialog>
                            <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-120">
                                <CloseButton onClick={handleCloseSlideout} theme="light" size="lg" className="absolute top-3 right-3 z-10" />
                                <div className="flex flex-col gap-4 px-4 pt-5 pb-6 sm:px-6 sm:pt-6">
                                    <div className="relative flex size-14 items-center justify-center">
                                        <EfiBankIcon className="z-10 h-7 w-auto" />
                                        <BackgroundPattern
                                            pattern="circle"
                                            size="sm"
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                        />
                                    </div>
                                    <div className="z-10 flex flex-col gap-0.5">
                                        <AriaHeading slot="title" className="text-md font-semibold text-primary">
                                            Efi Bank
                                        </AriaHeading>
                                        <p className="text-sm text-tertiary">Configure sua integração com Efi Bank.</p>
                                    </div>
                                </div>
                                <Form onSubmit={handleSubmitEfiBank}>
                                    <div className="flex flex-col gap-4 px-4 pb-6 sm:px-6">
                                        <Input
                                            type="text"
                                            size="md"
                                            isRequired
                                            placeholder="Client ID"
                                            label="Client ID"
                                            value={efiBankForm.data.client_id}
                                            onChange={(value) => efiBankForm.setData('client_id', value)}
                                            hint={efiBankForm.errors.client_id}
                                            isInvalid={!!efiBankForm.errors.client_id}
                                        />
                                        <Input
                                            type="text"
                                            size="md"
                                            isRequired
                                            placeholder="Client Secret"
                                            label="Client Secret"
                                            value={efiBankForm.data.client_secret}
                                            onChange={(value) => efiBankForm.setData('client_secret', value)}
                                            hint={efiBankForm.errors.client_secret}
                                            isInvalid={!!efiBankForm.errors.client_secret}
                                        />
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-medium text-secondary">Certificado</label>
                                            <FileUpload.Root>
                                                <FileUpload.DropZone
                                                    onDropFiles={handleDropFiles}
                                                    accept=".p12"
                                                    hint="Arquivo .p12"
                                                    allowsMultiple={false}
                                                />
                                                {uploadedFiles.length > 0 && (
                                                    <FileUpload.List>
                                                        {uploadedFiles.map((file) => (
                                                            <FileUpload.ListItemProgressBar
                                                                key={file.id}
                                                                {...file}
                                                                onDelete={() => handleDeleteFile(file.id)}
                                                                onRetry={() => handleRetryFile(file.id)}
                                                            />
                                                        ))}
                                                    </FileUpload.List>
                                                )}
                                            </FileUpload.Root>
                                            {efiBankForm.errors.certificate && (
                                                <p className="text-sm text-error-primary">{efiBankForm.errors.certificate}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-1 flex-col-reverse gap-3 p-4 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pb-6">
                                        <Button type="button" color="secondary" size="lg" onClick={handleCloseSlideout}>
                                            Cancelar
                                        </Button>
                                        <Button type="submit" color="primary" size="lg" isDisabled={efiBankForm.processing}>
                                            Salvar
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </Dialog>
                    </Modal>
                </ModalOverlay>
            </AriaDialogTrigger>
        </>
    );
}

Page.layout = (page: React.ReactNode) => <SettingsLayout>{page}</SettingsLayout>;

export default Page;
