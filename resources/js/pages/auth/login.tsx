import { store as submitLogin } from '@/actions/App/Http/Controllers/Auth/LoginController';
import { Dialog, Modal, ModalOverlay } from '@/components/ui/application/modals/modal';
import { Button } from '@/components/ui/base/buttons/button';
import { CloseButton } from '@/components/ui/base/buttons/close-button';
import { SocialButton } from '@/components/ui/base/buttons/social-button';
import { Checkbox } from '@/components/ui/base/checkbox/checkbox';
import { Form } from '@/components/ui/base/form/form';
import { Input } from '@/components/ui/base/input/input';
import { PinInput } from '@/components/ui/base/input/pin-input';
import { FeaturedIcon } from '@/components/ui/foundations/featured-icon/featured-icon';
import { BackgroundPattern } from '@/components/ui/shared-assets/background-patterns';
import { Illustration } from '@/components/ui/shared-assets/illustrations';
import { register } from '@/routes';
import oauth from '@/routes/oauth';
import { request as requestPassword } from '@/routes/password';
import { useLang } from '@/hooks/use-lang';
import { Head, useForm } from '@inertiajs/react';
import { LogIn03, Shield01 } from '@untitledui/icons';
import { FormEventHandler, useEffect, useState } from 'react';

interface LoginProps {
    status?: string;
    two_factor_required: boolean;
}

export default function Page({ status, two_factor_required }: LoginProps) {
    const { __ } = useLang();
    const [show2FADialog, setShow2FADialog] = useState(false);

    const {
        data,
        setData,
        submit: submitForm,
        processing,
        errors,
    } = useForm({
        email: '',
        password: '',
        remember: false,
        otp_code: '',
    });

    // Show 2FA dialog if required when page loads
    useEffect(() => {
        if (two_factor_required) {
            setShow2FADialog(true);
        }
    }, [two_factor_required]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const submittedPassword = data.password;

        submitForm(submitLogin(), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setData('otp_code', '');
                setShow2FADialog(false);
            },
            onError: () => {
                setData('password', submittedPassword);

                // If 2FA is required, the backend will redirect back with two_factor_required flag
                // Check if we need to show the dialog
                if (two_factor_required) {
                    setShow2FADialog(true);
                }
            },
        });
    };

    return (
        <>
            <Head title={__('auth.login.title')} />
            <section className="flex min-h-screen items-center justify-center overflow-hidden bg-primary px-4 py-12 md:px-8">
                <div className="mx-auto flex w-full flex-col gap-8 sm:max-w-90">
                    <div className="flex flex-col items-center gap-8 text-center">
                        <div className="relative">
                            <Illustration type="cloud" size="sm" className="relative z-10 h-29.5 w-38">
                                <LogIn03 />
                            </Illustration>
                            <BackgroundPattern
                                pattern="circle"
                                className="absolute top-[44%] left-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 md:block"
                            />
                            <BackgroundPattern
                                pattern="circle"
                                size="md"
                                className="absolute top-[44%] left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 md:hidden"
                            />
                        </div>

                        <div className="z-10 flex flex-col gap-2 md:gap-3">
                            <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">{__('auth.login.title')}</h1>
                            <p className="text-md text-tertiary">{__('auth.login.subtitle')}</p>
                        </div>
                    </div>

                    {status && (
                        <div className="z-10 rounded-md bg-green-50 p-4">
                            <p className="text-sm text-green-800">{status}</p>
                        </div>
                    )}

                    <Form onSubmit={submit} className="z-10 flex flex-col gap-6">
                        <div className="flex flex-col gap-5">
                            <Input
                                isRequired
                                hideRequiredIndicator
                                label={__('auth.login.fields.email.label')}
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(value) => setData('email', value)}
                                placeholder={__('auth.login.fields.email.placeholder')}
                                size="md"
                                isInvalid={!!errors.email}
                                hint={errors.email}
                            />
                            <Input
                                isRequired
                                hideRequiredIndicator
                                label={__('auth.login.fields.password.label')}
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(value) => setData('password', value)}
                                size="md"
                                placeholder={__('auth.login.fields.password.placeholder')}
                                isInvalid={!!errors.password}
                                hint={errors.password}
                            />
                        </div>

                        <div className="flex items-center">
                            <Checkbox
                                label={__('auth.login.fields.remember.label')}
                                name="remember"
                                isSelected={data.remember}
                                onChange={(isSelected) => setData('remember', isSelected)}
                            />

                            <Button color="link-color" size="md" href={requestPassword.url()} className="ml-auto">
                                Esqueceu a senha?
                            </Button>
                        </div>

                        <div className="flex flex-col gap-4">
                            <Button type="submit" size="lg" isDisabled={processing}>
                                {processing ? __('auth.login.buttons.processing') : __('auth.login.buttons.login')}
                            </Button>
                            <SocialButton social="google" theme="color" href={oauth.redirect.url('google')}>
                                Continuar com Google
                            </SocialButton>
                        </div>
                    </Form>

                    <div className="z-10 flex justify-center gap-1 text-center">
                        <span className="text-sm text-tertiary">{__('auth.login.signup_prompt')}</span>
                        <Button color="link-color" size="md" href={register.url()}>
                            Registre-se
                        </Button>
                    </div>
                </div>

                {/* 2FA Dialog */}
                {show2FADialog && (
                    <ModalOverlay isOpen={show2FADialog} onOpenChange={setShow2FADialog} isDismissable>
                        <Modal className="sm:max-w-100">
                            <Dialog>
                                    <CloseButton
                                        onClick={() => {
                                            setShow2FADialog(false);
                                            setData('otp_code', '');
                                        }}
                                        theme="light"
                                        size="lg"
                                        className="absolute top-3 right-3"
                                    />
                                    <div className="flex flex-col gap-4 px-4 pt-5 sm:px-6 sm:pt-6">
                                        <div className="relative w-max">
                                            <FeaturedIcon color="brand" size="lg" theme="light" icon={Shield01} />
                                            <BackgroundPattern
                                                pattern="circle"
                                                size="sm"
                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                            />
                                        </div>
                                        <div className="z-10 flex flex-col gap-0.5">
                                            <h2 className="text-md font-semibold text-primary">{__('auth.login.two_factor.title')}</h2>
                                            <p className="mb-4 text-sm text-tertiary">{__('auth.login.two_factor.subtitle')}</p>
                                        </div>
                                    </div>

                                    <Form className="contents" onSubmit={submit}>
                                        <div className="z-10 flex flex-col gap-4 px-4 sm:px-6">
                                            <div className="flex flex-col gap-2">
                                                <PinInput.Label>{__('auth.login.two_factor.code_label')}</PinInput.Label>
                                                <PinInput size="sm" disabled={processing} className="mx-auto">
                                                    <PinInput.Group
                                                        maxLength={6}
                                                        value={data.otp_code}
                                                        onChange={(value) => setData('otp_code', value)}
                                                    >
                                                        <PinInput.Slot index={0} />
                                                        <PinInput.Slot index={1} />
                                                        <PinInput.Slot index={2} />
                                                        <PinInput.Slot index={3} />
                                                        <PinInput.Slot index={4} />
                                                        <PinInput.Slot index={5} />
                                                    </PinInput.Group>
                                                </PinInput>
                                                {errors.otp_code && <p className="text-error text-sm">{errors.otp_code}</p>}
                                            </div>
                                        </div>

                                        <div className="z-10 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pt-8 sm:pb-6">
                                            <Button
                                                color="secondary"
                                                size="lg"
                                                onClick={() => {
                                                    setShow2FADialog(false);
                                                    setData('otp_code', '');
                                                }}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button type="submit" color="primary" size="lg" disabled={processing || data.otp_code.length !== 6}>
                                                {processing ? __('auth.login.two_factor.processing') : __('auth.login.two_factor.verify')}
                                            </Button>
                                        </div>
                                    </Form>
                            </Dialog>
                        </Modal>
                    </ModalOverlay>
                )}
            </section>
        </>
    );
}
